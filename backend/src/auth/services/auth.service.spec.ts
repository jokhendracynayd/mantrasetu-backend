import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { TestUtils } from '../../test/test-utils';
import { RegisterDto, LoginDto, ChangePasswordDto } from '../dto/auth.dto';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestingModule([
      AuthService,
      {
        provide: JwtService,
        useValue: {
          signAsync: jest.fn(),
        },
      },
      {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            const config = {
              JWT_SECRET: 'test-secret',
              JWT_EXPIRES_IN: '7d',
              REFRESH_TOKEN_SECRET: 'test-refresh-secret',
              REFRESH_TOKEN_EXPIRES_IN: '30d',
            };
            return config[key];
          }),
        },
      },
    ]);

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
      };

      const mockUser = TestUtils.createMockUser();
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          phone: registerDto.phone,
          role: UserRole.USER,
        }),
        select: expect.any(Object),
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const existingUser = TestUtils.createMockUser();

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = TestUtils.createMockUser();
      mockUser.passwordHash = 'hashed-password';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-123';
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'old-password',
        newPassword: 'new-password',
      };

      const mockUser = TestUtils.createMockUser();
      mockUser.passwordHash = 'hashed-old-password';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'updateMany').mockResolvedValue({ count: 1 });

      // Mock bcrypt.compare and bcrypt.hash
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-new-password');

      await service.changePassword(userId, changePasswordDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: 'hashed-new-password' },
      });
      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    });

    it('should throw BadRequestException for incorrect current password', async () => {
      const userId = 'user-123';
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'wrong-password',
        newPassword: 'new-password',
      };

      const mockUser = TestUtils.createMockUser();
      mockUser.passwordHash = 'hashed-password';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = 'user-123';

      jest.spyOn(prismaService.refreshToken, 'updateMany').mockResolvedValue({ count: 1 });

      await service.logout(userId);

      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });
});
