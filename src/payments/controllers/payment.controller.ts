import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  Req,
  UseGuards,
  UsePipes,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ValidationPipe
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto, PaymentSearchDto, RazorpayWebhookDto, ApprovePaymentDto, RejectPaymentDto } from '../dto/payment.dto';
import { UserRole, PaymentStatus, PaymentMethod } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @CurrentUser() user: UserContext,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(user.userId, createPaymentDto);
  }

  @Get()
  async getPayments(
    @Req() request: Request,
    @CurrentUser() currentUser: UserContext,
  ) {
    const query = request.query;
    const searchDto: PaymentSearchDto = {
      bookingId: query.bookingId as string,
      userId: query.userId as string,
      status: query.status as PaymentStatus,
      paymentMethod: query.paymentMethod as PaymentMethod,
      paymentGateway: query.paymentGateway as string,
      startDate: query.startDate as string,
      endDate: query.endDate as string,
      page: query.page ? parseInt(query.page as string) : undefined,
      limit: query.limit ? parseInt(query.limit as string) : undefined,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as 'asc' | 'desc',
    };
    return this.paymentService.searchPayments(searchDto, currentUser, searchDto.page || 1, searchDto.limit || 10);
  }

  @Get('search')
  async searchPayments(
    @Req() request: Request,
    @CurrentUser() currentUser: UserContext,
  ) {
    const query = request.query;
    const searchDto: PaymentSearchDto = {
      bookingId: query.bookingId as string,
      userId: query.userId as string,
      status: query.status as PaymentStatus,
      paymentMethod: query.paymentMethod as PaymentMethod,
      paymentGateway: query.paymentGateway as string,
      startDate: query.startDate as string,
      endDate: query.endDate as string,
      page: query.page ? parseInt(query.page as string) : undefined,
      limit: query.limit ? parseInt(query.limit as string) : undefined,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as 'asc' | 'desc',
    };
    return this.paymentService.searchPayments(searchDto, currentUser, searchDto.page || 1, searchDto.limit || 10);
  }

  @Get('stats')
  async getPaymentStats(@CurrentUser() currentUser: UserContext) {
    return this.paymentService.getPaymentStats(currentUser);
  }

  @Get('me')
  async getMyPayments(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.getUserPayments(user.userId, page, limit);
  }

  @Get(':id')
  async getPaymentById(
    @Param('id') paymentId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.paymentService.getPaymentById(paymentId, currentUser);
  }

  @Put(':id/process')
  async processPayment(
    @Param('id') paymentId: string,
    @Body() processPaymentDto: ProcessPaymentDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.paymentService.processPayment(paymentId, processPaymentDto, currentUser);
  }

  @Put(':id/refund')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async refundPayment(
    @Param('id') paymentId: string,
    @Body() refundPaymentDto: RefundPaymentDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.paymentService.refundPayment(paymentId, refundPaymentDto, currentUser);
  }

  @Post('webhooks/razorpay')
  @HttpCode(HttpStatus.OK)
  async handleRazorpayWebhook(@Body() webhookDto: RazorpayWebhookDto) {
    await this.paymentService.handleRazorpayWebhook(webhookDto);
    return { status: 'success' };
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async approvePayment(
    @Param('id') paymentId: string,
    @Body() approvePaymentDto: ApprovePaymentDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.paymentService.approvePayment(paymentId, approvePaymentDto, currentUser);
  }

  @Put(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async rejectPayment(
    @Param('id') paymentId: string,
    @Body() rejectPaymentDto: RejectPaymentDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.paymentService.rejectPayment(paymentId, rejectPaymentDto, currentUser);
  }

  @Post(':id/screenshot')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('screenshot', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'uploads/payments';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `payment-${req.params.id}-${uniqueSuffix}.${ext}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type. Only images are allowed.'), false);
      }
    },
  }))
  async uploadPaymentScreenshot(
    @Param('id') paymentId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserContext,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.paymentService.uploadPaymentScreenshot(paymentId, file, currentUser);
  }
}
