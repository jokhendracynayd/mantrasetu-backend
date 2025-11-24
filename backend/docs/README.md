# Standard Response System

This module provides a comprehensive, standardized response system for the MantraSetu application, ensuring consistent API responses across all endpoints.

## 🚀 Features

- **Standardized Success Responses**: Consistent format for all successful API calls
- **Comprehensive Error Handling**: Custom error codes and detailed error responses
- **Request Tracking**: Unique request IDs for debugging and monitoring
- **Pagination Support**: Built-in pagination metadata
- **Performance Metrics**: Execution time tracking
- **Development-Friendly**: Stack traces in development mode

## 📋 Response Formats

### Success Response

```typescript
{
  success: true,
  data: any,
  message: string,
  timestamp: string,
  requestId: string,
  statusCode: number,
  path: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  },
  meta?: {
    version: string,
    executionTime: number
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: {
    code: number,           // Numeric error code (e.g., 1001, 2003, 5004)
    message: string,        // User-friendly message
    details?: any,          // Additional error details
    field?: string,         // Field name for validation errors
    stack?: string          // Stack trace (development only)
  },
  timestamp: string,
  requestId: string,
  path: string,
  method: string,
  statusCode: number
}
```

## 🔧 Usage

### 1. Import the Common Module

```typescript
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule],
  // ...
})
export class AppModule {}
```

### 2. Use Response Utilities

```typescript
import { ResponseUtil, ErrorCode, BusinessLogicException } from './common';

// Success response
return ResponseUtil.createSuccessResponse(data, 'Operation successful');

// Paginated response
return ResponseUtil.createPaginatedResponse(
  data,
  page,
  limit,
  total,
  'Data retrieved successfully'
);

// Throw custom errors
throw new BusinessLogicException(
  ErrorCode.USER_NOT_FOUND,
  'User not found',
  404,
  { userId: '123' }
);
```

### 3. Controller Example

```typescript
@Controller('users')
export class UsersController {
  
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(
        ErrorCode.USER_NOT_FOUND,
        'User not found',
        { userId: id }
      );
    }

    return ResponseUtil.createSuccessResponse(user, 'User retrieved successfully');
  }

  @Get()
  async getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    const { page: validatedPage, limit: validatedLimit } = 
      ResponseUtil.validatePaginationParams(page, limit);

    const offset = ResponseUtil.calculateOffset(validatedPage, validatedLimit);
    const [users, total] = await Promise.all([
      this.usersService.findPaginated(validatedLimit, offset),
      this.usersService.count()
    ]);

    return ResponseUtil.createPaginatedResponse(
      users,
      validatedPage,
      validatedLimit,
      total,
      'Users retrieved successfully'
    );
  }
}
```

## 🚨 Error Codes (Numeric)

### Authentication & Authorization (1000-1999)
- `1001` - AUTH_INVALID_CREDENTIALS
- `1002` - AUTH_TOKEN_EXPIRED
- `1003` - AUTH_TOKEN_INVALID
- `1004` - AUTH_INSUFFICIENT_PERMISSIONS
- `1005` - AUTH_ACCOUNT_LOCKED
- `1006` - AUTH_ACCOUNT_SUSPENDED
- `1007` - AUTH_REFRESH_TOKEN_INVALID
- `1008` - AUTH_EMAIL_NOT_VERIFIED
- `1009` - AUTH_PHONE_NOT_VERIFIED
- `1010` - AUTH_OTP_INVALID
- `1011` - AUTH_OTP_EXPIRED
- `1012` - AUTH_PASSWORD_RESET_EXPIRED

### User Management (2000-2999)
- `2001` - USER_NOT_FOUND
- `2002` - USER_ALREADY_EXISTS
- `2003` - USER_EMAIL_ALREADY_EXISTS
- `2004` - USER_PHONE_ALREADY_EXISTS
- `2005` - USER_PROFILE_INCOMPLETE
- `2006` - USER_INVALID_ROLE
- `2007` - USER_CANNOT_DELETE_SELF
- `2008` - USER_INVALID_STATUS
- `2009` - USER_ADDRESS_NOT_FOUND

