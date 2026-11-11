import { IInquiry } from "@/models/Inquiry";

export interface TelegramDispatchResult {
  sent: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Formats a clean Markdown message for the Ariiti Tech Operations team Telegram channel.
 */
export function formatInquiryTelegramMessage(inquiry: Partial<IInquiry>): string {
  const cleanPhone = (inquiry.phone || "").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}`;
  const telUrl = `tel:${inquiry.phone}`;

  return [
    `🚨 *NEW LEAD RECEIVED — ARIITI TECH*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Client Name:* ${escapeMarkdown(inquiry.customerName || "N/A")}`,
    inquiry.businessName ? `🏢 *Business:* ${escapeMarkdown(inquiry.businessName)}` : null,
    `📍 *Location:* ${escapeMarkdown(inquiry.location || "N/A")}`,
    `📞 *Phone:* \`${inquiry.phone || "N/A"}\``,
    inquiry.email ? `✉️ *Email:* ${escapeMarkdown(inquiry.email)}` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛠️ *Service Requested:*`,
    `*${escapeMarkdown(inquiry.requestedServiceTitle || "General Inquiry")}*`,
    `📁 *Category:* \`${inquiry.serviceCategory || "GENERAL"}\``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📝 *Project Description:*`,
    `_${escapeMarkdown(inquiry.projectDescription || "No details provided.")}_`,
    inquiry.referralContext?.sourcePage
      ? `\n🌐 *Converted Via:* \`${inquiry.referralContext.sourcePage}\``
      : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ *Quick Actions:*`,
    `👉 [Open WhatsApp Chat](${waUrl}) | [Direct Phone Call](${telUrl})`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Helper to escape Markdown special characters for Telegram Bot API Markdown v1
 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

/**
 * Dispatches an automated lead notification to the Ariiti Tech Operations Telegram channel.
 * Never throws an uncaught exception so customer submissions are never aborted if Telegram is down.
 */
export async function sendInquiryTelegramAlert(
  inquiry: Partial<IInquiry>
): Promise<TelegramDispatchResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[TELEGRAM ALERT] Skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in .env.local"
    );
    return { sent: false, error: "Telegram credentials missing" };
  }

  try {
    const text = formatInquiryTelegramMessage(inquiry);
    const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      console.error("[TELEGRAM ALERT] Dispatch failed:", data);
      return { sent: false, error: data?.description || "Failed to send message" };
    }

    return { sent: true, messageId: data.result?.message_id };
  } catch (error: any) {
    console.error("[TELEGRAM ALERT] Network error:", error.message);
    return { sent: false, error: error.message };
  }
}
