import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, IsDecimal, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceCategory } from '@prisma/client';

export class CreatePanditProfileDto {
  @IsString()
  certificationNumber: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  experienceYears: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  specialization: string[];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  languagesSpoken: string[];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  serviceAreas: string[];

  @Transform(({ value }) => parseFloat(value))
  @IsDecimal()
  @Min(0)
  hourlyRate: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  achievements: string[];

  @IsOptional()
  verificationDocuments?: {
    certificate?: string;
    idProof?: string;
    photo?: string;
  };
}

export class UpdatePanditProfileDto {
  @IsOptional()
  @IsString()
  certificationNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesSpoken?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[];

  @IsOptional()
  @IsDecimal()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class CreateAvailabilityDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0-6 (Sunday-Saturday)

  @IsString()
  startTime: string; // HH:MM format

  @IsString()
  endTime: string; // HH:MM format

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PanditSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  minRating?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  maxHourlyRate?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsEnum(ServiceCategory)
  serviceCategory?: ServiceCategory;

  @IsOptional()
  @IsString()
  date?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  time?: string; // HH:MM format
}
