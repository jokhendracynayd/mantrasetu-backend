# 📝 Comprehensive Logging System Guide

This guide covers the complete logging system implementation for MantraSetu API, based on the e-commerce-api structure.

## 🏗️ **Architecture Overview**

The logging system consists of:
- **AppLogger**: Main logging service with structured logging
- **LoggingInterceptor**: Automatic HTTP request/response logging
- **LoggerMiddleware**: Basic HTTP request logging
- **Winston Configuration**: File-based logging with daily rotation

## 📁 **File Structure**

```
src/
├── config/
│   └── logger.module.ts              # Winston configuration module
├── common/
│   ├── services/
│   │   └── logger.service.ts        # Main logging service
│   ├── interceptors/
│   │   └── logging.interceptor.ts   # HTTP logging interceptor
│   ├── middlewares/
│   │   └── logger.middleware.ts     # HTTP logging middleware
│   └── common.module.ts              # Common module with logging
└── main.ts                           # Bootstrap with logging setup
```

## 🚀 **Quick Start**

### **1. Basic Usage**

```typescript
import { AppLogger } from './common/services/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('UserService');
  }

  async createUser(userData: any) {
    this.logger.log({
      message: 'Creating new user',
      email: userData.email,
    });
    
    try {
      const user = await this.userRepository.create(userData);
      this.logger.log({
        message: 'User created successfully',
        userId: user.id,
      });
      return user;
    } catch (error) {
      this.logger.error({
        message: 'Failed to create user',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
```

### **2. Controller Logging**

```typescript
import { AppLogger } from './common/services/logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext('UsersController');
  }

  @Post()
  async createUser(@Body() userData: any, @Req() req: any) {
    this.logger.log({
      message: 'User creation request',
      email: userData.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    try {
      const user = await this.userService.createUser(userData);
      return ResponseUtil.createSuccessResponse(user, 'User created successfully');
    } catch (error) {
      this.logger.error({
        message: 'User creation failed',
        error: error.message,
      });
      throw error;
    }
  }
}
```

## 📊 **Log Levels**

| Level | Description | Use Case |
|-------|-------------|----------|
| `debug` | Detailed information | Development debugging |
| `verbose` | Verbose information | Detailed flow tracking |
| `info` | General information | Normal operations |
| `warn` | Warning messages | Potential issues |
| `error` | Error messages | Error conditions |

## 📝 **Log Types**

### **1. Application Logs**
- General application events
- Business logic operations
- System events

### **2. HTTP Logs**
- Request/response logging (via LoggingInterceptor)
- Basic HTTP logging (via LoggerMiddleware)
- Performance metrics
- Error tracking

### **3. Error Logs**
- Application errors
- Uncaught exceptions
- Unhandled rejections

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Log level (debug, info, warn, error)
LOG_LEVEL=info

# Application version
APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

### **Log Files**

The system creates the following log files with daily rotation:

```
logs/
├── combined-YYYY-MM-DD.log    # All logs
├── error-YYYY-MM-DD.log       # Error logs only
└── http-YYYY-MM-DD.log         # HTTP request logs
```

### **Log Rotation**

- **File Size**: 20MB per file
- **Max Files**: 14 days retention
- **Format**: JSON for structured logging
- **Compression**: Gzip compression for old files

## 📋 **Usage Examples**

### **1. Service Logging**

```typescript
@Injectable()
export class BookingService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('BookingService');
  }

  async createBooking(bookingData: any) {
    this.logger.log({
      message: 'Creating booking',
      userId: bookingData.userId,
      templeId: bookingData.templeId,
      date: bookingData.date,
    });

    try {
      const booking = await this.bookingRepository.create(bookingData);
      
      this.logger.log({
        message: 'Booking created successfully',
        bookingId: booking.id,
        userId: booking.userId,
      });

      return booking;
    } catch (error) {
      this.logger.error({
        message: 'Failed to create booking',
        error: error.message,
        stack: error.stack,
        bookingData,
      });
      throw error;
    }
  }
}
```

### **2. Error Logging**

```typescript
@Injectable()
export class PaymentService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('PaymentService');
  }

  async processPayment(paymentData: any) {
    try {
      const result = await this.razorpay.payments.create(paymentData);
      
      this.logger.log({
        message: 'Payment processed successfully',
        paymentId: result.id,
        amount: paymentData.amount,
      });

      return result;
    } catch (error) {
      this.logger.error({
        message: 'Payment processing failed',
        error: error.message,
        stack: error.stack,
        paymentData: {
          amount: paymentData.amount,
          currency: paymentData.currency,
        },
      });
      throw error;
    }
  }
}
```

