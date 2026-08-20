import { TelegramClient } from "./telegramClient";
import { storage } from "@/shared/api/database/storage";
import { BOT_TRANSLATIONS, MARKETPLACE_RESOURCES } from "@/shared/constants/server/bot_i18n";
import { Template } from "@/shared/types/server/template";
import { Project } from "@/shared/types/server/project";
import { DocPage, RoadmapStage, VideoResource } from "@/shared/types/server/content";
import { formatMessage } from "@/shared/utils/services/msg-format";

import enData from "@/shared/locales/en.json";
import ruData from "@/shared/locales/ru.json";
import uaData from "@/shared/locales/ua.json";

export const getTemplates = (lang: string): Template[] => {
  const data = (lang === "ru" ? ruData : (lang === "ua" ? uaData : enData)) as any;
  return data.marketplaceTemplates || [];
};

export const getProjects = (lang: string): Project[] => {
  const data = (lang === "ru" ? ruData : (lang === "ua" ? uaData : enData)) as any;
  return Object.values(data.projectsData || {});
};

export const getProductDocs = (lang: string): Record<string, DocPage[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const docs: Record<string, DocPage[]> = {};

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      docs[key] = value.docs;
    });
  }

  return docs;
};

export const getProductRoadmaps = (lang: string): Record<string, RoadmapStage[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const roadmaps: Record<string, RoadmapStage[]> = {};

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      roadmaps[key] = value.roadmap;
    });
  }

  return roadmaps;
};

export const getProductVideos = (lang: string): Record<string, VideoResource[]> => {
  const data = MARKETPLACE_RESOURCES[lang] || MARKETPLACE_RESOURCES["en"];
  const videos: Record<string, VideoResource[]> = {};

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      videos[key] = value.videos;
    });
  }

  return videos;
};

export const t = (key: string, params: Record<string, any> = {}, lang: string = "en"): string => {
  let str = BOT_TRANSLATIONS[lang as keyof typeof BOT_TRANSLATIONS]?.[key] || BOT_TRANSLATIONS["en"]?.[key] || key;

  Object.keys(params).forEach(p => {
    str = str.replace(new RegExp(`{{${p}}}`, "g"), String(params[p]));
  });

  return str;
};

export const getMergedMarketplace = async (lang: string): Promise<Template[]> => {
  const itemMap = new Map<string, Template>();
  const staticData = (lang === "ru" ? ruData : (lang === "ua" ? uaData : enData)) as any;
  const staticItems = staticData.marketplaceTemplates || [];

  staticItems.forEach((item: any) => {
    itemMap.set(item.id, { ...item, slug: item.id });
  });

  try {
    const dbItems = await storage.getMarketplace();
    dbItems.forEach(row => {
      try {
        const parsed = JSON.parse(row.data);
        const langData = parsed[lang] || parsed["en"] || Object.values(parsed)[0];

        if (langData) {
          itemMap.set(row.slug, {
            ...langData,
            id: row.id,
            slug: row.slug,
            isFromDb: true
          });
        }
      } catch (e) {
        if (e instanceof Error) console.error("Failed to parse DB template in bot:", e);
      }
    });
  } catch (e) {
    if (e instanceof Error) console.error("Failed to fetch DB marketplace for bot:", e);
  }

  return Array.from(itemMap.values());
};

export const getMergedProjects = async (lang: string): Promise<Project[]> => {
  const projectMap = new Map<string, Project>();
  const staticData = (lang === "ru" ? ruData : (lang === "ua" ? uaData : enData)) as any;
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
        const langData = parsed[lang] || parsed["en"] || Object.values(parsed)[0];

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
        if (e instanceof Error) console.error("Failed to parse DB project in bot:", e);
      }
    });
  } catch (e) {
    if (e instanceof Error) console.error("Failed to fetch DB projects for bot:", e);
  }

  return Array.from(projectMap.values());
};

