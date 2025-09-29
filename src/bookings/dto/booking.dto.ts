import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsDecimal, Min, Max } from 'class-validator';
import { BookingStatus, PaymentStatus } from '../../../generated/prisma';

export class CreateBookingDto {
  @IsString()
  panditId: string;

  @IsString()
  serviceId: string;

  @IsDateString()
  bookingDate: string; // YYYY-MM-DD format

  @IsString()
  bookingTime: string; // HH:MM format

  @IsString()
  timezone: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @IsOptional()
  @IsString()
  bookingTime?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class BookingSearchDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  panditId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class BookingReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class CancelBookingDto {
  @IsString()
  reason: string;
}

export class RescheduleBookingDto {
  @IsDateString()
  newBookingDate: string;

  @IsString()
  newBookingTime: string;

  @IsString()
  timezone: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
