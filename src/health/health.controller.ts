import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ResponseUtil } from '../common';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Basic Health Check
   * GET /api/v1/health
   */
  @Get()
  async getHealth() {
    const health = await this.healthService.getHealth();
    return ResponseUtil.createSuccessResponse(health, 'Health check completed');
  }

  /**
   * Detailed Health Check
   * GET /api/v1/health/detailed
   */
  @Get('detailed')
  async getDetailedHealth() {
    const health = await this.healthService.getDetailedHealth();
    return ResponseUtil.createSuccessResponse(health, 'Detailed health check completed');
  }

  /**
   * Database Health Check
   * GET /api/v1/health/database
   */
  @Get('database')
  async getDatabaseHealth() {
    const health = await this.healthService.getDatabaseHealth();
    return ResponseUtil.createSuccessResponse(health, 'Database health check completed');
  }

  /**
   * Cache Health Check
   * GET /api/v1/health/cache
   */
  @Get('cache')
  async getCacheHealth() {
    const health = await this.healthService.getCacheHealth();
    return ResponseUtil.createSuccessResponse(health, 'Cache health check completed');
  }

  /**
   * External Services Health Check
   * GET /api/v1/health/external
   */
  @Get('external')
  async getExternalServicesHealth() {
    const health = await this.healthService.getExternalServicesHealth();
    return ResponseUtil.createSuccessResponse(health, 'External services health check completed');
  }

  /**
   * Readiness Check
   * GET /api/v1/health/ready
   */
  @Get('ready')
  async getReadiness() {
    const readiness = await this.healthService.getReadiness();
    return ResponseUtil.createSuccessResponse(readiness, 'Readiness check completed');
  }

  /**
   * Liveness Check
   * GET /api/v1/health/live
   */
  @Get('live')
  async getLiveness() {
    const liveness = await this.healthService.getLiveness();
    return ResponseUtil.createSuccessResponse(liveness, 'Liveness check completed');
  }
}
