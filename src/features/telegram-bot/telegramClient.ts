/**
 * Direct Telegram Bot API Client
 * Designed for predictable serverless and worker environments with full Promise lifecycle.
 */

export interface SendMessageOptions {
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: any;
  disable_web_page_preview?: boolean;
}

export interface AnswerCallbackOptions {
  text?: string;
  show_alert?: boolean;
  url?: string;
  cache_time?: number;
}

export interface EditMessageOptions {
  chat_id?: string | number;
  message_id?: number;
  inline_message_id?: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: any;
}

export class TelegramClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    const cleanToken = (token || "").trim().replace(/^["']|["']$/g, "");
    this.token = cleanToken;
    this.baseUrl = `https://api.telegram.org/bot${cleanToken}`;
  }

  private async callApi<T = any>(method: string, payload: Record<string, any> = {}): Promise<T> {
    if (!this.token) {
      throw new Error("[TelegramClient] Bot token is missing.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${this.baseUrl}/${method}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(`Telegram API [${method}] Error ${data.error_code}: ${data.description}`);
      }

      return data.result as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Telegram API [${method}] request timed out after 10s`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async sendMessage(chatId: string | number, text: string, options: SendMessageOptions = {}): Promise<any> {
    try {
      return await this.callApi("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: options.parse_mode,
        reply_markup: options.reply_markup,
        disable_web_page_preview: options.disable_web_page_preview
      });
    } catch (error) {
      // If HTML entity parsing fails, fallback to sending as plain text to avoid dropped messages
      if (options.parse_mode && String(error).includes("can't parse entities")) {
        console.warn(`[TelegramClient] HTML parsing failed for chatId ${chatId}. Retrying with plain text...`);
        const plainText = text.replace(/<[^>]*>?/gm, "");
        return await this.callApi("sendMessage", {
          chat_id: chatId,
          text: plainText,
          reply_markup: options.reply_markup,
          disable_web_page_preview: options.disable_web_page_preview
        });
      }
      throw error;
    }
  }

  async answerCallbackQuery(callbackQueryId: string, options: AnswerCallbackOptions = {}): Promise<any> {
    try {
      return await this.callApi("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
        text: options.text,
        show_alert: options.show_alert,
        url: options.url,
        cache_time: options.cache_time
      });
    } catch (error) {
      console.error(`[TelegramClient] Failed to answer callback query ${callbackQueryId}:`, error);
      return null;
    }
  }

  async editMessageText(text: string, options: EditMessageOptions): Promise<any> {
    try {
      return await this.callApi("editMessageText", {
        chat_id: options.chat_id,
        message_id: options.message_id,
        inline_message_id: options.inline_message_id,
        text,
        parse_mode: options.parse_mode,
        reply_markup: options.reply_markup
      });
    } catch (error) {
      if (options.parse_mode && String(error).includes("can't parse entities")) {
        console.warn(`[TelegramClient] HTML parsing failed during editMessageText. Retrying with plain text...`);
        const plainText = text.replace(/<[^>]*>?/gm, "");
        return await this.callApi("editMessageText", {
          chat_id: options.chat_id,
          message_id: options.message_id,
          inline_message_id: options.inline_message_id,
          text: plainText,
          reply_markup: options.reply_markup
        });
      }
      console.error("[TelegramClient] Failed to edit message:", error);
      return null;
    }
  }

  async setWebhook(url: string, secretToken?: string): Promise<any> {
    const payload: Record<string, any> = { url };
    if (secretToken) payload.secret_token = secretToken;
    return await this.callApi("setWebhook", payload);
  }

  async getWebhookInfo(): Promise<any> {
    return await this.callApi("getWebhookInfo");
  }

  async deleteWebhook(dropPendingUpdates = false): Promise<any> {
    return await this.callApi("deleteWebhook", { drop_pending_updates: dropPendingUpdates });
  }

  async getMe(): Promise<any> {
    return await this.callApi("getMe");
  }
}
