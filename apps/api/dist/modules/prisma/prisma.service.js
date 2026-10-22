var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
let PrismaService = PrismaService_1 = class PrismaService extends PrismaClient {
    logger = new Logger(PrismaService_1.name);
    async onModuleInit() {
        this.logger.log('Connecting to PostgreSQL via Prisma 7 engine...');
        await this.$connect();
        this.logger.log('Prisma 7 connection pool established successfully.');
    }
    async onModuleDestroy() {
        this.logger.log('Gracefully closing Prisma 7 connection pool...');
        await this.$disconnect();
    }
};
PrismaService = PrismaService_1 = __decorate([
    Injectable()
], PrismaService);
export { PrismaService };
