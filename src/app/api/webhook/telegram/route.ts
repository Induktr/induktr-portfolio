import { botManager } from "@/features/telegram-bot/index";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSetup = searchParams.get('setup') === 'true';

    if (isSetup && process.env.TELEGRAM_BOT_TOKEN) {
      botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      
      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;
      
      await botManager.setWebHook(webhookUrl);
      return NextResponse.json({ success: true, message: `Webhook set to ${webhookUrl}` });
    }
    
    return NextResponse.json({ success: false, message: "Use ?setup=true to configure webhook" });
  } catch (error) {
    console.error("Telegram Setup GET Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSetup = searchParams.get('setup') === 'true';

    if (process.env.TELEGRAM_BOT_TOKEN) {
      // In serverless, always initialize without polling
      botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    }

    if (isSetup) {
      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;
      
      await botManager.setWebHook(webhookUrl);
      return NextResponse.json({ success: true, message: `Webhook set to ${webhookUrl}` });
    }

    const body = await req.json();
    botManager.processUpdate(body);
    
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
