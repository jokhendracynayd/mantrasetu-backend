import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PanditService } from '../pandits/services/pandit.service';
import { ServicesService } from '../services/services/services.service';
import { BookingService } from '../bookings/services/booking.service';

@Injectable()
export class HomepageService {
  constructor(
    private prisma: PrismaService,
    private panditService: PanditService,
    private servicesService: ServicesService,
    private bookingService: BookingService,
  ) {}

  async getHomepageData() {
    try {
      // Fetch featured pandits directly using Prisma
      const featuredPandits = await this.prisma.pandit.findMany({
        where: {
          isVerified: true,
        },
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
        orderBy: {
          rating: 'desc',
        },
        take: 4,
      });

      // Fetch featured services directly using Prisma
      const featuredServices = await this.prisma.service.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
      });

      // Get stats
      const [totalPandits, totalServices, totalBookings] = await Promise.all([
        this.prisma.pandit.count({ where: { isVerified: true } }),
        this.prisma.service.count({ where: { isActive: true } }),
        this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      ]);

      // Calculate average rating
      const avgRatingResult = await this.prisma.pandit.aggregate({
        where: { isVerified: true },
        _avg: { rating: true },
      });

      const averageRating = avgRatingResult._avg.rating || 0;

      return {
        success: true,
        data: {
          hero: {
            title: 'Authentic Rituals, Guided by Learned Pandits',
            description: 'Book Verified Pandits for Astrology, Grih Pravesh, Satyanarayan, and all rituals on MantraSetu.',
            buttonText: 'Book Pandit Ji',
            buttonLink: '/services',
          },
          featuredPandits: featuredPandits.map(pandit => ({
            id: pandit.id,
            name: `${pandit.user.firstName} ${pandit.user.lastName}`,
            title: 'Vedic Scholar',
            rating: Number(pandit.rating),
            experience: `${pandit.experienceYears}+ years`,
            specializations: pandit.specialization,
            languages: pandit.languagesSpoken,
            image: pandit.user.profileImageUrl || null,
            hourlyRate: Number(pandit.hourlyRate),
            bio: pandit.bio,
            isVerified: pandit.isVerified,
          })),
          featuredServices: featuredServices.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description || '',
            image: service.imageUrl || null,
            link: `/services/${service.id}`,
            category: service.category,
            basePrice: Number(service.basePrice),
            durationMinutes: service.durationMinutes,
            isVirtual: service.isVirtual,
          })),
          stats: {
            totalPandits,
            totalServices,
            totalBookings,
            averageRating: Number(averageRating),
          },
        },
      };
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return {
        success: false,
        error: 'Failed to fetch homepage data',
        data: {
          hero: {
            title: 'Authentic Rituals, Guided by Learned Pandits',
            description: 'Book Verified Pandits for Astrology, Grih Pravesh, Satyanarayan, and all rituals on MantraSetu.',
            buttonText: 'Book Pandit Ji',
            buttonLink: '/services',
          },
          featuredPandits: [],
          featuredServices: [],
          stats: {
            totalPandits: 0,
            totalServices: 0,
            totalBookings: 0,
            averageRating: 0,
          },
        },
      };
    }
  }
}
