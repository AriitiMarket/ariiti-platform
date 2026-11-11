export interface InquiryNotificationPayload {
  id: string;
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
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
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
      `[DEV NOTIFICATION NOTICE] New lead received (Ref #${inquiry.id}). Telegram alert skipped because TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in .env.local`
    );
    return;
  }

  const cleanPhone = inquiry.phone.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}`;
  const telUrl = `tel:${inquiry.phone}`;

  const lines = [
    `🚨 *NEW INQUIRY RECEIVED — ARIITI TECH*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔖 *Reference ID:* \`#${inquiry.id}\``,
    `👤 *Client Name:* ${escapeMarkdown(inquiry.customerName)}`,
    inquiry.businessName
      ? `🏢 *Business / Org:* ${escapeMarkdown(inquiry.businessName)}`
      : null,
    `📍 *Location:* ${escapeMarkdown(inquiry.location)}`,
    `📞 *Phone:* [${escapeMarkdown(inquiry.phone)}](${telUrl})`,
    inquiry.email
      ? `✉️ *Email:* [${escapeMarkdown(inquiry.email)}](mailto:${inquiry.email})`
      : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛠️ *Requested Service:*`,
    `*${escapeMarkdown(inquiry.requestedServiceTitle)}*`,
    `📁 *Category:* \`${inquiry.serviceCategory}\``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📝 *Project Description:*`,
    `_${escapeMarkdown(inquiry.projectDescription)}_`,
    inquiry.referralContext?.sourcePage ||
    inquiry.referralContext?.caseStudySlug ||
    inquiry.referralContext?.productSlug
      ? `\n🌐 *Attribution Context:* ${escapeMarkdown(
          [
            inquiry.referralContext.sourcePage &&
              `Page: ${inquiry.referralContext.sourcePage}`,
            inquiry.referralContext.caseStudySlug &&
              `Case Study: ${inquiry.referralContext.caseStudySlug}`,
            inquiry.referralContext.productSlug &&
              `Product: ${inquiry.referralContext.productSlug}`,
          ]
            .filter(Boolean)
            .join(" | ")
        )}`
      : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ *Quick Response Actions:*`,
    `👉 [Open WhatsApp Chat](${waUrl}) | [Direct Dial](${telUrl})`,
  ];

  const text = lines.filter(Boolean).join("\n");
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
