import TelegramBot from "node-telegram-bot-api";

import enData from "../client/src/shared/locales/en.json";
import ruData from "../client/src/shared/locales/ru.json";
import uaData from "../client/src/shared/locales/ua.json";

import { storage } from "./storage";
import { BOT_TRANSLATIONS } from "./shared/constants/bot_i18n";

import { Template, ProjectMarketplaceData } from "./shared/types/template"; 
import { Project } from "@/shared/types/project"; 
import { DocPage, RoadmapStage, VideoResource } from "./shared/types/content";

class TelegramBotManager {
  private bot: TelegramBot | null = null;
  private isInitialized = false;

  constructor() {}

  initialize(token: string, options: { polling?: boolean } = { polling: true }) {
    if (this.isInitialized) return;

    console.log(`Initializing Telegram Bot (${options.polling ? 'Polling' : 'Webhook'} mode)...`);
    this.bot = new TelegramBot(token, { polling: options.polling });

    this.setupListeners();
    this.isInitialized = true;
    console.log("Telegram Bot initialized successfully");
  }

  public processUpdate(update: any) {
    if (this.bot) {
      this.bot.processUpdate(update);
    }
  }

  public async setWebHook(url: string) {
    if (this.bot) {
      await this.bot.setWebHook(url);
      console.log(`✅ Telegram Webhook set to: ${url}`);
    }
  }

