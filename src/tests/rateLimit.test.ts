import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimit } from "../lib/rateLimit";

describe("Sliding-Window Rate Limiter (src/lib/rateLimit.ts)", () => {
  const TEST_IP = "192.168.1.100";

  beforeEach(() => {
    resetRateLimit(TEST_IP);
  });

  test("allows requests up to the max threshold (5 requests)", () => {
    for (let i = 1; i <= 5; i++) {
      const result = checkRateLimit(TEST_IP, 5, 60000);
      assert.equal(result.allowed, true);
      assert.equal(result.remaining, 5 - i);
    }
  });

  test("blocks the 6th request when limit is 5", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit(TEST_IP, 5, 60000);
    }

    const blockedResult = checkRateLimit(TEST_IP, 5, 60000);
    assert.equal(blockedResult.allowed, false);
    assert.equal(blockedResult.remaining, 0);
    assert.ok(blockedResult.retryAfterSeconds > 0);
  });

  test("resets rate limit upon calling resetRateLimit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit(TEST_IP, 5, 60000);
    }

    resetRateLimit(TEST_IP);

    const freshResult = checkRateLimit(TEST_IP, 5, 60000);
    assert.equal(freshResult.allowed, true);
    assert.equal(freshResult.remaining, 4);
  });
});
