import { Lead, LeadStatus } from "./shared/schemas/lead.schema";

export interface IStorage {
  createLead(lead: Lead): Promise<Lead & { id: number }>;
  getLead(id: number): Promise<(Lead & { id: number }) | undefined>;
  getLeadByAccessCode(code: string): Promise<(Lead & { id: number }) | undefined>;
  updateLeadStatus(id: number, status: LeadStatus, materialsUrl?: string): Promise<Lead & { id: number }>;
  setLeadTelegramChatId(id: number, chatId: string): Promise<Lead & { id: number }>;
  getAllLeads(): Promise<(Lead & { id: number })[]>;
  getUserLanguage(chatId: string): Promise<string>;
  setUserLanguage(chatId: string, lang: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private leads: Map<number, Lead & { id: number }>;
  private userLanguages: Map<string, string>;
  private currentId: number;

  constructor() {
    this.leads = new Map();
    this.userLanguages = new Map();
    this.currentId = 1;
  }

  async createLead(leadData: Lead): Promise<Lead & { id: number }> {
    const id = this.currentId++;
    const accessCode = Math.random().toString(36).substring(2, 9).toUpperCase();
    const lead = { 
      ...leadData, 
      id, 
      accessCode, 
      status: (leadData.status || "pending") as LeadStatus 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLead(id: number): Promise<(Lead & { id: number }) | undefined> {
    return this.leads.get(id);
  }

  async getLeadByAccessCode(code: string): Promise<(Lead & { id: number }) | undefined> {
    return Array.from(this.leads.values()).find(l => l.accessCode === code);
  }

  async updateLeadStatus(id: number, status: LeadStatus, materialsUrl?: string): Promise<Lead & { id: number }> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { ...lead, status, ...(materialsUrl && { materialsUrl }) };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async setLeadTelegramChatId(id: number, telegramChatId: string): Promise<Lead & { id: number }> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { ...lead, telegramChatId };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async getAllLeads(): Promise<(Lead & { id: number })[]> {
    return Array.from(this.leads.values());
  }

  async getUserLanguage(chatId: string): Promise<string> {
    return this.userLanguages.get(chatId) || "en";
  }

  async setUserLanguage(chatId: string, lang: string): Promise<void> {
    this.userLanguages.set(chatId, lang);
  }
}

export const storage = new MemStorage();
