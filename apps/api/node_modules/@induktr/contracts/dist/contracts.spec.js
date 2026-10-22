"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_1 = require("./index");
(0, vitest_1.describe)('Contracts Verification Suite (IPO-Protocol Validation)', function () {
    (0, vitest_1.it)('validates a correct Lead creation payload', function () {
        var validLead = {
            name: 'Alexander Tech',
            contact: '@alex_founder',
            budget: '$5,000 - $10,000',
            description: 'High-performance trading dashboard refactoring to 60 FPS',
            serviceType: 'FULL_CYCLE_ENGINEERING',
        };
        var result = index_1.CreateLeadSchema.safeParse(validLead);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)('rejects an invalid Lead with insufficient characters', function () {
        var invalidLead = {
            name: 'A',
            contact: 'x',
            budget: '',
            description: 'short',
        };
        var result = index_1.CreateLeadSchema.safeParse(invalidLead);
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)('validates product taxonomy', function () {
        (0, vitest_1.expect)(index_1.ProductTypeSchema.options).toContain('UI_KIT');
        (0, vitest_1.expect)(index_1.ProductTypeSchema.options).toContain('CHEATSHEET_HIGH_LEVEL');
        (0, vitest_1.expect)(index_1.ProductTypeSchema.options).toContain('CHEATSHEET_LOW_LEVEL');
        (0, vitest_1.expect)(index_1.LeadStatusSchema.options).toContain('NEW');
    });
});
