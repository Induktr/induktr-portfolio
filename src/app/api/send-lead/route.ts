import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { botManager } from "@/features/telegram-bot/index";
import { escapeHtml } from "@/shared/utils/services/msg-format";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await storage.createLead(data);

    // Notify Admin via Telegram
    const adminChatId = process.env.TELEGRAM_CHAT_ID;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (adminChatId && token) {
      try {
        botManager.initialize(token, { polling: false });

        const message = `🔔 <b>New Lead Received!</b>\n\n` +
          `👤 <b>Name:</b> ${escapeHtml(lead.name)}\n` +
          `📞 <b>Contact:</b> ${escapeHtml(lead.contact)}\n` +
          `📂 <b>Type:</b> ${escapeHtml(lead.projectType)}\n` +
          `💰 <b>Budget:</b> ${escapeHtml(lead.budget)}\n` +
          `🕒 <b>Deadline:</b> ${escapeHtml(lead.deadline || "Not specified")}\n\n` +
          `💬 <b>Description:</b>\n${escapeHtml(lead.description || "")}\n\n` +
          `🔑 <b>Access Code:</b> <code>${lead.accessCode}</code>`;

        await botManager.sendNotification(adminChatId, message);
      } catch (notifyErr) {
        console.error("[send-lead] Failed to send Telegram notification to admin:", notifyErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      orderId: lead.id, 
      accessCode: lead.accessCode 
    });
  } catch (error) {
    console.error("[send-lead] Failed to process lead request:", error);
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
  }
}
