import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { PaymentGatewayResponse, RazorpayOrderResponse, RazorpayPaymentResponse, RefundResponse } from '../interfaces/payment.interface';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(private configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    
    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } else {
      console.warn('Razorpay service not configured: Missing API credentials');
    }
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string): Promise<RazorpayOrderResponse> {
    if (!this.razorpay) {
      throw new BadRequestException('Payment service not available: Razorpay not configured');
    }
    
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt,
        notes: {
          platform: 'MantraSetu',
        },
      };

      const order = await this.razorpay.orders.create(options);
      return order as RazorpayOrderResponse;
    } catch (error) {
      throw new BadRequestException(`Failed to create Razorpay order: ${error.message}`);
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<PaymentGatewayResponse> {
    try {
      const crypto = require('crypto');
      const razorpaySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
      
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === signature) {
        // Fetch payment details
        const payment = await this.razorpay.payments.fetch(paymentId);
        return {
          success: true,
          transactionId: payment.id,
          amount: Number(payment.amount) / 100, // Convert from paise to rupees
          currency: payment.currency,
          status: payment.status,
          gatewayResponse: payment,
        };
      } else {
        return {
          success: false,
          error: 'Invalid signature',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async capturePayment(paymentId: string, amount: number, currency: string = 'INR'): Promise<PaymentGatewayResponse> {
    try {
      const payment = await this.razorpay.payments.capture(paymentId, amount * 100, currency);
      return {
        success: true,
        transactionId: payment.id,
        amount: Number(payment.amount) / 100,
        currency: payment.currency,
        status: payment.status,
        gatewayResponse: payment,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async refundPayment(paymentId: string, amount: number, notes?: string): Promise<RefundResponse> {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount * 100, // Convert to paise
        notes: { reason: notes || 'Refund from MantraSetu' },
      });

      return {
        id: refund.id,
        amount: Number(refund.amount) / 100,
        currency: refund.currency,
        status: refund.status,
        receipt: refund.receipt || '',
        created_at: refund.created_at,
      } as RefundResponse;
    } catch (error) {
      throw new BadRequestException(`Failed to process refund: ${error.message}`);
    }
  }

  async getPaymentDetails(paymentId: string): Promise<RazorpayPaymentResponse> {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment as RazorpayPaymentResponse;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch payment details: ${error.message}`);
    }
  }

  async getOrderDetails(orderId: string): Promise<RazorpayOrderResponse> {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return order as RazorpayOrderResponse;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch order details: ${error.message}`);
    }
  }

  mapPaymentMethod(razorpayMethod: string): PaymentMethod {
    const methodMap: Record<string, PaymentMethod> = {
      'card': PaymentMethod.CARD,
      'upi': PaymentMethod.UPI,
      'netbanking': PaymentMethod.NET_BANKING,
      'wallet': PaymentMethod.WALLET,
      'cash': PaymentMethod.CASH,
    };

    return methodMap[razorpayMethod] || PaymentMethod.CARD;
  }

  mapPaymentStatus(razorpayStatus: string): string {
    const statusMap: Record<string, string> = {
      'created': 'PENDING',
      'authorized': 'PROCESSING',
      'captured': 'COMPLETED',
      'refunded': 'REFUNDED',
      'failed': 'FAILED',
    };

    return statusMap[razorpayStatus] || 'PENDING';
  }
}
