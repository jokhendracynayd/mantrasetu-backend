import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';

export class BusinessLogicException extends HttpException {
  constructor(
    errorCode: ErrorCode,
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    details?: any,
    field?: string
  ) {
    super(
      {
        success: false,
        error: {
          code: errorCode,
          message,
          details,
          field
        }
      },
      statusCode
    );
  }
}

export class ValidationException extends BusinessLogicException {
  constructor(message: string, field?: string, details?: any) {
    super(
      ErrorCode.VALIDATION_REQUIRED_FIELD,
      message,
      HttpStatus.BAD_REQUEST,
      details,
      field
    );
  }
}

export class AuthenticationException extends BusinessLogicException {
  constructor(errorCode: ErrorCode, message: string, details?: any) {
    super(errorCode, message, HttpStatus.UNAUTHORIZED, details);
  }
}

export class AuthorizationException extends BusinessLogicException {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(
      ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS,
      message,
      HttpStatus.FORBIDDEN,
      details
    );
  }
}

export class NotFoundException extends BusinessLogicException {
  constructor(errorCode: ErrorCode, message: string, details?: any) {
    super(errorCode, message, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictException extends BusinessLogicException {
  constructor(errorCode: ErrorCode, message: string, details?: any) {
    super(errorCode, message, HttpStatus.CONFLICT, details);
  }
}

export class SystemException extends BusinessLogicException {
  constructor(errorCode: ErrorCode, message: string, details?: any) {
    super(errorCode, message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}

export class PaymentException extends BusinessLogicException {
  constructor(errorCode: ErrorCode, message: string, details?: any) {
    super(errorCode, message, HttpStatus.PAYMENT_REQUIRED, details);
  }
}

export class RateLimitException extends BusinessLogicException {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(
      ErrorCode.SYSTEM_RATE_LIMIT_EXCEEDED,
      message,
      HttpStatus.TOO_MANY_REQUESTS,
      details
    );
  }
}
