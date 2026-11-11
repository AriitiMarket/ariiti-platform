import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { sendInquiryNotification } from "../lib/notifications";

describe("Notifications Service (src/lib/notifications.ts)", () => {
  test("completes gracefully without error when Telegram is unconfigured", async () => {
    // When TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are not set
    const samplePayload = {
      id: "TEST01",
      customerName: "Abebe Bikila",
      businessName: "Bikila Logistics",
      phone: "+251911223344",
      email: "abebe@example.com",
      serviceCategory: "SOFTWARE_DEVELOPMENT",
      requestedServiceTitle: "Ariiti POS",
      location: "Dire Dawa",
      projectDescription: "Testing notification delivery with offline resilience.",
      referralContext: {
        sourcePage: "/products/ariiti-pos",
        productSlug: "ariiti-pos",
      },
    };

    // Must not throw exception
    await assert.doesNotReject(async () => {
      await sendInquiryNotification(samplePayload);
    });
  });
});
