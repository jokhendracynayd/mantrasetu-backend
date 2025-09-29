import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Remove server information
    res.removeHeader('X-Powered-By');

    // Rate limiting headers
    const rateLimit = this.configService.get('RATE_LIMIT_MAX_REQUESTS', '100');
    const windowMs = this.configService.get('RATE_LIMIT_WINDOW_MS', '900000');
    
    res.setHeader('X-RateLimit-Limit', rateLimit);
    res.setHeader('X-RateLimit-Window', windowMs);

    // Request ID for tracking
    const requestId = this.generateRequestId();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    // Log security events
    this.logSecurityEvent(req);

    next();
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private logSecurityEvent(req: Request): void {
    const suspiciousPatterns = [
      /\.\.\//, // Path traversal
      /<script/i, // XSS attempts
      /union.*select/i, // SQL injection
      /javascript:/i, // JavaScript injection
      /eval\(/i, // Code injection
    ];

    const userAgent = req.get('User-Agent') || '';
    const url = req.url;
    const method = req.method;

    // Check for suspicious patterns
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(url) || pattern.test(userAgent)
    );

    if (isSuspicious) {
      console.warn('Suspicious request detected:', {
        ip: req.ip,
        userAgent,
        url,
        method,
        timestamp: new Date().toISOString(),
      });
    }

    // Log failed authentication attempts
    if (req.url.includes('/auth/login') && req.method === 'POST') {
      console.info('Login attempt:', {
        ip: req.ip,
        userAgent,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
