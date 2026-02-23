import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { botManager } from "@/features/telegram-bot/index";
import { BOT_TRANSLATIONS } from "@/shared/constants/server/bot_i18n";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await storage.createLead(data);

    // Notify Admin via Telegram
    const adminChatId = process.env.TELEGRAM_CHAT_ID;
    if (adminChatId && process.env.TELEGRAM_BOT_TOKEN) {
      botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      
      const adminLang = "en"; // Admin usually gets en
      // Use fallback translation if needed
      const t = BOT_TRANSLATIONS[adminLang]?.["new_lead_admin"] || "New Lead Received!";
      
      const message = `🔔 <b>New Lead Received!</b>\n\n` +
        `👤 <b>Name:</b> ${lead.name}\n` +
        `📞 <b>Contact:</b> ${lead.contact}\n` +
        `📂 <b>Type:</b> ${lead.projectType}\n` +
        `💰 <b>Budget:</b> ${lead.budget}\n` +
        `🕒 <b>Deadline:</b> ${lead.deadline || "Not specified"}\n\n` +
        `💬 <b>Description:</b>\n${lead.description}\n\n` +
        `🔑 <b>Access Code:</b> <code>${lead.accessCode}</code>`;

      await botManager.sendNotification(adminChatId, message);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: lead.id, 
      accessCode: lead.accessCode 
    });
  } catch (error) {
    console.error("Failed to send lead:", error);
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
  }
}
