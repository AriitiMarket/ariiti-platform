/**
 * Sliding-window in-memory IP rate limiter.
 * Cached on globalThis to persist across warm serverless invocations and Next.js HMR.
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, number[]> | undefined;
  // eslint-disable-next-line no-var
  var __rateLimitLastCleanup: number | undefined;
}

const store: Map<string, number[]> =
  global.__rateLimitStore || new Map<string, number[]>();

if (!global.__rateLimitStore) {
  global.__rateLimitStore = store;
}

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Purges expired timestamp entries to prevent memory leaks over time.
 */
function cleanupExpiredEntries(now: number, windowMs: number): void {
  const lastCleanup = global.__rateLimitLastCleanup || 0;
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  global.__rateLimitLastCleanup = now;
  const cutoff = now - windowMs;

  store.forEach((timestamps: number[], key: string) => {
    const valid = timestamps.filter((t: number) => t > cutoff);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, valid);
    }
  });
}

/**
 * Checks whether an identifier (e.g., client IP) has exceeded its rate limit
 * within a sliding time window.
 *
 * @param identifier Unique client key (IP address)
 * @param maxRequests Maximum allowable requests per window (default: 5)
 * @param windowMs Duration of sliding window in ms (default: 15 minutes)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Run opportunistic garbage collection periodically
  cleanupExpiredEntries(now, windowMs);

  const existingTimestamps = store.get(identifier) || [];
  const validTimestamps = existingTimestamps.filter((t: number) => t > windowStart);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  store.set(identifier, validTimestamps);

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Utility to manually reset rate limit for a specific identifier (useful for tests).
 */
export function resetRateLimit(identifier?: string): void {
  if (identifier) {
    store.delete(identifier);
  } else {
    store.clear();
  }
}
