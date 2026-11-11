import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatInquiryTelegramMessage } from "../lib/telegram";

describe("Telegram Alert Notification Service (src/lib/telegram.ts)", () => {
  test("formats clean markdown message with all inquiry details", () => {
    const inquiry = {
      customerName: "Abdi Hassen",
      businessName: "Harar Coffee Exporters",
      phone: "+251915001122",
      email: "abdi@hararcoffee.et",
      serviceCategory: "SOFTWARE_DEVELOPMENT" as const,
      requestedServiceTitle: "Ariiti POS & Warehouse Sync",
      location: "Harar",
      projectDescription: "Need multi-warehouse inventory syncing and receipt printing.",
      referralContext: {
        sourcePage: "/products/ariiti-pos",
      },
    };

    const message = formatInquiryTelegramMessage(inquiry as any);

    assert.ok(message.includes("NEW LEAD RECEIVED"));
    assert.ok(message.includes("Abdi Hassen"));
    assert.ok(message.includes("Harar Coffee Exporters"));
    assert.ok(message.includes("+251915001122"));
    assert.ok(message.includes("Ariiti POS & Warehouse Sync"));
    assert.ok(message.includes("https://wa.me/251915001122"));
    assert.ok(message.includes("tel:+251915001122"));
  });

  test("handles minimal required fields without business name or email", () => {
    const minimalInquiry = {
      customerName: "Kidus Tadesse",
      phone: "0911223344",
      serviceCategory: "NETWORKING_INFRASTRUCTURE" as const,
      requestedServiceTitle: "Commercial LAN Installation",
      location: "Dire Dawa",
      projectDescription: "Looking to wire our 2-floor commercial space.",
    };

    const message = formatInquiryTelegramMessage(minimalInquiry as any);

    assert.ok(message.includes("Kidus Tadesse"));
    assert.ok(message.includes("Dire Dawa"));
    assert.ok(!message.includes("Business:")); // omitted
    assert.ok(!message.includes("Email:")); // omitted
    assert.ok(message.includes("https://wa.me/0911223344"));
  });
});
