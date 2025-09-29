import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../database/prisma.service';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';
import { UserContext } from '../../auth/interfaces/auth.interface';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditData = this.reflector.get(AUDIT_LOG_KEY, context.getHandler());
    
    if (!auditData) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserContext;
    const { action, resource } = auditData;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logAuditEvent({
            userId: user?.userId,
            action,
            resource,
            resourceId: this.extractResourceId(request, response),
            oldValues: null,
            newValues: this.extractNewValues(request, response),
            ipAddress: request.ip,
            userAgent: request.get('User-Agent'),
            status: 'success',
            duration: Date.now() - startTime,
          });
        },
        error: (error) => {
          this.logAuditEvent({
            userId: user?.userId,
            action,
            resource,
            resourceId: this.extractResourceId(request, null),
            oldValues: null,
            newValues: null,
            ipAddress: request.ip,
            userAgent: request.get('User-Agent'),
            status: 'error',
            error: error.message,
            duration: Date.now() - startTime,
          });
        },
      }),
    );
  }

  private async logAuditEvent(auditData: any): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          resource: auditData.resource,
          resourceId: auditData.resourceId,
          oldValues: auditData.oldValues,
          newValues: auditData.newValues,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private extractResourceId(request: any, response: any): string | null {
    // Extract resource ID from URL params or response
    const params = request.params;
    if (params.id) {
      return params.id;
    }
    
    if (response?.id) {
      return response.id;
    }

    return null;
  }

  private extractNewValues(request: any, response: any): any {
    // Extract new values from request body or response
    if (request.body && Object.keys(request.body).length > 0) {
      return request.body;
    }

    if (response && typeof response === 'object') {
      return response;
    }

    return null;
  }
}
