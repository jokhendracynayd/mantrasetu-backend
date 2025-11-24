import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

export enum ContactType {
  GENERAL = 'GENERAL',
  SUPPORT = 'SUPPORT',
  PARTNERSHIP = 'PARTNERSHIP',
  FEEDBACK = 'FEEDBACK',
  COMPLAINT = 'COMPLAINT',
}

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  subject: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsEnum(ContactType)
  type?: ContactType;
}

export class UpdateContactStatusDto {
  @IsEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
