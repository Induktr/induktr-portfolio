/**
 * Standalone Telegram Bot Polling Worker
 * Designed for Hugging Face Spaces, Docker containers, and local background polling.
 */

import { botManager } from "./index";

async function main() {
  console.log("=========================================");
  console.log("🚀 Starting Telegram Bot Polling Worker...");
  console.log("=========================================");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("❌ ERROR: TELEGRAM_BOT_TOKEN environment variable is not defined.");
    process.exit(1);
  }

  const adminChatId = process.env.TELEGRAM_CHAT_ID;
  if (!adminChatId) {
    console.warn("⚠️ WARNING: TELEGRAM_CHAT_ID is not defined. Admin commands and notifications will be limited.");
  }

  try {
    botManager.initialize(token, { polling: true });
    console.log("✅ Worker initialized and listening for Telegram updates.");

    // Optional startup notification to admin
    if (adminChatId) {
      await botManager.sendNotification(
        adminChatId,
        `🤖 <b>Induktr Bot Worker Started!</b>\n\n` +
        `⚙️ <b>Environment:</b> ${process.env.NODE_ENV || "production"}\n` +
        `🕒 <b>Time:</b> ${new Date().toISOString()}`
      );
    }
  } catch (error) {
    console.error("❌ Fatal error starting bot worker:", error);
    process.exit(1);
  }

  // Graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down worker gracefully...`);
    botManager.stopPolling();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason, promise) => {
    console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("⚠️ Uncaught Exception:", error);
  });
}

main().catch((err) => {
  console.error("Fatal in main worker:", err);
  process.exit(1);
});
