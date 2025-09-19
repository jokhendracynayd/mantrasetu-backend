import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheInterface } from '../interfaces/cache.interface';
import { MemoryCacheService } from './memory-cache.service';
import { RedisCacheService } from './redis-cache.service';

export enum CacheType {
  MEMORY = 'memory',
  REDIS = 'redis',
}

@Injectable()
export class CacheFactoryService {
  constructor(
    private configService: ConfigService,
    private memoryCache: MemoryCacheService,
    @Optional() private redisCache: RedisCacheService | null,
  ) {}

  getCacheService(): CacheInterface {
    const cacheType = this.configService.get<CacheType>('CACHE_TYPE', CacheType.MEMORY);
    
    switch (cacheType) {
      case CacheType.REDIS:
        if (!this.redisCache) {
          console.warn('Redis cache requested but not available. Falling back to memory cache.');
          return this.memoryCache;
        }
        return this.redisCache;
      case CacheType.MEMORY:
      default:
        return this.memoryCache;
    }
  }

  getCurrentCacheType(): CacheType {
    return this.configService.get<CacheType>('CACHE_TYPE', CacheType.MEMORY);
  }

  async switchCacheType(newType: CacheType): Promise<void> {
    // This would require application restart in a real scenario
    // For now, just log the request
    console.log(`Cache type switch requested to: ${newType}`);
    console.log('Note: Cache type changes require application restart');
  }
}
