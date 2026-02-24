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

    console.log(`[bot-webhook] Received POST request. isSetup: ${isSetup}`);

    if (process.env.TELEGRAM_BOT_TOKEN) {
      botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    } else {
      console.error("[bot-webhook] Missing TELEGRAM_BOT_TOKEN");
    }

    if (isSetup) {
      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;
      
      console.log(`[bot-webhook] Setting up webhook to: ${webhookUrl}`);
      await botManager.setWebHook(webhookUrl);
      return NextResponse.json({ success: true, message: `Webhook set to ${webhookUrl}` });
    }

    const body = await req.json();
    console.log(`[bot-webhook] Update body path: ${body.message?.text || body.callback_query?.data || 'unknown'}`);

    await botManager.processUpdate(body);
    
    // In serverless, we might need a small delay or use await if the library supported it
    // But since it doesn't, we just return OK and hope for the best, or use telegraf
    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Telegram Webhook Error:", error.message, error.stack);
    } else {
      console.error("Telegram Webhook Error:", error);
    }
    return new Response(JSON.stringify({ error: String(error) }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
