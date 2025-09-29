import { IsString, IsOptional, IsEnum, IsDecimal, IsNumber, Min } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../../generated/prisma';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsDecimal()
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

  @IsDecimal()
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
