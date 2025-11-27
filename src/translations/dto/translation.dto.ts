import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  namespace?: string;
}

export class UpdateTranslationDto {
  @IsString()
  @IsOptional()
  value?: string;
}

export class BulkCreateTranslationDto {
  @IsArray()
  @IsNotEmpty()
  translations: CreateTranslationDto[];
}

export class GetTranslationsDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  namespace?: string;
}