### **3. Authentication Logging**

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('AuthService');
  }

  async login(email: string, password: string, ip: string, userAgent: string) {
    this.logger.log({
      message: 'Login attempt',
      email,
      ip,
      userAgent,
    });

    try {
      const user = await this.validateCredentials(email, password);
      
      this.logger.log({
        message: 'Login successful',
        userId: user.id,
        email: user.email,
        ip,
      });

      return user;
    } catch (error) {
      this.logger.warn({
        message: 'Login failed',
        email,
        ip,
        error: error.message,
      });
      throw error;
    }
  }
}
```

## 🔍 **Log Analysis**

### **1. Structured Logging**

All logs are in JSON format for easy parsing:

```json
{
  "level": "info",
  "context": "UserService",
  "message": "User created successfully",
  "userId": "123",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ms": "+5ms",
  "service": "mantrasetu-api",
  "environment": "development"
}
```

### **2. HTTP Request Logging**

```json
{
  "level": "info",
  "context": "LoggingInterceptor",
  "message": "Request Completed",
  "requestId": "req_1704110400000_abc123def",
  "method": "POST",
  "url": "/api/v1/users",
  "statusCode": 201,
  "duration": "150ms",
  "responseSize": 256,
  "userId": "123",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ms": "+150ms",
  "service": "mantrasetu-api",
  "environment": "development"
}
```

### **3. Error Logging**

```json
{
  "level": "error",
  "context": "UserService",
  "message": "Failed to create user",
  "error": "Email already exists",
  "stack": "Error: Email already exists\n    at UserService.createUser...",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ms": "+5ms",
  "service": "mantrasetu-api",
  "environment": "development"
}
```

## 🚨 **Security Considerations**

### **1. Sensitive Data**

Avoid logging sensitive information:
- Passwords
- Credit card numbers
- Social security numbers
- Personal addresses
- Phone numbers

### **2. Log Access**

- Restrict log file access
- Use secure log transmission
- Implement log retention policies
- Monitor log access

## 📈 **Performance Monitoring**

### **1. Response Time Tracking**

Automatic via LoggingInterceptor:
- Request start time
- Response time calculation
- Performance metrics

### **2. Memory Monitoring**

```typescript
// Log memory usage
this.logger.log({
  message: 'Memory usage check',
  memoryUsage: process.memoryUsage(),
});
```

## 🎯 **Best Practices**

### **1. Context Setting**

Always set context for better log organization:

```typescript
this.logger.setContext('UserService');
```

### **2. Structured Data**

Use objects for metadata:

```typescript
this.logger.log({
  message: 'User created',
  userId: user.id,
  email: user.email,
  role: user.role,
});
```

### **3. Error Logging**

Include full error context:

```typescript
this.logger.error({
  message: 'Operation failed',
  error: error.message,
  stack: error.stack,
  context: { userId, operation },
});
```

### **4. Request Tracking**

Use request IDs for tracing:

```typescript
// Automatic via LoggingInterceptor
// Manual tracking:
const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
this.logger.log({
  message: 'Operation started',
  requestId,
  operation: 'createUser',
});
```

## 🔧 **Testing**

### **1. Unit Testing**

```typescript
describe('UserService', () => {
  let service: UserService;
  let logger: AppLogger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: AppLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should log user creation', async () => {
    await service.createUser({ email: 'test@example.com' });
    
    expect(logger.log).toHaveBeenCalledWith({
      message: 'Creating new user',
      email: 'test@example.com',
    });
  });
});
```

### **2. Integration Testing**

```typescript
describe('UsersController (e2e)', () => {
  it('should log HTTP requests', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ email: 'test@example.com' });

    // Check logs directory for HTTP logs
    const logFiles = fs.readdirSync('logs');
    expect(logFiles).toContain('http-2024-01-01.log');
  });
});
```

## 🎉 **Production Deployment**

### **1. Environment Configuration**

```bash
# Production
NODE_ENV=production
LOG_LEVEL=info
APP_VERSION=1.0.0
```

### **2. Log Management**

- Set up log rotation
- Configure log aggregation
- Set up monitoring alerts
- Implement log retention policies

### **3. Monitoring**

- Monitor error rates
- Track response times
- Watch memory usage
- Monitor security events

## 🔧 **Log Aggregation Tools**

### **1. ELK Stack**
- Elasticsearch for log storage
- Logstash for log processing
- Kibana for log visualization

### **2. Cloud Solutions**
- AWS CloudWatch
- Google Cloud Logging
- Azure Monitor

### **3. Other Tools**
- Fluentd
- Prometheus + Grafana
- DataDog
- New Relic

## 📊 **Log Monitoring**

### **1. Key Metrics**
- Error rate
- Response time
- Request volume
- Memory usage
- CPU usage

### **2. Alerts**
- High error rate
- Slow response times
- Memory leaks
- Security violations

Your comprehensive logging system is now ready for production! 📝✨

## 🚀 **Quick Test**

Start the server and check the logs:

```bash
npm run start:dev
```

Check the logs directory:
```bash
ls logs/
# You should see:
# combined-2024-01-01.log
# error-2024-01-01.log
# http-2024-01-01.log
```

Test the health endpoint:
```bash
curl -X GET http://localhost:3000/api/v1/health
```

Check the logs to see the HTTP request logging in action!
