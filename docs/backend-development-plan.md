# Backend Development Plan - Devotional Platform

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Design](#architecture-design)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Integration](#payment-integration)
8. [File Management](#file-management)
9. [Third-party Integrations](#third-party-integrations)
10. [Security Implementation](#security-implementation)
11. [Development Phases](#development-phases)
12. [Testing Strategy](#testing-strategy)
13. [Deployment & DevOps](#deployment--devops)
14. [Monitoring & Logging](#monitoring--logging)
15. [Performance Optimization](#performance-optimization)

## Project Overview

### Project Goals
- Build a scalable backend for a devotional platform similar to Sri Mandir
- Support multiple services: Puja booking, Chadhava services, Panchang, Astro tools
- Handle high traffic with 30M+ users
- Ensure secure payment processing
- Support multi-language and multi-region functionality

### Core Features
- User management and authentication
- Temple and puja management
- Booking system (Puja, Chadhava, Yatra)
- Payment processing
- Content management (Mantras, Aartis, Literature)
- Panchang and astrological calculations
- Notification system
- Multi-language support
- Admin dashboard

## Technology Stack

### Core Technologies
```json
{
  "runtime": "Node.js 18+",
  "framework": "Nest.js 10+",
  "language": "TypeScript 5.0+",
  "database": {
    "primary": "PostgreSQL 15+",
    "orm": "Prisma 5.0+",
    "cache": "Redis 7.0+",
    "search": "Elasticsearch 8.0+"
  },
  "authentication": "JWT + Refresh Tokens + RBAC",
  "validation": "class-validator + class-transformer",
  "documentation": "Swagger (built-in)",
  "websocket": "Socket.io",
  "testing": "Jest (built-in)"
}
```

### Additional Libraries
```json
{
  "payment": "razorpay",
  "email": "nodemailer",
  "sms": "twilio",
  "fileUpload": "multer",
  "imageProcessing": "sharp",
  "cronJobs": "@nestjs/schedule",
  "logging": "winston",
  "monitoring": "prometheus",
  "testing": "jest + supertest",
  "security": "helmet + express-rate-limit",
  "websocket": "@nestjs/websockets + socket.io",
  "rbac": "custom guards + decorators",
  "validation": "class-validator + class-transformer",
  "caching": "@nestjs/cache-manager + redis",
  "database": "prisma + @prisma/client",
  "migrations": "prisma migrate",
  "seeding": "prisma db seed"
}
```

## Architecture Design

### Modular Monolith vs Microservices Analysis

#### **Recommendation: Modular Monolith Architecture**

For a devotional platform like Sri Mandir, a **Modular Monolith** is the recommended approach over microservices. Here's why:

##### **Why Modular Monolith is Better:**

1. **Simpler Development**: Single codebase, easier debugging and testing
2. **Better Performance**: No network latency between services
3. **Easier Deployment**: Single deployment unit
4. **Cost Effective**: Lower infrastructure costs
5. **Team Efficiency**: Easier for small to medium teams
6. **Data Consistency**: ACID transactions across modules
7. **Faster Development**: No service communication overhead

##### **When to Consider Microservices:**
- Team size > 50 developers
- Different teams own different domains
- Need independent scaling of specific features
- Different technology stacks required
- Strict fault isolation needed

### Modular Monolith Architecture with Nest.js
```
┌─────────────────────────────────────────────────────────────┐
│                    Nest.js Application                      │
│                  (Single Deployable Unit)                   │
└─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│   Auth Module  │    │  Booking Module   │    │  Payment Module   │
│                │    │                   │    │                  │
│ - JWT Auth     │    │ - Puja Booking    │    │ - Razorpay       │
│ - RBAC         │    │ - Chadhava        │    │ - Refunds        │
│ - Sessions     │    │ - Yatra           │    │ - Transactions   │
└────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │                       │
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│ Content Module │    │  Temple Module    │    │ Notification Mod │
│                │    │                   │    │                  │
│ - Mantras      │    │ - Temple Info     │    │ - Email          │
│ - Aartis       │    │ - Puja Types      │    │ - SMS            │
│ - Literature   │    │ - Availability    │    │ - WebSocket      │
└────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │                       │
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│ Panchang Module│    │  Astro Module    │    │   Admin Module    │
│                │    │                   │    │                  │
│ - Calendar     │    │ - Horoscope       │    │ - Dashboard       │
│ - Festivals    │    │ - Calculations    │    │ - Analytics       │
│ - Timings      │    │ - Consultations   │    │ - Reports         │
└────────────────┘    └──────────────────┘    └──────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│  Shared Module │    │   Core Module     │    │  Database Module  │
│                │    │                   │    │                  │
│ - Common DTOs  │    │ - Guards           │    │ - Prisma Service  │
│ - Utilities   │    │ - Interceptors     │    │ - Migrations      │
│ - Constants   │    │ - Pipes           │    │ - Seeds           │
└────────────────┘    └──────────────────┘    └──────────────────┘
```

### Module Communication
- **Direct Method Calls**: No network overhead
- **Dependency Injection**: Nest.js built-in DI container
- **Event Emitters**: For loose coupling between modules
- **Shared Services**: Common functionality across modules

### Detailed Module Structure

#### **Project Structure**
```
src/
├── app.module.ts                 # Root module
├── main.ts                      # Application entry point
├── common/                      # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
├── modules/
│   ├── auth/                    # Authentication & Authorization
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   ├── guards/
│   │   └── dto/
│   ├── users/                   # User Management
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   ├── temples/                 # Temple Management
│   │   ├── temples.module.ts
│   │   ├── temples.controller.ts
│   │   ├── temples.service.ts
│   │   └── dto/
│   ├── bookings/                # Booking System
│   │   ├── bookings.module.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   └── dto/
│   ├── payments/                # Payment Processing
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── dto/
│   ├── content/                 # Content Management
│   │   ├── content.module.ts
│   │   ├── content.controller.ts
│   │   ├── content.service.ts
│   │   └── dto/
│   ├── notifications/           # Notification System
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   ├── gateway.ts           # WebSocket Gateway
│   │   └── dto/
│   ├── panchang/                # Panchang & Calendar
│   │   ├── panchang.module.ts
│   │   ├── panchang.controller.ts
│   │   ├── panchang.service.ts
│   │   └── dto/
│   ├── astrology/               # Astrology Services
│   │   ├── astrology.module.ts
│   │   ├── astrology.controller.ts
│   │   ├── astrology.service.ts
│   │   └── dto/
│   └── admin/                   # Admin Dashboard
│       ├── admin.module.ts
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       └── dto/
├── database/                    # Database Layer
│   ├── prisma.service.ts
│   ├── migrations/
│   └── seeds/
└── config/                      # Configuration
    ├── database.config.ts
    ├── redis.config.ts
    └── app.config.ts
```

#### **Module Implementation Examples**

##### **1. Auth Module**
```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

##### **2. Bookings Module**
```typescript
// bookings.module.ts
import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../database/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, PaymentsModule, NotificationsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
```

##### **3. Shared Module**
```typescript
// common.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class CommonModule {}
```

#### **Benefits of Modular Architecture**

##### **✅ Advantages:**
1. **Separation of Concerns**: Each module handles specific functionality
2. **Reusability**: Modules can be reused across different parts
3. **Testability**: Easy to unit test individual modules
4. **Maintainability**: Changes in one module don't affect others
5. **Team Collaboration**: Different teams can work on different modules
6. **Scalability**: Easy to add new modules or modify existing ones
7. **Dependency Management**: Clear dependencies between modules
8. **Code Organization**: Well-structured and organized codebase

##### **⚠️ Considerations:**
1. **Module Dependencies**: Need to manage inter-module dependencies carefully
2. **Circular Dependencies**: Avoid circular imports between modules
3. **Shared State**: Be careful with shared services and state
4. **Module Boundaries**: Define clear boundaries between modules

#### **Module Communication Patterns**

##### **1. Direct Service Injection**
```typescript
// bookings.service.ts
import { Injectable } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
  ) {}

  async createBooking(bookingData: CreateBookingDto) {
    // Create booking
    const booking = await this.createBookingRecord(bookingData);
    
    // Process payment
    const payment = await this.paymentsService.createPayment(booking.id);
    
    // Send notification
    await this.notificationsService.sendBookingConfirmation(booking.userId);
    
    return booking;
  }
}
```

##### **2. Event-Driven Communication**
```typescript
// event-emitter.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  async emitBookingCreated(booking: Booking) {
    this.eventEmitter.emit('booking.created', booking);
  }

  async emitPaymentProcessed(payment: Payment) {
    this.eventEmitter.emit('payment.processed', payment);
  }
}

// notifications.service.ts
@Injectable()
export class NotificationsService {
  constructor(private eventEmitter: EventEmitter2) {
    this.eventEmitter.on('booking.created', this.handleBookingCreated.bind(this));
    this.eventEmitter.on('payment.processed', this.handlePaymentProcessed.bind(this));
  }

  private async handleBookingCreated(booking: Booking) {
    // Send booking confirmation notification
  }

  private async handlePaymentProcessed(payment: Payment) {
    // Send payment confirmation notification
  }
}
```

##### **3. Shared Services**
```typescript
// shared/cache.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@nestjs/redis';

@Injectable()
export class CacheService {
  constructor(private redisService: RedisService) {}

  async get(key: string): Promise<any> {
    return this.redisService.get(key);
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redisService.setex(key, ttl, JSON.stringify(value));
  }
}

// shared/email.service.ts
@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Email sending logic
  }
}
```

#### **Migration Path to Microservices (Future)**

If you need to migrate to microservices later, the modular structure makes it easier:

1. **Extract Modules**: Each module can become a separate service
2. **API Gateway**: Add API gateway for service communication
3. **Database Separation**: Split databases per service
4. **Service Discovery**: Add service discovery mechanism
5. **Event Streaming**: Implement event streaming for communication

### **Final Recommendation: Use Modular Monolith**

For your devotional platform, **Modular Monolith** is the best choice because:

- **Faster Development**: Single codebase, easier debugging
- **Better Performance**: No network latency
- **Cost Effective**: Lower infrastructure costs
- **Team Efficiency**: Easier for small to medium teams
- **Data Consistency**: ACID transactions
- **Future Flexibility**: Easy to migrate to microservices later

The modular structure provides all the benefits of microservices (separation of concerns, testability, maintainability) without the complexity and overhead of distributed systems.

## Database Design

### Prisma Schema Design

#### Prisma Schema Configuration
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema", "postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "analytics", "audit"]
}

// Extensions
generator db {
  provider = "postgresql"
  extensions = [pg_trgm, pg_stat_statements]
}
```

#### Core Models with Prisma
```prisma
// User Model with RBAC
model User {
  id                Int      @id @default(autoincrement())
  email             String   @unique
  phone             String   @unique
  name              String
  dateOfBirth       DateTime?
  gender            String?
  language          String   @default("en")
  role              UserRole @default(USER)
  templeId          Int?
  panditLicense     String?
  experienceYears   Int?
  specializations   String[]
  hourlyRate        Decimal? @db.Decimal(10, 2)
  isAvailable       Boolean  @default(true)
  preferences       Json?
  verification      Json?
  status            UserStatus @default(ACTIVE)
  lastLogin         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  temple            Temple?  @relation(fields: [templeId], references: [id])
  addresses         UserAddress[]
  sessions          UserSession[]
  bookings          Booking[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  pujaReports       PujaReport[]
  earnings          PanditEarning[]
  availability      PanditAvailability[]

  @@map("users")
  @@index([email])
  @@index([phone])
  @@index([role])
  @@index([templeId])
}

enum UserRole {
  USER
  PANDIT
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

// Temple Model
model Temple {
  id              Int      @id @default(autoincrement())
  name            String
  address         String
  city            String
  state           String
  latitude        Decimal? @db.Decimal(10, 8)
  longitude       Decimal? @db.Decimal(11, 8)
  deity           String
  description     String?
  images          String[]
  contactPhone    String?
  contactEmail    String?
  facilities      String[]
  timings         Json?
  status          TempleStatus @default(ACTIVE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  users           User[]
  pujas           Puja[]
  bookings        Booking[]

  @@map("temples")
  @@index([city])
  @@index([state])
  @@index([status])
}

enum TempleStatus {
  ACTIVE
  MAINTENANCE
  CLOSED
}

// Puja Model
model Puja {
  id              Int      @id @default(autoincrement())
  templeId        Int
  name            String
  description     String?
  durationMinutes Int
  price           Decimal  @db.Decimal(10, 2)
  maxParticipants Int
  requirements    String[]
  benefits        String[]
  images          String[]
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  temple          Temple   @relation(fields: [templeId], references: [id])
  bookings        Booking[]

  @@map("pujas")
  @@index([templeId])
  @@index([isActive])
}

// Booking Model
model Booking {
  id              Int      @id @default(autoincrement())
  userId          Int
  templeId        Int
  pujaId          Int
  bookingType     BookingType
  bookingDate     DateTime
  bookingTime     String
  amount          Decimal  @db.Decimal(10, 2)
  status          BookingStatus @default(PENDING)
  specialRequests String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  user            User     @relation(fields: [userId], references: [id])
  temple          Temple   @relation(fields: [templeId], references: [id])
  puja            Puja     @relation(fields: [pujaId], references: [id])
  participants    BookingParticipant[]
  payments        Payment[]
  pujaReports     PujaReport[]
  streamingSessions StreamingSession[]

  @@map("bookings")
  @@index([userId])
  @@index([templeId])
  @@index([pujaId])
  @@index([bookingDate])
  @@index([status])
}

enum BookingType {
  PUJA
  CHADHAVA
  YATRA
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

// Payment Model
model Payment {
  id                  Int      @id @default(autoincrement())
  bookingId           Int
  razorpayOrderId     String?
  razorpayPaymentId   String?
  razorpaySignature   String?
  amount              Decimal  @db.Decimal(10, 2)
  currency            String   @default("INR")
  status              PaymentStatus @default(PENDING)
  paidAt              DateTime?
  createdAt           DateTime @default(now())

  // Relations
  booking             Booking  @relation(fields: [bookingId], references: [id])

  @@map("payments")
  @@index([bookingId])
  @@index([status])
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// Notification Model
model Notification {
  id          Int      @id @default(autoincrement())
  userId      Int
  type        NotificationType
  title       String
  message     String
  data        Json?
  isRead      Boolean  @default(false)
  priority    NotificationPriority @default(NORMAL)
  expiresAt   DateTime?
  createdAt   DateTime @default(now())

  // Relations
  user        User     @relation(fields: [userId], references: [id])

  @@map("notifications")
  @@index([userId])
  @@index([isRead])
  @@index([type])
}

enum NotificationType {
  BOOKING
  PAYMENT
  PUJA
  SYSTEM
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

// Additional Models
model UserAddress {
  id        Int     @id @default(autoincrement())
  userId    Int
  type      String
  address   String
  city      String
  state     String
  pincode   String
  isDefault Boolean @default(false)
  createdAt DateTime @default(now())

  user      User    @relation(fields: [userId], references: [id])

  @@map("user_addresses")
}

model UserSession {
  id            Int      @id @default(autoincrement())
  userId        Int
  socketId      String?
  deviceType    String?
  lastActivity  DateTime @default(now())
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id])

  @@map("user_sessions")
}

model BookingParticipant {
  id          Int     @id @default(autoincrement())
  bookingId   Int
  name        String
  relationship String?
  gotra       String?

  booking     Booking @relation(fields: [bookingId], references: [id])

  @@map("booking_participants")
}

model PujaReport {
  id                    Int      @id @default(autoincrement())
  bookingId             Int
  panditId              Int
  reportType            String
  content               String?
  fileUrls              String[]
  durationMinutes       Int?
  participantsCount     Int?
  specialObservations   String?
  createdAt             DateTime @default(now())

  booking               Booking  @relation(fields: [bookingId], references: [id])
  pandit                User     @relation(fields: [panditId], references: [id])

  @@map("puja_reports")
}

model StreamingSession {
  id              Int      @id @default(autoincrement())
  bookingId       Int
  panditId        Int
  streamUrl       String?
  streamKey       String?
  status          StreamingStatus @default(PENDING)
  startedAt       DateTime?
  endedAt         DateTime?
  durationMinutes Int?
  viewerCount     Int      @default(0)
  qualityFeedback Json?
  createdAt       DateTime @default(now())

  booking         Booking  @relation(fields: [bookingId], references: [id])
  pandit          User     @relation(fields: [panditId], references: [id])

  @@map("streaming_sessions")
}

enum StreamingStatus {
  PENDING
  ACTIVE
  ENDED
  FAILED
}

model PanditAvailability {
  id          Int     @id @default(autoincrement())
  panditId    Int
  dayOfWeek   Int
  startTime   String
  endTime     String
  isAvailable Boolean @default(true)
  createdAt   DateTime @default(now())

  pandit      User    @relation(fields: [panditId], references: [id])

  @@map("pandit_availability")
}

model PanditEarning {
  id                Int      @id @default(autoincrement())
  panditId          Int
  bookingId         Int
  amount            Decimal  @db.Decimal(10, 2)
  commissionRate    Decimal  @default(0.10) @db.Decimal(5, 2)
  commissionAmount  Decimal? @db.Decimal(10, 2)
  paymentStatus     String   @default("pending")
  paidAt            DateTime?
  createdAt         DateTime @default(now())

  pandit            User     @relation(fields: [panditId], references: [id])
  booking           Booking  @relation(fields: [bookingId], references: [id])

  @@map("pandit_earnings")
}

model AuditLog {
  id            Int      @id @default(autoincrement())
  userId        Int?
  action        String
  resourceType  String?
  resourceId    Int?
  oldValues     Json?
  newValues     Json?
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())

  user          User?    @relation(fields: [userId], references: [id])

  @@map("audit_logs")
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

model SystemLog {
  id        Int      @id @default(autoincrement())
  level     String
  message   String
  context   Json?
  userId    Int?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id])

  @@map("system_logs")
  @@index([level])
  @@index([createdAt])
}
```

### Prisma Service Implementation
```typescript
// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Custom query methods
  async findUserWithBookings(userId: number) {
    return this.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            temple: true,
            puja: true,
            payments: true
          }
        }
      }
    });
  }

  async findTempleWithPujas(templeId: number) {
    return this.temple.findUnique({
      where: { id: templeId },
      include: {
        pujas: {
          where: { isActive: true }
        }
      }
    });
  }

  async getBookingAnalytics(startDate: Date, endDate: Date) {
    return this.booking.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });
  }
}
```

### Prisma Migrations
```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Deploy migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed
```

### Database Seeding with Prisma
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample temples
  const temple1 = await prisma.temple.create({
    data: {
      name: 'Shri Kashi Vishwanath Temple',
      address: 'Vishwanath Gali, Varanasi',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      deity: 'Shiva',
      description: 'One of the most sacred temples in Hinduism',
      contactPhone: '+91-542-2390001',
      contactEmail: 'info@kashivishwanath.org',
      facilities: ['Parking', 'Food Court', 'Accommodation'],
      timings: {
        open: '04:00',
        close: '23:00',
        specialDays: ['Monday', 'Thursday']
      }
    }
  });

  // Create sample pujas
  const puja1 = await prisma.puja.create({
    data: {
      templeId: temple1.id,
      name: 'Rudrabhishek',
      description: 'Sacred ritual for Lord Shiva',
      durationMinutes: 60,
      price: 500,
      maxParticipants: 10,
      requirements: ['Flowers', 'Milk', 'Bilva leaves'],
      benefits: ['Peace', 'Prosperity', 'Health']
    }
  });

  // Create sample users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@devotional-platform.com',
      phone: '+919876543210',
      name: 'System Administrator',
      role: 'ADMIN',
      language: 'en'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Prisma with Nest.js Integration
```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        bookings: {
          include: {
            temple: true,
            puja: true
          }
        }
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async findPanditsByTemple(templeId: number) {
    return this.prisma.user.findMany({
      where: {
        role: 'PANDIT',
        templeId: templeId,
        status: 'ACTIVE'
      },
      include: {
        availability: true,
        earnings: {
          where: {
            paymentStatus: 'pending'
          }
        }
      }
    });
  }
}
```

### MongoDB Collections

#### Users Collection (PostgreSQL Schema)
```sql
-- Users table with RBAC support
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    language VARCHAR(5) DEFAULT 'en',
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'pandit', 'admin'
    temple_id INTEGER REFERENCES temples(id), -- For pandits
    pandit_license VARCHAR(100), -- For pandits
    experience_years INTEGER, -- For pandits
    specializations TEXT[], -- For pandits
    hourly_rate DECIMAL(10, 2), -- For pandits
    is_available BOOLEAN DEFAULT true, -- For pandits
    preferences JSONB DEFAULT '{}',
    verification JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User addresses
CREATE TABLE user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20), -- 'home', 'work'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for WebSocket tracking
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    socket_id VARCHAR(100),
    device_type VARCHAR(20), -- 'web', 'mobile'
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pandit availability schedule
CREATE TABLE pandit_availability (
    id SERIAL PRIMARY KEY,
    pandit_id INTEGER REFERENCES users(id),
    day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Temples Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: { lat: Number, lng: Number }
  },
  deity: String,
  description: String,
  images: [String], // URLs
  contact: {
    phone: String,
    email: String
  },
  facilities: [String],
  timings: {
    open: String,
    close: String,
    specialDays: [String]
  },
  status: String, // 'active', 'maintenance', 'closed'
  createdAt: Date,
  updatedAt: Date
}
```

#### Pujas Collection
```javascript
{
  _id: ObjectId,
  templeId: ObjectId,
  name: String,
  description: String,
  duration: Number, // in minutes
  price: Number,
  maxParticipants: Number,
  requirements: [String],
  benefits: [String],
  images: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  templeId: ObjectId,
  pujaId: ObjectId,
  type: String, // 'puja', 'chadhava', 'yatra'
  date: Date,
  time: String,
  participants: [{
    name: String,
    relationship: String,
    gotra: String
  }],
  amount: Number,
  status: String, // 'pending', 'confirmed', 'completed', 'cancelled'
  payment: {
    method: String,
    transactionId: String,
    status: String,
    amount: Number,
    paidAt: Date
  },
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Content Collection
```javascript
{
  _id: ObjectId,
  type: String, // 'mantra', 'aarti', 'chalisa', 'literature'
  title: String,
  content: String,
  language: String,
  deity: String,
  audioUrl: String,
  videoUrl: String,
  images: [String],
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Additional Database Tables for RBAC & WebSocket Features

#### Notifications & Real-time Features
```sql
-- Notifications table for real-time features
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- 'booking', 'payment', 'puja', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional data
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puja reports for pandits
CREATE TABLE puja_reports (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    pandit_id INTEGER REFERENCES users(id),
    report_type VARCHAR(50), -- 'completion', 'ritual_notes', 'photos', 'video'
    content TEXT,
    file_urls TEXT[],
    duration_minutes INTEGER,
    participants_count INTEGER,
    special_observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live streaming sessions
CREATE TABLE streaming_sessions (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    pandit_id INTEGER REFERENCES users(id),
    stream_url VARCHAR(500),
    stream_key VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'ended', 'failed'
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    viewer_count INTEGER DEFAULT 0,
    quality_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs for monitoring
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL, -- 'info', 'warn', 'error', 'debug'
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit trail for RBAC
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    resource_type VARCHAR(50), -- 'user', 'booking', 'temple', 'puja'
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pandit earnings tracking
CREATE TABLE pandit_earnings (
    id SERIAL PRIMARY KEY,
    pandit_id INTEGER REFERENCES users(id),
    booking_id INTEGER REFERENCES bookings(id),
    amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 0.10, -- 10% commission
    commission_amount DECIMAL(10, 2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Redis Cache Structure
```javascript
// User sessions
"session:userId": {
  token: String,
  refreshToken: String,
  expiresAt: Date
}

// API rate limiting
"rateLimit:ip:endpoint": {
  count: Number,
  resetTime: Date
}

// Temple availability
"availability:templeId:date": {
  slots: [String],
  booked: [String]
}

// Panchang data
"panchang:date": {
  tithi: String,
  nakshatra: String,
  yoga: String,
  karana: String
}

// WebSocket connections
"websocket:userId": {
  socketId: String,
  connectedAt: Date,
  lastActivity: Date
}

// Pandit availability
"pandit:availability:panditId": {
  schedule: Object,
  currentStatus: String,
  nextAvailable: Date
}

// Live streaming sessions
"stream:bookingId": {
  streamUrl: String,
  streamKey: String,
  status: String,
  viewers: Number
}
```

## API Design

### RESTful API Structure

#### Authentication Endpoints
```javascript
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/verify-phone
```

#### User Management
```javascript
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/bookings
GET    /api/users/addresses
POST   /api/users/addresses
PUT    /api/users/addresses/:id
DELETE /api/users/addresses/:id
```

#### Temple & Puja Management
```javascript
GET    /api/temples
GET    /api/temples/:id
GET    /api/temples/:id/pujas
GET    /api/temples/:id/availability
GET    /api/pujas
GET    /api/pujas/:id
```

#### Booking System
```javascript
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
GET    /api/bookings/user/:userId
POST   /api/bookings/:id/reschedule
```

#### Payment Processing
```javascript
POST   /api/payments/create-order
POST   /api/payments/verify
POST   /api/payments/refund
GET    /api/payments/:id/status
```

#### Content Management
```javascript
GET    /api/content/mantras
GET    /api/content/aartis
GET    /api/content/chalisas
GET    /api/content/literature
GET    /api/content/search
```

#### Panchang & Astrology
```javascript
GET    /api/panchang/today
GET    /api/panchang/:date
GET    /api/panchang/festivals
POST   /api/astrology/horoscope
GET    /api/astrology/consultations
```

#### RBAC & User Management
```javascript
// User role management (Admin only)
POST   /api/admin/users/:id/promote
POST   /api/admin/users/:id/demote
POST   /api/admin/users/:id/suspend
GET    /api/admin/users
GET    /api/admin/pandits
POST   /api/admin/pandits/:id/assign-temple
PUT    /api/admin/pandits/:id/availability

// Pandit specific endpoints
GET    /api/pandit/bookings
GET    /api/pandit/bookings/:id
PUT    /api/pandit/bookings/:id/status
POST   /api/pandit/bookings/:id/report
GET    /api/pandit/earnings
GET    /api/pandit/schedule
PUT    /api/pandit/schedule
POST   /api/pandit/stream/start
POST   /api/pandit/stream/stop
```

#### WebSocket & Real-time Features
```javascript
// WebSocket endpoints
WS     /ws/notifications
WS     /ws/puja-stream/:bookingId
WS     /ws/temple-availability/:templeId

// Notification management
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id

// Live streaming
GET    /api/streaming/:bookingId/status
POST   /api/streaming/:bookingId/start
POST   /api/streaming/:bookingId/stop
GET    /api/streaming/:bookingId/viewers
```

#### Audit & Monitoring
```javascript
// Audit logs (Admin only)
GET    /api/admin/audit-logs
GET    /api/admin/audit-logs/:userId
GET    /api/admin/system-logs
GET    /api/admin/analytics
GET    /api/admin/reports
```

### API Response Format
```javascript
// Success Response
{
  success: true,
  data: Object | Array,
  message: String,
  timestamp: Date,
  requestId: String
}

// Error Response
{
  success: false,
  error: {
    code: String,
    message: String,
    details: Object
  },
  timestamp: Date,
  requestId: String
}
```

## Authentication & Authorization

### JWT Implementation with RBAC
```javascript
// Access Token (15 minutes)
{
  userId: String,
  email: String,
  role: String, // 'user', 'pandit', 'admin'
  permissions: [String],
  templeId: String, // For pandits (optional)
  iat: Number,
  exp: Number
}

// Refresh Token (7 days)
{
  userId: String,
  tokenVersion: Number,
  iat: Number,
  exp: Number
}
```

### Comprehensive Role-Based Access Control
```javascript
const roles = {
  USER: {
    permissions: [
      'read:profile',
      'update:profile',
      'create:booking',
      'read:bookings',
      'update:bookings',
      'cancel:bookings',
      'read:content',
      'read:temples',
      'read:pujas',
      'read:panchang',
      'create:review',
      'read:notifications',
      'update:notifications'
    ],
    description: 'Normal users who book pujas and access content'
  },
  
  PANDIT: {
    permissions: [
      // All USER permissions
      'read:profile',
      'update:profile',
      'read:content',
      'read:temples',
      'read:pujas',
      'read:panchang',
      'read:notifications',
      'update:notifications',
      
      // Pandit specific permissions
      'read:assigned_bookings',
      'update:booking_status',
      'create:puja_report',
      'read:puja_reports',
      'update:puja_reports',
      'read:temple_schedule',
      'update:temple_schedule',
      'create:ritual_notes',
      'read:ritual_notes',
      'update:ritual_notes',
      'read:devotee_feedback',
      'create:ritual_video',
      'upload:ritual_photos',
      'read:earnings',
      'update:availability'
    ],
    description: 'Pandits who perform pujas and manage temple activities'
  },
  
  ADMIN: {
    permissions: [
      '*', // All permissions
      'create:users',
      'update:users',
      'delete:users',
      'suspend:users',
      'create:temples',
      'update:temples',
      'delete:temples',
      'create:pujas',
      'update:pujas',
      'delete:pujas',
      'create:pandits',
      'assign:pandits',
      'read:all_bookings',
      'update:all_bookings',
      'cancel:all_bookings',
      'read:payments',
      'process:refunds',
      'read:analytics',
      'read:reports',
      'create:content',
      'update:content',
      'delete:content',
      'manage:system_settings',
      'read:system_logs',
      'manage:notifications'
    ],
    description: 'System administrators with full access'
  }
};
```

### RBAC Implementation with Nest.js

#### Role Guard Implementation
```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission) => 
      user.permissions.includes(permission) || user.permissions.includes('*')
    );
  }
}

// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
```

#### Controller Implementation with RBAC
```typescript
// temples.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('temples')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class TemplesController {
  
  @Get()
  @Roles('user', 'pandit', 'admin')
  @Permissions('read:temples')
  async findAll() {
    return this.templesService.findAll();
  }

  @Post()
  @Roles('admin')
  @Permissions('create:temples')
  async create(@Body() createTempleDto: CreateTempleDto) {
    return this.templesService.create(createTempleDto);
  }

  @Put(':id')
  @Roles('admin')
  @Permissions('update:temples')
  async update(@Param('id') id: string, @Body() updateTempleDto: UpdateTempleDto) {
    return this.templesService.update(id, updateTempleDto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('delete:temples')
  async remove(@Param('id') id: string) {
    return this.templesService.remove(id);
  }
}

// bookings.controller.ts
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BookingsController {
  
  @Get()
  @Roles('user', 'pandit', 'admin')
  @Permissions('read:bookings', 'read:assigned_bookings', 'read:all_bookings')
  async findAll(@Req() req) {
    const user = req.user;
    
    if (user.role === 'user') {
      return this.bookingsService.findByUserId(user.userId);
    } else if (user.role === 'pandit') {
      return this.bookingsService.findByPanditId(user.userId);
    } else if (user.role === 'admin') {
      return this.bookingsService.findAll();
    }
  }

  @Post()
  @Roles('user')
  @Permissions('create:booking')
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Put(':id/status')
  @Roles('pandit', 'admin')
  @Permissions('update:booking_status', 'update:all_bookings')
  async updateStatus(@Param('id') id: string, @Body() statusDto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, statusDto);
  }

  @Post(':id/cancel')
  @Roles('user', 'admin')
  @Permissions('cancel:bookings', 'cancel:all_bookings')
  async cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancel(id, req.user);
  }
}
```

### Security Middleware
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts'
});

// Input validation
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('en-IN'),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
];
```

