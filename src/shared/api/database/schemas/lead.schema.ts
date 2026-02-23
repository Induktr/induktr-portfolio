import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact (Email or Telegram) is required"),
  projectType: z.enum([
    "Landing Page", 
    "E-commerce", 
    "SaaS", 
    "Bot Development", 
    "Other"
  ], {
    error: "Please select a project type",
  }),
  budget: z.string().min(1, "Budget is required"),
  deadline: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters long").or(z.string().length(0)).optional(),
  paymentMethod: z.string().optional(),
  orderType: z.enum(["custom", "template"]).default("custom"),
  templateId: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending").optional(),
  telegramChatId: z.string().optional(),
  accessCode: z.string().optional(),
  materialsUrl: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export type LeadStatus = 'pending' | 'in_progress' | 'completed';
