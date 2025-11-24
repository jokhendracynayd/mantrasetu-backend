import { Module } from '@nestjs/common';
import { ContactController } from './controllers/contact.controller';
import { ContactService } from './services/contact.service';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [DatabaseModule, NotificationModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