export const sendMarketplace = async (client: TelegramClient, chatId: string): Promise<void> => {
  const lang = (await storage.getUserLanguage(chatId)) || "en";
  const message = t("marketplace_title", {}, lang);
  const templates = await getMergedMarketplace(lang);

  const keyboard = templates.map((tmpl: any) => [
    { text: `🛒 ${tmpl.title} - $${tmpl.price}`, callback_data: `buy_template:${tmpl.slug}` }
  ]);

  await client.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard }
  });
};

export const sendPortfolio = async (client: TelegramClient, chatId: string): Promise<void> => {
  const lang = (await storage.getUserLanguage(chatId)) || "en";
  const message = t("portfolio_title", {}, lang);
  const projectList = await getMergedProjects(lang);

  const keyboard = projectList.map((p: any) => [
    { text: `🚀 ${p.title} (${p.status})`, callback_data: `view_project:${p.slug}` }
  ]);

  await client.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard }
  });
};

/**
 * Dispatches an incoming Telegram update.
 * Guarantees that all async DB queries and API calls are fully resolved before returning.
 */
export const dispatchTelegramUpdate = async (update: any, client: TelegramClient): Promise<void> => {
  if (!update) return;

  // Handle Callback Queries
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query, client);
    return;
  }

  // Handle Messages
  if (update.message) {
    await handleMessage(update.message, client);
    return;
  }
};

