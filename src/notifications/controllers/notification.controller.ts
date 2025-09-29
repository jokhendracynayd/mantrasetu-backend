import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query, 
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreateNotificationDto, SendNotificationDto, UpdateNotificationDto, NotificationSearchDto } from '../dto/notification.dto';
import { UserRole } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async sendBulkNotifications(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationService.sendBulkNotifications(sendNotificationDto);
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async searchNotifications(
    @Query() searchDto: NotificationSearchDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationService.searchNotifications(searchDto, page, limit);
  }

  @Get('me')
  async getMyNotifications(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationService.getUserNotifications(user.userId, page, limit);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: UserContext) {
    const count = await this.notificationService.getUnreadNotificationCount(user.userId);
    return { unreadCount: count };
  }

  @Get(':id')
  async getNotificationById(
    @Param('id') notificationId: string,
    @CurrentUser() user: UserContext,
  ) {
    return this.notificationService.getNotificationById(notificationId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateNotification(
    @Param('id') notificationId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.updateNotification(notificationId, updateNotificationDto);
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @CurrentUser() user: UserContext,
  ) {
    return this.notificationService.markNotificationAsRead(notificationId, user.userId);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: UserContext) {
    return this.notificationService.markAllNotificationsAsRead(user.userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationId: string,
    @CurrentUser() user: UserContext,
  ) {
    return this.notificationService.deleteNotification(notificationId, user.userId);
  }
}
