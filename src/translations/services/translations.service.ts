import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTranslationDto, UpdateTranslationDto, BulkCreateTranslationDto } from '../dto/translation.dto';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  async createTranslation(createDto: CreateTranslationDto) {
    try {
      const translation = await this.prisma.translation.upsert({
        where: {
          key_language_namespace: {
            key: createDto.key,
            language: createDto.language,
            namespace: createDto.namespace || 'common',
          },
        },
        update: {
          value: createDto.value,
        },
        create: {
          key: createDto.key,
          language: createDto.language,
          value: createDto.value,
          namespace: createDto.namespace || 'common',
        },
      });

      return {
        success: true,
        message: 'Translation created/updated successfully',
        data: translation,
      };
    } catch (error) {
      console.error('Error creating translation:', error);
      throw new BadRequestException('Failed to create translation');
    }
  }

  async bulkCreateTranslations(bulkDto: BulkCreateTranslationDto) {
    try {
      const results = await Promise.all(
        bulkDto.translations.map((translation) =>
          this.prisma.translation.upsert({
            where: {
              key_language_namespace: {
                key: translation.key,
                language: translation.language,
                namespace: translation.namespace || 'common',
              },
            },
            update: {
              value: translation.value,
            },
            create: {
              key: translation.key,
              language: translation.language,
              value: translation.value,
              namespace: translation.namespace || 'common',
            },
          }),
        ),
      );

      return {
        success: true,
        message: `${results.length} translations created/updated successfully`,
        data: results,
      };
    } catch (error) {
      console.error('Error bulk creating translations:', error);
      throw new BadRequestException('Failed to bulk create translations');
    }
  }

  async getTranslationsByLanguage(language: string, namespace?: string) {
    const where: any = { language };
    if (namespace) {
      where.namespace = namespace;
    }

    const translations = await this.prisma.translation.findMany({
      where,
    });

    // Convert array to object format for easier frontend usage
    const translationsObject: Record<string, string> = {};
    translations.forEach((t) => {
      translationsObject[t.key] = t.value;
    });

    return {
      success: true,
      data: translationsObject,
      meta: {
        language,
        namespace: namespace || 'all',
        count: translations.length,
      },
    };
  }

  async getAllTranslations() {
    const translations = await this.prisma.translation.findMany({
      orderBy: [{ language: 'asc' }, { namespace: 'asc' }, { key: 'asc' }],
    });

    return {
      success: true,
      data: translations,
      meta: {
        count: translations.length,
      },
    };
  }

  async updateTranslation(key: string, language: string, namespace: string, updateDto: UpdateTranslationDto) {
    const translation = await this.prisma.translation.findUnique({
      where: {
        key_language_namespace: {
          key,
          language,
          namespace: namespace || 'common',
        },
      },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    const updated = await this.prisma.translation.update({
      where: {
        key_language_namespace: {
          key,
          language,
          namespace: namespace || 'common',
        },
      },
      data: {
        value: updateDto.value,
      },
    });

    return {
      success: true,
      message: 'Translation updated successfully',
      data: updated,
    };
  }

  async deleteTranslation(key: string, language: string, namespace: string) {
    const translation = await this.prisma.translation.findUnique({
      where: {
        key_language_namespace: {
          key,
          language,
          namespace: namespace || 'common',
        },
      },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.prisma.translation.delete({
      where: {
        key_language_namespace: {
          key,
          language,
          namespace: namespace || 'common',
        },
      },
    });

    return {
      success: true,
      message: 'Translation deleted successfully',
    };
  }

  async getSupportedLanguages() {
    const languages = await this.prisma.translation.findMany({
      select: {
        language: true,
      },
      distinct: ['language'],
      orderBy: {
        language: 'asc',
      },
    });

    return {
      success: true,
      data: languages.map((l) => l.language),
    };
  }
}

