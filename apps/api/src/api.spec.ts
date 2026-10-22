import { describe, it, expect } from 'vitest';
import { GqlLeadStatus } from './modules/lead/dto/lead.dto';

describe('API Core Specifications', () => {
  it('verifies GraphQL lead status enums', () => {
    expect(GqlLeadStatus.NEW).toBe('NEW');
    expect(GqlLeadStatus.QUALIFIED).toBe('QUALIFIED');
    expect(GqlLeadStatus.COMPLETED).toBe('COMPLETED');
  });
});
