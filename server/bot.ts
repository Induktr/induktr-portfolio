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

  initialize(token: string) {
    if (this.isInitialized) return;

    console.log("Initializing Telegram Bot...");
    // Create a bot that uses 'polling' to fetch new updates
    this.bot = new TelegramBot(token, { polling: true });

    this.setupListeners();
    this.isInitialized = true;
    console.log("Telegram Bot initialized successfully");
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
    Object.entries(data).forEach(([key, value]) => {
      docs[key] = value.docs;
    });
    return docs;
  }

  private getProductRoadmaps(lang: string): Record<string, RoadmapStage[]> {
    const data = this.MARKETPLACE_RESOURCES[lang] || this.MARKETPLACE_RESOURCES["en"];
    const roadmaps: Record<string, RoadmapStage[]> = {};
    Object.entries(data).forEach(([key, value]) => {
      roadmaps[key] = value.roadmap;
    });
    return roadmaps;
  }

  private getProductVideos(lang: string): Record<string, VideoResource[]> {
    const data = this.MARKETPLACE_RESOURCES[lang] || this.MARKETPLACE_RESOURCES["en"];
    const videos: Record<string, VideoResource[]> = {};
    Object.entries(data).forEach(([key, value]) => {
      videos[key] = value.videos;
    });
    return videos;
  }

  private async t(chatId: string, key: string, params: Record<string, any> = {}): Promise<string> {
    const lang = await storage.getUserLanguage(chatId);
    let str = BOT_TRANSLATIONS[lang]?.[key] || BOT_TRANSLATIONS["en"]?.[key] || key;
    
    // Replace {{param}} with actual values
    Object.keys(params).forEach(p => {
      str = str.replace(new RegExp(`{{${p}}}`, "g"), String(params[p]));
    });
    
    return str;
  }

  private setupListeners() {
    if (!this.bot) return;

    // Language change command
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

    // Listen for /start command
    this.bot.onText(/\/start ?(.+)?/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const accessCode = match ? match[1] : undefined;
      const userName = msg.from?.username || msg.from?.first_name || "User";

      if (!accessCode) {
        await this.bot?.sendMessage(chatId, await this.t(chatId, "welcome"), { parse_mode: "HTML" });
        return;
      }

      // Try to find lead by access code
      const lead = await storage.getLeadByAccessCode(accessCode);

      if (!lead) {
        this.bot?.sendMessage(chatId, await this.t(chatId, "invalid_code"));
        return;
      }

      // Link chat_id to lead
      await storage.setLeadTelegramChatId(lead.id, chatId);

      // Notify User
      this.bot?.sendMessage(
        chatId, 
        await this.t(chatId, "order_linked", { 
          id: lead.id, 
          type: lead.projectType, 
          deadline: lead.deadline || "???" 
        }),
        { parse_mode: "HTML" }
      );

      // Notify Admin
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

    // Marketplace command
    this.bot.onText(/\/marketplace/, async (msg) => {
      await this.sendMarketplace(msg.chat.id.toString());
    });

    // Portfolio command
    this.bot.onText(/\/portfolio/, async (msg) => {
      await this.sendPortfolio(msg.chat.id.toString());
    });

    // /about command
    this.bot.onText(/\/about/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const lang = await storage.getUserLanguage(chatId);
      this.bot?.sendMessage(chatId, await this.t(chatId, "about_title"), { 
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: lang === 'ru' ? "📖 Философия Induktr" : (lang === 'ua' ? "📖 Філософія Induktr" : "📖 Induktr Philosophy"), callback_data: "philosophy_detail" }
          ]]
        }
      });
    });

    // /faq command
    this.bot.onText(/\/faq/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const lang = await storage.getUserLanguage(chatId);
      const text = await this.t(chatId, "faq_title");
      
      const generalBtn = lang === 'ru' ? "🌐 Общие" : (lang === 'ua' ? "🌐 Загальні" : "🌐 General");
      const techBtn = lang === 'ru' ? "🛠️ Технические" : (lang === 'ua' ? "🛠️ Технічні" : "🛠️ Technical");
      const paymentsBtn = lang === 'ru' ? "💳 Оплата" : (lang === 'ua' ? "💳 Оплата" : "💳 Payments");

      await this.bot?.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: generalBtn, callback_data: "faq_general" }],
            [{ text: techBtn, callback_data: "faq_tech" }],
            [{ text: paymentsBtn, callback_data: "faq_payments" }]
          ]
        }
      });
    });
 
    // /payment command
    this.bot.onText(/\/payment/, async (msg) => {
      const chatId = msg.chat.id.toString();
      this.bot?.sendMessage(chatId, await this.t(chatId, "payment_title"), { parse_mode: "HTML" });
    });
 
    // Handle button clicks
    this.bot.on("callback_query", async (query) => {
      const data = query.data;
      if (!data) return;
      const chatId = query.message?.chat.id.toString();
      if (!chatId) return;
      const lang = await storage.getUserLanguage(chatId);

      // Set Language
      if (data.startsWith("set_lang:")) {
        const langCode = data.split(":")[1];
        await storage.setUserLanguage(chatId, langCode);
        await this.bot?.answerCallbackQuery(query.id, { text: "Language updated!" });
        // Resend welcome
        await this.bot?.sendMessage(chatId, await this.t(chatId, "welcome"), { parse_mode: "HTML" });
        return;
      }

      // Template Details
      if (data.startsWith("view_template:")) {
        const id = data.split(":")[1];
        const templates = this.getTemplates(lang);
        const t = templates.find((x: any) => x.id === id);
        if (!t) return;

        const message = `🛍️ <b>${t.title}</b>\n\n` +
        `💰 <b>${lang === 'ru' ? 'Цена' : (lang === 'ua' ? 'Ціна' : 'Price')}:</b> $${t.price}\n\n` +
        `📝 <b>${lang === 'ru' ? 'Описание' : (lang === 'ua' ? 'Опис' : 'Desc')}:</b> ${t.description}\n\n` +
        `🛠️ <b>${lang === 'ru' ? 'Стек' : (lang === 'ua' ? 'Стек' : 'Stack')}:</b> ${t.stack.join(", ")}\n\n` +
        `✨ <b>${lang === 'ru' ? 'Фичи' : (lang === 'ua' ? 'Фічі' : 'Features')}:</b>\n${t.features.map((f: string) => `• ${f}`).join("\n")}`;

        const inline_keyboard = [
          [
            { text: await this.t(chatId, "roadmap"), callback_data: `show_roadmap:${t.id}` },
            { text: await this.t(chatId, "docs"), callback_data: `show_docs:${t.id}` }
          ],
          [
            { text: await this.t(chatId, "video"), callback_data: `show_videos:${t.id}` },
            { text: await this.t(chatId, "buy"), callback_data: `buy_template:${t.id}` }
          ],
          [
            { text: await this.t(chatId, "back_to_shop"), callback_data: "goto_marketplace" }
          ]
        ];

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Show Roadmap
      if (data.startsWith("show_roadmap:")) {
        const id = data.split(":")[1];
        const roadmaps = this.getProductRoadmaps(lang);
        const roadmap = roadmaps[id];
        
        if (!roadmap) {
          await this.bot?.answerCallbackQuery(query.id, { text: "Roadmap coming soon!" });
          return;
        }

        let message = await this.t(chatId, "roadmap_of", { id });
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
            inline_keyboard: [[{ text: await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Show Docs List
      if (data.startsWith("show_docs:")) {
        const id = data.split(":")[1];
        const docsByLang = this.getProductDocs(lang);
        const docs = docsByLang[id];

        if (!docs) {
          await this.bot?.answerCallbackQuery(query.id, { text: "Docs coming soon..." });
          return;
        }

        let message = await this.t(chatId, "knowledge_base", { id });
        const keyboard = docs.map((page: any) => [
          { text: page.title, callback_data: `show_doc_page:${id}:${page.id}` }
        ]);
        keyboard.push([{ text: await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]);

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: keyboard }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Show Specific Doc Page
      if (data.startsWith("show_doc_page:")) {
        const [, templateId, pageId] = data.split(":");
        const docsByLang = this.getProductDocs(lang);
        const page = docsByLang[templateId]?.find((p: any) => p.id === pageId);

        if (!page) return;

        // Simplified Markdown for Telegram
        const cleanContent = page.content
          .replace(/#+ /g, "")
          .replace(/\*\*/g, "<b>").replace(/\*\*/g, "</b>")
          .replace(/`/g, "<code>");

        await this.bot?.sendMessage(chatId, `📖 <b>${page.title}</b>\n\n${cleanContent}`, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: await this.t(chatId, "back_to_docs"), callback_data: `show_docs:${templateId}` }]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Show Videos
      if (data.startsWith("show_videos:")) {
        const id = data.split(":")[1];
        const videosByLang = this.getProductVideos(lang);
        const videos = videosByLang[id];

        if (!videos) {
          await this.bot?.answerCallbackQuery(query.id, { text: "Videos coming soon!" });
          return;
        }

        let message = await this.t(chatId, "video_materials", { id });
        const watchText = await this.t(chatId, "watch_in_browser");
        const durText = lang === 'ru' ? 'Длительность' : (lang === 'ua' ? 'Тривалість' : 'Duration');
        for (const v of videos) {
          message += `🎬 <b>${v.title}</b>\n`;
          message += `⏱ ${durText}: ${v.duration}\n`;
          message += `🔗 <a href="${v.url}">${watchText}</a>\n\n`;
        }

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: await this.t(chatId, "back_to_template"), callback_data: `view_template:${id}` }]]
          },
          disable_web_page_preview: false
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Project Details
      if (data.startsWith("view_project:")) {
        const id = parseInt(data.split(":")[1]);
        const projectList = this.getProjects(lang);
        const p = projectList.find((x: any) => x.id === id);
        if (!p) return;

        const message = `🚀 <b>${p.title}</b>\n\n` +
        `📍 <b>${lang === 'ru' ? 'Статус' : (lang === 'ua' ? 'Статус' : 'Status')}:</b> ${p.status}\n` +
        `🏷️ <b>${lang === 'ru' ? 'Категории' : (lang === 'ua' ? 'Категорії' : 'Cats')}:</b> ${p.categories.join(", ")}\n\n` +
        `📝 <b>${lang === 'ru' ? 'О проекте' : (lang === 'ua' ? 'Про проєкт' : 'About')}:</b> ${p.description}\n\n` +
        `🛠️ <b>${lang === 'ru' ? 'Стек' : (lang === 'ua' ? 'Стек' : 'Stack')}:</b> ${p.techStack.join(", ")}`;

        await this.bot?.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[
              { text: await this.t(chatId, "back_to_portfolio"), callback_data: "goto_portfolio" }
            ]]
          }
        });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Buy Action
      if (data.startsWith("buy_template:")) {
        const id = data.split(":")[1];
        const templates = this.getTemplates(lang);
        const t = templates.find((x: any) => x.id === id);
        if (!t) return;

        const message = await this.t(chatId, "buy_purchase_title", {
          title: t.title,
          price: t.price
        });

        await this.bot?.sendMessage(chatId, message, { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // Navigation
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

      // FAQ Categories
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

      // 1. Handle Philosophy Detail Button
      if (data === "philosophy_detail") {
        const detailMessageEn = 
          `📓 <b>Induktr Deep Philosophy</b>\n\n` +
          `<b>1. Digital Asset Principle (Principle 10)</b>\n` +
          `BrainMessenger is not just a project, it's a \"living system\", an investment in the professional future.\n\n` +
          `<b>2. Independence Capital</b>\n` +
          `The goal of $10,000 is not money for expenses, but a strategic lever.\n\n` +
          `<b>3. Thinking Operating System</b>\n` +
          `I apply the \"Value Extraction Protocol\": synthesizing mental models from quality insights.\n\n` +
          `<b>4. Over-delivery</b>\n` +
          `In work with clients, I follow the \"Antifragile Authority\" principle.\n\n` +
          `✨ <i>\"Simplify the complex. Build the scalable. Believe in the system approach.\"</i>`;

        const detailMessageRu = 
          `📓 <b>Глубинная Философия Induktr</b>\n\n` +
          `<b>1. Принцип Цифрового Актива (Принцип 10)</b>\n` +
          `BrainMessenger — это не просто проект, это "живая система", инвестиция в профессиональное будущее.\n\n` +
          `<b>2. Капитал Независимости</b>\n` +
          `Цель в $10,000 — это не деньги на расходы, а стратегический рычаг.\n\n` +
          `<b>3. Операционная Система Мышления</b>\n` +
          `Я применяю "Протокол Извлечения Ценности": синтезирую ментальные модели из качественных инсайтов.\n\n` +
          `<b>4. Сверх-доставка (Over-delivery)</b>\n` +
          `В работе с клиентами я следую принципу "Антихрупкого авторитета".\n\n` +
          `✨ <i>\"Упрощаю сложное. Строю масштабируемое. Верю в системный подход.\"</i>`;

        const detailMessageUa = 
          `📓 <b>Глибинна Філософія Induktr</b>\n\n` +
          `<b>1. Принцип Цифрового Активу (Принцип 10)</b>\n` +
          `BrainMessenger — це не просто проєкт, це "жива система", інвестиція у професійне майбутнє.\n\n` +
          `<b>2. Капітал Незалежності</b>\n` +
          `Мета у $10,000 — це не гроші на витрати, а стратегічний важіль.\n\n` +
          `<b>3. Операційна Система Мислення</b>\n` +
          `Я застосовую "Протокол Вилучення Цінності": синтезую ментальні моделі з якісних інсайтів.\n\n` +
          `<b>4. Сверх-доставка (Over-delivery)</b>\n` +
          `У роботі з клієнтами я керуюся принципом "Антихрупкого авторитету".\n\n` +
          `✨ <i>\"Спрощую складне. Будую масштабоване. Вірю в системний підхід.\"</i>`;

        const message = lang === 'ru' ? detailMessageRu : (lang === 'ua' ? detailMessageUa : detailMessageEn);

        await this.bot?.sendMessage(chatId, message, { parse_mode: "HTML" });
        await this.bot?.answerCallbackQuery(query.id);
        return;
      }

      // 2. Handle Admin Approval/Process Buttons
      const isApprove = data.startsWith("approve_");
      const isProcess = data.startsWith("process_");
      
      if (!isApprove && !isProcess) {
        if(this.bot) {
          await this.bot.answerCallbackQuery(query.id);
        }
        return;
      }

      const orderId = parseInt(data.replace(isApprove ? "approve_" : "process_", ""));
      const lead = await storage.getLead(orderId);

      if (!lead) {
        if(this.bot) {
          await this.bot.answerCallbackQuery(query.id, { text: "❌ Order not found" });
        }
        return;
      }

      // Update status
      const newStatus = isApprove ? "completed" : "in_progress";
      await storage.updateLeadStatus(orderId, newStatus);

      // Notify Client if they have linked Telegram
      if (lead.telegramChatId) {
        const clientLang = await storage.getUserLanguage(lead.telegramChatId);
        const clientMessageEn = isApprove
          ? `🎁 <b>Payment confirmed!</b>\n\nThank you for purchase. Here is materials link:\n🔗 ${lead.materialsUrl || "https://induktr.com/download/example.zip"}\n\nIf you have questions, write to /msg.`
          : `⚡ <b>Your application is in progress!</b>\n\nWe started studying the details of your project. Soon we will contact you.\n\nThanks for choosing us!`;
        
        const clientMessageRu = isApprove
          ? `🎁 <b>Оплата подтверждена!</b>\n\nСпасибо за покупку. Вот ваша ссылка на материалы:\n🔗 ${lead.materialsUrl || "https://induktr.com/download/example.zip"}\n\nЕсли у вас есть вопросы, пишите в /msg.`
          : `⚡ <b>Ваша заявка принята в работу!</b>\n\nМы начали изучение деталей вашего проекта. Скоро мы свяжемся с вами.\n\nСпасибо, что выбрали нас!`;

        const clientMessageUa = isApprove
          ? `🎁 <b>Оплата підтверджена!</b>\n\nДякуємо за покупку. Ось ваше посилання на матеріали:\n🔗 ${lead.materialsUrl || "https://induktr.com/download/example.zip"}\n\nЯкщо у вас є питання, пишіть в /msg.`
          : `⚡ <b>Ваша заявка прийнята в роботу!</b>\n\nМи почали вивчення деталей вашого проєкту. Скоро ми зв'яжемося з вами.\n\nДякуємо, що обрали нас!`;

        const finalClientMsg = clientLang === 'ru' ? clientMessageRu : (clientLang === 'ua' ? clientMessageUa : clientMessageEn);
        await this.sendNotification(lead.telegramChatId, finalClientMsg);
      }

      // Feedback to Admin
      const statusText = isApprove ? "APPROVED & COMPLETED" : "IN PROGRESS";
      await this.bot?.answerCallbackQuery(query.id, { text: `✅ Order #${orderId} marked as ${statusText}` });
      await this.bot?.editMessageText(
        (query.message?.text || "") + `\n\n✅ <b>STATUS: ${statusText}</b> (${new Date().toLocaleTimeString()})`,
        {
          chat_id: query.message?.chat.id,
          message_id: query.message?.message_id,
          parse_mode: "HTML"
        }
      );
    });

    // Admin Commands
    this.bot.onText(/\/leads/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;

      if (chatId !== adminId) return;

      const leads = await storage.getAllLeads();
      if (leads.length === 0) {
        this.bot?.sendMessage(chatId, "📭 Order list is empty.");
        return;
      }

      let response = "📋 <b>List of all orders:</b>\n\n";
      leads.forEach(l => {
        const typeEmoji = l.orderType === 'template' ? '🛍️' : '🚀';
        const statusEmoji = l.status === 'completed' ? '✅' : (l.status === 'in_progress' ? '⏳' : '💤');
        
        response += `${typeEmoji} #<b>${l.id}</b> | ${l.name}\n`;
        response += `   Status: ${statusEmoji} ${l.status}\n`;
        response += `   Code: <code>${l.accessCode}</code>\n`;
        if (l.telegramChatId) response += `   TG: Connected ✅\n`;
        response += `-------------------\n`;
      });

      this.bot?.sendMessage(chatId, response, { parse_mode: "HTML" });
    });

    // /ready [id] [url] [optional_message]
    this.bot.onText(/\/ready (\d+) ([^ ]+) ?(.+)?/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;

      if (chatId !== adminId) return;

      const orderId = parseInt(match![1]);
      const url = match![2];
      const customMessage = match![3];

      const lead = await storage.getLead(orderId);
      if (!lead) {
        this.bot?.sendMessage(chatId, `❌ Order #${orderId} not found.`);
        return;
      }

      await storage.updateLeadStatus(orderId, "completed", url);
      this.bot?.sendMessage(chatId, `✅ Order #${orderId} marked as ready.`);

      if (lead.telegramChatId) {
        const clientLang = await storage.getUserLanguage(lead.telegramChatId);
        const commText = clientLang === 'ru' ? 'Комментарий' : (clientLang === 'ua' ? 'Коментар' : 'Comment');
        const clientMsg = await this.t(lead.telegramChatId, "order_ready_client", {
          url,
          custom: customMessage ? `\n\n💬 <b>${commText}:</b>\n<i>${customMessage}</i>` : ""
        });
        await this.sendNotification(lead.telegramChatId, clientMsg);
      }
    });

    // Unified Message Command (/msg)
    this.bot.onText(/\/msg (.+)/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const adminId = process.env.TELEGRAM_CHAT_ID;
      const fullText = match![1].trim();

      // CASE 1: Admin
      const adminMatch = fullText.match(/^(\d+) (.+)/);
      if (chatId === adminId && adminMatch) {
        const orderId = parseInt(adminMatch[1]);
        const messageToClient = adminMatch[2];
        const lead = await storage.getLead(orderId);
        if (!lead || !lead.telegramChatId) {
          this.bot?.sendMessage(chatId, `❌ Cannot send message to order #${orderId}.`);
          return;
        }

        const clientLang = await storage.getUserLanguage(lead.telegramChatId);
        const prefix = clientLang === 'ru' ? 'Сообщение от разработчика' : (clientLang === 'ua' ? 'Повідомлення від розробника' : 'Message from developer');
        const replyHint = clientLang === 'ru' ? 'Чтобы ответить, используйте' : (clientLang === 'ua' ? 'Щоб відповісти, використовуйте' : 'To reply, use');
        const urText = clientLang === 'ru' ? 'Ваш текст' : (clientLang === 'ua' ? 'Ваш текст' : 'Your text');

        const clientNotification = `📧 <b>${prefix} (#${orderId}):</b>\n\n` +
        `"${messageToClient}"\n\n` +
        `<i>${replyHint}:</i> <code>/msg ${urText}</code>`;

        try {
          await this.sendNotification(lead.telegramChatId, clientNotification);
          this.bot?.sendMessage(chatId, `✅ Sent to client #${orderId}.`);
        } catch {
          this.bot?.sendMessage(chatId, `❌ Send error.`);
        }
        return;
      }

      // CASE 2: Client
      if (chatId !== adminId) {
        const userName = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "User");
        const leads = await storage.getAllLeads();
        const linkedLead = leads.find(l => l.telegramChatId === chatId);

        if (adminId) {
          let adminNotification = await this.t(adminId, "new_msg_admin", {
            user: userName,
            chatId,
            orderInfo: linkedLead ? `📦 <b>Order:</b> #${linkedLead.id} [${linkedLead.projectType}]` : "",
            text: fullText,
            orderId: linkedLead?.id || "[ID]"
          });

          try {
            await this.bot?.sendMessage(adminId, adminNotification, { parse_mode: "HTML" });
            this.bot?.sendMessage(chatId, await this.t(chatId, "msg_sent"), { parse_mode: "HTML" });
          } catch (error) {
            if(error instanceof Error) {
              console.error("Failed to forward client message", error);
            }
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

  private async sendMarketplace(chatId: string) {
    if (!this.bot) return;
    const lang = await storage.getUserLanguage(chatId);
    const message = await this.t(chatId, "marketplace_title");
    const templatesList = this.getTemplates(lang);
    const keyboard = templatesList.map((t: any) => [
      { text: `${t.title} — $${t.price}`, callback_data: `view_template:${t.id}` }
    ]);
    await this.bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  private async sendPortfolio(chatId: string) {
    if (!this.bot) return;
    const lang = await storage.getUserLanguage(chatId);
    const message = await this.t(chatId, "portfolio_title");
    const projectList = this.getProjects(lang);
    const keyboard = projectList.map((p: any) => [
      { text: `🚀 ${p.title} (${p.status})`, callback_data: `view_project:${p.id}` }
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
      if(error instanceof Error) {
        console.error(`Failed to send Telegram notification to ${telegramChatId}`, error);
      }
    }
  }
}

export const botManager = new TelegramBotManager();
