import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterface } from '../interfaces/cache.interface';
import { MemoryCacheService } from '../services/memory-cache.service';
import { RedisCacheService } from '../services/redis-cache.service';
import { CacheFactoryService } from '../services/cache-factory.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MemoryCacheService,
    CacheFactoryService,
    {
      provide: 'CACHE_SERVICE',
      useFactory: (cacheFactory: CacheFactoryService) => {
        return cacheFactory.getCacheService();
      },
      inject: [CacheFactoryService],
    },
    {
      provide: RedisCacheService,
      useFactory: (configService: ConfigService) => {
        const cacheType = configService.get<string>('CACHE_TYPE', 'memory');
        if (cacheType === 'redis') {
          return new RedisCacheService(configService);
        }
        return null;
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    'CACHE_SERVICE',
    CacheFactoryService,
    MemoryCacheService,
    // RedisCacheService,
  ],
})
export class CacheModule {}
