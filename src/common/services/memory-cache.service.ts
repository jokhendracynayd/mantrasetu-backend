import { Injectable } from '@nestjs/common';
import { CacheInterface } from '../interfaces/cache.interface';

interface CacheItem {
  value: any;
  expiresAt?: number;
}

@Injectable()
export class MemoryCacheService implements CacheInterface {
  private cache = new Map<string, CacheItem>();
  private timers = new Map<string, NodeJS.Timeout>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      await this.del(key);
      return null;
    }

    return item.value as T;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const item: CacheItem = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : undefined,
    };

    this.cache.set(key, item);

    // Clear existing timer if any
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer if TTL is provided
    if (ttl) {
      const timer = setTimeout(() => {
        this.del(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
    
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      await this.del(key);
      return false;
    }

    return true;
  }

  async clear(): Promise<void> {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.cache.clear();
    this.timers.clear();
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }

    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key);
    
    if (!item || !item.expiresAt) {
      return -1; // No expiration
    }

    const remaining = Math.ceil((item.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2; // Expired
  }

  async expire(key: string, ttl: number): Promise<void> {
    const item = this.cache.get(key);
    
    if (!item) {
      return;
    }

    await this.set(key, item.value, ttl);
  }

  // Additional utility methods for memory cache
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
