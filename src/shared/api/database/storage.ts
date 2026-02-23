import { leads, userLanguages, users, projects, marketplace, tools, faq, experience, chatHistory, type Lead, type NewLead, type User, type NewUser, type ProjectRow, type NewProjectRow, type MarketplaceRow, type NewMarketplaceRow, type ToolRow, type NewToolRow, type FAQRow, type NewFAQRow, type ExperienceRow, type NewExperienceRow, type ChatMessage } from "./schemas/schema";
import { db } from "./client";
import { eq } from "drizzle-orm";

export interface IStorage {
  createLead(lead: any): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByAccessCode(code: string): Promise<Lead | undefined>;
  updateLeadStatus(id: number, status: string, materialsUrl?: string): Promise<Lead>;
  setLeadTelegramChatId(id: number, chatId: string): Promise<Lead>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getProjects(): Promise<ProjectRow[]>;
  createProject(project: NewProjectRow): Promise<ProjectRow>;
  updateProject(id: number, project: Partial<NewProjectRow>): Promise<ProjectRow>;
  deleteProject(id: number): Promise<void>;
  getMarketplace(): Promise<MarketplaceRow[]>;
  createMarketplaceItem(item: NewMarketplaceRow): Promise<MarketplaceRow>;
  updateMarketplaceItem(id: number, item: Partial<NewMarketplaceRow>): Promise<MarketplaceRow>;
  deleteMarketplaceItem(id: number): Promise<void>;
  getTools(): Promise<ToolRow[]>;
  createTool(tool: NewToolRow): Promise<ToolRow>;
  updateTool(id: number, tool: Partial<NewToolRow>): Promise<ToolRow>;
  deleteTool(id: number): Promise<void>;
  getFAQ(): Promise<FAQRow[]>;
  createFAQ(item: NewFAQRow): Promise<FAQRow>;
  updateFAQ(id: number, item: Partial<NewFAQRow>): Promise<FAQRow>;
  deleteFAQ(id: number): Promise<void>;
  getExperience(): Promise<ExperienceRow[]>;
  createExperience(item: NewExperienceRow): Promise<ExperienceRow>;
  updateExperience(id: number, item: Partial<NewExperienceRow>): Promise<ExperienceRow>;
  deleteExperience(id: number): Promise<void>;
  getUserLanguage(chatId: string): Promise<string | undefined>;
  setUserLanguage(chatId: string, lang: string): Promise<void>;
  addChatMessage(chatId: string, role: string, content: string): Promise<void>;
  getChatHistory(chatId: string): Promise<ChatMessage[]>;
  getAllLeads(): Promise<Lead[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createLead(insertLead: any): Promise<Lead> {
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const [lead] = await db.insert(leads).values({ ...insertLead, accessCode }).returning();
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
    const [lead] = await db
      .update(leads)
      .set({ status, materialsUrl })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async setLeadTelegramChatId(id: number, chatId: string): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ telegramChatId: chatId })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async getProjects(): Promise<ProjectRow[]> {
    return await db.select().from(projects);
  }

  async createProject(project: NewProjectRow): Promise<ProjectRow> {
    const [res] = await db.insert(projects).values(project).returning();
    return res;
  }

  async updateProject(id: number, project: Partial<NewProjectRow>): Promise<ProjectRow> {
    const [res] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return res;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getMarketplace(): Promise<MarketplaceRow[]> {
    return await db.select().from(marketplace);
  }

  async createMarketplaceItem(item: NewMarketplaceRow): Promise<MarketplaceRow> {
    const [res] = await db.insert(marketplace).values(item).returning();
    return res;
  }

  async updateMarketplaceItem(id: number, item: Partial<NewMarketplaceRow>): Promise<MarketplaceRow> {
    const [res] = await db.update(marketplace).set(item).where(eq(marketplace.id, id)).returning();
    return res;
  }

  async deleteMarketplaceItem(id: number): Promise<void> {
    await db.delete(marketplace).where(eq(marketplace.id, id));
  }

  async getTools(): Promise<ToolRow[]> {
    return await db.select().from(tools);
  }

  async createTool(tool: NewToolRow): Promise<ToolRow> {
    const [res] = await db.insert(tools).values(tool).returning();
    return res;
  }

  async updateTool(id: number, tool: Partial<NewToolRow>): Promise<ToolRow> {
    const [res] = await db.update(tools).set(tool).where(eq(tools.id, id)).returning();
    return res;
  }

  async deleteTool(id: number): Promise<void> {
    await db.delete(tools).where(eq(tools.id, id));
  }

  async getFAQ(): Promise<FAQRow[]> {
    return await db.select().from(faq);
  }

  async createFAQ(item: NewFAQRow): Promise<FAQRow> {
    const [res] = await db.insert(faq).values(item).returning();
    return res;
  }

  async updateFAQ(id: number, item: Partial<NewFAQRow>): Promise<FAQRow> {
    const [res] = await db.update(faq).set(item).where(eq(faq.id, id)).returning();
    return res;
  }

  async deleteFAQ(id: number): Promise<void> {
    await db.delete(faq).where(eq(faq.id, id));
  }

  async getExperience(): Promise<ExperienceRow[]> {
    return await db.select().from(experience);
  }

  async createExperience(item: NewExperienceRow): Promise<ExperienceRow> {
    const [res] = await db.insert(experience).values(item).returning();
    return res;
  }

  async updateExperience(id: number, item: Partial<NewExperienceRow>): Promise<ExperienceRow> {
    const [res] = await db.update(experience).set(item).where(eq(experience.id, id)).returning();
    return res;
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }

  async getUserLanguage(chatId: string): Promise<string | undefined> {
    const [record] = await db.select().from(userLanguages).where(eq(userLanguages.chatId, chatId));
    return record?.language;
  }

  async setUserLanguage(chatId: string, language: string): Promise<void> {
    await db.insert(userLanguages)
      .values({ chatId, language })
      .onConflictDoUpdate({
        target: userLanguages.chatId,
        set: { language }
      });
  }

  async addChatMessage(chatId: string, role: string, content: string): Promise<void> {
    await db.insert(chatHistory).values({ chatId, role, content });
  }

  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatHistory).where(eq(chatHistory.chatId, chatId));
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getAllChatIds(): Promise<string[]> {
    const results = await db.select({ chatId: userLanguages.chatId }).from(userLanguages);
    return results.map(r => r.chatId);
  }

  async getUsersCount(): Promise<number> {
    const results = await db.select().from(users);
    return results.length;
  }
}

export const storage = new DatabaseStorage();
