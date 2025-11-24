import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { PrismaService } from '../../database/prisma.service';
import { TestUtils } from '../../test/test-utils';
import { CreateBookingDto, CancelBookingDto, BookingReviewDto } from '../dto/booking.dto';
import { BookingStatus, PaymentStatus } from '@prisma/client';

describe('BookingService', () => {
  let service: BookingService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestingModule([
      BookingService,
    ]);

    service = module.get<BookingService>(BookingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const userId = 'user-123';
      const createBookingDto: CreateBookingDto = {
        panditId: 'pandit-123',
        serviceId: 'service-123',
        bookingDate: '2024-02-15',
        bookingTime: '10:00',
        timezone: 'Asia/Kolkata',
        specialInstructions: 'Please perform in Hindi',
      };

      const mockPandit = TestUtils.createMockPandit();
      const mockService = TestUtils.createMockService();
      const mockBooking = TestUtils.createMockBooking();
      const mockNotification = TestUtils.createMockNotification();

      jest.spyOn(prismaService.pandit, 'findUnique').mockResolvedValue(mockPandit);
      jest.spyOn(prismaService.service, 'findUnique').mockResolvedValue(mockService);
      jest.spyOn(prismaService.availability, 'findFirst').mockResolvedValue({
        id: 'availability-123',
        panditId: 'pandit-123',
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(prismaService.booking, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.booking, 'create').mockResolvedValue(mockBooking);
      jest.spyOn(prismaService.notification, 'create').mockResolvedValue(mockNotification);

      const result = await service.createBooking(userId, createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(prismaService.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          panditId: createBookingDto.panditId,
          serviceId: createBookingDto.serviceId,
          bookingDate: new Date(createBookingDto.bookingDate),
          bookingTime: createBookingDto.bookingTime,
          timezone: createBookingDto.timezone,
          specialInstructions: createBookingDto.specialInstructions,
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
        }),
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if pandit not found', async () => {
      const userId = 'user-123';
      const createBookingDto: CreateBookingDto = {
        panditId: 'non-existent-pandit',
        serviceId: 'service-123',
        bookingDate: '2024-02-15',
        bookingTime: '10:00',
        timezone: 'Asia/Kolkata',
      };

      jest.spyOn(prismaService.pandit, 'findUnique').mockResolvedValue(null);

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if time slot already booked', async () => {
      const userId = 'user-123';
      const createBookingDto: CreateBookingDto = {
        panditId: 'pandit-123',
        serviceId: 'service-123',
        bookingDate: '2024-02-15',
        bookingTime: '10:00',
        timezone: 'Asia/Kolkata',
      };

      const mockPandit = TestUtils.createMockPandit();
      const mockService = TestUtils.createMockService();
      const existingBooking = TestUtils.createMockBooking();

      jest.spyOn(prismaService.pandit, 'findUnique').mockResolvedValue(mockPandit);
      jest.spyOn(prismaService.service, 'findUnique').mockResolvedValue(mockService);
      jest.spyOn(prismaService.availability, 'findFirst').mockResolvedValue({
        id: 'availability-123',
        panditId: 'pandit-123',
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(prismaService.booking, 'findFirst').mockResolvedValue(existingBooking);

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking successfully', async () => {
      const bookingId = 'booking-123';
      const cancelBookingDto: CancelBookingDto = {
        reason: 'Change of plans',
      };
      const currentUser = TestUtils.createMockUserContext();

      const mockBooking = TestUtils.createMockBooking();
      mockBooking.pandit = { userId: 'pandit-user-123' };
      mockBooking.payments = [];

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking);
      jest.spyOn(prismaService.booking, 'update').mockResolvedValue(mockBooking);
      jest.spyOn(prismaService.notification, 'create').mockResolvedValue(TestUtils.createMockNotification());

      const result = await service.cancelBooking(bookingId, cancelBookingDto, currentUser);

      expect(result.status).toBe(BookingStatus.CANCELLED);
      expect(result.cancellationReason).toBe(cancelBookingDto.reason);
      expect(result.cancelledAt).toBeDefined();
    });

    it('should throw ForbiddenException if user cannot cancel booking', async () => {
      const bookingId = 'booking-123';
      const cancelBookingDto: CancelBookingDto = {
        reason: 'Change of plans',
      };
      const currentUser = TestUtils.createMockUserContext({ userId: 'other-user-123' });

      const mockBooking = TestUtils.createMockBooking();
      mockBooking.pandit = { userId: 'pandit-user-123' };

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking);

      await expect(service.cancelBooking(bookingId, cancelBookingDto, currentUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addReview', () => {
    it('should add review successfully', async () => {
      const bookingId = 'booking-123';
      const reviewDto: BookingReviewDto = {
        rating: 5,
        comment: 'Excellent service!',
      };
      const currentUser = TestUtils.createMockUserContext();

      const mockBooking = TestUtils.createMockBooking({
        status: BookingStatus.COMPLETED,
        panditId: 'pandit-123',
      });

      const mockReview = {
        id: 'review-123',
        userId: currentUser.userId,
        panditId: 'pandit-123',
        bookingId,
        rating: 5,
        comment: 'Excellent service!',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPandit = TestUtils.createMockPandit();

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking);
      jest.spyOn(prismaService.review, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.review, 'create').mockResolvedValue(mockReview);
      jest.spyOn(prismaService.review, 'findMany').mockResolvedValue([mockReview]);
      jest.spyOn(prismaService.pandit, 'update').mockResolvedValue(mockPandit);
      jest.spyOn(prismaService.booking, 'update').mockResolvedValue(mockBooking);

      const result = await service.addReview(bookingId, reviewDto, currentUser);

      expect(result).toEqual(mockReview);
      expect(prismaService.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: currentUser.userId,
          panditId: mockBooking.panditId,
          bookingId,
          rating: reviewDto.rating,
          comment: reviewDto.comment,
        }),
      });
    });

    it('should throw BadRequestException if booking not completed', async () => {
      const bookingId = 'booking-123';
      const reviewDto: BookingReviewDto = {
        rating: 5,
        comment: 'Excellent service!',
      };
      const currentUser = TestUtils.createMockUserContext();

      const mockBooking = TestUtils.createMockBooking({
        status: BookingStatus.PENDING,
      });

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking);

      await expect(service.addReview(bookingId, reviewDto, currentUser)).rejects.toThrow(BadRequestException);
    });
  });
});
