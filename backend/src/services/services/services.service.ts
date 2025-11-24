import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateServiceDto, UpdateServiceDto, ServiceSearchDto } from '../dto/services.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(createServiceDto: CreateServiceDto) {
    try {
      const service = await this.prisma.service.create({
        data: createServiceDto,
      });
      return service;
    } catch (error) {
      throw new ConflictException('Service creation failed');
    }
  }

  async findAllServices(searchDto: ServiceSearchDto = {}) {
    const {
      search,
      category,
      subcategory,
      isVirtual,
      isActive = true,
      tags,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = searchDto;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subcategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (isVirtual !== undefined) {
      where.isVirtual = isVirtual;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) {
        where.basePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.basePrice.lte = maxPrice;
      }
    }

    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.basePrice = sortOrder;
    } else if (sortBy === 'duration') {
      orderBy.durationMinutes = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto) {
    const existingService = await this.findServiceById(id);

    try {
      const service = await this.prisma.service.update({
        where: { id },
        data: updateServiceDto,
      });
      return service;
    } catch (error) {
      throw new BadRequestException('Service update failed');
    }
  }

  async deleteService(id: string) {
    await this.findServiceById(id);

    try {
      await this.prisma.service.delete({
        where: { id },
      });
      return { message: 'Service deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Service deletion failed');
    }
  }

  async searchServices(searchDto: ServiceSearchDto) {
    return this.findAllServices(searchDto);
  }
}
