import { z } from 'zod';

export const LeadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
]);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const CreateLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contact: z.string().min(3, 'Contact handle/email required').max(150),
  budget: z.string().min(1, 'Budget is required'),
  description: z.string().min(5, 'Brief description required').max(2000),
  serviceType: z.string().default('FULL_CYCLE_ENGINEERING'),
  referrer: z.string().optional(),
  idempotencyKey: z.string().uuid().optional(),
});
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

export interface LeadResponse {
  id: string;
  name: string;
  contact: string;
  budget: string;
  description: string;
  status: LeadStatus;
  createdAt: string;
}

export const UserRoleSchema = z.enum(['CLIENT', 'STUDIO_LEAD', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export interface TelegramInitDataUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface UserProfile {
  id: string;
  telegramId: string | null;
  username: string | null;
  firstName: string | null;
  email: string | null;
  role: UserRole;
  createdAt: string;
}

export const ProductTypeSchema = z.enum([
  'UI_KIT',
  'CHEATSHEET_HIGH_LEVEL',
  'CHEATSHEET_LOW_LEVEL',
  'CONSULTATION_AUDIT',
]);
export type ProductType = z.infer<typeof ProductTypeSchema>;

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  priceUsd: number;
  description: string;
  features: string[];
}

export const OrderStatusSchema = z.enum(['PENDING', 'PAID', 'DELIVERED', 'CANCELLED']);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export interface PurchaseContract {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  amountUsd: number;
  downloadUrl?: string;
  status: OrderStatus;
  purchasedAt: string;
}

export interface CustomOrderContract {
  id: string;
  userId: string;
  title: string;
  budgetUsd: number;
  status: OrderStatus;
  milestones: { title: string; completed: boolean }[];
  createdAt: string;
}
