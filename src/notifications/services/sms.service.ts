import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsNotificationDto } from '../dto/notification.dto';

@Injectable()
export class SmsService {
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    // Initialize Twilio client if credentials are available
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
      } catch (error) {
        console.warn('Twilio not available:', error.message);
      }
    }
  }

  async sendSms(smsDto: SmsNotificationDto): Promise<boolean> {
    if (!this.twilioClient) {
      console.warn('SMS service not configured - Twilio credentials missing');
      return false;
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: smsDto.message,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: smsDto.to,
      });

      return !!message.sid;
    } catch (error) {
      throw new BadRequestException(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendOtpSms(to: string, otp: string): Promise<boolean> {
    const message = `Your MantraSetu OTP is: ${otp}. This OTP is valid for 5 minutes. Do not share it with anyone.`;
    
    return this.sendSms({
      to,
      message,
    });
  }

  async sendBookingConfirmationSms(to: string, bookingDetails: any): Promise<boolean> {
    const message = `Your MantraSetu booking is confirmed! Service: ${bookingDetails.serviceName}, Date: ${bookingDetails.bookingDate}, Time: ${bookingDetails.bookingTime}. Meeting link will be sent separately.`;
    
    return this.sendSms({
      to,
      message,
    });
  }

  async sendBookingReminderSms(to: string, bookingDetails: any): Promise<boolean> {
    const message = `Reminder: Your MantraSetu service is scheduled for today at ${bookingDetails.bookingTime}. Please be ready 15 minutes before. Meeting link: ${bookingDetails.meetingLink || 'Will be shared soon'}`;
    
    return this.sendSms({
      to,
      message,
    });
  }

  async sendPaymentConfirmationSms(to: string, amount: number, bookingId: string): Promise<boolean> {
    const message = `Payment of ₹${amount} for booking ${bookingId} has been confirmed. Thank you for choosing MantraSetu!`;
    
    return this.sendSms({
      to,
      message,
    });
  }

  async sendServiceCompletionSms(to: string, panditName: string): Promise<boolean> {
    const message = `Your service with ${panditName} has been completed. Please rate and review your experience on MantraSetu. Thank you!`;
    
    return this.sendSms({
      to,
      message,
    });
  }
}
