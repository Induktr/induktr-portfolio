import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  projectType: text("project_type").notNull(),
  budget: text("budget").notNull(),
  deadline: text("deadline"),
  description: text("description"),
  paymentMethod: text("payment_method"),
  orderType: text("order_type").notNull().default("custom"),
  templateId: text("template_id"),
  status: text("status").notNull().default("pending"),
  telegramChatId: text("telegram_chat_id"),
  accessCode: text("access_code").notNull(),
  materialsUrl: text("materials_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const userLanguages = pgTable("user_languages", {
  chatId: text("chat_id").primaryKey(),
  language: text("language").notNull().default("en"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