## Payment Integration

### Razorpay Integration
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1
  };
  
  return await razorpay.orders.create(options);
};

// Verify payment
const verifyPayment = async (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
    
  return expectedSignature === signature;
};
```

### Payment Flow
1. **Order Creation**: Create Razorpay order
2. **Payment Processing**: Handle payment on frontend
3. **Webhook Verification**: Verify payment via webhook
4. **Booking Confirmation**: Update booking status
5. **Notification**: Send confirmation to user

## File Management

### File Upload Strategy
```javascript
const multer = require('multer');
const sharp = require('sharp');
const { S3 } = require('aws-sdk');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Image processing and upload
const processAndUploadImage = async (buffer, folder) => {
  const processedImage = await sharp(buffer)
    .resize(800, 600, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();
    
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
  
  return await s3.upload({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: processedImage,
    ContentType: 'image/jpeg'
  }).promise();
};
```

## WebSocket Integration

### Real-time Features Implementation
```typescript
// websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const user = await this.authService.validateToken(token);
      
      this.userSockets.set(user.userId, client.id);
      client.join(`user_${user.userId}`);
      
      // Join role-based rooms
      client.join(`role_${user.role}`);
      
      // Join temple-specific room for pandits
      if (user.role === 'pandit' && user.templeId) {
        client.join(`temple_${user.templeId}`);
      }
      
      console.log(`User ${user.userId} connected`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove user from socket mapping
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log('User disconnected');
  }

  // Send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  // Send notification to all users of a role
  sendToRole(role: string, event: string, data: any) {
    this.server.to(`role_${role}`).emit(event, data);
  }

  // Send notification to temple members
  sendToTemple(templeId: string, event: string, data: any) {
    this.server.to(`temple_${templeId}`).emit(event, data);
  }

  // Booking status updates
  @SubscribeMessage('booking_status_update')
  async handleBookingStatusUpdate(
    @MessageBody() data: { bookingId: string; status: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.getUserFromSocket(client);
    
    if (user.role !== 'pandit' && user.role !== 'admin') {
      return;
    }

    // Update booking status
    const booking = await this.bookingsService.updateStatus(data.bookingId, data.status);
    
    // Notify user about booking update
    this.sendToUser(booking.userId, 'booking_updated', {
      bookingId: data.bookingId,
      status: data.status,
      message: `Your booking status has been updated to ${data.status}`,
    });
  }

  // Live puja streaming
  @SubscribeMessage('start_puja_stream')
  async handleStartPujaStream(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.getUserFromSocket(client);
    
    if (user.role !== 'pandit') {
      return;
    }

    const booking = await this.bookingsService.findById(data.bookingId);
    
    // Start streaming for this booking
    client.join(`puja_stream_${data.bookingId}`);
    
    // Notify user that puja stream has started
    this.sendToUser(booking.userId, 'puja_stream_started', {
      bookingId: data.bookingId,
      streamUrl: `stream_${data.bookingId}`,
    });
  }

  // Panchang updates
  @SubscribeMessage('subscribe_panchang')
  async handleSubscribePanchang(@ConnectedSocket() client: Socket) {
    client.join('panchang_updates');
    
    // Send current panchang data
    const panchangData = await this.panchangService.getTodayPanchang();
    client.emit('panchang_data', panchangData);
  }

  // Temple availability updates
  @SubscribeMessage('subscribe_temple_availability')
  async handleSubscribeTempleAvailability(
    @MessageBody() data: { templeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`temple_availability_${data.templeId}`);
  }
}
```

### WebSocket Events and Use Cases

#### User Events
```typescript
// User-specific events
const userEvents = {
  // Booking related
  'booking_confirmed': 'Booking has been confirmed',
  'booking_cancelled': 'Booking has been cancelled',
  'booking_reminder': 'Booking reminder notification',
  'puja_started': 'Puja has started',
  'puja_completed': 'Puja has been completed',
  'puja_report_ready': 'Puja report is available',
  
  // Payment related
  'payment_success': 'Payment successful',
  'payment_failed': 'Payment failed',
  'refund_processed': 'Refund has been processed',
  
  // Content related
  'new_content': 'New content available',
  'festival_reminder': 'Festival reminder',
  'panchang_update': 'Daily panchang update',
  
  // System notifications
  'system_maintenance': 'System maintenance notification',
  'app_update': 'App update available'
};
```

#### Pandit Events
```typescript
// Pandit-specific events
const panditEvents = {
  // Booking management
  'new_booking_assigned': 'New booking assigned to you',
  'booking_cancelled': 'Booking cancelled by user',
  'booking_rescheduled': 'Booking rescheduled',
  
  // Temple management
  'temple_schedule_update': 'Temple schedule updated',
  'availability_request': 'Availability check request',
  
  // Earnings and reports
  'earnings_update': 'Earnings updated',
  'report_submission_reminder': 'Report submission reminder',
  
  // Live streaming
  'stream_start_request': 'User requesting live stream',
  'stream_quality_feedback': 'Stream quality feedback'
};
```

#### Admin Events
```typescript
// Admin-specific events
const adminEvents = {
  // System monitoring
  'system_alert': 'System alert notification',
  'user_registration': 'New user registration',
  'payment_issue': 'Payment processing issue',
  'high_traffic': 'High traffic alert',
  
  // Content management
  'content_review_request': 'Content review request',
  'user_feedback': 'User feedback received',
  
  // Analytics
  'daily_report': 'Daily analytics report',
  'monthly_summary': 'Monthly summary report'
};
```

### WebSocket Service Integration
```typescript
// notification.service.ts
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './websocket.gateway';

@Injectable()
export class NotificationService {
  constructor(private notificationGateway: NotificationGateway) {}

  // Send booking confirmation
  async sendBookingConfirmation(bookingId: string, userId: string) {
    const booking = await this.bookingsService.findById(bookingId);
    
    this.notificationGateway.sendToUser(userId, 'booking_confirmed', {
      bookingId,
      templeName: booking.temple.name,
      pujaName: booking.puja.name,
      date: booking.date,
      time: booking.time,
      amount: booking.amount,
    });
  }

  // Send puja started notification
  async sendPujaStartedNotification(bookingId: string, panditId: string) {
    const booking = await this.bookingsService.findById(bookingId);
    
    // Notify user
    this.notificationGateway.sendToUser(booking.userId, 'puja_started', {
      bookingId,
      panditName: booking.pandit.name,
      streamUrl: `stream_${bookingId}`,
    });
    
    // Notify pandit
    this.notificationGateway.sendToUser(panditId, 'puja_start_confirmed', {
      bookingId,
      userName: booking.user.name,
    });
  }

  // Send panchang updates
  async sendPanchangUpdate() {
    const panchangData = await this.panchangService.getTodayPanchang();
    
    this.notificationGateway.sendToRole('user', 'panchang_update', {
      date: new Date().toISOString().split('T')[0],
      tithi: panchangData.tithi,
      nakshatra: panchangData.nakshatra,
      festival: panchangData.festival,
      auspiciousTime: panchangData.auspiciousTime,
    });
  }

  // Send temple availability updates
  async sendTempleAvailabilityUpdate(templeId: string, date: string, slots: string[]) {
    this.notificationGateway.sendToTemple(templeId, 'availability_updated', {
      templeId,
      date,
      availableSlots: slots,
    });
  }

  // Send system-wide notifications
  async sendSystemNotification(message: string, type: 'info' | 'warning' | 'error') {
    this.notificationGateway.server.emit('system_notification', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### WebSocket Middleware for Authentication
```typescript
// websocket-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WebSocketAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.handshake.auth.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
```

## Third-party Integrations

### Panchang API Integration
```javascript
const getPanchangData = async (date) => {
  const cacheKey = `panchang:${date}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  const response = await fetch(`https://api.panchang.com/date/${date}`);
  const data = await response.json();
  
  await redis.setex(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
  return data;
};
```

### SMS Integration (Twilio)
```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendSMS = async (to, message) => {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: to
  });
};
```

### Email Integration (Nodemailer)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};
```

## Security Implementation

### Comprehensive Security Strategy

#### 1. Authentication & Authorization Security
```typescript
// JWT Security Configuration
const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  algorithm: 'HS256',
  issuer: 'devotional-platform',
  audience: 'devotional-platform-users'
};

// Password Security
const passwordConfig = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  bcryptRounds: 12,
  maxAttempts: 5,
  lockoutDuration: '30m'
};

// Session Security
const sessionConfig = {
  maxSessions: 3, // Max concurrent sessions per user
  sessionTimeout: '24h',
  refreshThreshold: '1h',
  secureCookies: true,
  httpOnly: true,
  sameSite: 'strict'
};
```

#### 2. Input Validation & Sanitization
```typescript
// Custom Validation Pipes
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @Length(10, 15)
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @Length(12, 128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character'
  })
  password: string;
}

// Global Validation Pipe
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  disableErrorMessages: false,
  exceptionFactory: (errors) => {
    const result = errors.map((error) => ({
      property: error.property,
      message: error.constraints[Object.keys(error.constraints)[0]]
    }));
    return new BadRequestException(result);
  }
}));

// XSS Protection
import * as xss from 'xss';

const xssOptions = {
  whiteList: {
    p: [],
    br: [],
    strong: [],
    em: [],
    u: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
};

// Sanitization Middleware
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return xss(value, xssOptions);
    }
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeObject(obj: any): any {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = this.transform(obj[key]);
      }
    }
    return sanitized;
  }
}
```

#### 3. Rate Limiting & DDoS Protection
```typescript
// Rate Limiting Configuration
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // Time window in seconds
      limit: 100, // Max requests per window
      ignoreUserAgents: [/googlebot/i, /bingbot/i],
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ]
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})

// Custom Rate Limiting for Sensitive Endpoints
@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const key = `auth_attempts:${ip}`;
    
    const attempts = await this.redisService.get(key) || 0;
    
    if (attempts >= 5) {
      throw new TooManyRequestsException('Too many authentication attempts');
    }
    
    await this.redisService.setex(key, 900, attempts + 1); // 15 minutes
    return true;
  }
}

// Endpoint-specific Rate Limiting
@Controller('auth')
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900 } }) // 5 attempts per 15 minutes
  async login(@Body() loginDto: LoginDto) {
    // Login logic
  }
}
```

#### 4. Security Headers & CORS
```typescript
// Security Headers Configuration
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS Configuration
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
});
```

#### 5. Database Security
```typescript
// Database Connection Security
const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA,
    cert: process.env.DB_SSL_CERT,
    key: process.env.DB_SSL_KEY
  },
  extra: {
    max: 20, // Maximum number of connections
    min: 5,  // Minimum number of connections
    acquire: 30000, // Maximum time to acquire connection
    idle: 10000,    // Maximum idle time
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  },
  logging: process.env.NODE_ENV === 'development',
  synchronize: false, // Never use in production
  migrationsRun: true,
  migrations: ['dist/migrations/*.js']
};

// SQL Injection Prevention
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // Will be hashed

  @Column({ type: 'varchar', length: 20 })
  @Index({ unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

// Query Security
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // Safe parameterized queries
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'name', 'role', 'createdAt']
    });
  }

  // Prevent SQL injection with proper typing
  async searchUsers(searchTerm: string, limit: number = 10): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .limit(limit)
      .getMany();
  }
}
```

#### 6. File Upload Security
```typescript
// File Upload Security
import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  async validateFile(file: Express.Multer.File): Promise<void> {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size too large');
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // Check file extension
    const ext = extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException('Invalid file extension');
    }

    // Validate image integrity
    try {
      await sharp(file.buffer).metadata();
    } catch (error) {
      throw new BadRequestException('Invalid image file');
    }
  }

  async processImage(file: Express.Multer.File): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async uploadToS3(buffer: Buffer, key: string): Promise<string> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'private', // Private by default
      ServerSideEncryption: 'AES256'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }
}
```

#### 7. Payment Security
```typescript
// Payment Security Implementation
@Injectable()
export class PaymentSecurityService {
  constructor(private razorpayService: RazorpayService) {}

  async createSecureOrder(amount: number, currency: string = 'INR'): Promise<any> {
    // Validate amount
    if (amount < 1 || amount > 100000) {
      throw new BadRequestException('Invalid amount');
    }

    // Generate secure order
    const order = await this.razorpayService.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_capture: 1,
      notes: {
        platform: 'devotional-platform',
        version: '1.0.0'
      }
    });

    return order;
  }

  async verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  async processRefund(paymentId: string, amount: number, reason: string): Promise<any> {
    // Validate refund amount
    if (amount <= 0) {
      throw new BadRequestException('Invalid refund amount');
    }

    return this.razorpayService.payments.refund(paymentId, {
      amount: amount * 100,
      notes: {
        reason,
        processed_by: 'system',
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

#### 8. WebSocket Security
```typescript
// WebSocket Security
@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true
  },
  namespace: '/notifications'
})
export class SecureNotificationGateway {
  @WebSocketServer()
  server: Server;