### Temple Management (3000-3999)
- `3001` - TEMPLE_NOT_FOUND
- `3002` - TEMPLE_ALREADY_EXISTS
- `3003` - TEMPLE_INVALID_LOCATION
- `3004` - TEMPLE_MAINTENANCE_MODE
- `3005` - TEMPLE_CLOSED
- `3006` - TEMPLE_INVALID_TIMINGS
- `3007` - TEMPLE_INVALID_CAPACITY

### Booking System (4000-4999)
- `4001` - BOOKING_NOT_FOUND
- `4002` - BOOKING_ALREADY_EXISTS
- `4003` - BOOKING_SLOT_UNAVAILABLE
- `4004` - BOOKING_INVALID_DATE
- `4005` - BOOKING_INVALID_TIME
- `4006` - BOOKING_MAX_PARTICIPANTS
- `4007` - BOOKING_CANNOT_CANCEL
- `4008` - BOOKING_CANNOT_MODIFY
- `4009` - BOOKING_PAST_DATE
- `4010` - BOOKING_INVALID_STATUS
- `4011` - BOOKING_PANDIT_UNAVAILABLE

### Payment System (5000-5999)
- `5001` - PAYMENT_FAILED
- `5002` - PAYMENT_INVALID_AMOUNT
- `5003` - PAYMENT_INSUFFICIENT_FUNDS
- `5004` - PAYMENT_GATEWAY_ERROR
- `5005` - PAYMENT_ALREADY_PROCESSED
- `5006` - PAYMENT_REFUND_FAILED
- `5007` - PAYMENT_INVALID_CURRENCY
- `5008` - PAYMENT_TIMEOUT
- `5009` - PAYMENT_INVALID_SIGNATURE
- `5010` - PAYMENT_WEBHOOK_ERROR

### Validation Errors (6000-6999)
- `6001` - VALIDATION_REQUIRED_FIELD
- `6002` - VALIDATION_INVALID_EMAIL
- `6003` - VALIDATION_INVALID_PHONE
- `6004` - VALIDATION_INVALID_DATE
- `6005` - VALIDATION_INVALID_TIME
- `6006` - VALIDATION_MIN_LENGTH
- `6007` - VALIDATION_MAX_LENGTH
- `6008` - VALIDATION_INVALID_FORMAT
- `6009` - VALIDATION_UNIQUE_CONSTRAINT
- `6010` - VALIDATION_INVALID_ENUM
- `6011` - VALIDATION_INVALID_UUID

### System Errors (7000-7999)
- `7001` - SYSTEM_DATABASE_ERROR
- `7002` - SYSTEM_CACHE_ERROR
- `7003` - SYSTEM_EXTERNAL_API_ERROR
- `7004` - SYSTEM_FILE_UPLOAD_ERROR
- `7005` - SYSTEM_EMAIL_SEND_ERROR
- `7006` - SYSTEM_SMS_SEND_ERROR
- `7007` - SYSTEM_RATE_LIMIT_EXCEEDED
- `7008` - SYSTEM_MAINTENANCE_MODE
- `7009` - SYSTEM_SERVICE_UNAVAILABLE
- `7010` - SYSTEM_TIMEOUT

### Content Management (8000-8999)
- `8001` - CONTENT_NOT_FOUND
- `8002` - CONTENT_INVALID_TYPE
- `8003` - CONTENT_FILE_TOO_LARGE
- `8004` - CONTENT_INVALID_FORMAT
- `8005` - CONTENT_UPLOAD_FAILED
- `8006` - CONTENT_DELETE_FAILED
- `8007` - CONTENT_INVALID_MIME_TYPE

### Notification System (9000-9999)
- `9001` - NOTIFICATION_SEND_FAILED
- `9002` - NOTIFICATION_TEMPLATE_NOT_FOUND
- `9003` - NOTIFICATION_INVALID_CHANNEL

### Pandit Management (10000-10999)
- `10001` - PANDIT_NOT_FOUND
- `10002` - PANDIT_NOT_AVAILABLE
- `10003` - PANDIT_INVALID_LICENSE
- `10004` - PANDIT_INVALID_SPECIALIZATION

### Puja Management (11000-11999)
- `11001` - PUJA_NOT_FOUND
- `11002` - PUJA_INVALID_TYPE
- `11003` - PUJA_INVALID_DURATION
- `11004` - PUJA_INVALID_PRICE

