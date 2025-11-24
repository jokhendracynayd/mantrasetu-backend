import { Module } from '@nestjs/common';
import { PanditController } from './controllers/pandit.controller';
import { PanditService } from './services/pandit.service';

@Module({
  controllers: [PanditController],
  providers: [PanditService],
  exports: [PanditService],
})
export class PanditModule {}
