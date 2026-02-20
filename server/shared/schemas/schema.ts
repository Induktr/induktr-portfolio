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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  data: text("data").notNull(), // JSON string containing localized data: { en: {...}, ru: {...}, ua: {...} }
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  data: text("data").notNull(), // JSON string containing localized data
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  data: text("data").notNull(), // JSON string: { en: {...}, ru: {...}, ua: {...} }
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faq = pgTable("faq", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  data: text("data").notNull(), // JSON string: { en: { q, a }, ru: { q, a }, ua: { q, a } }
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  data: text("data").notNull(), // JSON: { en: { role, period, description, catalog }, ... }
  order: integer("order").notNull().default(0),
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory);
export const selectChatHistorySchema = createSelectSchema(chatHistory);
export type ChatMessage = typeof chatHistory.$inferSelect;
export type NewChatMessage = typeof chatHistory.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;

export const insertMarketplaceSchema = createInsertSchema(marketplace);
export const selectMarketplaceSchema = createSelectSchema(marketplace);
export type MarketplaceRow = typeof marketplace.$inferSelect;
export type NewMarketplaceRow = typeof marketplace.$inferInsert;

export const insertToolSchema = createInsertSchema(tools);
export const selectToolSchema = createSelectSchema(tools);
export type ToolRow = typeof tools.$inferSelect;
export type NewToolRow = typeof tools.$inferInsert;

export const insertFAQSchema = createInsertSchema(faq);
export const selectFAQSchema = createSelectSchema(faq);
export type FAQRow = typeof faq.$inferSelect;
export type NewFAQRow = typeof faq.$inferInsert;

export const insertExperienceSchema = createInsertSchema(experience);
export const selectExperienceSchema = createSelectSchema(experience);
export type ExperienceRow = typeof experience.$inferSelect;
export type NewExperienceRow = typeof experience.$inferInsert;
