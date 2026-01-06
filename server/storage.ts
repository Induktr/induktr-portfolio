import { leads, userLanguages, type Lead, type NewLead } from "./shared/schemas/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createLead(lead: any): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByAccessCode(code: string): Promise<Lead | undefined>;
  updateLeadStatus(id: number, status: string, materialsUrl?: string): Promise<Lead>;
  setLeadTelegramChatId(id: number, chatId: string): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getUserLanguage(chatId: string): Promise<string>;
  setUserLanguage(chatId: string, lang: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createLead(leadData: any): Promise<Lead> {
    const accessCode = Math.random().toString(36).substring(2, 9).toUpperCase();
    const [lead] = await db.insert(leads).values({
      ...leadData,
      accessCode,
      status: leadData.status || "pending"
    }).returning();
    return lead;
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadByAccessCode(code: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.accessCode, code));
    return lead;
  }

  async updateLeadStatus(id: number, status: string, materialsUrl?: string): Promise<Lead> {
    const [updatedLead] = await db.update(leads)
      .set({ status, ...(materialsUrl && { materialsUrl }) })
      .where(eq(leads.id, id))
      .returning();
    
    if (!updatedLead) throw new Error("Lead not found");
    return updatedLead;
  }

  async setLeadTelegramChatId(id: number, telegramChatId: string): Promise<Lead> {
    const [updatedLead] = await db.update(leads)
      .set({ telegramChatId })
      .where(eq(leads.id, id))
      .returning();
    
    if (!updatedLead) throw new Error("Lead not found");
    return updatedLead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getUserLanguage(chatId: string): Promise<string> {
    const [langEntry] = await db.select().from(userLanguages).where(eq(userLanguages.chatId, chatId));
    return langEntry?.language || "en";
  }

  async setUserLanguage(chatId: string, language: string): Promise<void> {
    await db.insert(userLanguages)
      .values({ chatId, language })
      .onConflictDoUpdate({
        target: userLanguages.chatId,
        set: { language, updatedAt: new Date() }
      });
  }
}

export const storage = new DatabaseStorage();
