import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createCustomerInquiry } from "../actions/inquiryActions";
import { resetRateLimit } from "../lib/rateLimit";

describe("Customer Inquiry Server Action (src/app/actions/inquiryActions.ts)", () => {
  beforeEach(() => {
    resetRateLimit("127.0.0.1");
  });

  test("returns honeypot confirmation without database write when honeypot is populated", async () => {
    const botPayload = {
      customerName: "Crypto Spambot",
      phone: "+251911223344",
      serviceCategory: "GENERAL",
      requestedServiceTitle: "Spam proposal",
      location: "Dire Dawa",
      projectDescription: "Spam content message that meets length requirement.",
      honeypot: "http://bot-trap.com",
    };

    const result = await createCustomerInquiry(botPayload);

    assert.equal(result.success, true);
    assert.equal(result.referenceId, "HONEYPOT_IGNORED");
  });

  test("returns validation field errors when required fields are missing", async () => {
    const invalidPayload = {
      customerName: "A", // too short
      phone: "not-a-phone",
      serviceCategory: "INVALID_CAT",
      requestedServiceTitle: "",
      location: "",
      projectDescription: "short",
    };

    const result = await createCustomerInquiry(invalidPayload);

    assert.equal(result.success, false);
    assert.ok(result.fieldErrors);
    assert.ok(result.fieldErrors.customerName);
    assert.ok(result.fieldErrors.phone);
    assert.ok(result.fieldErrors.location);
    assert.ok(result.fieldErrors.projectDescription);
  });

  test("enforces sliding-window rate limit on multiple submissions", async () => {
    const dummyPayload = {
      customerName: "Abebe Kebede",
      phone: "0911223344",
      serviceCategory: "SOFTWARE_DEVELOPMENT",
      requestedServiceTitle: "Ariiti POS",
      location: "Harar",
      projectDescription: "Valid business requirements description over 10 characters.",
      honeypot: "bot_attempt", // use honeypot so DB connect is bypassed in test
    };

    // Make 5 requests (all should succeed via honeypot)
    for (let i = 0; i < 5; i++) {
      const res = await createCustomerInquiry(dummyPayload);
      assert.equal(res.success, true);
    }

    // 6th request should hit rate limit
    const blockedRes = await createCustomerInquiry(dummyPayload);
    assert.equal(blockedRes.success, false);
    assert.ok(blockedRes.error?.includes("Too many requests"));
  });
});
