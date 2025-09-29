import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { DatabaseModule } from '../database/database.module';
import { PanditModule } from '../pandits/pandit.module';
import { ServicesModule } from '../services/services.module';
import { BookingModule } from '../bookings/booking.module';

@Module({
  imports: [DatabaseModule, PanditModule, ServicesModule, BookingModule],
  controllers: [HomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}
