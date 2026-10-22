import { describe, it, expect } from 'vitest';
import { CreateLeadSchema, LeadStatusSchema, ProductTypeSchema } from './index';

describe('Contracts Verification Suite (IPO-Protocol Validation)', () => {
  it('validates a correct Lead creation payload', () => {
    const validLead = {
      name: 'Alexander Tech',
      contact: '@alex_founder',
      budget: '$5,000 - $10,000',
      description: 'High-performance trading dashboard refactoring to 60 FPS',
      serviceType: 'FULL_CYCLE_ENGINEERING',
    };

    const result = CreateLeadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid Lead with insufficient characters', () => {
    const invalidLead = {
      name: 'A',
      contact: 'x',
      budget: '',
      description: 'short',
    };

    const result = CreateLeadSchema.safeParse(invalidLead);
    expect(result.success).toBe(false);
  });

  it('validates product taxonomy', () => {
    expect(ProductTypeSchema.options).toContain('UI_KIT');
    expect(ProductTypeSchema.options).toContain('CHEATSHEET_HIGH_LEVEL');
    expect(ProductTypeSchema.options).toContain('CHEATSHEET_LOW_LEVEL');
    expect(LeadStatusSchema.options).toContain('NEW');
  });
});