  private readonly rateLimiter = new Map<string, { count: number; resetTime: number }>();

  async handleConnection(client: Socket) {
    try {
      // Validate JWT token
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const user = await this.authService.validateToken(token);
      if (!user) {
        client.disconnect();
        return;
      }

      // Rate limiting for WebSocket connections
      const clientId = client.handshake.address;
      if (this.isRateLimited(clientId)) {
        client.disconnect();
        return;
      }

      // Store user session
      client.data.userId = user.userId;
      client.data.role = user.role;
      client.join(`user_${user.userId}`);
      client.join(`role_${user.role}`);

      // Log connection
      this.logger.log(`User ${user.userId} connected via WebSocket`);
    } catch (error) {
      this.logger.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  private isRateLimited(clientId: string): boolean {
    const now = Date.now();
    const limit = this.rateLimiter.get(clientId);

    if (!limit || now > limit.resetTime) {
      this.rateLimiter.set(clientId, { count: 1, resetTime: now + 60000 });
      return false;
    }

    if (limit.count >= 10) { // 10 connections per minute
      return true;
    }

    limit.count++;
    return false;
  }

  @SubscribeMessage('secure_message')
  async handleSecureMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    // Validate user permissions
    if (!this.hasPermission(client.data.role, 'send_message')) {
      return;
    }

    // Sanitize message content
    const sanitizedData = this.sanitizeMessage(data);
    
    // Log message
    this.logger.log(`Secure message from user ${client.data.userId}`);
    
    return sanitizedData;
  }

  private hasPermission(role: string, permission: string): boolean {
    const rolePermissions = {
      user: ['send_message', 'receive_notifications'],
      pandit: ['send_message', 'receive_notifications', 'broadcast_puja'],
      admin: ['*']
    };

    const permissions = rolePermissions[role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }

  private sanitizeMessage(data: any): any {
    // Implement message sanitization
    if (typeof data === 'string') {
      return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return data;
  }
}
```

#### 9. Environment Security
```bash
# Environment Variables Security
# .env.production
NODE_ENV=production
PORT=3000

# Database Security
DB_HOST=your-secure-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-strong-password
DB_NAME=devotional_platform
DB_SSL_CA=/path/to/ca-cert.pem
DB_SSL_CERT=/path/to/client-cert.pem
DB_SSL_KEY=/path/to/client-key.pem

# JWT Security
JWT_ACCESS_SECRET=your-super-secret-access-key-256-bits
JWT_REFRESH_SECRET=your-super-secret-refresh-key-256-bits
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment Security
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# AWS Security
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-secure-bucket

# Redis Security
REDIS_URL=redis://username:password@host:port/database
REDIS_PASSWORD=your-redis-password

# Email Security
EMAIL_USER=your-secure-email
EMAIL_PASS=your-app-specific-password

# SMS Security
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-token
TWILIO_PHONE=+1234567890

# Security Headers
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_AUTH_TTL=900

# File Upload Security
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
UPLOAD_PATH=/secure/uploads

# Monitoring Security
PROMETHEUS_USERNAME=your-prometheus-user
PROMETHEUS_PASSWORD=your-prometheus-password
```

#### 10. Security Monitoring & Logging
```typescript
// Security Event Logging
@Injectable()
export class SecurityLoggerService {
  constructor(private logger: Logger) {}

  logSecurityEvent(event: SecurityEvent): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details,
      severity: event.severity
    };

    this.logger.warn('Security Event', logEntry);

    // Send to external security monitoring
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      this.sendSecurityAlert(logEntry);
    }
  }

