import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { NotificationType, NotificationStatus } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: any;
}

export class SendNotificationDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: any;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsBoolean()
  markAsRead?: boolean;
}

export class NotificationSearchDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsBoolean()
  unreadOnly?: boolean;
}

export class EmailNotificationDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  attachments?: any[];
}

export class SmsNotificationDto {
  @IsString()
  to: string;

  @IsString()
  message: string;
}
