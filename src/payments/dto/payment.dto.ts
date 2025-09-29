import { IsString, IsOptional, IsEnum, IsNumberString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'amount is not a valid decimal number.' })
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  paymentGateway: string;

  @IsOptional()
  @IsString()
  gatewayTransactionId?: string;

  @IsOptional()
  gatewayResponse?: any;
}

export class ProcessPaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  gatewayTransactionId?: string;

  @IsOptional()
  gatewayResponse?: any;
}

export class RefundPaymentDto {
  @IsString()
  paymentId: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'refundAmount is not a valid decimal number.' })
  @Min(0)
  refundAmount: number;

  @IsString()
  reason: string;
}

export class PaymentSearchDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class RazorpayWebhookDto {
  @IsString()
  event: string;

  @IsOptional()
  contains?: string[];

  @IsOptional()
  payload?: any;
}