  private async sendSecurityAlert(logEntry: any): Promise<void> {
    // Send to security team via email/SMS
    await this.notificationService.sendSecurityAlert(logEntry);
  }
}

interface SecurityEvent {
  type: 'LOGIN_FAILURE' | 'SUSPICIOUS_ACTIVITY' | 'RATE_LIMIT_EXCEEDED' | 'UNAUTHORIZED_ACCESS';
  userId?: string;
  ip: string;
  userAgent: string;
  details: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Security Middleware
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private securityLogger: SecurityLoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Log suspicious patterns
    if (this.detectSuspiciousActivity(req)) {
      this.securityLogger.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { url: req.url, method: req.method },
        severity: 'MEDIUM'
      });
    }

    next();
  }

  private detectSuspiciousActivity(req: Request): boolean {
    const suspiciousPatterns = [
      /\.\./, // Directory traversal
      /<script/i, // XSS attempts
      /union.*select/i, // SQL injection
      /eval\(/i, // Code injection
    ];

    const url = req.url.toLowerCase();
    const body = JSON.stringify(req.body).toLowerCase();

    return suspiciousPatterns.some(pattern => 
      pattern.test(url) || pattern.test(body)
    );
  }
}
```

### Security Checklist

#### ✅ **Authentication & Authorization**
- [ ] JWT with secure secrets (256-bit)
- [ ] Refresh token rotation
- [ ] Password complexity requirements
- [ ] Account lockout after failed attempts
- [ ] Multi-factor authentication (optional)
- [ ] Session management
- [ ] RBAC implementation

#### ✅ **Input Validation & Sanitization**
- [ ] Request validation with DTOs
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] File upload validation
- [ ] Input sanitization

#### ✅ **Network Security**
- [ ] HTTPS enforcement
- [ ] Security headers (HSTS, CSP, etc.)
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] DDoS protection

#### ✅ **Data Security**
- [ ] Database encryption at rest
- [ ] Secure database connections (SSL)
- [ ] Password hashing (bcrypt)
- [ ] Sensitive data encryption
- [ ] Secure file storage

#### ✅ **Application Security**
- [ ] Dependency vulnerability scanning
- [ ] Security logging
- [ ] Error handling without information leakage
- [ ] Secure configuration management
- [ ] Regular security updates

#### ✅ **Monitoring & Incident Response**
- [ ] Security event logging
- [ ] Intrusion detection
- [ ] Automated security alerts
- [ ] Incident response plan
- [ ] Regular security audits

## Development Phases

### Phase 1: Foundation & RBAC (Weeks 1-2)
- [ ] Project setup with Nest.js + TypeScript
- [ ] PostgreSQL database setup with Prisma ORM
- [ ] Prisma schema design and migrations
- [ ] User authentication with JWT
- [ ] RBAC implementation (User, Pandit, Admin roles)
- [ ] Role guards and permission decorators
- [ ] Basic CRUD operations with Prisma
- [ ] API documentation with Swagger
- [ ] Audit logging system
- [ ] Database seeding with Prisma

### Phase 2: Core Features & WebSocket (Weeks 3-4)
- [ ] Temple management system with RBAC
- [ ] Puja catalog management
- [ ] Booking system with role-based access
- [ ] Payment integration (Razorpay)
- [ ] WebSocket gateway setup
- [ ] Real-time notifications
- [ ] Live puja streaming foundation
- [ ] Email/SMS notifications
- [ ] File upload system

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] Pandit dashboard and management
- [ ] Advanced booking features
- [ ] Chadhava and Yatra services
- [ ] Content management system
- [ ] Panchang integration with real-time updates
- [ ] Astrology services
- [ ] Admin dashboard APIs
- [ ] Pandit earnings tracking
- [ ] Live streaming implementation

### Phase 4: Optimization & Production (Weeks 7-8)
- [ ] Redis caching implementation
- [ ] Performance optimization
- [ ] Security hardening
- [ ] WebSocket scaling
- [ ] Monitoring and logging setup
- [ ] Load testing
- [ ] Documentation completion
- [ ] Production deployment

## Testing Strategy

### Unit Testing
```javascript
// Example test for user service
describe('User Service', () => {
  test('should create user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      phone: '+919876543210',
      name: 'Test User',
      password: 'TestPass123'
    };
    
    const user = await userService.createUser(userData);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });
});
```

### Integration Testing
```javascript
// Example API test
describe('POST /api/auth/login', () => {
  test('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123'
      });
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### Test Coverage Goals
- Unit tests: 80%+ coverage
- Integration tests: 70%+ coverage
- API endpoints: 100% coverage
- Critical business logic: 100% coverage

## Deployment & DevOps

### Docker-Based Containerization Strategy

#### **Multi-Stage Dockerfile for Production**
```dockerfile
# Dockerfile
# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
```

#### **Development Dockerfile**
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start in development mode with hot reload
CMD ["npm", "run", "start:dev"]
```

#### **Docker Compose for Development**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/devotional_platform_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-jwt-secret
      - JWT_REFRESH_SECRET=dev-refresh-secret
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - devotional-network

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: devotional_platform_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - devotional-network

  # Redis Cache
  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - devotional-network

  # Elasticsearch for Search
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - devotional-network

  # Prisma Studio (Database GUI)
  prisma-studio:
    build:
      context: .
      dockerfile: Dockerfile.dev
    command: npx prisma studio --hostname 0.0.0.0
    ports:
      - "5555:5555"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/devotional_platform_dev
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - devotional-network

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  devotional-network:
    driver: bridge
```

#### **Production Docker Compose**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - devotional-network
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - devotional-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'

  # Redis Cache
  redis:
    image: redis:7.0-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - devotional-network
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - devotional-network

volumes:
  postgres_data:
  redis_data:

networks:
  devotional-network:
    driver: bridge
```

#### **Docker Scripts and Utilities**

##### **Development Scripts**
```bash
#!/bin/bash
# scripts/docker-dev.sh

echo "Starting development environment..."

# Build and start development containers
docker-compose -f docker-compose.dev.yml up --build

echo "Development environment started!"
echo "Application: http://localhost:3000"
echo "Prisma Studio: http://localhost:5555"
echo "Elasticsearch: http://localhost:9200"
```

```bash
#!/bin/bash
# scripts/docker-prod.sh

echo "Starting production environment..."

# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

echo "Production environment started!"
echo "Application: https://your-domain.com"
echo "Monitoring: http://localhost:3001"
```

##### **Database Migration Script**
```bash
#!/bin/bash
# scripts/migrate.sh

echo "Running database migrations..."

# Wait for database to be ready
until docker-compose exec postgres pg_isready -U postgres; do
  echo "Waiting for database..."
  sleep 2
done

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed

echo "Database migrations completed!"
```

##### **Backup Script**
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Creating database backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
docker-compose exec postgres pg_dump -U postgres devotional_platform > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

echo "Backup created: $BACKUP_DIR/backup_$DATE.sql.gz"
```

#### **Docker Health Checks**
```typescript
// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '@nestjs/redis';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get()
  async checkHealth() {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        memory: this.checkMemory(),
      },
    };

    return health;
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'OK', responseTime: Date.now() };
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }

  private async checkRedis() {
    try {
      await this.redis.ping();
      return { status: 'OK', responseTime: Date.now() };
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }

  private checkMemory() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
    };
  }
}
```

### CI/CD Pipeline with Docker
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t devotional-platform:latest .
      - name: Run Docker tests
        run: docker-compose -f docker-compose.dev.yml run --rm app npm test

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
          docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

## Monitoring & Logging

### Logging Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Health Check Endpoint
```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: await checkDatabaseConnection(),
      redis: await checkRedisConnection(),
      external: await checkExternalServices()
    }
  };
  
  res.status(200).json(health);
});
```

### Performance Monitoring
```javascript
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

## Performance Optimization

### Database Optimization
```javascript
// Indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });
db.bookings.createIndex({ userId: 1, createdAt: -1 });
db.bookings.createIndex({ templeId: 1, date: 1 });
db.temples.createIndex({ location: '2dsphere' }); // Geospatial index
```

### Caching Strategy
```javascript
// Redis caching middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};

// Usage
app.get('/api/temples', cache(300), getTemples); // Cache for 5 minutes
```

### Connection Pooling
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

## Environment Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/devotional_platform?schema=public
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-token
TWILIO_PHONE=+1234567890

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1
```

## API Documentation

### Swagger Configuration
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Devotional Platform API',
      version: '1.0.0',
      description: 'API for devotional platform services'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './models/*.js']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

