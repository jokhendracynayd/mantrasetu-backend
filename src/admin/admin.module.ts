import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserModule } from '../users/user.module';
import { PanditModule } from '../pandits/pandit.module';
import { BookingModule } from '../bookings/booking.module';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [UserModule, PanditModule, BookingModule, PaymentModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
