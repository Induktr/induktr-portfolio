import { botManager } from "@/features/telegram-bot/index";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSetup = searchParams.get("setup") === "true";
    const isDelete = searchParams.get("delete") === "true";

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json({
        success: false,
        error: "TELEGRAM_BOT_TOKEN is not configured in environment variables."
      }, { status: 500 });
    }

    botManager.initialize(token, { polling: false });

    // Handle webhook deletion
    if (isDelete) {
      const deleteResult = await botManager.deleteWebhook();
      return NextResponse.json({
        success: true,
        message: "Telegram webhook removed successfully.",
        result: deleteResult
      });
    }

    // Handle webhook setup
    if (isSetup) {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
      const protocol = req.headers.get("x-forwarded-proto") || "https";
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;

      console.log(`[Telegram Webhook Setup] Setting webhook to: ${webhookUrl}`);
      const setupResult = await botManager.setWebHook(webhookUrl);

      return NextResponse.json({
        success: true,
        message: `Webhook configured to: ${webhookUrl}`,
        result: setupResult
      });
    }

    // Diagnostics / Status query
    const webhookInfo = await botManager.getWebhookInfo();
    const client = botManager.getClient();
    let botInfo = null;

    if (client) {
      try {
        botInfo = await client.getMe();
      } catch (err) {
        botInfo = { error: String(err) };
      }
    }

    return NextResponse.json({
      success: true,
      status: "ready",
      bot: botInfo,
      webhook: webhookInfo,
      environment: {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasAdminChatId: !!process.env.TELEGRAM_CHAT_ID,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      },
      instructions: {
        setupWebhook: "Add ?setup=true to this URL to register the webhook with Telegram.",
        removeWebhook: "Add ?delete=true to remove the webhook (e.g. for polling mode)."
      }
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Telegram Webhook GET Error]:", error);

    const isUnauthorized = errorMsg.includes("401") || errorMsg.toLowerCase().includes("unauthorized");

    return NextResponse.json({
      success: false,
      error: errorMsg,
      hint: isUnauthorized
        ? "Telegram Bot API отклонил токен (401 Unauthorized). Проверьте токен в @BotFather в Telegram (команда /token или /revoke) и обновите переменную TELEGRAM_BOT_TOKEN в настройках проекта Vercel (Project Settings -> Environment Variables), после чего сделайте Redeploy."
        : "Проверьте сетевое подключение и переменные окружения."
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("[Telegram Webhook POST] Missing TELEGRAM_BOT_TOKEN");
      return new Response("Missing BOT TOKEN", { status: 500 });
    }

    botManager.initialize(token, { polling: false });

    // Optional secret token verification
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret) {
      const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
      if (secretHeader !== expectedSecret) {
        console.warn("[Telegram Webhook POST] Invalid secret token received.");
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const body = await req.json();
    console.log(`[Telegram Webhook POST] Update ID: ${body.update_id || "none"}`);

    // Pure async dispatch - Vercel will only terminate after this promise resolves
    await botManager.processUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[Telegram Webhook POST Error]:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
