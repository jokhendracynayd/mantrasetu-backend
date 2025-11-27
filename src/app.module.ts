import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { PanditModule } from './pandits/pandit.module';
import { BookingModule } from './bookings/booking.module';
import { PaymentModule } from './payments/payment.module';
import { NotificationModule } from './notifications/notification.module';
import { StreamingModule } from './streaming/streaming.module';
import { SecurityModule } from './security/security.module';
import { HomepageModule } from './homepage/homepage.module';
import { ServicesModule } from './services/services.module';
import { AdminModule } from './admin/admin.module';
import { ContactModule } from './contact/contact.module';
import { TranslationsModule } from './translations/translations.module';
import { FilesController } from './common/controllers/files.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    DatabaseModule,
    CommonModule,
    HealthModule,
    SecurityModule,
    AuthModule,
    UserModule,
    PanditModule,
    BookingModule,
    PaymentModule,
    NotificationModule,
    StreamingModule,
    HomepageModule,
    ServicesModule,
    AdminModule,
    ContactModule,
    TranslationsModule,
  ],
  controllers: [AppController, FilesController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
