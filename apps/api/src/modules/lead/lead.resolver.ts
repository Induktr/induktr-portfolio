import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { type CreateLeadInput, LeadResponse } from './dto/lead.dto';
import type { LeadService } from './lead.service';

@Resolver(() => LeadResponse)
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query(() => [LeadResponse], { name: 'leads', description: 'Retrieve latest CRM leads' })
  async getLeads(): Promise<LeadResponse[]> {
    return this.leadService.getAllLeads();
  }

  @Mutation(() => LeadResponse, {
    name: 'submitLead',
    description: 'Submit intake lead with guaranteed idempotency',
  })
  async submitLead(@Args('input') input: CreateLeadInput): Promise<LeadResponse> {
    return this.leadService.submitLead(input);
  }
}
