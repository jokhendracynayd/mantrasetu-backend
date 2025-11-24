import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheInterface } from '../interfaces/cache.interface';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisCacheService implements CacheInterface, OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    
    this.client = createClient({
      url: redisUrl,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (error) {
      console.error('Redis CLEAR error:', error);
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      const searchPattern = pattern || '*';
      return await this.client.keys(searchPattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
    }
  }

  // Additional Redis-specific methods
  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch (error) {
      console.error('Redis PING error:', error);
      return 'ERROR';
    }
  }

  async getInfo(): Promise<any> {
    try {
      return await this.client.info();
    } catch (error) {
      console.error('Redis INFO error:', error);
      return null;
    }
  }
}