const handleMessage = async (msg: any, client: TelegramClient): Promise<void> => {
  const text = msg.text?.trim();
  const chatId = msg.chat?.id?.toString();
  const adminId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId || !text) return;

  console.log(`[dispatcher] Message from ${chatId}: "${text}"`);
  const lang = (await storage.getUserLanguage(chatId)) || "en";

  // /start [code]
  if (text.startsWith("/start")) {
    const match = text.match(/^\/start(?:\s+(.+))?$/);
    const accessCode = match ? match[1]?.trim() : undefined;
    const userName = msg.from?.username || msg.from?.first_name || "User";

    if (!accessCode) {
      await client.sendMessage(chatId, formatMessage(t("welcome", {}, lang)), { parse_mode: "HTML" });
      return;
    }

    const lead = await storage.getLeadByAccessCode(accessCode);
    if (!lead) {
      await client.sendMessage(chatId, t("invalid_code", {}, lang));
      return;
    }

    await storage.setLeadTelegramChatId(lead.id, chatId);

    await client.sendMessage(
      chatId,
      t("order_linked", {
        id: lead.id,
        type: lead.projectType,
        deadline: lead.deadline || "???"
      }, lang),
      { parse_mode: "HTML" }
    );

    if (adminId) {
      const adminLang = (await storage.getUserLanguage(adminId)) || "en";
      await client.sendMessage(
        adminId,
        t("lead_connected", {
          id: lead.id,
          name: lead.name,
          user: userName,
          chatId
        }, adminLang),
        { parse_mode: "HTML" }
      );
    }
    return;
  }

  // /lang
  if (text === "/lang") {
    await client.sendMessage(chatId, t("lang_title", {}, lang), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "🇺🇸 English", callback_data: "set_lang:en" },
          { text: "🇷🇺 Русский", callback_data: "set_lang:ru" },
          { text: "🇺🇦 Українська", callback_data: "set_lang:ua" }
        ]]
      }
    });
    return;
  }

  // /marketplace
  if (text === "/marketplace") {
    await sendMarketplace(client, chatId);
    return;
  }

  // /portfolio
  if (text === "/portfolio") {
    await sendPortfolio(client, chatId);
    return;
  }

  // /about
  if (text === "/about") {
    await client.sendMessage(chatId, t("about_title", {}, lang), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: t("philosophy_btn", {}, lang), callback_data: "philosophy_detail" }
        ]]
      }
    });
    return;
  }

  // /faq
  if (text === "/faq") {
    await client.sendMessage(chatId, t("faq_title", {}, lang), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: t("btn_faq_general", {}, lang), callback_data: "faq_general" }],
          [{ text: t("btn_faq_tech", {}, lang), callback_data: "faq_tech" }],
          [{ text: t("btn_faq_payments", {}, lang), callback_data: "faq_payments" }]
        ]
      }
    });
    return;
  }

  // /payment
  if (text === "/payment") {
    await client.sendMessage(chatId, t("payment_title", {}, lang), { parse_mode: "HTML" });
    return;
  }

  // /leads (Admin Only)
  if (text === "/leads" && chatId === adminId) {
    const adminLang = (await storage.getUserLanguage(chatId)) || "en";
    const leadList = await storage.getAllLeads();

    if (leadList.length === 0) {
      await client.sendMessage(chatId, t("label_order_list_empty", {}, adminLang));
      return;
    }

    let response = t("label_list_orders", {}, adminLang) + "\n\n";
    const connLabel = t("label_connected", {}, adminLang);
    const statusLabel = t("label_status", {}, adminLang);
    const codeLabel = t("label_code", {}, adminLang);

    for (const l of leadList) {
      const typeEmoji = l.orderType === "template" ? "🛍️" : "🚀";
      const statusEmoji = l.status === "completed" ? "✅" : (l.status === "in_progress" ? "⏳" : "💤");
      const statusKey = l.status === "completed" ? "status_completed" : (l.status === "in_progress" ? "status_in_progress" : "status_new");
      const statusVal = t(statusKey, {}, adminLang);

      response += `${typeEmoji} #<b>${l.id}</b> | ${l.name}\n`;
      response += `   <b>${statusLabel}:</b> ${statusEmoji} ${statusVal}\n`;
      response += `   <b>${codeLabel}:</b> <code>${l.accessCode}</code>\n`;
      if (l.telegramChatId) response += `   TG: ${connLabel} ✅\n`;
      response += `-------------------\n`;
    }

    await client.sendMessage(chatId, response, { parse_mode: "HTML" });
    return;
  }

  // /ready <orderId> <url> [customMessage] (Admin Only)
  const readyMatch = text.match(/^\/ready\s+(\d+)\s+([^\s]+)(?:\s+(.+))?$/);
  if (readyMatch && chatId === adminId) {
    const adminLang = (await storage.getUserLanguage(chatId)) || "en";
    const orderId = parseInt(readyMatch[1]);
    const url = readyMatch[2];
    const customMessage = readyMatch[3];

    const lead = await storage.getLead(orderId);
    if (!lead) {
      await client.sendMessage(chatId, t("admin_order_not_found", { id: orderId }, adminLang));
      return;
    }

    await storage.updateLeadStatus(orderId, "completed", url);
    await client.sendMessage(chatId, t("admin_order_ready_success", { id: orderId }, adminLang));

    if (lead.telegramChatId) {
      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const commentLabel = t("comment_label", {}, clientLang);
      const clientMsg = t("order_ready_client", {
        url,
        custom: customMessage ? `\n\n💬 <b>${commentLabel}:</b>\n<i>${customMessage}</i>` : ""
      }, clientLang);
      await client.sendMessage(lead.telegramChatId, clientMsg, { parse_mode: "HTML" });
    }
    return;
  }

  // /msg [orderId] [text] OR /msg [text]
  const msgMatch = text.match(/^\/msg(?:\s+(.+))?$/);
  if (msgMatch) {
    const fullText = (msgMatch[1] || "").trim();

    if (!fullText) {
      if (chatId === adminId) {
        await client.sendMessage(chatId, t("admin_format", {}, lang), { parse_mode: "HTML" });
      } else {
        await client.sendMessage(chatId, "⚠️ Please provide your message: <code>/msg Your text</code>", { parse_mode: "HTML" });
      }
      return;
    }

    // Admin message to client: /msg <id> <text>
    const adminTargetMatch = fullText.match(/^(\d+)\s+(.+)$/);
    if (chatId === adminId && adminTargetMatch) {
      const orderId = parseInt(adminTargetMatch[1]);
      const messageToClient = adminTargetMatch[2];
      const lead = await storage.getLead(orderId);

      if (!lead || !lead.telegramChatId) {
        await client.sendMessage(chatId, `❌ Cannot send message to order #${orderId} (no linked chat).`);
        return;
      }

      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const clientNotification = t("dev_msg_client", {
        id: orderId,
        text: messageToClient
      }, clientLang);

      try {
        await client.sendMessage(lead.telegramChatId, clientNotification, { parse_mode: "HTML" });
        await client.sendMessage(chatId, t("admin_sent_success", { id: orderId }, lang));
      } catch (err) {
        console.error(`[dispatcher] Failed to send dev message to client ${lead.telegramChatId}:`, err);
        await client.sendMessage(chatId, t("admin_send_error", {}, lang));
      }
      return;
    }

    // Client message to admin
    if (chatId !== adminId) {
      const userName = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "User");
      const leads = await storage.getAllLeads();
      const linkedLead = leads.find(l => l.telegramChatId === chatId);

      if (adminId) {
        const adminLang = (await storage.getUserLanguage(adminId)) || "en";
        const orderLabel = t("label_order", {}, adminLang);
        const adminNotification = t("new_msg_admin", {
          user: userName,
          chatId,
          orderInfo: linkedLead ? `📦 <b>${orderLabel}:</b> #${linkedLead.id} [${linkedLead.projectType}]` : "",
          text: fullText,
          orderId: linkedLead?.id || "[ID]"
        }, adminLang);

        try {
          await client.sendMessage(adminId, adminNotification, { parse_mode: "HTML" });
          await client.sendMessage(chatId, t("msg_sent", {}, lang), { parse_mode: "HTML" });
        } catch (error) {
          console.error("[dispatcher] Failed to forward client message to admin:", error);
        }
      }
      return;
    }

    if (chatId === adminId && !adminTargetMatch) {
      await client.sendMessage(chatId, t("admin_format", {}, lang), { parse_mode: "HTML" });
      return;
    }
  }

  // Generic message fallback if client sends text without /msg
  if (chatId !== adminId && !text.startsWith("/")) {
    await client.sendMessage(
      chatId,
      `💡 <i>To send a direct message to the developer, please use:</i>\n<code>/msg ${text}</code>`,
      { parse_mode: "HTML" }
    );
  }
};

