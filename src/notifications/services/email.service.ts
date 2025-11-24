import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailNotificationDto } from '../dto/notification.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      console.warn('Email service not configured: Missing SMTP credentials');
    }
  }

  async sendEmail(emailDto: EmailNotificationDto): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not available: SMTP not configured');
      return false;
    }
    
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM'),
        to: emailDto.to,
        subject: emailDto.subject,
        html: emailDto.html,
        text: emailDto.text,
        attachments: emailDto.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return !!result.messageId;
    } catch (error) {
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to MantraSetu</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b35; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕉️ Welcome to MantraSetu</h1>
          </div>
          <div class="content">
            <h2>Namaste ${firstName}!</h2>
            <p>Welcome to MantraSetu, your gateway to authentic spiritual services and traditional Hindu practices.</p>
            <p>We're excited to have you join our community of devotees and spiritual seekers.</p>
            <p>With MantraSetu, you can:</p>
            <ul>
              <li>Book authentic pooja services with verified pandits</li>
              <li>Participate in virtual ceremonies from anywhere in the world</li>
              <li>Connect with traditional spiritual practices</li>
              <li>Access a wide range of spiritual services and guidance</li>
            </ul>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>May your spiritual journey be blessed and fulfilling.</p>
            <p>With warm regards,<br>The MantraSetu Team</p>
          </div>
          <div class="footer">
            <p>© 2024 MantraSetu. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to MantraSetu - Your Spiritual Journey Begins',
      html,
    });
  }

  async sendBookingConfirmationEmail(to: string, bookingDetails: any): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - MantraSetu</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b35; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ff6b35; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕉️ Booking Confirmed</h1>
          </div>
          <div class="content">
            <h2>Namaste!</h2>
            <p>Your booking has been confirmed. Here are the details:</p>
            <div class="booking-details">
              <h3>Booking Details</h3>
              <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
              <p><strong>Pandit:</strong> ${bookingDetails.panditName}</p>
              <p><strong>Date:</strong> ${bookingDetails.bookingDate}</p>
              <p><strong>Time:</strong> ${bookingDetails.bookingTime}</p>
              <p><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
              <p><strong>Amount:</strong> ₹${bookingDetails.amount}</p>
              <p><strong>Puja Type:</strong> ${bookingDetails.pujaType === 'OFFLINE' ? '📍 Offline (Pandit will visit your location)' : '💻 Online (Video Call)'}</p>
              ${bookingDetails.location ? `<p><strong>Location:</strong> ${bookingDetails.location}</p>` : ''}
              ${bookingDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${bookingDetails.meetingLink}">Join Meeting</a></p>` : ''}
            </div>
            ${bookingDetails.pujaType === 'OFFLINE' 
              ? '<p>Pandit ji will visit your location at the scheduled time. Please ensure the location is accessible and ready for the puja.</p>'
              : '<p>Please ensure you have a stable internet connection and are ready 15 minutes before the scheduled time.</p>'}
            <p>If you have any questions, please contact our support team.</p>
            <p>May your spiritual journey be blessed.</p>
            <p>With warm regards,<br>The MantraSetu Team</p>
          </div>
          <div class="footer">
            <p>© 2024 MantraSetu. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Booking Confirmed - MantraSetu',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - MantraSetu</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b35; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕉️ Password Reset</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password for your MantraSetu account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>With warm regards,<br>The MantraSetu Team</p>
          </div>
          <div class="footer">
            <p>© 2024 MantraSetu. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset - MantraSetu',
      html,
    });
  }
}
