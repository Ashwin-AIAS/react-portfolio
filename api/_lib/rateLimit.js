/**
 * Rate limiting and usage caps (SECURITY_PLAN.md, P4).
 *
 * Three limiters per endpoint, checked in order and stopping at the first
 * refusal (per-IP short window → per-IP daily → global daily), so a refused
 * request costs at most a couple of Redis commands. `ephemeralCache` remembers
 * blocked identifiers in instance memory, so repeat offenders are refused
 * without calling Redis at all.
 *
 * Identifiers are salted IP hashes (pseudonymous data, still personal data
 * under GDPR). Every key expires on its own: the longest window is one day,
 * and analytics are off, so nothing else is stored.
 *
 * Fail closed: missing Redis credentials outside local dev, a Redis error or
 * a Redis timeout all mean "no AI", never "no limits".
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const LIMITS = Object.freeze({
  chat: [
    { name: 'minute', scope: 'ip', tokens: 10, window: '1 m', sliding: true },
    { name: 'day', scope: 'ip', tokens: 60, window: '1 d' },
    { name: 'global', scope: 'global', tokens: 1500, window: '1 d' },
  ],
  'live-token': [
    { name: '10min', scope: 'ip', tokens: 1, window: '10 m', sliding: true },
    { name: 'day', scope: 'ip', tokens: 3, window: '1 d' },
    { name: 'global', scope: 'global', tokens: 25, window: '1 d' },
  ],
});

const REDIS_TIMEOUT_MS = 3000;
const KEY_PREFIX = 'portfolio:rl';

export class RateLimitUnavailableError extends Error {}

/** Redis credentials, preferring the Upstash names over Vercel's KV names. */
export function redisCredentials(env) {
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

// --- Redis-backed limiter -------------------------------------------------------

// Module-level so warm instances reuse the client and the ephemeral caches.
const redisCache = new Map();

function getRedis({ url, token }) {
  let redis = redisCache.get(url);
  if (!redis) {
    redis = new Redis({
      url,
      token,
      // Fail fast: a slow Redis should turn into a quick 503, not a hung request.
      retry: { retries: 1, backoff: () => 100 },
      enableTelemetry: false,
    });
    redisCache.set(url, redis);
  }
  return redis;
}

const limiterCache = new Map();

function getRedisLimiters(redis, url, route) {
  const cacheKey = `${url}|${route}`;
  let limiters = limiterCache.get(cacheKey);
  if (!limiters) {
    limiters = LIMITS[route].map((spec) => ({
      spec,
      rl: new Ratelimit({
        redis,
        limiter: spec.sliding
          ? Ratelimit.slidingWindow(spec.tokens, spec.window)
          : Ratelimit.fixedWindow(spec.tokens, spec.window),
        prefix: `${KEY_PREFIX}:${route}:${spec.name}`,
        ephemeralCache: new Map(),
        analytics: false,
        timeout: REDIS_TIMEOUT_MS,
      }),
    }));
    limiterCache.set(cacheKey, limiters);
  }
  return limiters;
}

function createRedisLimiter(redis, url) {
  return {
    kind: 'redis',
    async check(route, ipHash) {
      for (const { spec, rl } of getRedisLimiters(redis, url, route)) {
        let res;
        try {
          res = await rl.limit(spec.scope === 'global' ? 'global' : ipHash);
        } catch {
          throw new RateLimitUnavailableError('redis_error');
        }
        // On timeout the library *allows* the request; we refuse instead.
        if (res.reason === 'timeout') throw new RateLimitUnavailableError('redis_timeout');
        if (!res.success) return { ok: false, limit: spec.name, retryAfter: retryAfterSeconds(res.reset) };
      }
      return { ok: true };
    },
  };
}

// --- in-memory limiter (local dev only) ---------------------------------------

const WINDOW_MS = { m: 60_000, h: 3_600_000, d: 86_400_000 };

function windowMs(window) {
  const [n, unit] = window.split(' ');
  return Number(n) * WINDOW_MS[unit[0]];
}

/**
 * Fixed-window counters in process memory, with the same limits and order.
 * Only used by `vercel dev` with ALLOW_DEV_AI=1 and no Redis credentials.
 */
export function createMemoryLimiter(now = () => Date.now()) {
  const counters = new Map();
  return {
    kind: 'memory',
    async check(route, ipHash) {
      for (const spec of LIMITS[route]) {
        const key = `${route}:${spec.name}:${spec.scope === 'global' ? 'global' : ipHash}`;
        const t = now();
        let c = counters.get(key);
        if (!c || t >= c.resetAt) {
          c = { count: 0, resetAt: t + windowMs(spec.window) };
          counters.set(key, c);
        }
        if (c.count >= spec.tokens) {
          return { ok: false, limit: spec.name, retryAfter: retryAfterSeconds(c.resetAt, t) };
        }
        c.count++;
      }
      return { ok: true };
    },
  };
}

let devMemoryLimiter = null;

// --- selection --------------------------------------------------------------------

/**
 * @returns {{ limiter, redis } | null} null means misconfigured: fail closed.
 *   `redis` is the shared client (also used for the GitHub cache), or null
 *   when running on the in-memory dev limiter.
 */
export function getBackends(env, mode) {
  const creds = redisCredentials(env);
  if (creds) {
    const redis = getRedis(creds);
    return { limiter: createRedisLimiter(redis, creds.url), redis };
  }
  if (mode === 'development' && env.ALLOW_DEV_AI === '1') {
    devMemoryLimiter ??= createMemoryLimiter();
    return { limiter: devMemoryLimiter, redis: null };
  }
  return null;
}

export function retryAfterSeconds(resetAtMs, now = Date.now()) {
  return Math.max(1, Math.ceil((resetAtMs - now) / 1000));
}
