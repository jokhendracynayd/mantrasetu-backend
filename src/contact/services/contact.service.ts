import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto, UpdateContactStatusDto } from '../dto/contact.dto';
import { EmailService } from '../../notifications/services/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    try {
      // Normalize phone - convert empty string to undefined
      const phone = createContactDto.phone?.trim() || undefined;
      
      // Create contact entry - anyone can contact, no user relationship needed
      const contact = await this.prisma.contact.create({
        data: {
          name: createContactDto.name.trim(),
          email: createContactDto.email.trim().toLowerCase(),
          phone: phone,
          subject: createContactDto.subject.trim(),
          message: createContactDto.message.trim(),
          type: createContactDto.type || 'GENERAL',
        },
      });

      // Send confirmation email to user
      try {
        await this.emailService.sendEmail({
          to: createContactDto.email,
          subject: 'Thank You for Contacting MantraSetu',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #E6470E;">🕉️ Thank You for Contacting MantraSetu</h2>
              <p>Dear ${createContactDto.name},</p>
              <p>We have received your message and our team will get back to you within 24 hours.</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${createContactDto.subject}</p>
                <p><strong>Your Message:</strong></p>
                <p>${createContactDto.message.replace(/\n/g, '<br>')}</p>
              </div>
              <p>If you have any urgent concerns, please feel free to call us at +91 88228 82264.</p>
              <p>Best regards,<br>MantraSetu Support Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the request if email fails
      }

      // Send notification email to support team
      const supportEmail = 'support@mantrasetu.com';
      try {
        await this.emailService.sendEmail({
          to: supportEmail,
          subject: `New Contact Form Submission: ${createContactDto.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #E6470E;">New Contact Form Submission</h2>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${createContactDto.name}</p>
                <p><strong>Email:</strong> ${createContactDto.email}</p>
                <p><strong>Phone:</strong> ${createContactDto.phone || 'Not provided'}</p>
                <p><strong>Type:</strong> ${createContactDto.type || 'GENERAL'}</p>
                <p><strong>Subject:</strong> ${createContactDto.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${createContactDto.message.replace(/\n/g, '<br>')}</p>
              </div>
              <p><a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/admin/contacts/${contact.id}" style="color: #E6470E;">View in Admin Panel</a></p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send support notification email:', emailError);
        // Don't fail the request if email fails
      }

      return {
        success: true,
        message: 'Contact form submitted successfully. We will get back to you soon.',
        data: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status,
          createdAt: contact.createdAt,
        },
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      
      // Handle Prisma errors
      if (error.code === 'P2002') {
        throw new BadRequestException('A contact with this email already exists. Please use a different email or wait before submitting again.');
      }
      
      // Handle validation errors
      if (error.response && error.response.message) {
        throw new BadRequestException(error.response.message);
      }
      
      // Generic error
      throw new BadRequestException('Failed to submit contact form. Please try again later.');
    }
  }

  async getAllContacts(page = 1, limit = 20, status?: string, type?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      success: true,
      data: contacts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getContactById(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return {
      success: true,
      data: contact,
    };
  }

  async updateContactStatus(id: string, updateDto: UpdateContactStatusDto) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updated = await this.prisma.contact.update({
      where: { id },
      data: {
        status: updateDto.status as any,
        adminNotes: updateDto.adminNotes,
        resolvedAt: updateDto.status === 'RESOLVED' || updateDto.status === 'CLOSED' ? new Date() : null,
      },
    });

    return {
      success: true,
      message: 'Contact status updated successfully',
      data: updated,
    };
  }
}
