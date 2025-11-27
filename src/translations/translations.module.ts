import { Module } from '@nestjs/common';
import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}

