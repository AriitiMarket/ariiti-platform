import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { submitInquiry } from "../actions/inquiry";

describe("Server Actions - Lead Ingestion Pipeline", () => {
  test("returns error when required form fields are missing", async () => {
    const invalidPayload = {
      customerName: "A", // too short
      phone: "invalid_phone",
      location: "",
      projectDescription: "short",
    };

    const result = await submitInquiry(invalidPayload);

    assert.equal(result.success, false);
    assert.ok(result.errors);
    assert.ok(result.errors.customerName);
    assert.ok(result.errors.phone);
    assert.ok(result.errors.location);
    assert.ok(result.errors.projectDescription);
  });

  test("traps bot spam via honeypot and silently returns success without DB query", async () => {
    const botPayload = {
      customerName: "Cryptobot 3000",
      phone: "+251911223344",
      serviceCategory: "GENERAL",
      requestedServiceTitle: "Promote Your Business",
      location: "Dire Dawa",
      projectDescription: "Automated SEO spam message with lots of text to satisfy min length.",
      honeypot: "https://spamlink.cc/bot",
    };

    const result = await submitInquiry(botPayload);

    // Bot receives fake success
    assert.equal(result.success, true);
    assert.equal(result.data?.id, "simulated_spam_sink");
  });
});
