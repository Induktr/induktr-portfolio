import TelegramBot from "node-telegram-bot-api";
import enData from "../../shared/locales/en.json";
import ruData from "../../shared/locales/ru.json";
import uaData from "../../shared/locales/ua.json";
import { storage } from "@shared/api/database/storage";
import { BOT_TRANSLATIONS } from "@shared/constants/server/bot_i18n";
import { Template, ProjectMarketplaceData } from "@shared/types/server/template";
import { Project } from "@shared/types/server/project";
import { DocPage, RoadmapStage, VideoResource } from "@shared/types/server/content";

let bot: TelegramBot | null = null;
let isInitialized = false;

const MARKETPLACE_RESOURCES: Record<string, Record<string, ProjectMarketplaceData>> = {
  en: (enData as any).marketplaceData,
  ru: (ruData as any).marketplaceData,
  ua: (uaData as any).marketplaceData
};

const formatMessage = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/#+ /g, "") // Remove headers
    .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>") // Bold Italic
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
    .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic
    .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // Links
};

const getTemplates = (lang: string): Template[] => {
  const data = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
  return data.marketplaceTemplates || [];
};

const getProjects = (lang: string): Project[] => {
  const data = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
  return Object.values(data.projectsData || {});
};

const getProductDocs = (lang: string): Record<string, DocPage[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const docs: Record<string, DocPage[]> = {};
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      docs[key] = value.docs;
    });
  }
  return docs;
};

const getProductRoadmaps = (lang: string): Record<string, RoadmapStage[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const roadmaps: Record<string, RoadmapStage[]> = {};
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      roadmaps[key] = value.roadmap;
    });
  }
  return roadmaps;
};

const getProductVideos = (lang: string): Record<string, VideoResource[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const videos: Record<string, VideoResource[]> = {};
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      videos[key] = value.videos;
    });
  }
  return videos;
};

const t = (key: string, params: Record<string, any> = {}, lang: string = "en"): string => {
  let str = BOT_TRANSLATIONS[lang as keyof typeof BOT_TRANSLATIONS]?.[key] || BOT_TRANSLATIONS["en"]?.[key] || key;

  Object.keys(params).forEach(p => {
    str = str.replace(new RegExp(`{{${p}}}`, "g"), String(params[p]));
  });

  return str;
};

const getMergedMarketplace = async (lang: string): Promise<Template[]> => {
  const itemMap = new Map<string, Template>();
  const staticData = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
  const staticItems = staticData.marketplaceTemplates || [];

  staticItems.forEach((item: any) => {
    itemMap.set(item.id, { ...item, slug: item.id });
  });

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
};

const getMergedProjects = async (lang: string): Promise<Project[]> => {
  const projectMap = new Map<string, Project>();
  const staticData = (lang === 'ru' ? ruData : (lang === 'ua' ? uaData : enData)) as any;
  const staticProjects = Object.values(staticData.projectsData || {}) as Project[];

  staticProjects.forEach(p => {
    const slug = p.slug || p.title.toLowerCase().replace(/ /g, "-");
    projectMap.set(slug, { ...p, slug });
  });

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
            id: row.id,
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
};

const sendMarketplace = async (chatId: string) => {
  if (!bot) return;
  const lang = (await storage.getUserLanguage(chatId)) || "en";
  const message = t("marketplace_title", {}, lang);
  const templates = await getMergedMarketplace(lang);

  const keyboard = templates.map((t: any) => [
    { text: `🛒 ${t.title} - $${t.price}`, callback_data: `buy_template:${t.slug}` }
  ]);

  await bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard }
  });
};

const sendPortfolio = async (chatId: string) => {
  if (!bot) return;
  const lang = (await storage.getUserLanguage(chatId)) || "en";
  const message = t("portfolio_title", {}, lang);
  const projectList = await getMergedProjects(lang);

  const keyboard = projectList.map((p: any) => [
    { text: `🚀 ${p.title} (${p.status})`, callback_data: `view_project:${p.slug}` }
  ]);

  await bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard }
  });
};

// --- Listeners Setup ---

