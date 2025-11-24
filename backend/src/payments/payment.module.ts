import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { RazorpayService } from './services/razorpay.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RazorpayService],
  exports: [PaymentService, RazorpayService],
})
export class PaymentModule {}
