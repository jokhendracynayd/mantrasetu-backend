import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService, AdminDashboardStats, UserManagementResponse, PanditManagementResponse } from '../services/admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserRole, Prisma } from '@prisma/client';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { AdminUserFilterDto, AdminPanditFilterDto, UpdateUserStatusDto, AdminServiceFilterDto } from '../dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(@Query() filters: AdminUserFilterDto) {
    return this.adminService.getUsers(filters);
  }

  @Get('users/:id')
  async getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Put('users/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.adminService.updateUserStatus(userId, updateUserStatusDto.isActive, currentUser);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') userId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.adminService.deleteUser(userId, currentUser);
  }

  @Get('pandits')
  async getPandits(@Query() filters: AdminPanditFilterDto) {
    return this.adminService.getPandits(filters);
  }

  @Get('pandits/:id')
  async getPanditById(@Param('id') panditId: string) {
    return this.adminService.getPanditById(panditId);
  }

  @Put('pandits/:id/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPandit(
    @Param('id') panditId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.adminService.verifyPandit(panditId, currentUser);
  }

  @Put('pandits/:id/unverify')
  @HttpCode(HttpStatus.OK)
  async unverifyPandit(
    @Param('id') panditId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.adminService.unverifyPandit(panditId, currentUser);
  }

  @Get('pandits/:id/performance')
  async getPanditPerformance(@Param('id') panditId: string) {
    return this.adminService.getPanditPerformanceMetrics(panditId);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalyticsData();
  }

  // Service Management
  @Get('services')
  async getServices(@Query() filters: AdminServiceFilterDto): Promise<{
    services: Array<Prisma.ServiceGetPayload<{ include: { _count: { select: { bookings: true } } } }>>;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    return this.adminService.getServices(filters);
  }

  @Get('services/:id')
  async getServiceById(@Param('id') serviceId: string): Promise<Prisma.ServiceGetPayload<{ include: { _count: { select: { bookings: true } } } }>> {
    return this.adminService.getServiceById(serviceId);
  }

  @Post('services')
  @HttpCode(HttpStatus.CREATED)
  async createService(
    @Body() createServiceDto: Prisma.ServiceCreateInput,
    @CurrentUser() currentUser: UserContext,
  ): Promise<Prisma.ServiceGetPayload<{}>> {
    return this.adminService.createService(createServiceDto, currentUser);
  }

  @Put('services/:id')
  @HttpCode(HttpStatus.OK)
  async updateService(
    @Param('id') serviceId: string,
    @Body() updateServiceDto: Prisma.ServiceUpdateInput,
    @CurrentUser() currentUser: UserContext,
  ): Promise<Prisma.ServiceGetPayload<{}>> {
    return this.adminService.updateService(serviceId, updateServiceDto, currentUser);
  }

  @Delete('services/:id')
  @HttpCode(HttpStatus.OK)
  async deleteService(
    @Param('id') serviceId: string,
    @CurrentUser() currentUser: UserContext,
  ): Promise<{ message: string }> {
    return this.adminService.deleteService(serviceId, currentUser);
  }
}
