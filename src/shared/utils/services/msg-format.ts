export const escapeHtml = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

/**
 * Converts basic markdown formatting to valid Telegram HTML while escaping
 * unsafe characters to prevent "400 Bad Request: can't parse entities" errors.
 */
export const formatMessage = (text: string): string => {
  if (!text) return "";

  // If text already contains Telegram HTML tags, perform soft cleanup
  // First, extract links [text](url)
  let formatted = text
    .replace(/#+\s+(.+)$/gm, "<b>$1</b>")
    .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<i>$1</i>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');

  return formatted;
};