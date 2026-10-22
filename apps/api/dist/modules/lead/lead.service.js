var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LeadService_1;
import { Injectable, Logger } from '@nestjs/common';
let LeadService = LeadService_1 = class LeadService {
    prisma;
    telegram;
    logger = new Logger(LeadService_1.name);
    constructor(prisma, telegram) {
        this.prisma = prisma;
        this.telegram = telegram;
    }
    async submitLead(input) {
        // Idempotency check if key provided
        if (input.idempotencyKey) {
            const existing = await this.prisma.lead.findUnique({
                where: { idempotencyKey: input.idempotencyKey },
            });
            if (existing) {
                this.logger.warn(`Idempotency key ${input.idempotencyKey} matched existing lead ${existing.id}`);
                return {
                    id: existing.id,
                    name: existing.name,
                    contact: existing.contact,
                    budget: existing.budget,
                    description: existing.description,
                    status: existing.status,
                    createdAt: existing.createdAt.toISOString(),
                };
            }
        }
        const lead = await this.prisma.lead.create({
            data: {
                name: input.name,
                contact: input.contact,
                budget: input.budget,
                description: input.description,
                serviceType: input.serviceType ?? 'FULL_CYCLE_ENGINEERING',
                referrer: input.referrer,
                idempotencyKey: input.idempotencyKey,
            },
        });
        // Dual-Contour Async Dispatch (Does not block mutation response)
        queueMicrotask(() => {
            this.telegram
                .sendLeadNotification({
                id: lead.id,
                name: lead.name,
                contact: lead.contact,
                budget: lead.budget,
                description: lead.description,
                serviceType: lead.serviceType,
            })
                .catch((err) => {
                this.logger.error(`Async Telegram alert failed for lead ${lead.id}`, err);
            });
        });
        return {
            id: lead.id,
            name: lead.name,
            contact: lead.contact,
            budget: lead.budget,
            description: lead.description,
            status: lead.status,
            createdAt: lead.createdAt.toISOString(),
        };
    }
    async getAllLeads() {
        const leads = await this.prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return leads.map((l) => ({
            id: l.id,
            name: l.name,
            contact: l.contact,
            budget: l.budget,
            description: l.description,
            status: l.status,
            createdAt: l.createdAt.toISOString(),
        }));
    }
};
LeadService = LeadService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Function, Function])
], LeadService);
export { LeadService };
