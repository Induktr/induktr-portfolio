import type { Request, Response } from "express";
import { LeadSchema } from "../schemas/lead.schema";
import { storage } from "../../storage";
import { BOT_TRANSLATIONS } from "../constants/bot_i18n";

export const handleSendLead = async (req: Request, res: Response) => {
  try {
    const leadData = LeadSchema.parse(req.body);
    const newLead = await storage.createLead(leadData);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram credentials missing (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const timestamp = new Date().toLocaleString("uk-UA", { 
      timeZone: "Europe/Kiev", 
      hour12: false 
    });

    const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const adminLang = await storage.getUserLanguage(chatId) || "ru";
    const tAdmin = (key: string, params: Record<string, any> = {}) => {
      let str = BOT_TRANSLATIONS[adminLang]?.[key] || BOT_TRANSLATIONS["en"]?.[key] || key;
      Object.keys(params).forEach(p => {
        str = str.replace(new RegExp(`{{${p}}}`, "g"), String(params[p]));
      });
      return str;
    };

    const isPurchase = leadData.orderType === 'template';
    const message = isPurchase 
      ? `${tAdmin("admin_purchase_title", { id: newLead.id })}\n\n` +
        `📦 <b>${tAdmin("label_template")}:</b> ${escapeHtml(String(leadData.templateId || ""))}\n` +
        `👤 <b>${tAdmin("label_client")}:</b> ${escapeHtml(String(leadData.name || ""))}\n` +
        `📧 <b>${tAdmin("label_contact")}:</b> ${escapeHtml(String(leadData.contact || ""))}\n` +
        `💰 <b>${tAdmin("label_amount")}:</b> ${escapeHtml(String(leadData.budget || ""))}$\n` +
        `🔑 <b>${tAdmin("label_code")}:</b> <code>${escapeHtml(String(newLead.accessCode || ""))}</code>\n` +
        `🕒 <b>${tAdmin("label_time")}:</b> ${escapeHtml(timestamp)}`
      : `${tAdmin("admin_lead_title", { id: newLead.id })}\n\n` +
        `👤 <b>${tAdmin("label_client")}:</b> ${escapeHtml(String(leadData.name || ""))}\n` +
        `📧 <b>${tAdmin("label_contact")}:</b> ${escapeHtml(String(leadData.contact || ""))}\n` +
        `💎 <b>${tAdmin("label_type")}:</b> ${escapeHtml(String(leadData.projectType || ""))}\n` +
        `💰 <b>${tAdmin("label_budget")}:</b> ${escapeHtml(String(leadData.budget || ""))}$\n` +
        `📅 <b>${tAdmin("label_deadline")}:</b> ${escapeHtml(String(leadData.deadline || tAdmin("not_specified") || "Не указан"))}\n` +
        `💳 <b>${tAdmin("label_payment")}:</b> ${escapeHtml(String(leadData.paymentMethod || tAdmin("not_selected") || "Не выбрана"))}\n` +
        `📝 <b>${tAdmin("label_task")}:</b> ${escapeHtml(String(leadData.description || ""))}\n` +
        `🔑 <b>${tAdmin("label_code")}:</b> <code>${escapeHtml(String(newLead.accessCode || ""))}</code>\n` +
        `🕒 <b>${tAdmin("label_time")}:</b> ${escapeHtml(timestamp)}`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            isPurchase 
              ? { text: tAdmin("admin_btn_approve"), callback_data: `approve_${newLead.id}` }
              : { text: tAdmin("admin_btn_process"), callback_data: `process_${newLead.id}` }
          ]]
        }
      }),
    });

    const telegramResult = await response.json();

    if (!telegramResult.ok) {
      console.error("Telegram API Error:", telegramResult);
      throw new Error("Failed to send message to Telegram");
    }

    res.json({ 
      success: true, 
      message: "Lead sent successfully",
      orderId: newLead.id,
      accessCode: newLead.accessCode
    });
  } catch (error: any) {
    console.error("Lead submission error:", error);
    if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError") {
      res.status(400).json({ error: "Validation failed", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
