import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto, PaymentSearchDto, RazorpayWebhookDto } from '../dto/payment.dto';
import { UserRole } from '@prisma/client';

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
    @Query() searchDto: PaymentSearchDto,
    @CurrentUser() currentUser: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.searchPayments(searchDto, currentUser, page, limit);
  }

  @Get('search')
  async searchPayments(
    @Query() searchDto: PaymentSearchDto,
    @CurrentUser() currentUser: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.searchPayments(searchDto, currentUser, page, limit);
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
}
