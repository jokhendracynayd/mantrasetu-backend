import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { CustomThrottlerGuard } from './guards/rate-limit.guard';
import { SecurityMiddleware } from './middleware/security.middleware';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Module({
  providers: [EncryptionService, CustomThrottlerGuard, AuditLogInterceptor],
  exports: [EncryptionService, CustomThrottlerGuard, AuditLogInterceptor],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*path');
  }
}
