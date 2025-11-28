import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLogger } from './common/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'express';

async function bootstrap() {
  try {
    // Handle config errors during startup
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      bodyParser: true, // Enable JSON body parser
      rawBody: false,
    });

    // Configure body size limits for file uploads
    // Increase limit to 50MB to handle multiple file uploads
    // Note: This applies to JSON/URL-encoded bodies, not multipart/form-data (handled by multer)
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));

    const configService = app.get(ConfigService);

    // Use Winston for logging
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Get the Winston logger
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

    // Create a contextId for resolving scoped providers
    const appLoggerFactory = await app.resolve(AppLogger);
    const appLogger = appLoggerFactory.setContext('Bootstrap');

    // Security middleware
    if (configService.get('HELMET_ENABLED') === 'true') {
      app.use(helmet());
    }

    // Compression middleware
    app.use(compression());

    // CORS configuration
    const corsEnabled = configService.get('CORS_ENABLED');
    const nodeEnv = configService.get('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';
    
    // Enable CORS by default in production or if explicitly enabled
    if (corsEnabled === 'true' || corsEnabled === true || isProduction) {
      const corsOrigin = configService.get('CORS_ORIGIN');
      
      app.enableCors({
        origin: [
          // Production origins
          'https://mantrasetu.com',
          'https://www.mantrasetu.com',
          'https://mantrasetu-frontend.vercel.app',
          // Development origins
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3035',
          // Custom origin from env
          ...(corsOrigin ? [corsOrigin] : []),
        ].filter(Boolean), // Remove any undefined values
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type', 
          'Authorization', 
          'X-Requested-With',
          'X-Request-ID',
          'Accept',
          'Origin',
          'Cache-Control',
          'X-File-Name'
        ],
        exposedHeaders: ['X-Request-ID'],
        maxAge: 86400, // 24 hours
        optionsSuccessStatus: 200, // Some legacy browsers choke on 204
      });
      
      logger.log('CORS enabled with origins:', {
        origins: [
          'https://mantrasetu.com',
          'https://www.mantrasetu.com',
          'https://mantrasetu-frontend.vercel.app',
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3035',
          ...(corsOrigin ? [corsOrigin] : []),
        ].filter(Boolean)
      });
    } else {
      logger.warn('CORS is disabled. This may cause issues with frontend requests.');
    }

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // TEMPORARILY DISABLED - Remove this line after testing
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Set global logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

    const port = configService.get('PORT') || 3035;

    // Set global prefix for all routes, but exclude uploads routes
    // ServeStaticModule already serves files at /uploads/* directly
    app.setGlobalPrefix('api/v1', {
      exclude: ['uploads/(.*)'],
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('MantraSetu API')
      .setDescription('API documentation for MantraSetu - Spiritual Services Platform')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Users', 'User management and profile operations')
      .addTag('Pandits', 'Pandit profiles and services')
      .addTag('Bookings', 'Service booking management')
      .addTag('Payments', 'Payment processing and management')
      .addTag('Services', 'Service catalog and management')
      .addTag('Notifications', 'Notification system')
      .addTag('Admin', 'Administrative operations')
      .addTag('Streaming', 'Live streaming services')
      .addTag('Health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    // Log application startup
    appLogger.log({
      message: 'Application starting...',
      port,
      environment: nodeEnv,
      version: configService.get('APP_VERSION') || '1.0.0',
    });

    await app.listen(port);

    appLogger.log({
      message: 'Application started successfully',
      port,
      url: `http://localhost:${port}/api/v1`,
    });
    
    logger.log(
      `Application is running on: http://localhost:${port}/api/v1 in ${nodeEnv} mode`,
    );
    
    logger.log(
      `Swagger documentation available at: http://localhost:${port}/api/v1/docs`,
    );
  } catch (error) {
    // Use standard logger for bootstrap failures since Winston might not be available
    console.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}
bootstrap();