## Error Handling

### Global Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.statusCode || 500,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
};

app.use(errorHandler);
```

## Additional Critical Components

### 1. Data Backup & Disaster Recovery
```typescript
// Backup Strategy
const backupConfig = {
  // Database backups
  database: {
    fullBackup: 'daily', // Full backup every day
    incrementalBackup: 'hourly', // Incremental every hour
    retention: '30 days', // Keep backups for 30 days
    encryption: true,
    compression: true,
    storage: 'AWS S3 + Glacier'
  },
  
  // File backups
  files: {
    frequency: 'real-time', // Real-time sync to S3
    versioning: true,
    retention: '90 days',
    crossRegion: true
  },
  
  // Configuration backups
  config: {
    frequency: 'daily',
    encryption: true,
    multipleLocations: true
  }
};

// Disaster Recovery Plan
const disasterRecovery = {
  rto: '4 hours', // Recovery Time Objective
  rpo: '1 hour', // Recovery Point Objective
  failover: 'automatic',
  testing: 'monthly',
  documentation: 'comprehensive'
};
```

### 2. Compliance & Legal Requirements
```typescript
// GDPR Compliance
const gdprCompliance = {
  dataProcessing: {
    lawfulBasis: 'consent',
    dataMinimization: true,
    purposeLimitation: true,
    storageLimitation: '7 years'
  },
  
  userRights: {
    rightToAccess: true,
    rightToRectification: true,
    rightToErasure: true,
    rightToPortability: true,
    rightToObject: true
  },
  
  dataProtection: {
    encryption: 'AES-256',
    pseudonymization: true,
    accessControls: 'RBAC',
    auditLogging: true
  }
};