const setupListeners = () => {
  if (!bot) return;

  bot.on('message', (msg) => {
    console.log(`[bot] Message received: "${msg.text}" from ${msg.chat.id}`);
  });

  bot.onText(/\/lang/, async (msg) => {
    console.log(`[bot] Command /lang triggered by ${msg.chat.id}`);
    const chatId = msg.chat.id.toString();
    const lang = (await storage.getUserLanguage(chatId)) || "en";
    await bot?.sendMessage(chatId, t("lang_title", {}, lang), {
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

  bot.onText(/\/start ?(.+)?/, async (msg, match) => {
    console.log(`[bot] Command /start triggered by ${msg.chat.id}`);
    const chatId = msg.chat.id.toString();
    const lang = (await storage.getUserLanguage(chatId)) || "en";
    const accessCode = match ? match[1] : undefined;
    const userName = msg.from?.username || msg.from?.first_name || "User";

    if (!accessCode) {
      await bot?.sendMessage(chatId, formatMessage(t("welcome", {}, lang)), { parse_mode: "HTML" });
      return;
    }

    const lead = await storage.getLeadByAccessCode(accessCode);
    if (!lead) {
      bot?.sendMessage(chatId, t("invalid_code", {}, lang));
      return;
    }

    await storage.setLeadTelegramChatId(lead.id, chatId);

    bot?.sendMessage(
      chatId,
      t("order_linked", {
        id: lead.id,
        type: lead.projectType,
        deadline: lead.deadline || "???"
      }, lang),
      { parse_mode: "HTML" }
    );

    const adminChatId = process.env.TELEGRAM_CHAT_ID;
    if (adminChatId) {
      const adminLang = (await storage.getUserLanguage(adminChatId)) || "en";
      bot?.sendMessage(
        adminChatId,
        t("lead_connected", {
          id: lead.id,
          name: lead.name,
          user: userName,
          chatId
        }, adminLang),
        { parse_mode: "HTML" }
      );
    }
  });

  bot.onText(/\/marketplace/, async (msg) => {
    console.log(`[bot] Command /marketplace triggered by ${msg.chat.id}`);
    await sendMarketplace(msg.chat.id.toString());
  });

  bot.onText(/\/portfolio/, async (msg) => {
    console.log(`[bot] Command /portfolio triggered by ${msg.chat.id}`);
    await sendPortfolio(msg.chat.id.toString());
  });

  bot.onText(/\/about/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const lang = (await storage.getUserLanguage(chatId)) || "en";
    bot?.sendMessage(chatId, t("about_title", {}, lang), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: t("philosophy_btn", {}, lang), callback_data: "philosophy_detail" }
        ]]
      }
    });
  });

  bot.onText(/\/faq/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const lang = (await storage.getUserLanguage(chatId)) || "en";
    const text = t("faq_title", {}, lang);
    await bot?.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: t("btn_faq_general", {}, lang), callback_data: "faq_general" }],
          [{ text: t("btn_faq_tech", {}, lang), callback_data: "faq_tech" }],
          [{ text: t("btn_faq_payments", {}, lang), callback_data: "faq_payments" }]
        ]
      }
    });
  });

  bot.onText(/\/payment/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const lang = (await storage.getUserLanguage(chatId)) || "en";
    bot?.sendMessage(chatId, t("payment_title", {}, lang), { parse_mode: "HTML" });
  });

  bot.on("callback_query", async (query) => {
    const data = query.data;
    if (!data) return;
    const chatId = query.message?.chat.id.toString();
    if (!chatId) return;
    const lang = (await storage.getUserLanguage(chatId)) || "en";

    if (data.startsWith("set_lang:")) {
      const langCode = data.split(":")[1];
      await storage.setUserLanguage(chatId, langCode);
      await bot?.answerCallbackQuery(query.id, { text: t("lang_updated", {}, langCode) });
      await bot?.sendMessage(chatId, formatMessage(t("welcome", {}, langCode)), { parse_mode: "HTML" });
      return;
    }

    if (data.startsWith("view_template:")) {
      const id = data.split(":")[1];
      const templates = getTemplates(lang);
      const temp = templates.find((x: any) => x.id === id);
      if (!temp) return;

      const message = `🛍️ <b>${temp.title}</b>\n\n` +
        `💰 <b>${t("label_price", {}, lang)}:</b> $${temp.price}\n\n` +
        `📝 <b>${t("label_description", {}, lang)}:</b> ${formatMessage(temp.description)}\n\n` +
        `🛠️ <b>${t("label_stack", {}, lang)}:</b> ${temp.stack.join(", ")}\n\n` +
        `✨ <b>${t("label_features", {}, lang)}:</b>\n${temp.features.map((f: string) => `• ${formatMessage(f)}`).join("\n")}`;

      const inline_keyboard = [
        [
          { text: "🗺️ " + t("roadmap", {}, lang), callback_data: `show_roadmap:${temp.id}` },
          { text: "📚 " + t("docs", {}, lang), callback_data: `show_docs:${temp.id}` }
        ],
        [
          { text: "🎬 " + t("video", {}, lang), callback_data: `show_videos:${temp.id}` },
          { text: "💳 " + t("buy", {}, lang), callback_data: `buy_template:${temp.id}` }
        ],
        [
          { text: "⬅️ " + t("back_to_shop", {}, lang), callback_data: "goto_marketplace" }
        ]
      ];

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("show_roadmap:")) {
      const id = data.split(":")[1];
      const roadmaps = getProductRoadmaps(lang);
      const roadmap = roadmaps[id];

      if (!roadmap) {
        await bot?.answerCallbackQuery(query.id, { text: t("roadmap_coming_soon", {}, lang) });
        return;
      }

      let message = t("roadmap_title", { id: id.toUpperCase() }, lang) + "\n\n";
      roadmap.forEach((stage: any) => {
        const statusIcon = stage.status === "completed" ? "✅" : (stage.status === "in-progress" ? "⏳" : "💤");
        message += `${statusIcon} <b>${stage.title}</b>\n`;
        stage.tasks.forEach((task: any) => {
          message += `  ${task.completed ? "🔹" : "▫️"} ${task.label}\n`;
        });
        message += `\n`;
      });

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ " + t("back_to_template", {}, lang), callback_data: `view_template:${id}` }]]
        }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("show_docs:")) {
      const id = data.split(":")[1];
      const docsByLang = getProductDocs(lang);
      const docs = docsByLang[id];

      if (!docs) {
        await bot?.answerCallbackQuery(query.id, { text: t("docs_coming_soon", {}, lang) });
        return;
      }

      let message = t("knowledge_base", { id: id.toUpperCase() }, lang) + "\n\n";
      const keyboard = docs.map((page: any) => [
        { text: "📄 " + page.title, callback_data: `show_doc_page:${id}:${page.id}` }
      ]);
      keyboard.push([{ text: "⬅️ " + t("back_to_template", {}, lang), callback_data: `view_template:${id}` }]);

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("show_doc_page:")) {
      const [, templateId, pageId] = data.split(":");
      const docsByLang = getProductDocs(lang);
      const page = docsByLang[templateId]?.find((p: any) => p.id === pageId);

      if (!page) return;

      const formattedContent = formatMessage(page.content);

      await bot?.sendMessage(chatId, `📄 <b>${page.title}</b>\n\n${formattedContent}`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ " + t("back_to_docs", {}, lang), callback_data: `show_docs:${templateId}` }]]
        }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("show_videos:")) {
      const id = data.split(":")[1];
      const videosByLang = getProductVideos(lang);
      const videos = videosByLang[id];

      if (!videos) {
        await bot?.answerCallbackQuery(query.id, { text: t("video_coming_soon", {}, lang) });
        return;
      }

      let message = `🎬 ` + t("video_materials", { id: id.toUpperCase() }, lang) + `\n\n`;
      const watchText = t("watch_in_browser", {}, lang);
      const durLabel = t("label_duration", {}, lang);
      for (const v of videos) {
        message += `📽️ <b>${v.title}</b>\n`;
        message += `⏱ ${durLabel}: ${v.duration}\n`;
        message += `🔗 <a href="${v.url}">${watchText}</a>\n\n`;
      }

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ " + t("back_to_template", {}, lang), callback_data: `view_template:${id}` }]]
        },
        disable_web_page_preview: false
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("view_project:")) {
      const slug = data.split(":")[1];
      const projectList = await getMergedProjects(lang);
      const proj = projectList.find((x: any) => x.slug === slug);
      if (!proj) return;

      const message = `🚀 <b>${proj.title}</b>\n\n` +
        `📍 <b>${t("label_status", {}, lang)}:</b> ${proj.status}\n` +
        `🏷️ <b>${t("label_categories", {}, lang)}:</b> ${proj.categories.join(", ")}\n\n` +
        `📝 <b>${t("label_about", {}, lang)}:</b> ${formatMessage(proj.description)}\n\n` +
        `🛠️ <b>${t("label_stack", {}, lang)}:</b> ${proj.techStack.join(", ")}`;

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "⬅️ " + t("back_to_portfolio", {}, lang), callback_data: "goto_portfolio" }
          ]]
        }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("buy_template:")) {
      const slug = data.split(":")[1];
      const templates = await getMergedMarketplace(lang);
      const item = templates.find((x: any) => x.slug === slug);
      if (!item) return;

      const message = t("buy_purchase_title", {
        title: item.title,
        price: item.price
      }, lang);

      await bot?.sendMessage(chatId, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "⬅️ " + t("back_to_marketplace", {}, lang), callback_data: "goto_marketplace" }
          ]]
        }
      });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data === "goto_marketplace") {
      await bot?.answerCallbackQuery(query.id);
      await sendMarketplace(chatId);
      return;
    }

    if (data === "goto_portfolio") {
      await bot?.answerCallbackQuery(query.id);
      await sendPortfolio(chatId);
      return;
    }

    if (data === "faq_general") {
      await bot?.sendMessage(chatId, t("faq_general_title", {}, lang), { parse_mode: "HTML" });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data === "faq_tech") {
      await bot?.sendMessage(chatId, t("faq_tech_title", {}, lang), { parse_mode: "HTML" });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data === "faq_payments") {
      await bot?.sendMessage(chatId, t("faq_payments_title", {}, lang), { parse_mode: "HTML" });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    if (data === "philosophy_detail") {
      const philosophyMessage = t("philosophy_text", {}, lang);
      await bot?.sendMessage(chatId, philosophyMessage, { parse_mode: "HTML" });
      await bot?.answerCallbackQuery(query.id);
      return;
    }

    const isApprove = data.startsWith("approve_");
    const isProcess = data.startsWith("process_");

    if (!isApprove && !isProcess) {
      if (bot) await bot.answerCallbackQuery(query.id);
      return;
    }

    const orderId = parseInt(data.replace(isApprove ? "approve_" : "process_", ""));
    const lead = await storage.getLead(orderId);

    if (!lead) {
      if (bot) await bot.answerCallbackQuery(query.id, { text: t("error_order_not_found", {}, lang) });
      return;
    }

    const newStatus = isApprove ? "completed" : "in_progress";
    await storage.updateLeadStatus(orderId, newStatus);

    if (lead.telegramChatId) {
      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const clientMsg = isApprove
        ? t("payment_approved", { url: lead.materialsUrl || "https://induktr.com/download/example.zip" }, clientLang)
        : t("request_in_progress", {}, clientLang);
      await botManager.sendNotification(lead.telegramChatId, clientMsg);
    }

    const statusKey = isApprove ? "status_completed" : "status_in_progress";
    const statusVal = t(statusKey, {}, lang);

    await bot?.answerCallbackQuery(query.id, {
      text: t("msg_order_status_updated", { id: orderId, status: statusVal }, lang)
    });

    const statusLabel = t("label_status", {}, lang);

    await bot?.editMessageText(
      (query.message?.text || "") + `\n\n✅ <b>${statusLabel}: ${statusVal}</b> (${new Date().toLocaleTimeString()})`,
      {
        chat_id: query.message?.chat.id,
        message_id: query.message?.message_id,
        parse_mode: "HTML"
      }
    );
  });

  bot.onText(/\/leads/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const adminId = process.env.TELEGRAM_CHAT_ID;
    if (chatId !== adminId) return;

    const adminLang = (await storage.getUserLanguage(chatId)) || "en";
    const leadList = await storage.getAllLeads();
    if (leadList.length === 0) {
      bot?.sendMessage(chatId, t("label_order_list_empty", {}, adminLang));
      return;
    }

    let response = t("label_list_orders", {}, adminLang) + "\n\n";
    const connLabel = t("label_connected", {}, adminLang);
    const statusLabel = t("label_status", {}, adminLang);
    const codeLabel = t("label_code", {}, adminLang);

    for (const l of leadList) {
      const typeEmoji = l.orderType === 'template' ? '🛍️' : '🚀';
      const statusEmoji = l.status === 'completed' ? '✅' : (l.status === 'in_progress' ? '⏳' : '💤');

      const statusKey = l.status === 'completed' ? 'status_completed' : (l.status === 'in_progress' ? 'status_in_progress' : 'status_new');
      const statusVal = t(statusKey, {}, adminLang);

      response += `${typeEmoji} #<b>${l.id}</b> | ${l.name}\n`;
      response += `   <b>${statusLabel}:</b> ${statusEmoji} ${statusVal}\n`;
      response += `   <b>${codeLabel}:</b> <code>${l.accessCode}</code>\n`;
      if (l.telegramChatId) response += `   TG: ${connLabel} ✅\n`;
      response += `-------------------\n`;
    }
    bot?.sendMessage(chatId, response, { parse_mode: "HTML" });
  });

  bot.onText(/\/ready (\d+) ([^ ]+) ?(.+)?/, async (msg, match) => {
    const chatId = msg.chat.id.toString();
    const adminId = process.env.TELEGRAM_CHAT_ID;
    if (chatId !== adminId) return;

    const adminLang = (await storage.getUserLanguage(chatId)) || "en";
    const orderId = parseInt(match![1]);
    const url = match![2];
    const customMessage = match![3];

    const lead = await storage.getLead(orderId);
    if (!lead) {
      bot?.sendMessage(chatId, t("admin_order_not_found", { id: orderId }, adminLang));
      return;
    }

    await storage.updateLeadStatus(orderId, "completed", url);
    bot?.sendMessage(chatId, t("admin_order_ready_success", { id: orderId }, adminLang));

    if (lead.telegramChatId) {
      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const commentLabel = t("comment_label", {}, clientLang);
      const clientMsg = t("order_ready_client", {
        url,
        custom: customMessage ? `\n\n💬 <b>${commentLabel}:</b>\n<i>${customMessage}</i>` : ""
      }, clientLang);
      await botManager.sendNotification(lead.telegramChatId, clientMsg);
    }
  });

  bot.onText(/\/msg (.+)/, async (msg, match) => {
    const chatId = msg.chat.id.toString();
    const adminId = process.env.TELEGRAM_CHAT_ID;
    const fullText = match![1].trim();
    const lang = (await storage.getUserLanguage(chatId)) || "en";

    const adminMatch = fullText.match(/^(\d+) (.+)/);
    if (chatId === adminId && adminMatch) {
      const orderId = parseInt(adminMatch[1]);
      const messageToClient = adminMatch[2];
      const lead = await storage.getLead(orderId);
      if (!lead || !lead.telegramChatId) {
        bot?.sendMessage(chatId, `❌ Cannot send message to order #${orderId}.`);
        return;
      }

      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const clientNotification = t("dev_msg_client", {
        id: orderId,
        text: messageToClient
      }, clientLang);
      try {
        await botManager.sendNotification(lead.telegramChatId, clientNotification);
        bot?.sendMessage(chatId, t("admin_sent_success", { id: orderId }, lang));
      } catch {
        bot?.sendMessage(chatId, t("admin_send_error", {}, lang));
      }
      return;
    }

    if (chatId !== adminId) {
      const userName = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "User");
      const leads = await storage.getAllLeads();
      const linkedLead = leads.find(l => l.telegramChatId === chatId);

      if (adminId) {
        const adminLang = (await storage.getUserLanguage(adminId)) || "en";
        const orderLabel = t("label_order", {}, adminLang);
        let adminNotification = t("new_msg_admin", {
          user: userName,
          chatId,
          orderInfo: linkedLead ? `📦 <b>${orderLabel}:</b> #${linkedLead.id} [${linkedLead.projectType}]` : "",
          text: fullText,
          orderId: linkedLead?.id || "[ID]"
        }, adminLang);

        try {
          await bot?.sendMessage(adminId, adminNotification, { parse_mode: "HTML" });
          bot?.sendMessage(chatId, t("msg_sent", {}, lang), { parse_mode: "HTML" });
        } catch (error) {
          if (error instanceof Error) console.error("Failed to forward/reply client message", error);
        }
      }
      return;
    }

    if (chatId === adminId && !adminMatch) {
      bot?.sendMessage(chatId, t("admin_format", {}, lang), { parse_mode: "HTML" });
    }
  });

  bot.on("polling_error", (error) => {});
};

// --- API ---

export const botManager = {
  initialize(token: string, options: { polling?: boolean } = { polling: true }) {
    if (isInitialized && bot) return;

    console.log(`[bot] Initializing Telegram Bot (${options.polling ? 'Polling' : 'Webhook'} mode)...`);
    bot = new TelegramBot(token, { polling: options.polling });

    setupListeners();
    isInitialized = true;
    console.log("[bot] Telegram Bot initialized successfully");
  },

  processUpdate(update: any) {
    if (bot) {
      bot.processUpdate(update);
    }
  },

  async setWebHook(url: string) {
    if (bot) {
      await bot.setWebHook(url);
      console.log(`[bot] Telegram Webhook set to: ${url}`);
    }
  },

  async sendNotification(telegramChatId: string, message: string) {
    if (!bot) return;
    try {
      await bot.sendMessage(telegramChatId, message, { parse_mode: "HTML" });
    } catch (error) {
      if (error instanceof Error) console.error(`[bot] Failed to send notification to ${telegramChatId}`, error);
    }
  }
};