  /**
   * Refactoring Goal: "Sterile Display Protocol"
   * Converts basic Markdown symbols to valid Telegram HTML.
   */
  private formatMessage(text: string): string {
    if (!text) return "";
    return text
      .replace(/#+ /g, "") // Remove headers
      .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>") // Bold Italic
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic
      .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // Links
  }

  private MARKETPLACE_RESOURCES: Record<string, Record<string, ProjectMarketplaceData>> = {
    en: (enData as any).marketplaceData,
    ru: (ruData as any).marketplaceData,
    ua: (uaData as any).marketplaceData
  };

  private getTemplates(lang: string): Template[] {
    const data = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
    return data.marketplaceTemplates || [];
  }

  private getProjects(lang: string): Project[] {
    const data = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
    return Object.values(data.projectsData || {});
  }

  private getProductDocs(lang: string): Record<string, DocPage[]> {
    const data = this.MARKETPLACE_RESOURCES[lang] || this.MARKETPLACE_RESOURCES["en"];
    const docs: Record<string, DocPage[]> = {};
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
          docs[key] = value.docs;
        });
    }
    return docs;
  }

  private getProductRoadmaps(lang: string): Record<string, RoadmapStage[]> {
    const data = this.MARKETPLACE_RESOURCES[lang] || this.MARKETPLACE_RESOURCES["en"];
    const roadmaps: Record<string, RoadmapStage[]> = {};
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
          roadmaps[key] = value.roadmap;
        });
    }
    return roadmaps;
  }

  private getProductVideos(lang: string): Record<string, VideoResource[]> {
    const data = this.MARKETPLACE_RESOURCES[lang] || this.MARKETPLACE_RESOURCES["en"];
    const videos: Record<string, VideoResource[]> = {};
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
          videos[key] = value.videos;
        });
    }
    return videos;
  }

  private async t(chatId: string, key: string, params: Record<string, any> = {}): Promise<string> {
    const lang = await storage.getUserLanguage(chatId);
    let str = BOT_TRANSLATIONS[lang]?.[key] || BOT_TRANSLATIONS["en"]?.[key] || key;
    
    Object.keys(params).forEach(p => {
      str = str.replace(new RegExp(`{{${p}}}`, "g"), String(params[p]));
    });
    
    return str;
  }

  private setupListeners() {
    if (!this.bot) return;

    this.bot.onText(/\/lang/, async (msg) => {
      const chatId = msg.chat.id.toString();
      await this.bot?.sendMessage(chatId, await this.t(chatId, "lang_title"), {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "🇺🇸 English", callback_data: "set_lang:en" },
            { text: "🇷🇺 Русский", callback_data: "set_lang:ru" },
            { text: "🇺🇦 Українська", callback_data: "set_lang:ua" }
          ]]
        }
      });
    });

    this.bot.onText(/\/start ?(.+)?/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const accessCode = match ? match[1] : undefined;
      const userName = msg.from?.username || msg.from?.first_name || "User";

      if (!accessCode) {
        await this.bot?.sendMessage(chatId, this.formatMessage(await this.t(chatId, "welcome")), { parse_mode: "HTML" });
        return;
      }

      const lead = await storage.getLeadByAccessCode(accessCode);
      if (!lead) {
        this.bot?.sendMessage(chatId, await this.t(chatId, "invalid_code"));
        return;
      }

      await storage.setLeadTelegramChatId(lead.id, chatId);

      this.bot?.sendMessage(
        chatId, 
        await this.t(chatId, "order_linked", { 
          id: lead.id, 
          type: lead.projectType, 
          deadline: lead.deadline || "???" 
        }),
        { parse_mode: "HTML" }
      );

      const adminChatId = process.env.TELEGRAM_CHAT_ID;
      if (adminChatId) {
        this.bot?.sendMessage(
          adminChatId, 
          await this.t(adminChatId, "lead_connected", {
            id: lead.id,
            name: lead.name,
            user: userName,
            chatId
          }),
          { parse_mode: "HTML" }
        );
      }
    });

    this.bot.onText(/\/marketplace/, async (msg) => {
      await this.sendMarketplace(msg.chat.id.toString());
    });

    this.bot.onText(/\/portfolio/, async (msg) => {
      await this.sendPortfolio(msg.chat.id.toString());
    });

    this.bot.onText(/\/about/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const lang = await storage.getUserLanguage(chatId);
      this.bot?.sendMessage(chatId, await this.t(chatId, "about_title"), { 
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: await this.t(chatId, "philosophy_btn"), callback_data: "philosophy_detail" }
          ]]
        }
      });
    });

    this.bot.onText(/\/faq/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const text = await this.t(chatId, "faq_title");
      await this.bot?.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: await this.t(chatId, "btn_faq_general"), callback_data: "faq_general" }],
            [{ text: await this.t(chatId, "btn_faq_tech"), callback_data: "faq_tech" }],
            [{ text: await this.t(chatId, "btn_faq_payments"), callback_data: "faq_payments" }]
          ]
        }
      });
    });
 
    this.bot.onText(/\/payment/, async (msg) => {
      const chatId = msg.chat.id.toString();
      this.bot?.sendMessage(chatId, await this.t(chatId, "payment_title"), { parse_mode: "HTML" });
    });
 
    this.bot.on("callback_query", async (query) => {
      const data = query.data;
      if (!data) return;
      const chatId = query.message?.chat.id.toString();
      if (!chatId) return;
      const lang = await storage.getUserLanguage(chatId);

      if (data.startsWith("set_lang:")) {
        const langCode = data.split(":")[1];
        await storage.setUserLanguage(chatId, langCode);
        await this.bot?.answerCallbackQuery(query.id, { text: await this.t(chatId, "lang_updated") });
        await this.bot?.sendMessage(chatId, this.formatMessage(await this.t(chatId, "welcome")), { parse_mode: "HTML" });
        return;
      }

      if (data.startsWith("view_template:")) {
        const id = data.split(":")[1];
        const templates = this.getTemplates(lang);
        const t = templates.find((x: any) => x.id === id);
        if (!t) return;

        const message = `🛍️ <b>${t.title}</b>\n\n` +
        `💰 <b>${await this.t(chatId, "label_price")}:</b> $${t.price}\n\n` +
        `📝 <b>${await this.t(chatId, "label_description")}:</b> ${this.formatMessage(t.description)}\n\n` +
        `🛠️ <b>${await this.t(chatId, "label_stack")}:</b> ${t.stack.join(", ")}\n\n` +
        `✨ <b>${await this.t(chatId, "label_features")}:</b>\n${t.features.map((f: string) => `• ${this.formatMessage(f)}`).join("\n")}`;

        const inline_keyboard = [
          [
            { text: "🗺️ " + await this.t(chatId, "roadmap"), callback_data: `show_roadmap:${t.id}` },
            { text: "📚 " + await this.t(chatId, "docs"), callback_data: `show_docs:${t.id}` }
          ],
          [
            { text: "🎬 " + await this.t(chatId, "video"), callback_data: `show_videos:${t.id}` },
            { text: "💳 " + await this.t(chatId, "buy"), callback_data: `buy_template:${t.id}` }
          ],
          [
            { text: "⬅️ " + await this.t(chatId, "back_to_shop"), callback_data: "goto_marketplace" }
          ]
        ];

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("show_roadmap:")) {
        const id = data.split(":")[1];
        const roadmaps = this.getProductRoadmaps(lang);
        const roadmap = roadmaps[id];
        
        if (!roadmap) {
          await this.bot?.answerCallbackQuery(query.id, { text: await this.t(chatId, "roadmap_coming_soon") });
          return;
        }

        let message = (await this.t(chatId, "roadmap_title", { id: id.toUpperCase() })) + "\n\n";
        roadmap.forEach((stage: any) => {
          const statusIcon = stage.status === "completed" ? "✅" : (stage.status === "in-progress" ? "⏳" : "💤");
          message += `${statusIcon} <b>${stage.title}</b>\n`;
          stage.tasks.forEach((task: any) => {
            message += `  ${task.completed ? "🔹" : "▫️"} ${task.label}\n`;
          });
          message += `\n`;
        });

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: "⬅️ " + await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("show_docs:")) {
        const id = data.split(":")[1];
        const docsByLang = this.getProductDocs(lang);
        const docs = docsByLang[id];

        if (!docs) {
          await this.bot?.answerCallbackQuery(query.id, { text: await this.t(chatId, "docs_coming_soon") });
          return;
        }

        let message = await this.t(chatId, "knowledge_base", { id: id.toUpperCase() }) + "\n\n";
        const keyboard = docs.map((page: any) => [
          { text: "📄 " + page.title, callback_data: `show_doc_page:${id}:${page.id}` }
        ]);
        keyboard.push([{ text: "⬅️ " + await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]);

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: keyboard }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("show_doc_page:")) {
        const [, templateId, pageId] = data.split(":");
        const docsByLang = this.getProductDocs(lang);
        const page = docsByLang[templateId]?.find((p: any) => p.id === pageId);

        if (!page) return;

        const formattedContent = this.formatMessage(page.content);

        await this.bot?.sendMessage(chatId, `📄 <b>${page.title}</b>\n\n${formattedContent}`, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: "⬅️ " + await this.t(chatId, "back_to_docs"), callback_data: `show_docs:${templateId}` }]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("show_videos:")) {
        const id = data.split(":")[1];
        const videosByLang = this.getProductVideos(lang);
        const videos = videosByLang[id];

        if (!videos) {
          await this.bot?.answerCallbackQuery(query.id, { text: await this.t(chatId, "video_coming_soon") });
          return;
        }

        let message = `🎬 ` + await this.t(chatId, "video_materials", { id: id.toUpperCase() }) + `\n\n`;
        const watchText = await this.t(chatId, "watch_in_browser");
        const durLabel = await this.t(chatId, "label_duration");
        for (const v of videos) {
          message += `📽️ <b>${v.title}</b>\n`;
          message += `⏱ ${durLabel}: ${v.duration}\n`;
          message += `🔗 <a href="${v.url}">${watchText}</a>\n\n`;
        }

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: "⬅️ " + await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]]
          },
          disable_web_page_preview: false
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("view_project:")) {
        const slug = data.split(":")[1];
        const projectList = await this.getMergedProjects(lang);
        const p = projectList.find((x: any) => x.slug === slug);
        if (!p) return;

        const message = `🚀 <b>${p.title}</b>\n\n` +
        `📍 <b>${await this.t(chatId, "label_status")}:</b> ${p.status}\n` +
        `🏷️ <b>${await this.t(chatId, "label_categories")}:</b> ${p.categories.join(", ")}\n\n` +
        `📝 <b>${await this.t(chatId, "label_about")}:</b> ${this.formatMessage(p.description)}\n\n` +
        `🛠️ <b>${await this.t(chatId, "label_stack")}:</b> ${p.techStack.join(", ")}`;

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[
              { text: "⬅️ " + await this.t(chatId, "back_to_portfolio"), callback_data: "goto_portfolio" }
            ]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data.startsWith("buy_template:")) {
        const slug = data.split(":")[1];
        const templates = await this.getMergedMarketplace(lang);
        const t = templates.find((x: any) => x.slug === slug);
        if (!t) return;

        const message = await this.t(chatId, "buy_purchase_title", {
          title: t.title,
          price: t.price
        });

        await this.bot?.sendMessage(chatId, message, { 
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[
              { text: "⬅️ " + await this.t(chatId, "back_to_marketplace"), callback_data: "goto_marketplace" }
            ]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data === "goto_marketplace") {
        await this.bot?.answerCallbackQuery(query.id);
        await this.sendMarketplace(chatId);
        return;
      }

      if (data === "goto_portfolio") {
        await this.bot?.answerCallbackQuery(query.id);
        await this.sendPortfolio(chatId);
        return;
      }

      if (data === "faq_general") {
        await this.bot?.sendMessage(chatId, await this.t(chatId, "faq_general_title"), { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data === "faq_tech") {
        await this.bot?.sendMessage(chatId, await this.t(chatId, "faq_tech_title"), { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data === "faq_payments") {
        await this.bot?.sendMessage(chatId, await this.t(chatId, "faq_payments_title"), { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      if (data === "philosophy_detail") {
        const philosophyMessage = await this.t(chatId, "philosophy_text");
        await this.bot?.sendMessage(chatId, philosophyMessage, { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      const isApprove = data.startsWith("approve_");
      const isProcess = data.startsWith("process_");
      
      if (!isApprove && !isProcess) {
        if(this.bot) await this.bot.answerCallbackQuery(query.id);
        return;
      }

      const orderId = parseInt(data.replace(isApprove ? "approve_" : "process_", ""));
      const lead = await storage.getLead(orderId);

      if (!lead) {
        if(this.bot) await this.bot.answerCallbackQuery(query.id, { text: await this.t(chatId, "error_order_not_found") });
        return;
      }

      const newStatus = isApprove ? "completed" : "in_progress";
      await storage.updateLeadStatus(orderId, newStatus);

      if (lead.telegramChatId) {
        const clientMsg = isApprove
          ? await this.t(lead.telegramChatId, "payment_approved", { url: lead.materialsUrl || "https://induktr.com/download/example.zip" })
          : await this.t(lead.telegramChatId, "request_in_progress");
        await this.sendNotification(lead.telegramChatId, clientMsg);
      }

      const statusKey = isApprove ? "status_completed" : "status_in_progress";
      const statusVal = await this.t(chatId, statusKey);

      await this.bot?.answerCallbackQuery(query.id, { 
        text: await this.t(chatId, "msg_order_status_updated", { id: orderId, status: statusVal }) 
      });
      
      const statusLabel = await this.t(chatId, "label_status");

      await this.bot?.editMessageText(
        (query.message?.text || "") + `\n\n✅ <b>${statusLabel}: ${statusVal}</b> (${new Date().toLocaleTimeString()})`,
        {
          chat_id: query.message?.chat.id,
          message_id: query.message?.message_id,
          parse_mode: "HTML"
        }
      );
    });

    this.bot.onText(/\/leads/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;
      if (chatId !== adminId) return;

      const leads = await storage.getAllLeads();
      if (leads.length === 0) {
        this.bot?.sendMessage(chatId, await this.t(chatId, "label_order_list_empty"));
        return;
      }

      let response = (await this.t(chatId, "label_list_orders")) + "\n\n";
      const connLabel = await this.t(chatId, "label_connected");
      const statusLabel = await this.t(chatId, "label_status");
      const codeLabel = await this.t(chatId, "label_code");

      for (const l of leads) {
        const typeEmoji = l.orderType === 'template' ? '🛍️' : '🚀';
        const statusEmoji = l.status === 'completed' ? '✅' : (l.status === 'in_progress' ? '⏳' : '💤');
        
        const statusKey = l.status === 'completed' ? 'status_completed' : (l.status === 'in_progress' ? 'status_in_progress' : 'status_new');
        const statusVal = await this.t(chatId, statusKey);

        response += `${typeEmoji} #<b>${l.id}</b> | ${l.name}\n`;
        response += `   <b>${statusLabel}:</b> ${statusEmoji} ${statusVal}\n`;
        response += `   <b>${codeLabel}:</b> <code>${l.accessCode}</code>\n`;
        if (l.telegramChatId) response += `   TG: ${connLabel} ✅\n`;
        response += `-------------------\n`;
      }
      this.bot?.sendMessage(chatId, response, { parse_mode: "HTML" });
    });

    this.bot.onText(/\/ready (\d+) ([^ ]+) ?(.+)?/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;
      if (chatId !== adminId) return;

      const orderId = parseInt(match![1]);
      const url = match![2];
      const customMessage = match![3];

      const lead = await storage.getLead(orderId);
      if (!lead) {
        this.bot?.sendMessage(chatId, await this.t(chatId, "admin_order_not_found", { id: orderId }));
        return;
      }

      await storage.updateLeadStatus(orderId, "completed", url);
      this.bot?.sendMessage(chatId, await this.t(chatId, "admin_order_ready_success", { id: orderId }));

      if (lead.telegramChatId) {
        const commentLabel = await this.t(lead.telegramChatId, "comment_label");
        const clientMsg = await this.t(lead.telegramChatId, "order_ready_client", {
          url,
          custom: customMessage ? `\n\n💬 <b>${commentLabel}:</b>\n<i>${customMessage}</i>` : ""
        });
        await this.sendNotification(lead.telegramChatId, clientMsg);
      }
    });

    this.bot.onText(/\/msg (.+)/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;
      const fullText = match![1].trim();

      const adminMatch = fullText.match(/^(\d+) (.+)/);
      if (chatId === adminId && adminMatch) {
        const orderId = parseInt(adminMatch[1]);
        const messageToClient = adminMatch[2];
        const lead = await storage.getLead(orderId);
        if (!lead || !lead.telegramChatId) {
          this.bot?.sendMessage(chatId, `❌ Cannot send message to order #${orderId}.`);
          return;
        }

        const clientNotification = await this.t(lead.telegramChatId, "dev_msg_client", {
          id: orderId,
          text: messageToClient
        });
        try {
          await this.sendNotification(lead.telegramChatId, clientNotification);
          this.bot?.sendMessage(chatId, await this.t(chatId, "admin_sent_success", { id: orderId }));
        } catch {
          this.bot?.sendMessage(chatId, await this.t(chatId, "admin_send_error"));
        }
        return;
      }

      if (chatId !== adminId) {
        const userName = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "User");
        const leads = await storage.getAllLeads();
        const linkedLead = leads.find(l => l.telegramChatId === chatId);

        if (adminId) {
          const orderLabel = await this.t(adminId, "label_order");
          let adminNotification = await this.t(adminId, "new_msg_admin", {
            user: userName,
            chatId,
            orderInfo: linkedLead ? `📦 <b>${orderLabel}:</b> #${linkedLead.id} [${linkedLead.projectType}]` : "",
            text: fullText,
            orderId: linkedLead?.id || "[ID]"
          });
          
          try {
            await this.bot?.sendMessage(adminId, adminNotification, { parse_mode: "HTML" });
            
            // Forward message notification
            this.bot?.sendMessage(chatId, await this.t(chatId, "msg_sent"), { parse_mode: "HTML" });
          } catch (error) {
            if(error instanceof Error) console.error("Failed to forward/reply client message", error);
          }
        }
        return;
      }
      
      if (chatId === adminId && !adminMatch) {
        this.bot?.sendMessage(chatId, await this.t(chatId, "admin_format"), { parse_mode: "HTML" });
      }
    });

    this.bot.on("polling_error", (error) => {});
  }

  private async getMergedMarketplace(lang: string): Promise<Template[]> {
    const itemMap = new Map<string, Template>();
    const staticData = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
    const staticItems = staticData.marketplaceTemplates || [];

    // 1. Static
    staticItems.forEach((item: any) => {
      itemMap.set(item.id, { ...item, slug: item.id });
    });

    // 2. DB (Overwrite)
    try {
      const dbItems = await storage.getMarketplace();
      dbItems.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[lang] || parsed['en'] || Object.values(parsed)[0];
          if (langData) {
            itemMap.set(row.slug, {
              ...langData,
              id: row.id,
              slug: row.slug,
              isFromDb: true
            });
          }
        } catch (e) {
          if (e instanceof Error) console.error("Failed to parse DB template in bot", e);
        }
      });
    } catch (e) {
      if (e instanceof Error) console.error("Failed to fetch DB marketplace for bot", e);
    }

    return Array.from(itemMap.values());
  }

  private async sendMarketplace(chatId: string) {
    if (!this.bot) return;
    const lang = await storage.getUserLanguage(chatId);
    const message = await this.t(chatId, "marketplace_title");
    const templates = await this.getMergedMarketplace(lang);
    
    const keyboard = templates.map((t: any) => [
      { text: `🛒 ${t.title} - $${t.price}`, callback_data: `buy_template:${t.slug}` }
    ]);

    await this.bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  private async getMergedProjects(lang: string): Promise<Project[]> {
    const projectMap = new Map<string, Project>();
    const staticData = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
    const staticProjects = Object.values(staticData.projectsData || {}) as Project[];

    // 1. Load Static Projects
    staticProjects.forEach(p => {
      const slug = p.slug || p.title.toLowerCase().replace(/ /g, "-");
      projectMap.set(slug, { ...p, slug });
    });

    // 2. Load DB Projects (Overwrite Static)
    try {
      const dbProjects = await storage.getProjects();
      dbProjects.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[lang] || parsed['en'] || Object.values(parsed)[0];
          if (langData) {
            const slug = row.slug;
            projectMap.set(slug, {
              ...langData,
              id: row.id, // Store original ID for numeric lookups if needed, but we use slug
              slug,
              isFromDb: true,
              rawDbData: parsed
            });
          }
        } catch (e) {
          if (e instanceof Error) console.error("Failed to parse DB project in bot", e);
        }
      });
    } catch (e) {
      if (e instanceof Error) console.error("Failed to fetch DB projects for bot", e);
    }

    return Array.from(projectMap.values());
  }

  private async sendPortfolio(chatId: string) {
    if (!this.bot) return;
    const lang = await storage.getUserLanguage(chatId);
    const message = await this.t(chatId, "portfolio_title");
    const projectList = await this.getMergedProjects(lang);
    
    const keyboard = projectList.map((p: any) => [
      { text: `🚀 ${p.title} (${p.status})`, callback_data: `view_project:${p.slug}` }
    ]);

    await this.bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  async sendNotification(telegramChatId: string, message: string) {
    if (!this.bot) return;
    try {
      await this.bot.sendMessage(telegramChatId, message, { parse_mode: "HTML" });
    } catch (error) {
      if(error instanceof Error) console.error(`Failed to send Telegram notification to ${telegramChatId}`, error);
    }
  }
}

export const botManager = new TelegramBotManager();
