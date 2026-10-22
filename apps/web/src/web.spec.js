import { describe, it, expect } from 'vitest';
import { graphqlClient } from './shared/api/graphql-client';
describe('Web Client Toolchain & Gateway', () => {
    it('initializes urql client with correct default configuration', () => {
        expect(graphqlClient).toBeDefined();
        expect(typeof graphqlClient.executeQuery).toBe('function');
        expect(typeof graphqlClient.executeMutation).toBe('function');
    });
});
