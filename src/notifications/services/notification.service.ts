import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { CreateNotificationDto, SendNotificationDto, UpdateNotificationDto, NotificationSearchDto } from '../dto/notification.dto';
import { NotificationType, NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
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

    // Send notification based on type
    await this.sendNotification(notification);

    return notification;
  }

  async sendNotification(notification: any) {
    try {
      switch (notification.type) {
        case NotificationType.EMAIL:
          if (notification.user.email) {
            const emailSent = await this.emailService.sendEmail({
              to: notification.user.email,
              subject: notification.title,
              html: `<p>${notification.message}</p>`,
            });
            
            if (emailSent) {
              await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
            } else {
              await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
            }
          }
          break;

        case NotificationType.SMS:
          if (notification.user.phone) {
            const smsSent = await this.smsService.sendSms({
              to: notification.user.phone,
              message: notification.message,
            });
            
            if (smsSent) {
              await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
            } else {
              await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
            }
          }
          break;

        case NotificationType.IN_APP:
          // In-app notifications are automatically marked as sent
          await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
          break;

        case NotificationType.PUSH:
          // TODO: Implement push notification service (Firebase, OneSignal, etc.)
          await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
          break;

        default:
          await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
      }
    } catch (error) {
      await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
      throw error;
    }
  }

  async sendBulkNotifications(sendNotificationDto: SendNotificationDto) {
    const { userIds, type, title, message, metadata } = sendNotificationDto;

    const notifications = await Promise.all(
      userIds.map(userId =>
        this.prisma.notification.create({
          data: {
            userId,
            type,
            title,
            message,
            metadata,
          },
        })
      )
    );

    // Send notifications
    for (const notification of notifications) {
      await this.sendNotification(notification);
    }

    return notifications;
  }

  async getNotificationById(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
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

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async updateNotification(notificationId: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updateData: any = {};

    if (updateNotificationDto.status) {
      updateData.status = updateNotificationDto.status;
    }

    if (updateNotificationDto.markAsRead) {
      updateData.readAt = new Date();
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: updateData,
    });
  }

  async updateNotificationStatus(notificationId: string, status: NotificationStatus) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { 
        status,
        ...(status === NotificationStatus.SENT && { sentAt: new Date() }),
      },
    });
  }

  async searchNotifications(searchDto: NotificationSearchDto, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (searchDto.userId) {
      where.userId = searchDto.userId;
    }

    if (searchDto.type) {
      where.type = searchDto.type;
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    if (searchDto.unreadOnly) {
      where.readAt = null;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
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
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
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
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { message: 'All notifications marked as read' };
  }

  async getUnreadNotificationCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted successfully' };
  }

  // Helper methods for common notification scenarios
  async sendWelcomeNotification(userId: string, userEmail: string, firstName: string) {
    // Send email
    await this.emailService.sendWelcomeEmail(userEmail, firstName);

    // Create in-app notification
    return this.createNotification({
      userId,
      type: NotificationType.IN_APP,
      title: 'Welcome to MantraSetu!',
      message: `Welcome ${firstName}! Your account has been created successfully. Start exploring our spiritual services.`,
    });
  }

  async sendBookingConfirmationNotification(userId: string, bookingDetails: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, firstName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send email
    if (user.email) {
      await this.emailService.sendBookingConfirmationEmail(user.email, bookingDetails);
    }

    // Send SMS
    if (user.phone) {
      await this.smsService.sendBookingConfirmationSms(user.phone, bookingDetails);
    }

    // Create in-app notification
    return this.createNotification({
      userId,
      bookingId: bookingDetails.id,
      type: NotificationType.IN_APP,
      title: 'Booking Confirmed',
      message: `Your booking for ${bookingDetails.serviceName} has been confirmed for ${bookingDetails.bookingDate} at ${bookingDetails.bookingTime}.`,
    });
  }

  async sendPaymentConfirmationNotification(userId: string, paymentDetails: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, firstName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send SMS
    if (user.phone) {
      await this.smsService.sendPaymentConfirmationSms(user.phone, paymentDetails.amount, paymentDetails.bookingId);
    }

    // Create in-app notification
    return this.createNotification({
      userId,
      type: NotificationType.IN_APP,
      title: 'Payment Confirmed',
      message: `Your payment of ₹${paymentDetails.amount} has been confirmed. Thank you for choosing MantraSetu!`,
    });
  }

  async sendServiceCompletionNotification(userId: string, panditName: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, firstName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send SMS
    if (user.phone) {
      await this.smsService.sendServiceCompletionSms(user.phone, panditName);
    }

    // Create in-app notification
    return this.createNotification({
      userId,
      type: NotificationType.IN_APP,
      title: 'Service Completed',
      message: `Your service with ${panditName} has been completed. Please rate and review your experience.`,
    });
  }
}
