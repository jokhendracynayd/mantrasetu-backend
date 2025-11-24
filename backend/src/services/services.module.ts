import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller';
import { ServicesService } from './services/services.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
