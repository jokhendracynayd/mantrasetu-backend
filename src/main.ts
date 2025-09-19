import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLogger } from './common/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  try {
    // Handle config errors during startup
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    // Use Winston for logging
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Get the Winston logger
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

    // Create a contextId for resolving scoped providers
    const appLoggerFactory = await app.resolve(AppLogger);
    const appLogger = appLoggerFactory.setContext('Bootstrap');

    // Set global logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

    const port = process.env.PORT ?? 3000;
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Set global prefix for all routes
    app.setGlobalPrefix('api/v1');

    // Log application startup
    appLogger.log({
      message: 'Application starting...',
      port,
      environment: nodeEnv,
      version: process.env.APP_VERSION || '1.0.0',
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
