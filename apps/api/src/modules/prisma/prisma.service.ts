import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL via Prisma 7 engine...');
    await this.$connect();
    this.logger.log('Prisma 7 connection pool established successfully.');
  }

  async onModuleDestroy() {
    this.logger.log('Gracefully closing Prisma 7 connection pool...');
    await this.$disconnect();
  }
}
