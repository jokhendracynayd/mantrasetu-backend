import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { SuccessResponseDto, PaginationDto, MetaDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const executionTime = Date.now() - startTime;
        const requestId = request.headers['x-request-id'] as string || this.generateRequestId();
        
        // Set request ID in response headers
        response.setHeader('X-Request-ID', requestId);

        const responseData: SuccessResponseDto<T> = {
          success: true,
          data: data?.data || data,
          message: data?.message || this.getResponseMessage(request.method, response.statusCode),
          timestamp: new Date().toISOString(),
          requestId,
          statusCode: response.statusCode,
          path: request.url,
          meta: {
            version: process.env.APP_VERSION || '1.0.0',
            executionTime,
          },
        };

        // Add pagination if present
        if (data?.pagination) {
          responseData.pagination = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            hasNext: data.pagination.page < data.pagination.totalPages,
            hasPrev: data.pagination.page > 1,
          };
        }

        return responseData;
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getResponseMessage(method: string, status: number): string {
    switch (method) {
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Request processed successfully';
    }
  }
}
