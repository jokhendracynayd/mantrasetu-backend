import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePanditProfileDto, UpdatePanditProfileDto, CreateAvailabilityDto, UpdateAvailabilityDto, PanditSearchDto } from '../dto/pandit.dto';
import { UserContext } from '../../auth/interfaces/auth.interface';
import { UserRole, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PanditService {
  constructor(private prisma: PrismaService) {}

  async registerPandit(registrationData: any, files?: { certificate?: Express.Multer.File[], idProof?: Express.Multer.File[], photo?: Express.Multer.File[] }) {
    // Extract user registration data
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role = 'PANDIT',
      ...panditData
    } = registrationData;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if certification number is already taken
    if (panditData.certificationNumber) {
      const existingCertification = await this.prisma.pandit.findUnique({
        where: { certificationNumber: panditData.certificationNumber },
      });

      if (existingCertification) {
        throw new ConflictException('Certification number already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Process uploaded files
    const verificationDocuments: any = {};
    if (files) {
      if (files.certificate && files.certificate.length > 0) {
        verificationDocuments.certificate = `/uploads/pandits/${email}/${files.certificate[0].filename}`;
      }
      if (files.idProof && files.idProof.length > 0) {
        verificationDocuments.idProof = `/uploads/pandits/${email}/${files.idProof[0].filename}`;
      }
      if (files.photo && files.photo.length > 0) {
        verificationDocuments.photo = `/uploads/pandits/${email}/${files.photo[0].filename}`;
      }
    }

    // Create user and pandit profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          phone,
          role: UserRole.PANDIT,
          isVerified: false, // Will need email verification
        },
      });

      // Create pandit profile
      const pandit = await tx.pandit.create({
        data: {
          userId: user.id,
          certificationNumber: panditData.certificationNumber,
          experienceYears: parseInt(panditData.experienceYears) || 0,
          specialization: JSON.parse(panditData.specialization || '[]'),
          languagesSpoken: JSON.parse(panditData.languagesSpoken || '[]'),
          serviceAreas: JSON.parse(panditData.serviceAreas || '[]'),
          hourlyRate: parseFloat(panditData.hourlyRate) || 0,
          bio: panditData.bio || '',
          education: panditData.education || '',
          achievements: JSON.parse(panditData.achievements || '[]'),
          verificationDocuments: verificationDocuments,
          isVerified: false, // Will need admin verification
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
            },
          },
        },
      });

      return { user, pandit };
    });

    return {
      message: 'Registration successful! Please wait while we verify your details. You will receive an email confirmation once your profile is approved.',
      user: result.user,
      pandit: result.pandit,
    };
  }

  async createPanditProfile(userId: string, createPanditProfileDto: CreatePanditProfileDto, files?: { certificate?: Express.Multer.File[], idProof?: Express.Multer.File[], photo?: Express.Multer.File[] }) {
    // Check if user already has a pandit profile
    const existingProfile = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Pandit profile already exists for this user');
    }

    // Check if certification number is already taken
    if (createPanditProfileDto.certificationNumber) {
      const existingCertification = await this.prisma.pandit.findUnique({
        where: { certificationNumber: createPanditProfileDto.certificationNumber },
      });

      if (existingCertification) {
        throw new ConflictException('Certification number already exists');
      }
    }

    // Process uploaded files
    const verificationDocuments: any = {};
    if (files) {
      if (files.certificate && files.certificate.length > 0) {
        verificationDocuments.certificate = `/uploads/pandits/${userId}/${files.certificate[0].filename}`;
      }
      if (files.idProof && files.idProof.length > 0) {
        verificationDocuments.idProof = `/uploads/pandits/${userId}/${files.idProof[0].filename}`;
      }
      if (files.photo && files.photo.length > 0) {
        verificationDocuments.photo = `/uploads/pandits/${userId}/${files.photo[0].filename}`;
      }
    }

    const pandit = await this.prisma.pandit.create({
      data: {
        userId,
        ...createPanditProfileDto,
        verificationDocuments: verificationDocuments,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            phone: true,
          },
        },
      },
    });

    // Update user role to PANDIT
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.PANDIT },
    });

    return pandit;
  }

  async getPanditProfile(userId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            phone: true,
            preferredLanguage: true,
            timezone: true,
          },
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
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
      throw new NotFoundException('Pandit profile not found');
    }

    return pandit;
  }

  async updatePanditProfile(userId: string, updatePanditProfileDto: UpdatePanditProfileDto) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    // Check if certification number is already taken by another pandit
    if (updatePanditProfileDto.certificationNumber) {
      const existingCertification = await this.prisma.pandit.findFirst({
        where: {
          certificationNumber: updatePanditProfileDto.certificationNumber,
          NOT: { userId },
        },
      });

      if (existingCertification) {
        throw new ConflictException('Certification number already exists');
      }
    }

    return this.prisma.pandit.update({
      where: { userId },
      data: updatePanditProfileDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            phone: true,
          },
        },
      },
    });
  }

  async getAvailability(userId: string) {
    return this.prisma.availability.findMany({
      where: { panditId: userId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async createAvailability(userId: string, createAvailabilityDto: CreateAvailabilityDto) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    // Check for overlapping availability
    const overlapping = await this.prisma.availability.findFirst({
      where: {
        panditId: pandit.id,
        dayOfWeek: createAvailabilityDto.dayOfWeek,
        isActive: true,
        OR: [
          {
            AND: [
              { startTime: { lte: createAvailabilityDto.startTime } },
              { endTime: { gt: createAvailabilityDto.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: createAvailabilityDto.endTime } },
              { endTime: { gte: createAvailabilityDto.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: createAvailabilityDto.startTime } },
              { endTime: { lte: createAvailabilityDto.endTime } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException('Availability overlaps with existing schedule');
    }

    return this.prisma.availability.create({
      data: {
        panditId: pandit.id,
        ...createAvailabilityDto,
      },
    });
  }

  async updateAvailability(userId: string, availabilityId: string, updateAvailabilityDto: UpdateAvailabilityDto) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    const availability = await this.prisma.availability.findFirst({
      where: { id: availabilityId, panditId: pandit.id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // Check for overlapping availability if time is being updated
    if (updateAvailabilityDto.startTime || updateAvailabilityDto.endTime || updateAvailabilityDto.dayOfWeek) {
      const startTime = updateAvailabilityDto.startTime || availability.startTime;
      const endTime = updateAvailabilityDto.endTime || availability.endTime;
      const dayOfWeek = updateAvailabilityDto.dayOfWeek ?? availability.dayOfWeek;

      const overlapping = await this.prisma.availability.findFirst({
        where: {
          panditId: pandit.id,
          dayOfWeek,
          isActive: true,
          NOT: { id: availabilityId },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });

      if (overlapping) {
        throw new ConflictException('Availability overlaps with existing schedule');
      }
    }

    return this.prisma.availability.update({
      where: { id: availabilityId },
      data: updateAvailabilityDto,
    });
  }

  async deleteAvailability(userId: string, availabilityId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    const availability = await this.prisma.availability.findFirst({
      where: { id: availabilityId, panditId: pandit.id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    await this.prisma.availability.delete({
      where: { id: availabilityId },
    });

    return { message: 'Availability deleted successfully' };
  }

  async searchPandits(searchDto: PanditSearchDto, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {
      isVerified: true,
      isAvailable: true,
    };

    // Apply filters
    if (searchDto.specialization && searchDto.specialization.length > 0) {
      where.specialization = {
        hasSome: searchDto.specialization,
      };
    }

    if (searchDto.languages && searchDto.languages.length > 0) {
      where.languagesSpoken = {
        hasSome: searchDto.languages,
      };
    }

    if (searchDto.serviceAreas && searchDto.serviceAreas.length > 0) {
      where.serviceAreas = {
        hasSome: searchDto.serviceAreas,
      };
    }

    if (searchDto.minRating) {
      where.rating = {
        gte: searchDto.minRating,
      };
    }

    if (searchDto.maxHourlyRate) {
      where.hourlyRate = {
        lte: searchDto.maxHourlyRate,
      };
    }

    if (searchDto.isVerified !== undefined) {
      where.isVerified = searchDto.isVerified;
    }

    if (searchDto.isAvailable !== undefined) {
      where.isAvailable = searchDto.isAvailable;
    }

    // Search by name if provided
    if (searchDto.search) {
      where.user = {
        OR: [
          { firstName: { contains: searchDto.search, mode: 'insensitive' } },
          { lastName: { contains: searchDto.search, mode: 'insensitive' } },
        ],
      };
    }

    const [pandits, total] = await Promise.all([
      this.prisma.pandit.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              phone: true,
            },
          },
          availability: {
            where: { isActive: true },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { totalBookings: 'desc' },
        ],
        skip,
        take: limit,
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
            profileImageUrl: true,
            phone: true,
            preferredLanguage: true,
            timezone: true,
          },
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
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

  async getPanditBookings(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { panditId: pandit.id },
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
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({
        where: { panditId: pandit.id },
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

  async getPanditStats(userId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { userId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit profile not found');
    }

    const [totalBookings, completedBookings, pendingBookings, totalEarnings, averageRating] = await Promise.all([
      this.prisma.booking.count({
        where: { panditId: pandit.id },
      }),
      this.prisma.booking.count({
        where: { panditId: pandit.id, status: BookingStatus.COMPLETED },
      }),
      this.prisma.booking.count({
        where: { panditId: pandit.id, status: BookingStatus.PENDING },
      }),
      this.prisma.payment.aggregate({
        where: {
          booking: { panditId: pandit.id },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      this.prisma.review.aggregate({
        where: { panditId: pandit.id },
        _avg: { rating: true },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      totalEarnings: totalEarnings._sum.amount || 0,
      averageRating: averageRating._avg.rating || 0,
      rating: pandit.rating,
    };
  }

  async verifyPandit(panditId: string, currentUser: UserContext) {
    // Only admins can verify pandits
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can verify pandits');
    }

    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    return this.prisma.pandit.update({
      where: { id: panditId },
      data: { isVerified: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async unverifyPandit(panditId: string, currentUser: UserContext) {
    // Only admins can unverify pandits
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can unverify pandits');
    }

    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    return this.prisma.pandit.update({
      where: { id: panditId },
      data: { isVerified: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getAvailablePandits(filters: {
    serviceId?: string;
    date?: string;
    time?: string;
    location?: string;
    specialization?: string;
  }, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {
      isAvailable: true,
      isVerified: true,
    };

    // Filter by specialization
    if (filters.specialization) {
      where.specialization = {
        has: filters.specialization,
      };
    }

    // Filter by service areas if location is provided
    if (filters.location) {
      where.serviceAreas = {
        has: filters.location,
      };
    }

    // Get pandits with their availability
    const pandits = await this.prisma.pandit.findMany({
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
        availability: {
          where: { isActive: true },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { totalBookings: 'desc' },
      ],
    });

    // Calculate average ratings
    const panditsWithRatings = pandits.map(pandit => ({
      ...pandit,
      rating: pandit.reviews.length > 0 
        ? pandit.reviews.reduce((sum, review) => sum + review.rating, 0) / pandit.reviews.length
        : 0,
      reviewsCount: pandit.reviews.length,
    }));

    // Filter by date/time availability if provided
    let availablePandits = panditsWithRatings;
    
    if (filters.date || filters.time) {
      availablePandits = panditsWithRatings.filter(pandit => {
        if (!filters.date && !filters.time) return true;

        const targetDate = filters.date ? new Date(filters.date) : new Date();
        const dayOfWeek = targetDate.getDay();
        
        // Check if pandit has availability on this day
        const dayAvailability = pandit.availability.find(av => av.dayOfWeek === dayOfWeek);
        if (!dayAvailability) return false;

        // If time is specified, check if pandit is available at that time
        if (filters.time) {
          const targetTime = filters.time;
          return targetTime >= dayAvailability.startTime && targetTime < dayAvailability.endTime;
        }

        return true;
      });
    }

    const total = await this.prisma.pandit.count({ where });

    return {
      pandits: availablePandits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPanditAvailability(panditId: string, date?: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    const targetDate = date ? new Date(date) : new Date();
    const dayOfWeek = targetDate.getDay();

    // Get pandit's availability for the specific day
    const availability = await this.prisma.availability.findMany({
      where: {
        panditId,
        dayOfWeek,
        isActive: true,
      },
    });

    // Get existing bookings for the date
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        panditId,
        bookingDate: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
        },
      },
      select: {
        bookingTime: true,
      },
    });

    const bookedTimes = existingBookings.map(booking => booking.bookingTime);

    // Generate time slots based on availability
    const timeSlots: Array<{ time: string; available: boolean }> = [];
    
    for (const av of availability) {
      const startTime = av.startTime.split(':');
      const endTime = av.endTime.split(':');
      
      const startHour = parseInt(startTime[0]);
      const startMinute = parseInt(startTime[1]);
      const endHour = parseInt(endTime[0]);
      const endMinute = parseInt(endTime[1]);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        timeSlots.push({
          time: timeString,
          available: !bookedTimes.includes(timeString),
        });
        
        // Increment by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentHour += 1;
          currentMinute = 0;
        }
      }
    }

    return {
      panditId,
      date: targetDate.toISOString().split('T')[0],
      availability: timeSlots,
    };
  }

  async getPanditReviews(panditId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
    });

    if (!pandit) {
      throw new NotFoundException('Pandit not found');
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { panditId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { panditId },
      }),
    ]);

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      reviews,
      averageRating: avgRating,
      totalReviews: total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
