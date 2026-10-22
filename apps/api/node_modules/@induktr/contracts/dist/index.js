"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusSchema = exports.ProductTypeSchema = exports.UserRoleSchema = exports.CreateLeadSchema = exports.LeadStatusSchema = void 0;
var zod_1 = require("zod");
// ==========================================
// 1. LEAD DOMAIN CONTRACTS
// ==========================================
exports.LeadStatusSchema = zod_1.z.enum([
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'IN_PROGRESS',
    'COMPLETED',
    'REJECTED',
]);
exports.CreateLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    contact: zod_1.z.string().min(3, 'Contact handle/email required').max(150),
    budget: zod_1.z.string().min(1, 'Budget is required'),
    description: zod_1.z.string().min(5, 'Brief description required').max(2000),
    serviceType: zod_1.z.string().default('FULL_CYCLE_ENGINEERING'),
    referrer: zod_1.z.string().optional(),
    idempotencyKey: zod_1.z.string().uuid().optional(),
});
// ==========================================
// 2. USER & OMNICHANNEL AUTH CONTRACTS
// ==========================================
exports.UserRoleSchema = zod_1.z.enum(['CLIENT', 'STUDIO_LEAD', 'ADMIN']);
// ==========================================
// 3. PRODUCTS & E-COMMERCE CONTRACTS
// ==========================================
exports.ProductTypeSchema = zod_1.z.enum([
    'UI_KIT',
    'CHEATSHEET_HIGH_LEVEL',
    'CHEATSHEET_LOW_LEVEL',
    'CONSULTATION_AUDIT',
]);
exports.OrderStatusSchema = zod_1.z.enum(['PENDING', 'PAID', 'DELIVERED', 'CANCELLED']);
