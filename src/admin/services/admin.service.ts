import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { AdminUserFilterDto, AdminPanditFilterDto, AdminServiceFilterDto } from '../dto/admin.dto';

export interface AdminDashboardStats {
  totalUsers: number;
  totalPandits: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  activeUsers: number;
  verifiedPandits: number;
  monthlyRevenue: number;
  userGrowth: number;
}

export interface UserManagementFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PanditManagementFilters {
  search?: string;
  isVerified?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

type UserWithCounts = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    phone: true;
    role: true;
    isActive: true;
    isVerified: true;
    emailVerifiedAt: true;
    phoneVerifiedAt: true;
    lastLoginAt: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        bookings: true;
        payments: true;
      };
    };
  };
}>;

type PanditWithUser = Prisma.PanditGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
        phone: true;
        isActive: true;
        isVerified: true;
        lastLoginAt: true;
        createdAt: true;
      };
    };
    _count: {
      select: {
        bookings: true;
        reviews: true;
      };
    };
  };
}>;

export interface UserManagementResponse {
  users: UserWithCounts[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PanditManagementResponse {
  pandits: PanditWithUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Converts Prisma input types to JSON-serializable format for audit logs
   * Handles Decimal types and other non-serializable values
   */
  private serializeForAuditLog(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'object') {
      if (data instanceof Date) {
        return data.toISOString();
      }

      // Handle Decimal types (Prisma Decimal)
      if (data && typeof data === 'object' && 'toNumber' in data) {
        return data.toNumber();
      }

      // Handle DecimalFieldUpdateOperationsInput
      if (data && typeof data === 'object' && 'set' in data) {
        const setValue = data.set;
        if (setValue && typeof setValue === 'object' && 'toNumber' in setValue) {
          return { set: setValue.toNumber() };
        }
        return { set: typeof setValue === 'number' ? setValue : String(setValue) };
      }

      // Handle arrays
      if (Array.isArray(data)) {
        return data.map(item => this.serializeForAuditLog(item));
      }

      // Handle plain objects
      const serialized: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          serialized[key] = this.serializeForAuditLog(data[key]);
        }
      }
      return serialized;
    }

