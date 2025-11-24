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
  DefaultValuePipe
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreateBookingDto, UpdateBookingDto, BookingSearchDto, BookingReviewDto, CancelBookingDto, RescheduleBookingDto } from '../dto/booking.dto';
import { UserRole } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @CurrentUser() user: UserContext,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(user.userId, createBookingDto);
  }

  @Get()
  async getBookings(
    @Query() searchDto: BookingSearchDto,
    @CurrentUser() currentUser: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.bookingService.searchBookings(searchDto, currentUser, page, limit);
  }

  @Get('search')
  async searchBookings(
    @Query() searchDto: BookingSearchDto,
    @CurrentUser() currentUser: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.bookingService.searchBookings(searchDto, currentUser, page, limit);
  }

  @Get(':id')
  async getBookingById(
    @Param('id') bookingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.getBookingById(bookingId, currentUser);
  }

  @Put(':id')
  async updateBooking(
    @Param('id') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.updateBooking(bookingId, updateBookingDto, currentUser);
  }

  @Put(':id/cancel')
  async cancelBooking(
    @Param('id') bookingId: string,
    @Body() cancelBookingDto: CancelBookingDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.cancelBooking(bookingId, cancelBookingDto, currentUser);
  }

  @Put(':id/reschedule')
  async rescheduleBooking(
    @Param('id') bookingId: string,
    @Body() rescheduleBookingDto: RescheduleBookingDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.rescheduleBooking(bookingId, rescheduleBookingDto, currentUser);
  }

  @Post(':id/review')
  async addReview(
    @Param('id') bookingId: string,
    @Body() reviewDto: BookingReviewDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.addReview(bookingId, reviewDto, currentUser);
  }

  @Put(':id/confirm')
  async confirmBooking(
    @Param('id') bookingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.confirmBooking(bookingId, currentUser);
  }

  @Put(':id/start')
  async startBooking(
    @Param('id') bookingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.startBooking(bookingId, currentUser);
  }

  @Put(':id/complete')
  async completeBooking(
    @Param('id') bookingId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.bookingService.completeBooking(bookingId, currentUser);
  }
}
