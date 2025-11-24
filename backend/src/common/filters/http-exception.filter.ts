import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';
import { BusinessLogicException } from '../exceptions/business-logic.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const requestId = request.headers['x-request-id'] as string || this.generateRequestId();
    
    let status: number;
    let errorResponse: ErrorResponseDto;

    if (exception instanceof BusinessLogicException) {
      // Handle our custom business logic exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      
      errorResponse = {
        success: false,
        error: exceptionResponse.error,
        timestamp: new Date().toISOString(),
        requestId,
        path: request.url,
        method: request.method,
        statusCode: status,
      };
    } else if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      let errorMessage: string;
      let errorCode: number;
      let errorDetails: any;

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        errorMessage = responseObj.message || responseObj.error || 'An error occurred';
        errorCode = responseObj.code || this.getErrorCodeFromStatus(status);
        errorDetails = responseObj.details;
      } else {
        errorMessage = 'An error occurred';
        errorCode = this.getErrorCodeFromStatus(status);
      }

      errorResponse = {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details: errorDetails,
          ...(process.env.NODE_ENV === 'development' && { stack: exception.stack }),
        },
        timestamp: new Date().toISOString(),
        requestId,
        path: request.url,
        method: request.method,
        statusCode: status,
      };
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const error = exception as Error;
      
      errorResponse = {
        success: false,
        error: {
          code: 9999, // SYSTEM_INTERNAL_ERROR
          message: process.env.NODE_ENV === 'production' 
            ? 'An internal server error occurred' 
            : error.message || 'An unexpected error occurred',
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
        timestamp: new Date().toISOString(),
        requestId,
        path: request.url,
        method: request.method,
        statusCode: status,
      };
    }

    // Set request ID in response headers
    response.setHeader('X-Request-ID', requestId);
    
    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): number {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 6001; // VALIDATION_REQUIRED_FIELD
      case HttpStatus.UNAUTHORIZED:
        return 1001; // AUTH_INVALID_CREDENTIALS
      case HttpStatus.FORBIDDEN:
        return 1004; // AUTH_INSUFFICIENT_PERMISSIONS
      case HttpStatus.NOT_FOUND:
        return 2001; // USER_NOT_FOUND (generic)
      case HttpStatus.CONFLICT:
        return 2002; // USER_ALREADY_EXISTS (generic)
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 6001; // VALIDATION_REQUIRED_FIELD
      case HttpStatus.TOO_MANY_REQUESTS:
        return 7007; // SYSTEM_RATE_LIMIT_EXCEEDED
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 7001; // SYSTEM_DATABASE_ERROR
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 7009; // SYSTEM_SERVICE_UNAVAILABLE
      default:
        return 9999; // SYSTEM_INTERNAL_ERROR
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
