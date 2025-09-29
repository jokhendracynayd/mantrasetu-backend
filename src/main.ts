import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLogger } from './common/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  try {
    // Handle config errors during startup
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

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
    if (configService.get('CORS_ENABLED') === 'true') {
      app.enableCors({
        origin: [
          configService.get('CORS_ORIGIN') || 'http://localhost:3000',
          'http://localhost:3001' // Add frontend port
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      });
    }

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Set global logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

    const port = configService.get('PORT') || 3000;
    const nodeEnv = configService.get('NODE_ENV') || 'development';

    // Set global prefix for all routes
    app.setGlobalPrefix('api/v1');

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
  } catch (error) {
    // Use standard logger for bootstrap failures since Winston might not be available
    console.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}
bootstrap();
