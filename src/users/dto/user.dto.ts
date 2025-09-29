import { IsString, IsOptional, IsEmail, IsEnum, IsDateString, IsBoolean, IsArray } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class CreateAddressDto {
  @IsString()
  type: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  line1?: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UserPreferencesDto {
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationPreferences?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicePreferences?: string[];
}

export class EnrollInServiceDto {
  @IsString()
  serviceId: string;

  @IsOptional()
  preferences?: {
    preferredLanguage?: string;
    preferredTimeSlot?: string;
    virtualOrInPerson?: 'virtual' | 'in-person' | 'both';
    specialRequirements?: string;
  };
}

export class UpdateEnrollmentDto {
  @IsOptional()
  preferences?: {
    preferredLanguage?: string;
    preferredTimeSlot?: string;
    virtualOrInPerson?: 'virtual' | 'in-person' | 'both';
    specialRequirements?: string;
  };
}