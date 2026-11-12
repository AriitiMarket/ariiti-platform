export interface InquiryNotificationPayload {
  id?: string;
  customerName: string;
  businessName?: string;
  phone: string;
  email?: string;
  serviceCategory: string;
  requestedServiceTitle: string;
  location: string;
  projectDescription: string;
  referralContext?: {
    sourcePage?: string;
    caseStudySlug?: string;
    productSlug?: string;
  };
}

/**
 * Helper to escape Markdown special characters for Telegram Bot API Markdown v1
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

/**
 * Formats a clean Markdown message for the Ariiti Tech Operations team Telegram channel.
 */
export function formatInquiryTelegramMessage(
  inquiry: InquiryNotificationPayload | Record<string, any>
): string {
  const cleanPhone = (inquiry.phone || "").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}`;
  const telUrl = `tel:${inquiry.phone}`;

  return [
    `🚨 *NEW LEAD RECEIVED — ARIITI TECH*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    inquiry.id ? `🔖 *Reference ID:* \`#${inquiry.id}\`` : null,
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
 * Non-blocking Telegram Bot alert dispatcher.
 * Sends formatted corporate lead alerts directly to Ariiti Tech's operations channel.
 */
export async function sendInquiryNotification(
  inquiry: InquiryNotificationPayload
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.info(
      `[DEV NOTIFICATION NOTICE] New lead received (Ref #${inquiry.id || "N/A"}). Telegram alert skipped because TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in .env.local`
    );
    return;
  }

  const text = formatInquiryTelegramMessage(inquiry);
  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.warn(
        `[TELEGRAM DISPATCH WARNING] Telegram API rejected message for Ref #${inquiry.id}:`,
        data
      );
    }
  } catch (error: any) {
    // Non-blocking catch: Never re-throw to break user workflow
    console.warn(
      `[TELEGRAM DISPATCH ERROR] Could not reach Telegram for Ref #${inquiry.id}: ${error?.message}`
    );
  }
}
