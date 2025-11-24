import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto } from '../dto/auth.dto';
import { AuthResponse, TokenResponse, JwtPayload } from '../interfaces/auth.interface';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private inMemoryUsers: Map<string, any> = new Map();
  private inMemoryRefreshTokens: Map<string, any> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async isDatabaseAvailable(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const dbAvailable = await this.isDatabaseAvailable();

    if (dbAvailable) {
      return this.registerWithDatabase(registerDto);
    } else {
      return this.registerInMemory(registerDto);
    }
  }

  private async registerWithDatabase(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('An account with this email address already exists. Please use a different email or try logging in.');
      }
      if (phone && existingUser.phone === phone) {
        throw new ConflictException('An account with this phone number already exists. Please use a different phone number or try logging in.');
      }
      throw new ConflictException('An account with this email or phone number already exists. Please use different credentials or try logging in.');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        role: role || UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  private async registerInMemory(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, role } = registerDto;

    // Check if user already exists in memory
    if (this.inMemoryUsers.has(email)) {
      throw new ConflictException('An account with this email address already exists. Please use a different email or try logging in.');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user object
    const userId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      role: role || UserRole.USER,
      isVerified: false,
    };

    // Store in memory
    this.inMemoryUsers.set(email, {
      ...user,
      passwordHash,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const dbAvailable = await this.isDatabaseAvailable();

    if (dbAvailable) {
      return this.loginWithDatabase(loginDto);
    } else {
      return this.loginInMemory(loginDto);
    }
  }

  private async loginWithDatabase(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('No account found with this email address. Please check your email or sign up for a new account.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support for assistance.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('The password you entered is incorrect. Please try again or reset your password.');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  private async loginInMemory(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user in memory
    const userData = this.inMemoryUsers.get(email);
    if (!userData) {
      throw new UnauthorizedException('No account found with this email address. Please check your email or sign up for a new account.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('The password you entered is incorrect. Please try again or reset your password.');
    }

    // Generate tokens
    const tokens = await this.generateTokens(userData.id, userData.email, userData.role);

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = userData;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    const { refreshToken } = refreshTokenDto;

    // Find refresh token
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!tokenRecord || !tokenRecord.user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old refresh token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    // Generate new tokens
    return this.generateTokens(tokenRecord.user.id, tokenRecord.user.email, tokenRecord.user.role);
  }

  async logout(userId: string): Promise<void> {
    // Revoke all refresh tokens for user
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user with password hash
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found. Please log in again.');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('The current password you entered is incorrect. Please try again.');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async verifyEmail(token: string): Promise<void> {
    // Implementation for email verification
    // This would typically involve checking a verification token
    // and updating the user's emailVerifiedAt field
    throw new Error('Email verification not implemented yet');
  }

  async resendVerificationEmail(email: string): Promise<void> {
    // Implementation for resending verification email
    throw new Error('Resend verification email not implemented yet');
  }

  private async generateTokens(userId: string, email: string, role: UserRole): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwtService.signAsync(
        { sub: userId, token: randomBytes(32).toString('hex') },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN', '30d'),
        },
      ),
    ]);

    // Store refresh token
    const dbAvailable = await this.isDatabaseAvailable();
    if (dbAvailable) {
      await this.storeRefreshTokenInDatabase(userId, refreshToken);
    } else {
      this.storeRefreshTokenInMemory(userId, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  private async storeRefreshTokenInDatabase(userId: string, refreshToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });
  }

  private storeRefreshTokenInMemory(userId: string, refreshToken: string): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    this.inMemoryRefreshTokens.set(refreshToken, {
      userId,
      token: refreshToken,
      expiresAt,
    });
  }
}