    return data;
  }

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [
      totalUsers,
      totalPandits,
      totalBookings,
      activeUsers,
      verifiedPandits,
      pendingBookings,
      completedBookings,
      revenueData,
      monthlyRevenueData,
      userGrowthData,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.pandit.count(),
      this.prisma.booking.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.pandit.count({ where: { isVerified: true } }),
      this.prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.COMPLETED,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const userGrowth = lastMonthUsers > 0 ? ((userGrowthData - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    return {
      totalUsers,
      totalPandits,
      totalBookings,
      totalRevenue: Number(revenueData._sum.amount) || 0,
      pendingBookings,
      completedBookings,
      activeUsers,
      verifiedPandits,
      monthlyRevenue: Number(monthlyRevenueData._sum.amount) || 0,
      userGrowth: Math.round(userGrowth * 100) / 100,
    };
  }

  async getUsers(filters: AdminUserFilterDto): Promise<UserManagementResponse> {
    const {
      search,
      role,
      isActive,
      isVerified,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.UserOrderByWithRelationInput = { [sortBy]: sortOrder } as Prisma.UserOrderByWithRelationInput;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          emailVerifiedAt: true,
          phoneVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookings: true,
              payments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        profileImageUrl: true,
        preferredLanguage: true,
        timezone: true,
        role: true,
        isActive: true,
        isVerified: true,
        emailVerifiedAt: true,
        phoneVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        panditProfile: {
          select: {
            id: true,
            isVerified: true,
            specialization: true,
            bio: true,
            hourlyRate: true,
            rating: true,
            totalBookings: true,
          },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            bookingDate: true,
            totalAmount: true,
            service: {
              select: {
                name: true,
                category: true,
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
          },
        },
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            payments: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean, currentUser: UserContext) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot modify admin user status');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string, currentUser: UserContext) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot delete admin user');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  async getPandits(filters: AdminPanditFilterDto): Promise<PanditManagementResponse> {
    const {
      search,
      isVerified,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.PanditWhereInput = {};

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        // Note: specialization is a String[] array, so we use hasSome for exact match
        // Case-insensitive search is not directly supported for array fields in Prisma
        { specialization: { hasSome: [search] } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (isActive !== undefined) {
      where.isAvailable = isActive;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.PanditOrderByWithRelationInput = { [sortBy]: sortOrder } as Prisma.PanditOrderByWithRelationInput;

    const [pandits, total] = await Promise.all([
      this.prisma.pandit.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              isActive: true,
              isVerified: true,
              lastLoginAt: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.pandit.count({ where }),
    ]);

    return {
      pandits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPanditById(panditId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
            profileImageUrl: true,
            preferredLanguage: true,
            timezone: true,
            isActive: true,
            isVerified: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            bookingDate: true,
            totalAmount: true,
            service: {
              select: {
                name: true,
                category: true,
              },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    return pandit;
  }

  async verifyPandit(panditId: string, currentUser: UserContext) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      select: { id: true, isVerified: true },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    const updatedPandit = await this.prisma.pandit.update({
      where: { id: panditId },
      data: { isVerified: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
    });

    return updatedPandit;
  }

  async unverifyPandit(panditId: string, currentUser: UserContext) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      select: { id: true, isVerified: true },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    const updatedPandit = await this.prisma.pandit.update({
      where: { id: panditId },
      data: { isVerified: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
    });

    return updatedPandit;
  }

  async getPanditPerformanceMetrics(panditId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      select: { id: true, user: { select: { firstName: true, lastName: true } } },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings,
      averageRating,
      totalReviews,
      monthlyBookings,
      monthlyEarnings,
    ] = await Promise.all([
      this.prisma.booking.count({ where: { panditId } }),
      this.prisma.booking.count({ where: { panditId, status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { panditId, status: BookingStatus.CANCELLED } }),
      this.prisma.booking.aggregate({
        where: { panditId, status: BookingStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
      this.prisma.review.aggregate({
        where: { panditId },
        _avg: { rating: true },
      }),
      this.prisma.review.count({ where: { panditId } }),
      this.prisma.booking.count({
        where: {
          panditId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.booking.aggregate({
        where: {
          panditId,
          status: BookingStatus.COMPLETED,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    return {
      panditId,
      panditName: `${pandit.user.firstName} ${pandit.user.lastName}`,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings: totalEarnings._sum.totalAmount || 0,
      averageRating: averageRating._avg.rating || 0,
      totalReviews,
      monthlyBookings,
      monthlyEarnings: monthlyEarnings._sum.totalAmount || 0,
      completionRate: Math.round(completionRate * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
    };
  }

  async getAnalyticsData() {
    const [
      userGrowthData,
      revenueData,
      bookingTrends,
      servicePopularity,
      panditPerformance,
      monthlyMetrics,
    ] = await Promise.all([
      this.getUserGrowthAnalytics(),
      this.getRevenueAnalytics(),
      this.getBookingTrends(),
      this.getServicePopularity(),
      this.getTopPerformingPandits(),
      this.getMonthlyMetrics(),
    ]);

    return {
      userGrowth: userGrowthData,
      revenue: revenueData,
      bookingTrends,
      servicePopularity,
      panditPerformance,
      monthlyMetrics,
    };
  }

  private async getUserGrowthAnalytics() {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    
    const monthlyUsers = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Group by month
    const monthlyData = new Map();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, 0);
    }

    monthlyUsers.forEach((user) => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, monthlyData.get(monthKey) + user._count.id);
      }
    });

    return Array.from(monthlyData.entries()).map(([month, count]) => ({
      month,
      users: count,
    })).reverse();
  }

  private async getRevenueAnalytics() {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    
    const monthlyRevenue = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        status: PaymentStatus.COMPLETED,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Group by month
    const monthlyData = new Map();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, 0);
    }

    monthlyRevenue.forEach((payment) => {
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, monthlyData.get(monthKey) + (payment._sum.amount || 0));
      }
    });

    return Array.from(monthlyData.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    })).reverse();
  }

  private async getBookingTrends() {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    
    const monthlyBookings = await this.prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Group by month
    const monthlyData = new Map();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, 0);
    }

    monthlyBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, monthlyData.get(monthKey) + booking._count.id);
      }
    });

    return Array.from(monthlyData.entries()).map(([month, bookings]) => ({
      month,
      bookings,
    })).reverse();
  }

  private async getServicePopularity() {
    const serviceStats = await this.prisma.booking.groupBy({
      by: ['serviceId'],
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    const serviceDetails = await this.prisma.service.findMany({
      where: {
        id: {
          in: serviceStats.map(stat => stat.serviceId),
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    return serviceStats.map(stat => {
      const service = serviceDetails.find(s => s.id === stat.serviceId);
      return {
        serviceId: stat.serviceId,
        serviceName: service?.name || 'Unknown',
        category: service?.category || 'Unknown',
        bookings: stat._count.id,
        revenue: stat._sum.totalAmount || 0,
      };
    }).sort((a, b) => b.bookings - a.bookings).slice(0, 10);
  }

  private async getTopPerformingPandits() {
    const panditStats = await this.prisma.booking.groupBy({
      by: ['panditId'],
      where: {
        status: BookingStatus.COMPLETED,
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    const panditDetails = await this.prisma.pandit.findMany({
      where: {
        id: {
          in: panditStats.map(stat => stat.panditId),
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return panditStats.map(stat => {
      const pandit = panditDetails.find(p => p.id === stat.panditId);
      return {
        panditId: stat.panditId,
        panditName: pandit ? `${pandit.user.firstName} ${pandit.user.lastName}` : 'Unknown',
        specialization: pandit?.specialization || 'Unknown',
        bookings: stat._count.id,
        revenue: Number(stat._sum.totalAmount) || 0,
        rating: Number(pandit?.rating) || 0,
      };
    }).sort((a, b) => Number(b.revenue) - Number(a.revenue)).slice(0, 10);
  }

  private async getMonthlyMetrics() {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [
      lastMonthUsers,
      thisMonthUsers,
      lastMonthBookings,
      thisMonthBookings,
      lastMonthRevenue,
      thisMonthRevenue,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.COMPLETED,
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.COMPLETED,
          createdAt: {
            gte: thisMonth,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const userGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;
    const bookingGrowth = lastMonthBookings > 0 ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;
    const lastMonthAmount = Number(lastMonthRevenue._sum.amount) || 0;
    const thisMonthAmount = Number(thisMonthRevenue._sum.amount) || 0;
    const revenueGrowth = lastMonthAmount > 0 ? 
      ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 : 0;

    return {
      userGrowth: Math.round(userGrowth * 100) / 100,
      bookingGrowth: Math.round(bookingGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      thisMonthUsers,
      thisMonthBookings,
      thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
    };
  }

  // Service Management
  async getServices(filters: AdminServiceFilterDto): Promise<{
    services: Array<Prisma.ServiceGetPayload<{ include: { _count: { select: { bookings: true } } } }>>;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const {
      search,
      category,
      subcategory,
      isVirtual,
      isActive,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.ServiceWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subcategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category !== undefined) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (isVirtual !== undefined) {
      where.isVirtual = isVirtual;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) {
        where.basePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.basePrice.lte = maxPrice;
      }
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput;
    if (sortBy === 'price') {
      orderBy = { basePrice: sortOrder };
    } else if (sortBy === 'duration') {
      orderBy = { durationMinutes: sortOrder };
    } else {
      orderBy = { [sortBy]: sortOrder } as Prisma.ServiceOrderByWithRelationInput;
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceById(serviceId: string): Promise<Prisma.ServiceGetPayload<{ include: { _count: { select: { bookings: true } } } }>> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(createServiceDto: Prisma.ServiceCreateInput, currentUser: UserContext): Promise<Prisma.ServiceGetPayload<{}>> {
    try {
      const service = await this.prisma.service.create({
        data: createServiceDto,
      });

      // Convert DTO to JSON-serializable format for audit log
      const serializedDto = this.serializeForAuditLog(createServiceDto);

      // Log the action
      await this.prisma.auditLog.create({
        data: {
          userId: currentUser.userId,
          action: 'CREATE_SERVICE',
          resource: 'Service',
          resourceId: service.id,
          newValues: serializedDto,
        },
      });

      return service;
    } catch (error) {
      throw new BadRequestException('Service creation failed');
    }
  }

  async updateService(serviceId: string, updateServiceDto: Prisma.ServiceUpdateInput, currentUser: UserContext): Promise<Prisma.ServiceGetPayload<{}>> {
    const existingService = await this.getServiceById(serviceId);

    try {
      const service = await this.prisma.service.update({
        where: { id: serviceId },
        data: updateServiceDto,
      });

      // Convert DTO to JSON-serializable format for audit log
      const serializedDto = this.serializeForAuditLog(updateServiceDto);

      // Log the action
      await this.prisma.auditLog.create({
        data: {
          userId: currentUser.userId,
          action: 'UPDATE_SERVICE',
          resource: 'Service',
          resourceId: serviceId,
          oldValues: existingService,
          newValues: serializedDto,
        },
      });

      return service;
    } catch (error) {
      throw new BadRequestException('Service update failed');
    }
  }

  async deleteService(serviceId: string, currentUser: UserContext): Promise<{ message: string }> {
    const existingService = await this.getServiceById(serviceId);

    try {
      await this.prisma.service.delete({
        where: { id: serviceId },
      });

      // Log the action
      await this.prisma.auditLog.create({
        data: {
          userId: currentUser.userId,
          action: 'DELETE_SERVICE',
          resource: 'Service',
          resourceId: serviceId,
          oldValues: existingService,
        },
      });

      return { message: 'Service deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Service deletion failed');
    }
  }
}
