import type { Request, Response } from "express";
import { LeadSchema } from "../schemas/lead.schema";
import { storage } from "../../storage";

export default async function handleSendLead(req: Request, res: Response) {
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

    const isPurchase = leadData.orderType === 'template';
    const message = isPurchase 
      ? `🛍️ **Покупка шаблона #${newLead.id}!**\n\n` +
        `📦 **Шаблон:** ${leadData.templateId}\n` +
        `👤 **Клиент:** ${leadData.name}\n` +
        `📧 **Контакт:** ${leadData.contact}\n` +
        `💰 **Сумма:** ${leadData.budget}$\n` +
        `🔑 **Код доступа:** \`${newLead.accessCode}\`\n` +
        `🕒 **Время:** ${timestamp}`
      : `🚀 **Новая заявка #${newLead.id}!**\n\n` +
        `👤 **Клиент:** ${leadData.name}\n` +
        `📧 **Контакт:** ${leadData.contact}\n` +
        `💎 **Тип:** ${leadData.projectType}\n` +
        `💰 **Бюджет:** ${leadData.budget}$\n` +
        `📅 **Дедлайн:** ${leadData.deadline ? leadData.deadline : "Не указан"}\n` +
        `💳 **Оплата:** ${leadData.paymentMethod || "Не выбрана"}\n` +
        `📝 **Задача:** ${leadData.description}\n` +
        `🔑 **Код доступа:** \`${newLead.accessCode}\`\n` +
        `🕒 **Время:** ${timestamp}`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[
            isPurchase 
              ? { text: "✅ Подтвердить и отправить файлы", callback_data: `approve_${newLead.id}` }
              : { text: "⏳ Взять в работу", callback_data: `process_${newLead.id}` }
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
    if (error.name === "ZodError") {
      res.status(400).json({ error: "Validation failed", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
