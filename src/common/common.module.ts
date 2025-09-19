import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerModule } from '../config/logger.module';
import { AppLogger } from './services/logger.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [AppLogger],
  exports: [AppLogger, CacheModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logger middleware to all routes using a named parameter
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}