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
  DefaultValuePipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req
} from '@nestjs/common';
import type { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PanditService } from '../services/pandit.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { UserContext } from '../../auth/interfaces/auth.interface';
import { CreatePanditProfileDto, UpdatePanditProfileDto, CreateAvailabilityDto, UpdateAvailabilityDto, PanditSearchDto, UpdateBookingStatusDto } from '../dto/pandit.dto';
import { UserRole } from '@prisma/client';

@Controller('pandits')
export class PanditController {
  constructor(private readonly panditService: PanditService) {}

  @Get('search')
  async searchPandits(
    @Query() searchDto: PanditSearchDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.panditService.searchPandits(searchDto, page, limit);
  }

  @Get('available')
  async getAvailablePandits(
    @Query() filters: {
      serviceId?: string;
      date?: string;
      time?: string;
      location?: string;
      specialization?: string;
    },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.panditService.getAvailablePandits(filters, page, limit);
  }

  @Get(':id')
  async getPanditById(@Param('id') panditId: string) {
    return this.panditService.getPanditById(panditId);
  }

  @Get(':id/availability')
  async getPanditAvailability(
    @Param('id') panditId: string,
    @Query('date') date?: string,
  ) {
    return this.panditService.getPanditAvailability(panditId, date);
  }

  @Get(':id/reviews')
  async getPanditReviews(
    @Param('id') panditId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.panditService.getPanditReviews(panditId, page, limit);
  }

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'certificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ], {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'uploads/pandits';
        // Create directory if it doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit per file
      files: 10, // Allow up to 10 files total
      fieldSize: 10 * 1024 * 1024, // 10MB for field values
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type. Only images and PDFs are allowed.'), false);
      }
    },
  }))
  async registerPandit(
    @Req() req: Request,
    @UploadedFiles() files: { certificate?: Express.Multer.File[], idProof?: Express.Multer.File[], photo?: Express.Multer.File[] },
  ) {
    // Extract form data from request body (multer puts non-file fields in req.body)
    const registrationData = req.body;
    
    // Log files received for debugging
    console.log('Files received in registerPandit:', {
      certificate: files?.certificate?.length || 0,
      idProof: files?.idProof?.length || 0,
      photo: files?.photo?.length || 0,
      fileDetails: files ? {
        certificate: files.certificate?.[0]?.filename,
        idProof: files.idProof?.[0]?.filename,
        photo: files.photo?.[0]?.filename,
      } : null
    });
    
    return this.panditService.registerPandit(registrationData, files);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'certificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ], {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const fs = require('fs');
        // Get userId from request (set by JwtAuthGuard)
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const uploadPath = userId ? `uploads/pandits/${userId}` : 'uploads/pandits';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type. Only images and PDFs are allowed.'), false);
      }
    },
  }))
  async createPanditProfile(
    @CurrentUser() user: UserContext,
    @Body() createPanditProfileDto: CreatePanditProfileDto,
    @UploadedFiles() files: { certificate?: Express.Multer.File[], idProof?: Express.Multer.File[], photo?: Express.Multer.File[] },
  ) {
    return this.panditService.createPanditProfile(user.userId, createPanditProfileDto, files);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getMyPanditProfile(@CurrentUser() user: UserContext) {
    return this.panditService.getPanditProfile(user.userId);
  }

  @Put('profile/me')
  @UseGuards(JwtAuthGuard)
  async updateMyPanditProfile(
    @CurrentUser() user: UserContext,
    @Body() updatePanditProfileDto: UpdatePanditProfileDto,
  ) {
    return this.panditService.updatePanditProfile(user.userId, updatePanditProfileDto);
  }

  @Get('availability/me')
  @UseGuards(JwtAuthGuard)
  async getMyAvailability(@CurrentUser() user: UserContext) {
    return this.panditService.getAvailability(user.userId);
  }

  @Post('availability/me')
  @UseGuards(JwtAuthGuard)
  async createAvailability(
    @CurrentUser() user: UserContext,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.panditService.createAvailability(user.userId, createAvailabilityDto);
  }

  @Put('availability/me/:id')
  @UseGuards(JwtAuthGuard)
  async updateAvailability(
    @CurrentUser() user: UserContext,
    @Param('id') availabilityId: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.panditService.updateAvailability(user.userId, availabilityId, updateAvailabilityDto);
  }

  @Delete('availability/me/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAvailability(
    @CurrentUser() user: UserContext,
    @Param('id') availabilityId: string,
  ) {
    return this.panditService.deleteAvailability(user.userId, availabilityId);
  }

  @Get('bookings/me')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(
    @CurrentUser() user: UserContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.panditService.getPanditBookings(user.userId, page, limit);
  }

  @Put('bookings/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatus(
    @CurrentUser() user: UserContext,
    @Param('id') bookingId: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.panditService.updateBookingStatus(bookingId, updateBookingStatusDto.status, user);
  }

  @Get('stats/me')
  @UseGuards(JwtAuthGuard)
  async getMyStats(@CurrentUser() user: UserContext) {
    return this.panditService.getPanditStats(user.userId);
  }

  @Put(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async verifyPandit(
    @Param('id') panditId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.panditService.verifyPandit(panditId, currentUser);
  }

  @Put(':id/unverify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async unverifyPandit(
    @Param('id') panditId: string,
    @CurrentUser() currentUser: UserContext,
  ) {
    return this.panditService.unverifyPandit(panditId, currentUser);
  }
}
