import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { TestUtils } from '../src/test/test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
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
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe('ok');
        });
    });
  });

  describe('Authentication', () => {
    it('/auth/register (POST) - should register a new user', async () => {
      const registerData = {
        email: TestUtils.generateRandomEmail(),
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: TestUtils.generateRandomPhone(),
      };

      const mockUser = TestUtils.createMockUser({
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      });

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.user.email).toBe(registerData.email);
        });
    });

    it('/auth/register (POST) - should return 409 for existing user', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const existingUser = TestUtils.createMockUser({
        email: registerData.email,
      });

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(existingUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(409);
    });

    it('/auth/login (POST) - should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = TestUtils.createMockUser({
        email: loginData.email,
        passwordHash: 'hashed-password',
      });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });
  });

  describe('User Management', () => {
    let authToken: string;

    beforeEach(async () => {
      // Mock authentication
      const mockUser = TestUtils.createMockUser();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      authToken = 'mock-jwt-token';
    });

    it('/users/profile (GET) - should get user profile', async () => {
      const mockUser = TestUtils.createMockUser();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('firstName');
          expect(res.body).toHaveProperty('lastName');
        });
    });

    it('/users/profile (PUT) - should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUser = TestUtils.createMockUser(updateData);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe(updateData.firstName);
          expect(res.body.lastName).toBe(updateData.lastName);
        });
    });
  });

  describe('Booking Management', () => {
    let authToken: string;

    beforeEach(async () => {
      authToken = 'mock-jwt-token';
    });

    it('/bookings (POST) - should create a booking', async () => {
      const bookingData = {
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
      jest.spyOn(prismaService.notification, 'create').mockResolvedValue(TestUtils.createMockNotification());

      return request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('panditId');
          expect(res.body).toHaveProperty('serviceId');
        });
    });

    it('/bookings/search (GET) - should search bookings', async () => {
      const mockBookings = [TestUtils.createMockBooking()];
      jest.spyOn(prismaService.booking, 'findMany').mockResolvedValue(mockBookings);
      jest.spyOn(prismaService.booking, 'count').mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/api/v1/bookings/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('bookings');
          expect(res.body).toHaveProperty('pagination');
          expect(Array.isArray(res.body.bookings)).toBe(true);
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/non-existent-route')
        .expect(404);
    });

    it('should return 401 for unauthorized access', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .expect(401);
    });
  });
});