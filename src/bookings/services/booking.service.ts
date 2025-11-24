import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto, UpdateBookingDto, BookingSearchDto, BookingReviewDto, CancelBookingDto, RescheduleBookingDto } from '../dto/booking.dto';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { BookingStatus, PaymentStatus, UserRole, PujaType } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // Helper function to add/subtract hours from time string (HH:MM format)
  private addHours(time: string, hours: number): string {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setHours(date.getHours() + hours);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const { panditId, serviceId, bookingDate, bookingTime, timezone, specialInstructions, pujaType, addressId } = createBookingDto;

    // Verify pandit exists and is available
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!pandit || !pandit.isAvailable || !pandit.isVerified) {
      throw new NotFoundException('Pandit not available or not verified');
    }

    // Verify service exists and is active
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException('Service not available');
    }

    // For offline bookings, verify address exists
    if (pujaType === PujaType.OFFLINE) {
      if (!addressId) {
        throw new BadRequestException('Address is required for offline bookings');
      }

      const address = await this.prisma.address.findFirst({
        where: {
          id: addressId,
          userId: userId,
        },
      });

      if (!address) {
        throw new NotFoundException('Address not found');
      }
    }

    // Check if pandit is available at the requested time
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}:00`);
    const dayOfWeek = bookingDateTime.getDay();

    const availability = await this.prisma.availability.findFirst({
      where: {
        panditId,
        dayOfWeek,
        isActive: true,
        startTime: { lte: bookingTime },
        endTime: { gt: bookingTime },
      },
    });

    if (!availability) {
      throw new ConflictException('Pandit is not available at the requested time');
    }

    // Check for existing bookings
    // For offline bookings, also check previous 1 hour and next 1 hour slots
    const timeSlotsToCheck = [bookingTime];
    
    if (pujaType === PujaType.OFFLINE) {
      // Add previous 1 hour and next 1 hour slots
      const previousHour = this.addHours(bookingTime, -1);
      const nextHour = this.addHours(bookingTime, 1);
      timeSlotsToCheck.push(previousHour, nextHour);
    }

    // Check for existing bookings at any of the time slots
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        panditId,
        bookingDate: new Date(bookingDate),
        bookingTime: {
          in: timeSlotsToCheck,
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
        },
      },
    });

    if (existingBookings.length > 0) {
      if (pujaType === PujaType.OFFLINE) {
        throw new ConflictException('Time slot is not available. For offline bookings, the previous 1 hour and next 1 hour slots must be free.');
      } else {
        throw new ConflictException('Time slot is already booked');
      }
    }

    // Calculate total amount (service base price + pandit hourly rate)
    const totalAmount = Number(service.basePrice) + (Number(pandit.hourlyRate) * (service.durationMinutes / 60));

    // Prepare location data for offline bookings
    let locationData: any = undefined;
    if (pujaType === PujaType.OFFLINE && addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: addressId },
      });
      if (address) {
        locationData = {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
        };
      }
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        panditId,
        serviceId,
        bookingDate: new Date(bookingDate),
        bookingTime,
        timezone,
        durationMinutes: service.durationMinutes,
        totalAmount,
        pujaType: pujaType || PujaType.ONLINE,
        addressId: pujaType === PujaType.OFFLINE ? addressId : null,
        location: locationData,
        specialInstructions,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      } as any,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        pandit: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            specialization: true,
            languagesSpoken: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
          },
        },
        address: pujaType === PujaType.OFFLINE ? {
          select: {
            id: true,
            line1: true,
            line2: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
          },
        } : false,
      } as any,
    });

    // Create notification for pandit
    await this.prisma.notification.create({
      data: {
        userId: pandit.userId,
        bookingId: booking.id,
        type: 'IN_APP',
        title: 'New Booking Request',
        message: `You have a new booking request for ${service.name} on ${bookingDate} at ${bookingTime}`,
        status: 'PENDING',
      },
    });

    // Create payment record for the booking
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: 'ONLINE',
        paymentGateway: 'razorpay',
        status: PaymentStatus.PENDING,
      },
    });

    return booking;
  }

  async getBookingById(bookingId: string, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        pandit: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profileImageUrl: true,
              },
            },
            specialization: true,
            languagesSpoken: true,
            rating: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
            instructions: true,
          },
        },
        address: {
          select: {
            id: true,
            line1: true,
            line2: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            paymentMethod: true,
            status: true,
            createdAt: true,
          },
        },
        notifications: {
          select: {
            id: true,
            type: true,
            title: true,
            message: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      } as any,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has access to this booking
    const hasAccess = 
      booking.userId === currentUser.userId ||
      (booking as any).pandit?.user?.id === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this booking');
    }

    return booking;
  }

  async updateBooking(bookingId: string, updateBookingDto: UpdateBookingDto, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to update this booking
    const canUpdate = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this booking');
    }

    // Check if booking can be updated (not completed or cancelled)
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot update completed or cancelled booking');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...updateBookingDto,
        ...(updateBookingDto.bookingDate && { bookingDate: new Date(updateBookingDto.bookingDate) }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        pandit: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            durationMinutes: true,
            basePrice: true,
          },
        },
      },
    });

    return updatedBooking;
  }

  async searchBookings(searchDto: BookingSearchDto, currentUser: UserContext, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (searchDto.userId) {
      where.userId = searchDto.userId;
    }

    if (searchDto.panditId) {
      where.panditId = searchDto.panditId;
    }

    if (searchDto.serviceId) {
      where.serviceId = searchDto.serviceId;
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    if (searchDto.paymentStatus) {
      where.paymentStatus = searchDto.paymentStatus;
    }

    if (searchDto.startDate && searchDto.endDate) {
      where.bookingDate = {
        gte: new Date(searchDto.startDate),
        lte: new Date(searchDto.endDate),
      };
    }

    // For regular users, only show their own bookings
    if (currentUser.role === UserRole.USER) {
      where.userId = currentUser.userId;
    }

    // For pandits, only show their own bookings
    if (currentUser.role === UserRole.PANDIT) {
      const pandit = await this.prisma.pandit.findUnique({
        where: { userId: currentUser.userId },
      });
      if (pandit) {
        where.panditId = pandit.id;
      }
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImageUrl: true,
            },
          },
          pandit: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                  profileImageUrl: true,
                },
              },
              specialization: true,
              rating: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              durationMinutes: true,
              basePrice: true,
              isVirtual: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async cancelBooking(bookingId: string, cancelBookingDto: CancelBookingDto, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
        payments: {
          where: { status: PaymentStatus.COMPLETED },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to cancel this booking
    const canCancel = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!canCancel) {
      throw new ForbiddenException('You do not have permission to cancel this booking');
    }

    // Check if booking can be cancelled
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking cannot be cancelled');
    }

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: cancelBookingDto.reason,
        cancelledAt: new Date(),
      },
    });

    // Create notifications
    await Promise.all([
      // Notify user
      this.prisma.notification.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          type: 'IN_APP',
          title: 'Booking Cancelled',
          message: `Your booking has been cancelled. Reason: ${cancelBookingDto.reason}`,
          status: 'PENDING',
        },
      }),
      // Notify pandit
      this.prisma.notification.create({
        data: {
          userId: booking.pandit.userId,
          bookingId: booking.id,
          type: 'IN_APP',
          title: 'Booking Cancelled',
          message: `A booking has been cancelled. Reason: ${cancelBookingDto.reason}`,
          status: 'PENDING',
        },
      }),
    ]);

    // TODO: Process refund if payment was completed
    // This would be handled by the payment service

    return updatedBooking;
  }

  async rescheduleBooking(bookingId: string, rescheduleBookingDto: RescheduleBookingDto, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to reschedule this booking
    const canReschedule = 
      booking.userId === currentUser.userId ||
      booking.pandit.userId === currentUser.userId ||
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPER_ADMIN;

    if (!canReschedule) {
      throw new ForbiddenException('You do not have permission to reschedule this booking');
    }

    // Check if booking can be rescheduled
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking cannot be rescheduled');
    }

    // Check if new time slot is available
    const newBookingDateTime = new Date(`${rescheduleBookingDto.newBookingDate}T${rescheduleBookingDto.newBookingTime}:00`);
    const dayOfWeek = newBookingDateTime.getDay();

    const availability = await this.prisma.availability.findFirst({
      where: {
        panditId: booking.panditId,
        dayOfWeek,
        isActive: true,
        startTime: { lte: rescheduleBookingDto.newBookingTime },
        endTime: { gt: rescheduleBookingDto.newBookingTime },
      },
    });

    if (!availability) {
      throw new ConflictException('Pandit is not available at the requested time');
    }

    // Check for existing bookings at the new time
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        panditId: booking.panditId,
        bookingDate: new Date(rescheduleBookingDto.newBookingDate),
        bookingTime: rescheduleBookingDto.newBookingTime,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
        },
        NOT: { id: bookingId },
      },
    });

    if (existingBooking) {
      throw new ConflictException('Time slot is already booked');
    }

    // Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingDate: new Date(rescheduleBookingDto.newBookingDate),
        bookingTime: rescheduleBookingDto.newBookingTime,
        timezone: rescheduleBookingDto.timezone,
        status: BookingStatus.PENDING, // Reset to pending for approval
      },
    });

    // Create notifications
    await Promise.all([
      // Notify user
      this.prisma.notification.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          type: 'IN_APP',
          title: 'Booking Rescheduled',
          message: `Your booking has been rescheduled to ${rescheduleBookingDto.newBookingDate} at ${rescheduleBookingDto.newBookingTime}`,
          status: 'PENDING',
        },
      }),
      // Notify pandit
      this.prisma.notification.create({
        data: {
          userId: booking.pandit.userId,
          bookingId: booking.id,
          type: 'IN_APP',
          title: 'Booking Rescheduled',
          message: `A booking has been rescheduled to ${rescheduleBookingDto.newBookingDate} at ${rescheduleBookingDto.newBookingTime}`,
          status: 'PENDING',
        },
      }),
    ]);

    return updatedBooking;
  }

  async addReview(bookingId: string, reviewDto: BookingReviewDto, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to review this booking
    if (booking.userId !== currentUser.userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Check if booking is completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed bookings');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findFirst({
      where: { bookingId },
    });

    if (existingReview) {
      throw new ConflictException('Review already exists for this booking');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        userId: currentUser.userId,
        panditId: booking.panditId,
        bookingId,
        rating: reviewDto.rating,
        comment: reviewDto.comment,
      },
    });

    // Update pandit rating
    const panditReviews = await this.prisma.review.findMany({
      where: { panditId: booking.panditId },
      select: { rating: true },
    });

    const averageRating = panditReviews.reduce((sum, r) => sum + r.rating, 0) / panditReviews.length;

    await this.prisma.pandit.update({
      where: { id: booking.panditId },
      data: { rating: averageRating },
    });

    // Update booking with review
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        rating: reviewDto.rating,
        review: reviewDto.comment,
      },
    });

    return review;
  }

  async confirmBooking(bookingId: string, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only pandit can confirm their own bookings
    if (booking.pandit.userId !== currentUser.userId) {
      throw new ForbiddenException('Only the assigned pandit can confirm this booking');
    }

    // Check if booking can be confirmed
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    // Notify user
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        type: 'IN_APP',
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed by the pandit',
        status: 'PENDING',
      },
    });

    return updatedBooking;
  }

  async startBooking(bookingId: string, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only pandit can start their own bookings
    if (booking.pandit.userId !== currentUser.userId) {
      throw new ForbiddenException('Only the assigned pandit can start this booking');
    }

    // Check if booking can be started
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be started');
    }

    // Generate meeting link for virtual services
    let meetingLink: string | null = null;
    let meetingPassword: string | null = null;

    if (booking.service.isVirtual) {
      // TODO: Integrate with video streaming service (Zoom, WebRTC, etc.)
      meetingLink = `https://meet.mantrasetu.com/${bookingId}`;
      meetingPassword = Math.random().toString(36).substring(2, 8);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.IN_PROGRESS,
        meetingLink,
        meetingPassword,
      },
    });

    // Notify user
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        type: 'IN_APP',
        title: 'Service Started',
        message: 'Your service has started. Please join the meeting if it\'s a virtual service.',
        status: 'PENDING',
      },
    });

    return updatedBooking;
  }

  async completeBooking(bookingId: string, currentUser: UserContext) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pandit: {
          select: { userId: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only pandit can complete their own bookings
    if (booking.pandit.userId !== currentUser.userId) {
      throw new ForbiddenException('Only the assigned pandit can complete this booking');
    }

    // Check if booking can be completed
    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress bookings can be completed');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Update pandit stats
    await this.prisma.pandit.update({
      where: { id: booking.panditId },
      data: {
        totalBookings: {
          increment: 1,
        },
      },
    });

    // Notify user
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        type: 'IN_APP',
        title: 'Service Completed',
        message: 'Your service has been completed. Please rate and review your experience.',
        status: 'PENDING',
      },
    });

    return updatedBooking;
  }
}
