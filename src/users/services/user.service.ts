import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto, UserPreferencesDto, EnrollInServiceDto, UpdateEnrollmentDto } from '../dto/user.dto';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        profileImageUrl: true,
        preferredLanguage: true,
        timezone: true,
        isActive: true,
        isVerified: true,
        emailVerifiedAt: true,
        phoneVerifiedAt: true,
        lastLoginAt: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          where: { userId },
          orderBy: { isDefault: 'desc' },
        },
        panditProfile: {
          select: {
            id: true,
            certificationNumber: true,
            experienceYears: true,
            specialization: true,
            languagesSpoken: true,
            serviceAreas: true,
            hourlyRate: true,
            rating: true,
            totalBookings: true,
            isVerified: true,
            isAvailable: true,
            bio: true,
            education: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { email, phone, ...updateData } = updateProfileDto;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already taken');
      }
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          phone,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Phone number already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        ...(email && { email }),
        ...(phone && { phone }),
        ...(updateData.dateOfBirth && { dateOfBirth: new Date(updateData.dateOfBirth) }),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        profileImageUrl: true,
        preferredLanguage: true,
        timezone: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: isDefault || false,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto) {
    const { isDefault, ...addressData } = updateAddressDto;

    // Check if address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  async getUserBookings(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              durationMinutes: true,
              basePrice: true,
              imageUrl: true,
            },
          },
          pandit: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profileImageUrl: true,
                },
              },
              rating: true,
              specialization: true,
              languagesSpoken: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
              paymentScreenshot: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({
        where: { userId },
      }),
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

  async getUserReviews(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        include: {
          pandit: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profileImageUrl: true,
                },
              },
              specialization: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { userId },
      }),
    ]);

    return {
      reviews,
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
                select: {
                  name: true,
                },
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

  async markNotificationAsRead(userId: string, notificationId: string) {
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

  async deleteUser(userId: string, currentUser: UserContext) {
    // Only allow users to delete their own account or admins to delete any account
    if (currentUser.userId !== userId && currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('You can only delete your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by deactivating the account
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'User account deactivated successfully' };
  }

  async getUserStats(userId: string) {
    const [totalBookings, completedBookings, totalSpent, totalReviews] = await Promise.all([
      this.prisma.booking.count({
        where: { userId },
      }),
      this.prisma.booking.count({
        where: { userId, status: 'COMPLETED' },
      }),
      this.prisma.payment.aggregate({
        where: { userId, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.review.count({
        where: { userId },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      totalSpent: totalSpent._sum.amount || 0,
      totalReviews,
    };
  }

  // Service Enrollment Methods
  async getEnrolledServices(userId: string) {
    const enrollments = await this.prisma.serviceEnrollment.findMany({
      where: {
        userId,
        status: 'active',
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            subcategory: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
            requiresSamagri: true,
            imageUrl: true,
            tags: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return {
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        userId: enrollment.userId,
        serviceId: enrollment.serviceId,
        service: enrollment.service,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        preferences: enrollment.preferences,
        progress: enrollment.progress || {
          completedBookings: 0,
          totalBookings: 0,
        },
      })),
    };
  }

  async enrollInService(userId: string, enrollInServiceDto: EnrollInServiceDto) {
    const { serviceId, preferences } = enrollInServiceDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if service exists and is active
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new BadRequestException('Service is not currently available');
    }

    // Check if user is already enrolled in this service
    const existingEnrollment = await this.prisma.serviceEnrollment.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'active') {
        throw new ConflictException('User is already enrolled in this service');
      } else {
        // Reactivate existing enrollment
        const reactivatedEnrollment = await this.prisma.serviceEnrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            status: 'active',
            preferences: preferences || {},
            updatedAt: new Date(),
          },
          include: {
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                subcategory: true,
                durationMinutes: true,
                basePrice: true,
                isVirtual: true,
                requiresSamagri: true,
                imageUrl: true,
                tags: true,
              },
            },
          },
        });

        return {
          success: true,
          message: `Successfully re-enrolled in ${service.name}`,
          enrollment: reactivatedEnrollment,
          enrollmentId: reactivatedEnrollment.id,
        };
      }
    }

    // Create new enrollment
    const enrollment = await this.prisma.serviceEnrollment.create({
      data: {
        userId,
        serviceId,
        status: 'active',
        preferences: preferences || {},
        progress: {
          completedBookings: 0,
          totalBookings: 0,
        },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            subcategory: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
            requiresSamagri: true,
            imageUrl: true,
            tags: true,
          },
        },
      },
    });

    // Create notification
    await this.prisma.notification.create({
      data: {
        userId,
        type: 'IN_APP',
        title: 'Service Enrollment Confirmed',
        message: `You have successfully enrolled in ${service.name}`,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: `Successfully enrolled in ${service.name}`,
      enrollment: enrollment,
      enrollmentId: enrollment.id,
    };
  }

  async updateEnrollment(userId: string, enrollmentId: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.prisma.serviceEnrollment.findFirst({
      where: {
        id: enrollmentId,
        userId,
        status: 'active',
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Active enrollment not found');
    }

    const updatedEnrollment = await this.prisma.serviceEnrollment.update({
      where: { id: enrollmentId },
      data: {
        preferences: (updateEnrollmentDto.preferences || enrollment.preferences) as any,
        updatedAt: new Date(),
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            subcategory: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
            requiresSamagri: true,
            imageUrl: true,
            tags: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Enrollment updated successfully',
      enrollment: updatedEnrollment,
    };
  }

  async unenrollFromService(userId: string, enrollmentId: string) {
    const enrollment = await this.prisma.serviceEnrollment.findFirst({
      where: {
        id: enrollmentId,
        userId,
        status: 'active',
      },
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Active enrollment not found');
    }

    await this.prisma.serviceEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'cancelled',
        updatedAt: new Date(),
      },
    });

    // Create notification
    await this.prisma.notification.create({
      data: {
        userId,
        type: 'IN_APP',
        title: 'Service Enrollment Cancelled',
        message: `You have unenrolled from ${enrollment.service.name}`,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: `Successfully unenrolled from ${enrollment.service.name}`,
    };
  }

  async getEnrollmentHistory(userId: string) {
    const enrollments = await this.prisma.serviceEnrollment.findMany({
      where: {
        userId,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            subcategory: true,
            durationMinutes: true,
            basePrice: true,
            isVirtual: true,
            requiresSamagri: true,
            imageUrl: true,
            tags: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return {
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        userId: enrollment.userId,
        serviceId: enrollment.serviceId,
        service: enrollment.service,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        preferences: enrollment.preferences,
        progress: enrollment.progress,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
      })),
    };
  }
}
