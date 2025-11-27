import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TranslationsService } from '../services/translations.service';
import {
  CreateTranslationDto,
  UpdateTranslationDto,
  BulkCreateTranslationDto,
} from '../dto/translation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  // Public endpoint - get translations by language
  @Get()
  async getTranslations(@Query('language') language: string, @Query('namespace') namespace?: string) {
    if (!language) {
      return this.translationsService.getAllTranslations();
    }
    return this.translationsService.getTranslationsByLanguage(language, namespace);
  }

  // Public endpoint - get supported languages
  @Get('languages')
  async getSupportedLanguages() {
    return this.translationsService.getSupportedLanguages();
  }

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createTranslation(@Body() createDto: CreateTranslationDto) {
    return this.translationsService.createTranslation(createDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateTranslations(@Body() bulkDto: BulkCreateTranslationDto) {
    return this.translationsService.bulkCreateTranslations(bulkDto);
  }

  @Put(':key/:language')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async updateTranslation(
    @Param('key') key: string,
    @Param('language') language: string,
    @Query('namespace') namespace: string,
    @Body() updateDto: UpdateTranslationDto,
  ) {
    return this.translationsService.updateTranslation(key, language, namespace || 'common', updateDto);
  }

  @Delete(':key/:language')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async deleteTranslation(
    @Param('key') key: string,
    @Param('language') language: string,
    @Query('namespace') namespace: string,
  ) {
    return this.translationsService.deleteTranslation(key, language, namespace || 'common');
  }
}

