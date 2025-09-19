import { IsOptional, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  total: number;

  @IsNumber()
  totalPages: number;

  @IsBoolean()
  hasNext: boolean;

  @IsBoolean()
  hasPrev: boolean;
}

export class MetaDto {
  @IsString()
  version: string;

  @IsNumber()
  executionTime: number;
}

export class SuccessResponseDto<T = any> {
  @IsBoolean()
  success: true;

  @IsObject()
  data: T;

  @IsString()
  message: string;

  @IsString()
  timestamp: string;

  @IsString()
  requestId: string;

  @IsNumber()
  statusCode: number;

  @IsString()
  path: string;

  @IsOptional()
  @IsObject()
  pagination?: PaginationDto;

  @IsOptional()
  @IsObject()
  meta?: MetaDto;
}

export class ErrorDetailDto {
  @IsNumber()
  code: number;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  details?: any;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  stack?: string;
}

export class ErrorResponseDto {
  @IsBoolean()
  success: false;

  @IsObject()
  error: ErrorDetailDto;

  @IsString()
  timestamp: string;

  @IsString()
  requestId: string;

  @IsString()
  path: string;

  @IsString()
  method: string;

  @IsNumber()
  statusCode: number;
}