// PCI DSS Compliance for Payments
const pciCompliance = {
  networkSecurity: 'firewall + encryption',
  dataProtection: 'encryption at rest and transit',
  accessControl: 'RBAC + MFA',
  monitoring: 'continuous',
  testing: 'quarterly'
};
```

### 3. Multi-tenancy & Scalability
```typescript
// Multi-tenant Architecture
@Injectable()
export class TenantService {
  async getTenantContext(request: Request): Promise<TenantContext> {
    const tenantId = request.headers['x-tenant-id'] || 'default';
    return {
      tenantId,
      database: `tenant_${tenantId}`,
      config: await this.getTenantConfig(tenantId),
      features: await this.getTenantFeatures(tenantId)
    };
  }
}

// Horizontal Scaling Strategy
const scalingStrategy = {
  database: {
    readReplicas: 3,
    sharding: 'by_region',
    partitioning: 'by_date',
    connectionPooling: 'pgBouncer'
  },
  
  application: {
    loadBalancing: 'round-robin',
    autoScaling: 'CPU + Memory based',
    containerization: 'Docker + Kubernetes',
    serviceMesh: 'Istio'
  },
  
  caching: {
    redis: 'cluster mode',
    cdn: 'CloudFront',
    edgeCaching: 'CloudFlare'
  }
};
```

### 4. API Versioning & Backward Compatibility
```typescript
// API Versioning Strategy
@Controller({
  path: 'api',
  version: '1'
})
export class V1Controller {
  // Version 1 implementation
}

