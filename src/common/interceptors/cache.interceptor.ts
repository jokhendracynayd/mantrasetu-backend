import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inject } from '@nestjs/common';
import type { CacheInterface } from '../interfaces/cache.interface';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject('CACHE_SERVICE') private cacheService: CacheInterface,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler());
    const cacheTtl = this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler());

    if (!cacheKey) {
      return next.handle();
    }

    // Generate dynamic cache key with request parameters
    const request = context.switchToHttp().getRequest();
    const dynamicKey = this.generateCacheKey(cacheKey, request);

    // Try to get from cache
    const cachedResult = await this.cacheService.get(dynamicKey);
    if (cachedResult) {
      return of(cachedResult);
    }

    // If not in cache, execute the method and cache the result
    return next.handle().pipe(
      tap(async (result) => {
        await this.cacheService.set(dynamicKey, result, cacheTtl);
      }),
    );
  }

  private generateCacheKey(baseKey: string, request: any): string {
    const { params, query, body } = request;
    
    // Create a unique key based on the base key and request parameters
    const keyParts = [baseKey];
    
    if (params && Object.keys(params).length > 0) {
      keyParts.push('params', JSON.stringify(params));
    }
    
    if (query && Object.keys(query).length > 0) {
      keyParts.push('query', JSON.stringify(query));
    }
    
    if (body && Object.keys(body).length > 0) {
      // Only include relevant body fields for caching
      const relevantBody = this.extractRelevantBodyFields(body);
      if (Object.keys(relevantBody).length > 0) {
        keyParts.push('body', JSON.stringify(relevantBody));
      }
    }

    return keyParts.join(':');
  }

  private extractRelevantBodyFields(body: any): any {
    // Extract only fields that should be part of the cache key
    // Exclude sensitive fields like passwords, tokens, etc.
    const excludedFields = ['password', 'token', 'refreshToken', 'otp'];
    const relevantFields: any = {};

    for (const [key, value] of Object.entries(body)) {
      if (!excludedFields.includes(key.toLowerCase())) {
        relevantFields[key] = value;
      }
    }

    return relevantFields;
  }
}
