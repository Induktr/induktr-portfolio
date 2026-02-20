import { leads, userLanguages, users, projects, marketplace, tools, faq, experience, chatHistory, type Lead, type NewLead, type User, type NewUser, type ProjectRow, type NewProjectRow, type MarketplaceRow, type NewMarketplaceRow, type ToolRow, type NewToolRow, type FAQRow, type NewFAQRow, type ExperienceRow, type NewExperienceRow, type ChatMessage } from "./shared/schemas/schema";
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
  
  // User auth methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: NewUser): Promise<User>;
  getUsersCount(): Promise<number>;

  // Project management methods
  getProjects(): Promise<ProjectRow[]>;
  createProject(project: NewProjectRow): Promise<ProjectRow>;
  updateProject(id: number, project: Partial<NewProjectRow>): Promise<ProjectRow>;
  deleteProject(id: number): Promise<void>;

  // Marketplace management methods
  getMarketplace(): Promise<MarketplaceRow[]>;
  createMarketplaceItem(item: NewMarketplaceRow): Promise<MarketplaceRow>;
  updateMarketplaceItem(id: number, item: Partial<NewMarketplaceRow>): Promise<MarketplaceRow>;
  deleteMarketplaceItem(id: number): Promise<void>;

  // Tools management methods
  getTools(): Promise<ToolRow[]>;
  createTool(tool: NewToolRow): Promise<ToolRow>;
  updateTool(id: number, tool: Partial<NewToolRow>): Promise<ToolRow>;
  deleteTool(id: number): Promise<void>;

  // FAQ management methods
  getFAQ(): Promise<FAQRow[]>;
  createFAQ(item: NewFAQRow): Promise<FAQRow>;
  updateFAQ(id: number, item: Partial<NewFAQRow>): Promise<FAQRow>;
  deleteFAQ(id: number): Promise<void>;

  // Experience management methods
  getExperience(): Promise<ExperienceRow[]>;
  createExperience(item: NewExperienceRow): Promise<ExperienceRow>;
  updateExperience(id: number, item: Partial<NewExperienceRow>): Promise<ExperienceRow>;
  deleteExperience(id: number): Promise<void>;
  
  // Chat history methods
  addChatMessage(chatId: string, role: string, content: string): Promise<ChatMessage>;
  getChatHistory(chatId: string, limit?: number): Promise<ChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // ... existing methods ...
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUsersCount(): Promise<number> {
    const allUsers = await db.select().from(users);
    return allUsers.length;
  }

  async getProjects(): Promise<ProjectRow[]> {
    return await db.select().from(projects);
  }

  async createProject(project: NewProjectRow): Promise<ProjectRow> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<NewProjectRow>): Promise<ProjectRow> {
    const [updatedProject] = await db.update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    if (!updatedProject) throw new Error("Project not found");
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getMarketplace(): Promise<MarketplaceRow[]> {
    return await db.select().from(marketplace);
  }

  async createMarketplaceItem(item: NewMarketplaceRow): Promise<MarketplaceRow> {
    const [newItem] = await db.insert(marketplace).values(item).returning();
    return newItem;
  }

  async updateMarketplaceItem(id: number, item: Partial<NewMarketplaceRow>): Promise<MarketplaceRow> {
    const [updatedItem] = await db.update(marketplace)
      .set(item)
      .where(eq(marketplace.id, id))
      .returning();
    if (!updatedItem) throw new Error("Marketplace item not found");
    return updatedItem;
  }

  async deleteMarketplaceItem(id: number): Promise<void> {
    await db.delete(marketplace).where(eq(marketplace.id, id));
  }

  async getTools(): Promise<ToolRow[]> {
    return await db.select().from(tools);
  }

  async createTool(tool: NewToolRow): Promise<ToolRow> {
    const [newTool] = await db.insert(tools).values(tool).returning();
    return newTool;
  }

  async updateTool(id: number, tool: Partial<NewToolRow>): Promise<ToolRow> {
    const [updatedTool] = await db.update(tools)
      .set(tool)
      .where(eq(tools.id, id))
      .returning();
    if (!updatedTool) throw new Error("Tool not found");
    return updatedTool;
  }

  async deleteTool(id: number): Promise<void> {
    await db.delete(tools).where(eq(tools.id, id));
  }

  async getFAQ(): Promise<FAQRow[]> {
    return await db.select().from(faq);
  }

  async createFAQ(item: NewFAQRow): Promise<FAQRow> {
    const [newItem] = await db.insert(faq).values(item).returning();
    return newItem;
  }

  async updateFAQ(id: number, item: Partial<NewFAQRow>): Promise<FAQRow> {
    const [updatedItem] = await db.update(faq)
      .set(item)
      .where(eq(faq.id, id))
      .returning();
    if (!updatedItem) throw new Error("FAQ item not found");
    return updatedItem;
  }

  async deleteFAQ(id: number): Promise<void> {
    await db.delete(faq).where(eq(faq.id, id));
  }

  async getExperience(): Promise<ExperienceRow[]> {
    return await db.select().from(experience);
  }

  async createExperience(item: NewExperienceRow): Promise<ExperienceRow> {
    const [newItem] = await db.insert(experience).values(item).returning();
    return newItem;
  }

  async updateExperience(id: number, item: Partial<NewExperienceRow>): Promise<ExperienceRow> {
    const [updatedItem] = await db.update(experience)
      .set(item)
      .where(eq(experience.id, id))
      .returning();
    if (!updatedItem) throw new Error("Experience item not found");
    return updatedItem;
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }

  // Chat history implementation
  async addChatMessage(chatId: string, role: string, content: string): Promise<ChatMessage> {
    const [msg] = await db.insert(chatHistory).values({
      chatId,
      role,
      content
    }).returning();
    return msg;
  }

  async getChatHistory(chatId: string, limit: number = 20): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatHistory)
      .where(eq(chatHistory.chatId, chatId))
      .orderBy(chatHistory.createdAt)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
