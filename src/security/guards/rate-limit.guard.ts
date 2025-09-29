import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // Use IP address and user ID for tracking
    const ip = req.ip || req.connection.remoteAddress;
    const userId = (req as any).user?.userId;
    
    if (userId) {
      return `user:${userId}`;
    }
    
    return `ip:${ip}`;
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const { req } = context.switchToHttp().getRequest();
    const key = this.generateKey(context, await this.getTracker(req));
    const totalHits = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          retryAfter: Math.round(ttl / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
