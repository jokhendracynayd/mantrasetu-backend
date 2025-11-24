import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';

export class TestUtils {
  static async createTestingModule(providers: any[] = []): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            pandit: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            booking: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            payment: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            notification: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $connect: jest.fn(),
            $disconnect: jest.fn(),
          },
        },
        ...providers,
      ],
    }).compile();
  }

  static createMockUser(overrides: any = {}) {
    return {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockPandit(overrides: any = {}) {
    return {
      id: 'pandit-123',
      userId: 'user-123',
      certificationNumber: 'CERT123',
      experienceYears: 10,
      specialization: ['pooja', 'astrology'],
      languagesSpoken: ['hindi', 'english'],
      serviceAreas: ['delhi', 'mumbai'],
      hourlyRate: 2000,
      rating: 4.5,
      totalBookings: 100,
      isVerified: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockBooking(overrides: any = {}) {
    return {
      id: 'booking-123',
      userId: 'user-123',
      panditId: 'pandit-123',
      serviceId: 'service-123',
      bookingDate: new Date(),
      bookingTime: '10:00',
      timezone: 'Asia/Kolkata',
      durationMinutes: 120,
      totalAmount: 2500,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockService(overrides: any = {}) {
    return {
      id: 'service-123',
      name: 'Satyanarayan Katha',
      description: 'Sacred storytelling session',
      category: 'POOJA',
      durationMinutes: 120,
      basePrice: 1500,
      isVirtual: true,
      requiresSamagri: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockPayment(overrides: any = {}) {
    return {
      id: 'payment-123',
      bookingId: 'booking-123',
      userId: 'user-123',
      amount: 2500,
      currency: 'INR',
      paymentMethod: 'CARD',
      paymentGateway: 'razorpay',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockNotification(overrides: any = {}) {
    return {
      id: 'notification-123',
      userId: 'user-123',
      type: 'IN_APP',
      title: 'Test Notification',
      message: 'This is a test notification',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockUserContext(overrides: any = {}) {
    return {
      userId: 'user-123',
      email: 'test@example.com',
      role: UserRole.USER,
      ...overrides,
    };
  }

  static createMockRequest(overrides: any = {}) {
    return {
      user: this.createMockUserContext(),
      body: {},
      params: {},
      query: {},
      ip: '127.0.0.1',
      get: jest.fn(),
      ...overrides,
    };
  }

  static createMockResponse(overrides: any = {}) {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      removeHeader: jest.fn().mockReturnThis(),
      ...overrides,
    };
  }

  static createMockNextFunction() {
    return jest.fn();
  }

  static async waitFor(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static generateRandomId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static generateRandomEmail(): string {
    return `test-${this.generateRandomId()}@example.com`;
  }

  static generateRandomPhone(): string {
    return `+91${Math.floor(Math.random() * 10000000000)}`;
  }
}
