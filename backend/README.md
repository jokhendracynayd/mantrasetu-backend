# MantraSetu Backend

A comprehensive backend API for MantraSetu - Digital Spiritual Platform built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

### Core Services
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Profile management, preferences, and address handling
- **Pandit Management** - Onboarding, verification, and availability management
- **Booking System** - Service scheduling, availability checking, and booking management
- **Payment Processing** - Multi-gateway payment integration (Razorpay)
- **Notification System** - Email, SMS, and in-app notifications
- **Video Streaming** - WebRTC and Zoom integration for virtual pooja sessions
- **Security** - Rate limiting, encryption, and audit logging

### Technical Features
- **Database** - PostgreSQL with Prisma ORM
- **Caching** - Redis integration for performance
- **Logging** - Winston-based structured logging
- **Testing** - Comprehensive unit and integration tests
- **Documentation** - OpenAPI/Swagger documentation
- **Docker** - Containerized deployment
- **CI/CD** - GitHub Actions workflow

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mantra-setu/backend/mantrasetu-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mantrasetu"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   REFRESH_TOKEN_SECRET="your-super-secret-refresh-key"
   REFRESH_TOKEN_EXPIRES_IN="30d"
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Email (SMTP)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Payment (Razorpay)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   
   # SMS (Twilio)
   TWILIO_ACCOUNT_SID="your-twilio-account-sid"
   TWILIO_AUTH_TOKEN="your-twilio-auth-token"
   TWILIO_PHONE_NUMBER="your-twilio-phone-number"
   
   # Video Streaming (Zoom)
   ZOOM_API_KEY="your-zoom-api-key"
   ZOOM_API_SECRET="your-zoom-api-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed database (optional)
   npm run db:seed
   ```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 📚 API Documentation

Once the application is running, you can access:

- **API Base URL**: `http://localhost:3000/api/v1`
- **Health Check**: `http://localhost:3000/api/v1/health`
- **Swagger Documentation**: `http://localhost:3000/api/docs` (if enabled)

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema to database
npm run db:migrate         # Run database migrations
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed the database

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier

# Docker
npm run build:docker       # Build Docker image
npm run build:docker:prod  # Build production Docker image
```

## 🏗️ Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── controllers/       # Auth controllers
│   ├── services/         # Auth services
│   ├── guards/           # Auth guards
│   ├── strategies/       # JWT strategies
│   └── decorators/       # Custom decorators
├── users/                # User management module
├── pandits/              # Pandit management module
├── bookings/             # Booking system module
├── payments/             # Payment processing module
├── notifications/        # Notification system module
├── streaming/            # Video streaming module
├── security/             # Security utilities
├── database/             # Database configuration
├── common/               # Shared utilities
└── test/                 # Test utilities
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permissions system
- **Rate Limiting** - API rate limiting and throttling
- **Data Encryption** - Sensitive data encryption
- **Audit Logging** - Comprehensive audit trail
- **Input Validation** - Request validation and sanitization
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers

## 📊 Monitoring & Logging

- **Structured Logging** - Winston-based logging with multiple transports
- **Request Tracking** - Request ID tracking for debugging
- **Performance Monitoring** - Response time and error tracking
- **Health Checks** - Application health monitoring
- **Audit Trail** - User action tracking

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in your deployment environment.

### Database Migration
Run database migrations before deploying:
```bash
npm run db:migrate
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/production/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/bookings` - Get user bookings
- `GET /api/v1/users/notifications` - Get user notifications

### Pandits
- `GET /api/v1/pandits/search` - Search pandits
- `GET /api/v1/pandits/:id` - Get pandit details
- `POST /api/v1/pandits/profile` - Create pandit profile
- `PUT /api/v1/pandits/profile/me` - Update pandit profile

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/search` - Search bookings
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/v1/payments` - Create payment
- `GET /api/v1/payments/search` - Search payments
- `PUT /api/v1/payments/:id/process` - Process payment
- `POST /api/v1/payments/webhooks/razorpay` - Razorpay webhook

### Notifications
- `GET /api/v1/notifications/me` - Get user notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all notifications as read

### Streaming
- `POST /api/v1/streaming/meetings` - Create meeting
- `GET /api/v1/streaming/meetings/:id` - Get meeting details
- `POST /api/v1/streaming/meetings/:id/join` - Join meeting
- `PUT /api/v1/streaming/meetings/:id/end` - End meeting

---

**MantraSetu Backend** - Connecting tradition with technology 🕉️