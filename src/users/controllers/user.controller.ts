import { 
  Controller, 
  Get, 
  Put, 
  Post, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto, EnrollInServiceDto, UpdateEnrollmentDto } from '../dto/user.dto';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: UserContext) {
    return this.userService.getProfile(user.userId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: UserContext,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  @Get('addresses')
  async getAddresses(@CurrentUser() user: UserContext) {
    return this.userService.getAddresses(user.userId);
  }

  @Post('addresses')
  async createAddress(
    @CurrentUser() user: UserContext,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.userService.createAddress(user.userId, createAddressDto);
  }

  @Put('addresses/:id')
  async updateAddress(
    @CurrentUser() user: UserContext,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(user.userId, addressId, updateAddressDto);
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @CurrentUser() user: UserContext,
    @Param('id') addressId: string,
  ) {
    return this.userService.deleteAddress(user.userId, addressId);
  }

  @Get('bookings')
  async getUserBookings(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.getUserBookings(user.userId, page, limit);
  }

  @Get('reviews')
  async getUserReviews(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.getUserReviews(user.userId, page, limit);
  }

  @Get('notifications')
  async getUserNotifications(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.getUserNotifications(user.userId, page, limit);
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(
    @CurrentUser() user: UserContext,
    @Param('id') notificationId: string,
  ) {
    return this.userService.markNotificationAsRead(user.userId, notificationId);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@CurrentUser() user: UserContext) {
    return this.userService.markAllNotificationsAsRead(user.userId);
  }

  @Get('stats')
  async getUserStats(@CurrentUser() user: UserContext) {
    return this.userService.getUserStats(user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async deleteUser(
    @Param('id') userId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.userService.deleteUser(userId, currentUser);
  }

  // Service Enrollment endpoints
  @Get('enrolled-services')
  async getEnrolledServices(@CurrentUser() user: UserContext) {
    return this.userService.getEnrolledServices(user.userId);
  }

  @Post('enroll-service')
  async enrollInService(
    @Body() enrollInServiceDto: EnrollInServiceDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.userService.enrollInService(user.userId, enrollInServiceDto);
  }

  @Put('enrollments/:enrollmentId')
  async updateEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.userService.updateEnrollment(user.userId, enrollmentId, updateEnrollmentDto);
  }

  @Delete('enrollments/:enrollmentId')
  async unenrollFromService(
    @Param('enrollmentId') enrollmentId: string,
    @CurrentUser() user: UserContext,
  ) {
    return this.userService.unenrollFromService(user.userId, enrollmentId);
  }

  @Get('enrollment-history')
  async getEnrollmentHistory(@CurrentUser() user: UserContext) {
    return this.userService.getEnrollmentHistory(user.userId);
  }
}
