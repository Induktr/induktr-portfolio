import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import type { TelegramService } from '../telegram/telegram.service';
import type { CreateLeadInput, GqlLeadStatus, LeadResponse } from './dto/lead.dto';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async submitLead(input: CreateLeadInput): Promise<LeadResponse> {
    // Idempotency check if key provided
    if (input.idempotencyKey) {
      const existing = await this.prisma.lead.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        this.logger.warn(
          `Idempotency key ${input.idempotencyKey} matched existing lead ${existing.id}`,
        );
        return {
          id: existing.id,
          name: existing.name,
          contact: existing.contact,
          budget: existing.budget,
          description: existing.description,
          status: existing.status as unknown as GqlLeadStatus,
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
        .catch((err: unknown) => {
          this.logger.error(`Async Telegram alert failed for lead ${lead.id}`, err);
        });
    });

    return {
      id: lead.id,
      name: lead.name,
      contact: lead.contact,
      budget: lead.budget,
      description: lead.description,
      status: lead.status as unknown as GqlLeadStatus,
      createdAt: lead.createdAt.toISOString(),
    };
  }

  async getAllLeads(): Promise<LeadResponse[]> {
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
      status: l.status as unknown as GqlLeadStatus,
      createdAt: l.createdAt.toISOString(),
    }));
  }
}
