import { Injectable, Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

export interface TelegramLeadNotification {
  id: string;
  name: string;
  contact: string;
  budget: string;
  description: string;
  serviceType: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string | undefined;
  private readonly chatId: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
  }

  async sendLeadNotification(lead: TelegramLeadNotification, retryCount = 3): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured. Emitting stub notification.',
      );
      return true;
    }

    const message = [
      '⚡ <b>НОВАЯ ЗАЯВКА INDUKTR STUDIO v2.0</b>',
      '──────────────────────────',
      `👤 <b>Клиент:</b> ${this.escapeHtml(lead.name)}`,
      `📞 <b>Контакт:</b> ${this.escapeHtml(lead.contact)}`,
      `💰 <b>Бюджет:</b> ${this.escapeHtml(lead.budget)}`,
      `🛠 <b>Направление:</b> ${this.escapeHtml(lead.serviceType)}`,
      `📝 <b>Описание:</b>\n<blockquote>${this.escapeHtml(lead.description)}</blockquote>`,
      '──────────────────────────',
      `🆔 <code>${lead.id}</code> | 🕒 <i>${new Date().toISOString()}</i>`,
    ].join('\n');

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });

        if (response.ok) {
          this.logger.log(`Telegram notification for lead ${lead.id} delivered successfully.`);
          return true;
        }

        const errorText = await response.text();
        this.logger.warn(`Telegram API attempt ${attempt}/${retryCount} failed: ${errorText}`);
      } catch (err) {
        this.logger.error(
          `Network error during Telegram dispatch (attempt ${attempt}/${retryCount}):`,
          err,
        );
      }

      if (attempt < retryCount) {
        // Exponential backoff
        await new Promise((res) => setTimeout(res, attempt * 500));
      }
    }

    this.logger.error(`Failed to send Telegram notification after ${retryCount} attempts.`);
    return false;
  }

  private escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
