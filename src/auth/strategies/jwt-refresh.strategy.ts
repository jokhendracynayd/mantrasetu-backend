import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET') || 'default-refresh-secret',
    });
  }

  async validate(payload: any) {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: payload.token,
        userId: payload.sub,
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
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!refreshToken || !refreshToken.user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
      role: refreshToken.user.role,
    };
  }
}