const handleCallbackQuery = async (query: any, client: TelegramClient): Promise<void> => {
  const data = query.data;
  const chatId = query.message?.chat?.id?.toString();
  const queryId = query.id;

  if (!data || !chatId) {
    if (queryId) await client.answerCallbackQuery(queryId);
    return;
  }

  console.log(`[dispatcher] Callback query from ${chatId}: "${data}"`);
  const lang = (await storage.getUserLanguage(chatId)) || "en";

  // set_lang:<langCode>
  if (data.startsWith("set_lang:")) {
    const langCode = data.split(":")[1];
    await storage.setUserLanguage(chatId, langCode);
    await client.answerCallbackQuery(queryId, { text: t("lang_updated", {}, langCode) });
    await client.sendMessage(chatId, formatMessage(t("welcome", {}, langCode)), { parse_mode: "HTML" });
    return;
  }

  // view_template:<id>
  if (data.startsWith("view_template:")) {
    const id = data.split(":")[1];
    const templates = getTemplates(lang);
    const temp = templates.find((x: any) => x.id === id);

    if (!temp) {
      await client.answerCallbackQuery(queryId);
      return;
    }

    const message = `🛍️ <b>${temp.title}</b>\n\n` +
      `💰 <b>${t("label_price", {}, lang)}:</b> $${temp.price}\n\n` +
      `📝 <b>${t("label_description", {}, lang)}:</b> ${formatMessage(temp.description)}\n\n` +
      `🛠️ <b>${t("label_stack", {}, lang)}:</b> ${temp.stack.join(", ")}\n\n` +
      `✨ <b>${t("label_features", {}, lang)}:</b>\n${temp.features.map((f: string) => `• ${formatMessage(f)}`).join("\n")}`;

    const inline_keyboard = [
      [
        { text: `🗺️ ${t("roadmap", {}, lang)}`, callback_data: `show_roadmap:${temp.id}` },
        { text: `📚 ${t("docs", {}, lang)}`, callback_data: `show_docs:${temp.id}` }
      ],
      [
        { text: `🎬 ${t("video", {}, lang)}`, callback_data: `show_videos:${temp.id}` },
        { text: `💳 ${t("buy", {}, lang)}`, callback_data: `buy_template:${temp.id}` }
      ],
      [
        { text: `⬅️ ${t("back_to_shop", {}, lang)}`, callback_data: "goto_marketplace" }
      ]
    ];

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // show_roadmap:<id>
  if (data.startsWith("show_roadmap:")) {
    const id = data.split(":")[1];
    const roadmaps = getProductRoadmaps(lang);
    const roadmap = roadmaps[id];

    if (!roadmap) {
      await client.answerCallbackQuery(queryId, { text: t("roadmap_coming_soon", {}, lang) });
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

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: `⬅️ ${t("back_to_template", {}, lang)}`, callback_data: `view_template:${id}` }]]
      }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // show_docs:<id>
  if (data.startsWith("show_docs:")) {
    const id = data.split(":")[1];
    const docsByLang = getProductDocs(lang);
    const docs = docsByLang[id];

    if (!docs) {
      await client.answerCallbackQuery(queryId, { text: t("docs_coming_soon", {}, lang) });
      return;
    }

    let message = t("knowledge_base", { id: id.toUpperCase() }, lang) + "\n\n";
    const keyboard = docs.map((page: any) => [
      { text: `📄 ${page.title}`, callback_data: `show_doc_page:${id}:${page.id}` }
    ]);
    keyboard.push([{ text: `⬅️ ${t("back_to_template", {}, lang)}`, callback_data: `view_template:${id}` }]);

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // show_doc_page:<templateId>:<pageId>
  if (data.startsWith("show_doc_page:")) {
    const [, templateId, pageId] = data.split(":");
    const docsByLang = getProductDocs(lang);
    const page = docsByLang[templateId]?.find((p: any) => p.id === pageId);

    if (!page) {
      await client.answerCallbackQuery(queryId);
      return;
    }

    const formattedContent = formatMessage(page.content);

    await client.sendMessage(chatId, `📄 <b>${page.title}</b>\n\n${formattedContent}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: `⬅️ ${t("back_to_docs", {}, lang)}`, callback_data: `show_docs:${templateId}` }]]
      }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // show_videos:<id>
  if (data.startsWith("show_videos:")) {
    const id = data.split(":")[1];
    const videosByLang = getProductVideos(lang);
    const videos = videosByLang[id];

    if (!videos) {
      await client.answerCallbackQuery(queryId, { text: t("video_coming_soon", {}, lang) });
      return;
    }

    let message = `🎬 ${t("video_materials", { id: id.toUpperCase() }, lang)}\n\n`;
    const watchText = t("watch_in_browser", {}, lang);
    const durLabel = t("label_duration", {}, lang);

    for (const v of videos) {
      message += `📽️ <b>${v.title}</b>\n`;
      message += `⏱ ${durLabel}: ${v.duration}\n`;
      message += `🔗 <a href="${v.url}">${watchText}</a>\n\n`;
    }

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: `⬅️ ${t("back_to_template", {}, lang)}`, callback_data: `view_template:${id}` }]]
      },
      disable_web_page_preview: false
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // view_project:<slug>
  if (data.startsWith("view_project:")) {
    const slug = data.split(":")[1];
    const projectList = await getMergedProjects(lang);
    const proj = projectList.find((x: any) => x.slug === slug);
    if (!proj) {
      await client.answerCallbackQuery(queryId);
      return;
    }

    const message = `🚀 <b>${proj.title}</b>\n\n` +
      `📍 <b>${t("label_status", {}, lang)}:</b> ${proj.status}\n` +
      `🏷️ <b>${t("label_categories", {}, lang)}:</b> ${proj.categories.join(", ")}\n\n` +
      `📝 <b>${t("label_about", {}, lang)}:</b> ${formatMessage(proj.description)}\n\n` +
      `🛠️ <b>${t("label_stack", {}, lang)}:</b> ${proj.techStack.join(", ")}`;

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: `⬅️ ${t("back_to_portfolio", {}, lang)}`, callback_data: "goto_portfolio" }
        ]]
      }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // buy_template:<slug>
  if (data.startsWith("buy_template:")) {
    const slug = data.split(":")[1];
    const templates = await getMergedMarketplace(lang);
    const item = templates.find((x: any) => x.slug === slug);
    if (!item) {
      await client.answerCallbackQuery(queryId);
      return;
    }

    const message = t("buy_purchase_title", {
      title: item.title,
      price: item.price
    }, lang);

    await client.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: `⬅️ ${t("back_to_marketplace", {}, lang)}`, callback_data: "goto_marketplace" }
        ]]
      }
    });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // goto_marketplace
  if (data === "goto_marketplace") {
    await client.answerCallbackQuery(queryId);
    await sendMarketplace(client, chatId);
    return;
  }

  // goto_portfolio
  if (data === "goto_portfolio") {
    await client.answerCallbackQuery(queryId);
    await sendPortfolio(client, chatId);
    return;
  }

  // FAQ categories
  if (data === "faq_general") {
    await client.sendMessage(chatId, t("faq_general_title", {}, lang), { parse_mode: "HTML" });
    await client.answerCallbackQuery(queryId);
    return;
  }

  if (data === "faq_tech") {
    await client.sendMessage(chatId, t("faq_tech_title", {}, lang), { parse_mode: "HTML" });
    await client.answerCallbackQuery(queryId);
    return;
  }

  if (data === "faq_payments") {
    await client.sendMessage(chatId, t("faq_payments_title", {}, lang), { parse_mode: "HTML" });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // philosophy_detail
  if (data === "philosophy_detail") {
    const philosophyMessage = t("philosophy_text", {}, lang);
    await client.sendMessage(chatId, philosophyMessage, { parse_mode: "HTML" });
    await client.answerCallbackQuery(queryId);
    return;
  }

  // Admin approval & process buttons
  const isApprove = data.startsWith("approve_");
  const isProcess = data.startsWith("process_");

  if (isApprove || isProcess) {
    const orderId = parseInt(data.replace(isApprove ? "approve_" : "process_", ""));
    const lead = await storage.getLead(orderId);

    if (!lead) {
      await client.answerCallbackQuery(queryId, { text: t("error_order_not_found", {}, lang) });
      return;
    }

    const newStatus = isApprove ? "completed" : "in_progress";
    await storage.updateLeadStatus(orderId, newStatus);

    if (lead.telegramChatId) {
      const clientLang = (await storage.getUserLanguage(lead.telegramChatId)) || "en";
      const clientMsg = isApprove
        ? t("payment_approved", { url: lead.materialsUrl || "https://induktr.com/download/example.zip" }, clientLang)
        : t("request_in_progress", {}, clientLang);
      await client.sendMessage(lead.telegramChatId, clientMsg, { parse_mode: "HTML" });
    }

    const statusKey = isApprove ? "status_completed" : "status_in_progress";
    const statusVal = t(statusKey, {}, lang);

    await client.answerCallbackQuery(queryId, {
      text: t("msg_order_status_updated", { id: orderId, status: statusVal }, lang)
    });

    const statusLabel = t("label_status", {}, lang);

    if (query.message?.chat?.id && query.message?.message_id) {
      await client.editMessageText(
        (query.message?.text || "") + `\n\n✅ <b>${statusLabel}: ${statusVal}</b> (${new Date().toLocaleTimeString()})`,
        {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          parse_mode: "HTML"
        }
      );
    }
    return;
  }

  await client.answerCallbackQuery(queryId);
};