### Admin Management (12000-12999)
- `12001` - ADMIN_ACCESS_DENIED
- `12002` - ADMIN_INVALID_OPERATION
- `12003` - ADMIN_AUDIT_LOG_ERROR

## 🛠️ Custom Exceptions

### BusinessLogicException
```typescript
throw new BusinessLogicException(
  ErrorCode.USER_NOT_FOUND,
  'User not found',
  404,
  { userId: '123' }
);
```

### ValidationException
```typescript
throw new ValidationException(
  'Email is required',
  'email'
);
```

### AuthenticationException
```typescript
throw new AuthenticationException(
  ErrorCode.AUTH_TOKEN_EXPIRED,
  'Token has expired'
);
```

### AuthorizationException
```typescript
throw new AuthorizationException(
  'You do not have permission to perform this action'
);
```

### NotFoundException
```typescript
throw new NotFoundException(
  ErrorCode.USER_NOT_FOUND,
  'User not found',
  { userId: '123' }
);
```

### ConflictException
```typescript
throw new ConflictException(
  ErrorCode.USER_EMAIL_ALREADY_EXISTS,
  'Email already exists',
  { email: 'user@example.com' }
);
```

### SystemException
```typescript
throw new SystemException(
  ErrorCode.SYSTEM_DATABASE_ERROR,
  'Database connection failed',
  { error: 'Connection timeout' }
);
```

### PaymentException
```typescript
throw new PaymentException(
  ErrorCode.PAYMENT_GATEWAY_ERROR,
  'Payment gateway unavailable',
  { gateway: 'razorpay' }
);
```

### RateLimitException
```typescript
throw new RateLimitException(
  'Too many requests. Please try again later.',
  { limit: 100, remaining: 0 }
);
```

## 📊 Pagination

### Validate Pagination Parameters
```typescript
const { page, limit } = ResponseUtil.validatePaginationParams(page, limit);
```

### Calculate Offset
```typescript
const offset = ResponseUtil.calculateOffset(page, limit);
```

### Create Paginated Response
```typescript
return ResponseUtil.createPaginatedResponse(
  data,
  page,
  limit,
  total,
  'Data retrieved successfully'
);
```

## 🔍 Request Tracking

Every request automatically gets a unique request ID that is:
- Generated if not provided in headers
- Included in response headers (`X-Request-ID`)
- Logged with all responses
- Useful for debugging and monitoring

## ⚡ Performance Monitoring

The system automatically tracks:
- **Execution Time**: Time taken to process each request
- **Request ID**: Unique identifier for each request
- **Timestamp**: ISO timestamp of response
- **Version**: Application version

## 🛡️ Security Features

- **Stack Traces**: Only shown in development mode
- **Error Sanitization**: Sensitive information is filtered out
- **Request Validation**: Automatic validation of pagination parameters
- **Rate Limiting**: Built-in rate limit error handling

## 📝 Best Practices

1. **Always use custom error codes** for business logic errors
2. **Provide meaningful error messages** for users
3. **Include relevant details** in error responses
4. **Use pagination** for list endpoints
5. **Validate input parameters** before processing
6. **Handle errors gracefully** with appropriate HTTP status codes
7. **Log errors** for monitoring and debugging
8. **Use request IDs** for tracing requests across services

## 🧪 Testing

The response system is designed to work seamlessly with testing frameworks:

```typescript
// Test success response
expect(response.body.success).toBe(true);
expect(response.body.data).toBeDefined();
expect(response.body.requestId).toBeDefined();

// Test error response
expect(response.body.success).toBe(false);
expect(response.body.error.code).toBe(2001); // USER_NOT_FOUND
expect(response.body.error.message).toBe('User not found');
```

## 🔄 Migration Guide

If you're migrating from an existing response system:

1. Import `CommonModule` in your app module
2. Replace manual response formatting with `ResponseUtil`
3. Replace generic errors with specific `BusinessLogicException`
4. Update frontend to handle new response format
5. Update tests to expect new response structure

## 📚 Examples

See `src/common/examples/enhanced-response-examples.ts` for comprehensive usage examples covering:
- Success responses with path
- Paginated responses
- Various error types with numeric codes
- Controller implementations
- Service layer integration
- Complete error code reference