@Controller({
  path: 'api',
  version: '2'
})
export class V2Controller {
  // Version 2 implementation with backward compatibility
}

// Backward Compatibility Middleware
@Injectable()
export class CompatibilityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const apiVersion = req.headers['api-version'] || '1';
    
    // Handle version-specific logic
    if (apiVersion === '1') {
      req.body = this.transformV1ToV2(req.body);
    }
    
    next();
  }
  
  private transformV1ToV2(data: any): any {
    // Transform V1 data format to V2
    return data;
  }
}
```

### 5. Content Delivery & CDN Strategy
```typescript
// CDN Configuration
const cdnConfig = {
  staticAssets: {
    provider: 'CloudFront',
    domains: ['cdn.devotional-platform.com'],
    caching: {
      images: '1 year',
      css: '1 month',
      js: '1 week',
      fonts: '1 year'
    },
    compression: 'gzip + brotli',
    https: true
  },
  
  dynamicContent: {
    api: 'CloudFlare',
    caching: 'Redis',
    invalidation: 'tag-based'
  },
  
  media: {
    images: 'S3 + CloudFront',
    videos: 'S3 + CloudFront',
    audio: 'S3 + CloudFront',
    streaming: 'HLS + DASH'
  }
};
```

### 6. Internationalization & Localization
```typescript
// i18n Implementation
@Injectable()
export class I18nService {
  private readonly supportedLocales = ['en', 'hi', 'ta', 'te', 'kn'];
  
  async getLocalizedContent(contentId: string, locale: string): Promise<any> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId, locale }
    });
    
    if (!content) {
      // Fallback to default locale
      return this.getDefaultContent(contentId);
    }
    
    return content;
  }
  
  async translateText(text: string, fromLocale: string, toLocale: string): Promise<string> {
    // Use translation service (Google Translate API or custom)
    return this.translationService.translate(text, fromLocale, toLocale);
  }
}

// Localization Middleware
@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const locale = req.headers['accept-language'] || 'en';
    req.locale = this.validateLocale(locale);
    next();
  }
  
  private validateLocale(locale: string): string {
    const supportedLocales = ['en', 'hi', 'ta', 'te', 'kn'];
    return supportedLocales.includes(locale) ? locale : 'en';
  }
}
```

### 7. Advanced Analytics & Business Intelligence
```typescript
// Analytics Service
@Injectable()
export class AnalyticsService {
  async trackUserBehavior(userId: string, event: string, data: any): Promise<void> {
    const analyticsEvent = {
      userId,
      event,
      data,
      timestamp: new Date(),
      sessionId: this.getSessionId(),
      userAgent: this.getUserAgent(),
      ip: this.getClientIP()
    };
    
    // Send to analytics pipeline
    await this.analyticsQueue.add('track-event', analyticsEvent);
  }
  
  async generateBusinessMetrics(): Promise<BusinessMetrics> {
    return {
      userGrowth: await this.getUserGrowthMetrics(),
      revenue: await this.getRevenueMetrics(),
      engagement: await this.getEngagementMetrics(),
      conversion: await this.getConversionMetrics()
    };
  }
}

// Business Intelligence Dashboard
@Controller('analytics')
export class AnalyticsController {
  @Get('dashboard')
  @Roles('admin')
  async getDashboard(@Query() filters: AnalyticsFilters): Promise<DashboardData> {
    return this.analyticsService.getDashboardData(filters);
  }
  
  @Get('reports/:type')
  @Roles('admin')
  async generateReport(@Param('type') type: string): Promise<ReportData> {
    return this.analyticsService.generateReport(type);
  }
}
```

### 8. Advanced Search & Recommendation Engine
```typescript
// Search Service with Elasticsearch
@Injectable()
export class SearchService {
  constructor(private elasticsearchService: ElasticsearchService) {}
  
  async searchTemples(query: string, filters: SearchFilters): Promise<SearchResults> {
    const searchQuery = {
      index: 'temples',
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['name^3', 'description', 'deity', 'location']
                }
              }
            ],
            filter: this.buildFilters(filters)
          }
        },
        highlight: {
          fields: {
            name: {},
            description: {}
          }
        }
      }
    };
    
    return this.elasticsearchService.search(searchQuery);
  }
  
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    // Collaborative filtering + content-based filtering
    const userPreferences = await this.getUserPreferences(userId);
    const similarUsers = await this.findSimilarUsers(userId);
    
    return this.generateRecommendations(userPreferences, similarUsers);
  }
}
```

### 9. Advanced Notification System
```typescript
// Multi-channel Notification Service
@Injectable()
export class NotificationService {
  async sendNotification(notification: NotificationRequest): Promise<void> {
    const channels = await this.getUserNotificationChannels(notification.userId);
    
    for (const channel of channels) {
      switch (channel.type) {
        case 'email':
          await this.sendEmail(notification);
          break;
        case 'sms':
          await this.sendSMS(notification);
          break;
        case 'push':
          await this.sendPushNotification(notification);
          break;
        case 'websocket':
          await this.sendWebSocketNotification(notification);
          break;
      }
    }
  }
  
  async scheduleNotification(notification: ScheduledNotification): Promise<void> {
    // Schedule for specific time (festivals, reminders)
    await this.schedulerService.schedule(notification);
  }
}
```

### 10. Advanced Caching Strategy
```typescript
// Multi-level Caching
@Injectable()
export class CacheService {
  constructor(
    private redisService: RedisService,
    private memoryCache: MemoryCacheService
  ) {}
  
  async get(key: string): Promise<any> {
    // L1: Memory cache
    let value = this.memoryCache.get(key);
    if (value) return value;
    
    // L2: Redis cache
    value = await this.redisService.get(key);
    if (value) {
      this.memoryCache.set(key, value, 300); // 5 minutes
      return value;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.memoryCache.set(key, value, Math.min(ttl, 300));
    await this.redisService.setex(key, ttl, value);
  }
}
```

## Conclusion

This comprehensive backend development plan provides a solid foundation for building a scalable devotional platform. The architecture is designed to handle high traffic, ensure security, and provide excellent user experience. 

### Key Success Factors:
- **Scalability**: Microservices architecture with proper caching and horizontal scaling
- **Security**: Comprehensive security measures and compliance (GDPR, PCI DSS)
- **Performance**: Optimized database queries, multi-level caching, and CDN
- **Maintainability**: Clean code structure, comprehensive testing, and monitoring
- **Reliability**: Backup strategies, disaster recovery, and fault tolerance
- **User Experience**: Real-time features, multi-language support, and personalization

### Additional Considerations:
- **Compliance**: GDPR, PCI DSS, and local regulations
- **Disaster Recovery**: 4-hour RTO, 1-hour RPO
- **Multi-tenancy**: Support for multiple temple organizations
- **Analytics**: Business intelligence and user behavior tracking
- **Search**: Advanced search with Elasticsearch
- **Recommendations**: AI-powered content and service recommendations
- **Internationalization**: Multi-language and cultural adaptation

Follow this plan systematically, and you'll have a robust backend that can support millions of users while maintaining high performance, security, and reliability standards. The platform will be ready for production deployment and can scale to meet growing demands.
