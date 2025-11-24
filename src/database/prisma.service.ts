import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.warn('Database connection failed:', error.message);
      console.warn('Running in development mode without database connection');
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.warn('Database disconnection failed:', error.message);
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this)
      .filter((key): key is string => typeof key === 'string' && key[0] !== '_');
    
    return Promise.all(
      models.map((modelKey) => (this as any)[modelKey].deleteMany())
    );
  }
}
