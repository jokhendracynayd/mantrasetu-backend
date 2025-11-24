import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Generate request ID if not present
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = this.generateRequestId();
    }
    
    // Set request ID in response headers
    res.setHeader('X-Request-ID', req.headers['x-request-id']);
    
    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
