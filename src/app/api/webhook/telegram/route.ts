import { botManager } from "@/features/telegram-bot/index";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (process.env.TELEGRAM_BOT_TOKEN) {
      // In serverless, always initialize without polling
      botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    }

    botManager.processUpdate(body);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
