import { TelegramClient } from "./telegramClient";
import { dispatchTelegramUpdate } from "./dispatcher";

let clientInstance: TelegramClient | null = null;
let isPollingActive = false;
let pollingAbortController: AbortController | null = null;

const getClient = (token?: string): TelegramClient => {
  const activeToken = token || process.env.TELEGRAM_BOT_TOKEN;
  if (!activeToken) {
    throw new Error("[botManager] TELEGRAM_BOT_TOKEN is not configured.");
  }
  if (!clientInstance) {
    clientInstance = new TelegramClient(activeToken);
  }
  return clientInstance;
};

export const botManager = {
  /**
   * Initializes the bot client instance.
   */
  initialize(token?: string, options: { polling?: boolean } = { polling: false }) {
    const botToken = token || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn("[botManager] Cannot initialize: TELEGRAM_BOT_TOKEN is not set.");
      return;
    }

    clientInstance = new TelegramClient(botToken);
    console.log(`[botManager] Telegram Bot initialized (${options.polling ? "Polling" : "Webhook"} mode).`);

    if (options.polling) {
      this.startPolling();
    }
  },

  /**
   * Returns the underlying TelegramClient.
   */
  getClient(): TelegramClient | null {
    try {
      return getClient();
    } catch {
      return null;
    }
  },

  /**
   * Processes a webhook update.
   * Guarantees 100% async completion for serverless (Vercel) environments.
   */
  async processUpdate(update: any): Promise<void> {
    const client = getClient();
    console.log(`[botManager] Processing update ${update?.update_id || "unknown"}...`);
    try {
      await dispatchTelegramUpdate(update, client);
      console.log(`[botManager] Update ${update?.update_id || "unknown"} processed successfully.`);
    } catch (error) {
      console.error("[botManager] Error processing update:", error);
      throw error;
    }
  },

  /**
   * Sends a direct HTML notification to a Telegram user/admin.
   */
  async sendNotification(telegramChatId: string | number, message: string): Promise<boolean> {
    try {
      const client = getClient();
      await client.sendMessage(telegramChatId, message, { parse_mode: "HTML" });
      return true;
    } catch (error) {
      console.error(`[botManager] Failed to send notification to ${telegramChatId}:`, error);
      return false;
    }
  },

  /**
   * Configures the webhook URL in Telegram.
   */
  async setWebHook(url: string, secretToken?: string): Promise<any> {
    const client = getClient();
    const result = await client.setWebhook(url, secretToken);
    console.log(`[botManager] Telegram Webhook set to: ${url}`);
    return result;
  },

  /**
   * Retrieves current webhook info from Telegram.
   */
  async getWebhookInfo(): Promise<any> {
    const client = getClient();
    return await client.getWebhookInfo();
  },

  /**
   * Removes current webhook from Telegram (required before starting polling).
   */
  async deleteWebhook(dropPendingUpdates = false): Promise<any> {
    const client = getClient();
    return await client.deleteWebhook(dropPendingUpdates);
  },

  /**
   * Starts long-polling worker loop (for Hugging Face Spaces / Docker / local dev).
   */
  async startPolling(): Promise<void> {
    if (isPollingActive) {
      console.log("[botManager] Polling is already running.");
      return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("[botManager] Cannot start polling: TELEGRAM_BOT_TOKEN missing.");
      return;
    }

    const client = getClient(token);
    isPollingActive = true;
    pollingAbortController = new AbortController();

    console.log("[botManager] Removing existing webhook before starting polling...");
    try {
      await client.deleteWebhook();
    } catch (e) {
      console.warn("[botManager] Warning while deleting webhook:", e);
    }

    console.log("[botManager] Long-polling worker started.");

    let offset = 0;
    const signal = pollingAbortController.signal;

    const pollLoop = async () => {
      while (isPollingActive && !signal.aborted) {
        try {
          const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=25`, {
            signal
          });

          if (!response.ok) {
            console.error(`[botManager] getUpdates HTTP error ${response.status}`);
            await new Promise(r => setTimeout(r, 3000));
            continue;
          }

          const data = await response.json();
          if (data.ok && Array.isArray(data.result)) {
            for (const update of data.result) {
              offset = update.update_id + 1;
              try {
                await dispatchTelegramUpdate(update, client);
              } catch (dispatchErr) {
                console.error(`[botManager] Error in update ${update.update_id}:`, dispatchErr);
              }
            }
          }
        } catch (err) {
          if (signal.aborted) break;
          console.error("[botManager] Polling error (will retry in 3s):", err);
          await new Promise(r => setTimeout(r, 3000));
        }
      }
      console.log("[botManager] Polling loop stopped.");
    };

    pollLoop();
  },

  /**
   * Stops the long-polling loop gracefully.
   */
  stopPolling() {
    if (!isPollingActive) return;
    isPollingActive = false;
    if (pollingAbortController) {
      pollingAbortController.abort();
      pollingAbortController = null;
    }
    console.log("[botManager] Polling stopped.");
  }
};
