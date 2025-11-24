import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto, PaymentSearchDto, ApprovePaymentDto, RejectPaymentDto } from '../dto/payment.dto';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { PaymentStatus, UserRole, BookingStatus } from '@prisma/client';
import { join } from 'path';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private razorpayService: RazorpayService,
    private notificationService: NotificationService,
  ) {}

  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const { bookingId, amount, currency, paymentMethod, paymentGateway } = createPaymentDto;

    // Verify booking exists and belongs to user
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: { id: true },
        },
        service: {
          select: { name: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only create payments for your own bookings');
    }

    // Check if payment already exists for this booking
    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        bookingId,
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.COMPLETED],
        },
      },
    });

    if (existingPayment) {
      // Return existing payment instead of throwing error
      return {
        success: true,
        data: existingPayment,
        message: 'Payment already exists for this booking',
      };
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        currency,
        paymentMethod,
        paymentGateway,
        status: PaymentStatus.PENDING,
      },
      include: {
        booking: {
          select: {
            id: true,
            service: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Create Razorpay order if using Razorpay
    if (paymentGateway === 'razorpay') {
      try {
        const order = await this.razorpayService.createOrder(
          amount,
          currency,
          `booking_${bookingId}_payment_${payment.id}`,
        );

        // Update payment with order details
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            gatewayTransactionId: order.id,
            gatewayResponse: order as any,
          },
        });

        return {
          ...payment,
          razorpayOrderId: order.id,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        };
      } catch (error) {
        // Update payment status to failed
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        });

        throw new BadRequestException(`Failed to create payment order: ${error.message}`);
      }
    }

    return payment;
  }

  async processPayment(paymentId: string, processPaymentDto: ProcessPaymentDto, currentUser: UserContext) {
    const { gatewayTransactionId, gatewayResponse } = processPaymentDto;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check permissions
    const canProcess = 
      payment.userId === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!canProcess) {
      throw new ForbiddenException('You do not have permission to process this payment');
    }

    // Verify payment with gateway
    let verificationResult;
    if (payment.paymentGateway === 'razorpay' && gatewayTransactionId) {
      // For Razorpay, we need the signature from the webhook or frontend
      // This is a simplified version - in production, you'd verify the signature
      const paymentDetails = await this.razorpayService.getPaymentDetails(gatewayTransactionId);
      
      verificationResult = {
        success: paymentDetails.status === 'captured',
        transactionId: paymentDetails.id,
        amount: paymentDetails.amount / 100,
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        gatewayResponse: paymentDetails,
      };
    }

    if (!verificationResult || !verificationResult.success) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: verificationResult?.gatewayResponse || gatewayResponse,
        },
      });

      throw new BadRequestException('Payment verification failed');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date(),
        gatewayTransactionId: verificationResult.transactionId,
        gatewayResponse: verificationResult.gatewayResponse,
      },
    });

    // Update booking payment status
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: PaymentStatus.COMPLETED },
    });

    return updatedPayment;
  }

  async refundPayment(paymentId: string, refundPaymentDto: RefundPaymentDto, currentUser: UserContext) {
    const { refundAmount, reason } = refundPaymentDto;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check permissions - only admins can process refunds
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can process refunds');
    }

    // Check if payment can be refunded
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (refundAmount > Number(payment.amount)) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Process refund with gateway
    let refundResult;
    if (payment.paymentGateway === 'razorpay' && payment.gatewayTransactionId) {
      try {
        refundResult = await this.razorpayService.refundPayment(
          payment.gatewayTransactionId,
          refundAmount,
          reason,
        );
      } catch (error) {
        throw new BadRequestException(`Failed to process refund: ${error.message}`);
      }
    }

    // Update payment record
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        refundAmount,
        refundReason: reason,
        refundedAt: new Date(),
        status: refundAmount === Number(payment.amount) ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
        gatewayResponse: {
          ...(payment.gatewayResponse as any),
          refund: refundResult,
        },
      },
    });

    // Update booking status if fully refunded
    if (refundAmount === Number(payment.amount)) {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { paymentStatus: PaymentStatus.REFUNDED },
      });
    }

    return updatedPayment;
  }

  async getPaymentById(paymentId: string, currentUser: UserContext) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            id: true,
            user: {
              select: { id: true },
            },
            service: {
              select: { name: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check permissions
    const canView = 
      payment.userId === currentUser.userId ||
      payment.booking.user.id === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this payment');
    }

    return payment;
  }

  async searchPayments(searchDto: PaymentSearchDto, currentUser: UserContext, page: number = 1, limit: number = 10) {
    // Use DTO values if provided, otherwise use function parameters
    const finalPage = searchDto.page || page;
    const finalLimit = searchDto.limit || limit;
    const skip = (finalPage - 1) * finalLimit;
    const where: any = {};

    // Apply filters
    if (searchDto.bookingId) {
      where.bookingId = searchDto.bookingId;
    }

    if (searchDto.userId) {
      where.userId = searchDto.userId;
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    if (searchDto.paymentMethod) {
      where.paymentMethod = searchDto.paymentMethod;
    }

    if (searchDto.paymentGateway) {
      where.paymentGateway = searchDto.paymentGateway;
    }

    if (searchDto.startDate && searchDto.endDate) {
      where.createdAt = {
        gte: new Date(searchDto.startDate),
        lte: new Date(searchDto.endDate),
      };
    }

    // For regular users, only show their own payments
    if (currentUser.role === UserRole.USER) {
      where.userId = currentUser.userId;
    }

    // Determine sort order
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'desc';
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              service: {
                select: { name: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: finalLimit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        page: finalPage,
        limit: finalLimit,
        total,
        pages: Math.ceil(total / finalLimit),
      },
    };
  }

  async getUserPayments(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        include: {
          booking: {
            select: {
              id: true,
              service: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({
        where: { userId },
      }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentStats(currentUser: UserContext) {
    const where: any = {};

    // For regular users, only show their own stats
    if (currentUser.role === UserRole.USER) {
      where.userId = currentUser.userId;
    }

    const [totalPayments, completedPayments, totalAmount, refundedAmount] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.COMPLETED },
      }),
      this.prisma.payment.aggregate({
        where: { ...where, status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { ...where, status: { in: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED] } },
        _sum: { refundAmount: true },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      totalAmount: totalAmount._sum.amount || 0,
      refundedAmount: refundedAmount._sum.refundAmount || 0,
    };
  }

  async handleRazorpayWebhook(webhookData: any) {
    const { event, payload } = webhookData;

    switch (event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload.payment.entity);
        break;
      case 'refund.created':
        await this.handleRefundCreated(payload.refund.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
  }

  private async handlePaymentCaptured(payment: any) {
    const paymentRecord = await this.prisma.payment.findFirst({
      where: { gatewayTransactionId: payment.id },
    });

    if (paymentRecord) {
      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
          gatewayResponse: payment,
        },
      });

      // Update booking payment status
      await this.prisma.booking.update({
        where: { id: paymentRecord.bookingId },
        data: { paymentStatus: PaymentStatus.COMPLETED },
      });
    }
  }

  private async handlePaymentFailed(payment: any) {
    const paymentRecord = await this.prisma.payment.findFirst({
      where: { gatewayTransactionId: payment.id },
    });

    if (paymentRecord) {
      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: payment,
        },
      });
    }
  }

  private async handleRefundCreated(refund: any) {
    const paymentRecord = await this.prisma.payment.findFirst({
      where: { gatewayTransactionId: refund.payment_id },
    });

    if (paymentRecord) {
      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          refundAmount: refund.amount / 100,
          refundedAt: new Date(),
          status: refund.amount === paymentRecord.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
          gatewayResponse: {
            ...(paymentRecord.gatewayResponse as any),
            refund,
          },
        },
      });
    }
  }

  async approvePayment(paymentId: string, approvePaymentDto: ApprovePaymentDto, currentUser: UserContext) {
    // Check if user is admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can approve payments');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            pandit: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            service: {
              select: {
                name: true,
                durationMinutes: true,
              },
            },
            address: {
              select: {
                line1: true,
                line2: true,
                city: true,
                state: true,
                country: true,
                postalCode: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Only allow approval of pending payments
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Only pending payments can be approved');
    }

    // Update payment status to completed
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date(),
        gatewayResponse: {
          ...(payment.gatewayResponse as any || {}),
          approvedBy: currentUser.userId,
          approvedAt: new Date().toISOString(),
          notes: approvePaymentDto.notes,
        },
      },
    });

    // Update booking payment status and confirm booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { 
        paymentStatus: PaymentStatus.COMPLETED,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        user: true,
        pandit: {
          include: {
            user: true,
          },
        },
        service: true,
        address: true,
      },
    });

    // Send confirmation email to user
    try {
      const bookingDetails = {
        id: updatedBooking.id,
        serviceName: updatedBooking.service.name,
        panditName: `${updatedBooking.pandit.user.firstName} ${updatedBooking.pandit.user.lastName}`,
        bookingDate: new Date(updatedBooking.bookingDate).toLocaleDateString(),
        bookingTime: updatedBooking.bookingTime,
        duration: updatedBooking.durationMinutes,
        amount: updatedBooking.totalAmount.toString(),
        pujaType: updatedBooking.pujaType,
        location: updatedBooking.pujaType === 'OFFLINE' && (updatedBooking.address || updatedBooking.location) 
          ? (updatedBooking.address 
              ? `${updatedBooking.address.line1}, ${updatedBooking.address.city}, ${updatedBooking.address.state} - ${updatedBooking.address.postalCode}`
              : `${(updatedBooking.location as any)?.line1}, ${(updatedBooking.location as any)?.city}, ${(updatedBooking.location as any)?.state}`)
          : null,
        meetingLink: updatedBooking.meetingLink,
      };

      await this.notificationService.sendBookingConfirmationNotification(
        updatedBooking.userId,
        bookingDetails,
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the request if email fails
    }

    return updatedPayment;
  }

  async rejectPayment(paymentId: string, rejectPaymentDto: RejectPaymentDto, currentUser: UserContext) {
    // Check if user is admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can reject payments');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Only allow rejection of pending payments
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Only pending payments can be rejected');
    }

    // Update payment status to failed
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: {
          ...(payment.gatewayResponse as any || {}),
          rejectedBy: currentUser.userId,
          rejectedAt: new Date().toISOString(),
          rejectionReason: rejectPaymentDto.reason,
        },
      },
    });

    // Update booking payment status
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: PaymentStatus.FAILED },
    });

    return updatedPayment;
  }

  async uploadPaymentScreenshot(paymentId: string, file: Express.Multer.File, currentUser: UserContext) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check permissions - user can only upload screenshot for their own payment
    if (payment.userId !== currentUser.userId && currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('You do not have permission to upload screenshot for this payment');
    }

    // Save file path relative to uploads directory
    const filePath = `payments/${file.filename}`;

    // Update payment with screenshot path
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentScreenshot: filePath,
      },
    });

    return {
      ...updatedPayment,
      screenshotUrl: `/uploads/${filePath}`,
    };
  }
}
