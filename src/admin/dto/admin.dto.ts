import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole, ServiceCategory } from '@prisma/client';

export class AdminUserFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }): UserRole | undefined => {
    if (value === '') return undefined;
    return value as UserRole;
  })
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isVerified?: boolean;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string => String(value))
  sortBy?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }): 'asc' | 'desc' => (value === 'asc' || value === 'desc' ? value : 'desc'))
  sortOrder?: 'asc' | 'desc';
}

export class AdminPanditFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isVerified?: boolean;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string => String(value))
  sortBy?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }): 'asc' | 'desc' => (value === 'asc' || value === 'desc' ? value : 'desc'))
  sortOrder?: 'asc' | 'desc';
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class AdminServiceFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }): ServiceCategory | undefined => {
    if (value === '') return undefined;
    return value as ServiceCategory;
  })
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string => String(value))
  subcategory?: string;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isVirtual?: boolean;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '') return undefined;
    return undefined;
  })
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10))
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10) || 1)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }): number => parseInt(String(value), 10) || 10)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string => String(value || 'createdAt'))
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @Transform(({ value }): 'asc' | 'desc' => (value === 'asc' || value === 'desc' ? value : 'desc'))
  sortOrder?: 'asc' | 'desc' = 'desc';
}
