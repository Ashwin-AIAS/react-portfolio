/**
 * Shared request guards for the AI endpoints (SECURITY_PLAN.md, P1/P3/P5/P7/P9).
 *
 * Everything here is pure and takes `env` as an argument instead of reading
 * process.env directly, so scripts/test-api-security.mjs can exercise every
 * branch without real secrets.
 */
import { createHash } from 'node:crypto';
import { ipAddress } from '@vercel/functions';

// --- environment ------------------------------------------------------------

/**
 * Vercel sets VERCEL_ENV to production | preview | development (`vercel dev`).
 * Anything unset or unknown is treated as development, which is the most
 * restricted mode: the AI endpoints stay off unless ALLOW_DEV_AI=1.
 */
export function getMode(env) {
  const v = env.VERCEL_ENV;
  return v === 'production' || v === 'preview' ? v : 'development';
}

// --- origin allowlist (P5) -----------------------------------------------------

export const PRODUCTION_ORIGIN = 'https://react-portfolio-theta-steel.vercel.app';
// Fully anchored and scoped to this team, so another Vercel project with a
// similar name can't match.
export const PREVIEW_ORIGIN_RE = /^https:\/\/react-portfolio-[a-z0-9]+-ashwins-projects-8d106fa7\.vercel\.app$/;
export const DEV_ORIGIN = 'http://localhost:3000';

/**
 * Per-environment allowlist: each deployment only accepts its own kind of
 * origin, so production never trusts a preview URL and localhost is only
 * accepted by `vercel dev`. A missing Origin is rejected: browsers always send
 * it on a POST made with fetch(). Scripts can fake the header, so this is
 * defense in depth only; the rate limits and Google quotas are the real
 * controls.
 */
export function isAllowedOrigin(origin, mode) {
  if (typeof origin !== 'string' || origin.length === 0) return false;
  if (mode === 'production') return origin === PRODUCTION_ORIGIN;
  if (mode === 'preview') return PREVIEW_ORIGIN_RE.test(origin);
  return origin === DEV_ORIGIN;
}

// --- responses (P7) -----------------------------------------------------------

export const BASE_HEADERS = Object.freeze({
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
});

/** JSON response with a generic, client-safe message. Never include upstream detail. */
export function jsonResponse(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...BASE_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  });
}

export const errors = {
  methodNotAllowed: (allow) =>
    jsonResponse(405, { error: 'method_not_allowed' }, { Allow: allow }),
  notFound: () => jsonResponse(404, { error: 'not_found' }),
  forbidden: () => jsonResponse(403, { error: 'forbidden' }),
  badRequest: () => jsonResponse(400, { error: 'bad_request' }),
  payloadTooLarge: () => jsonResponse(413, { error: 'payload_too_large' }),
  unsupportedMediaType: () => jsonResponse(415, { error: 'unsupported_media_type' }),
  rateLimited: (retryAfterSeconds) =>
    jsonResponse(
      429,
      { error: 'rate_limited', retryAfter: retryAfterSeconds },
      { 'Retry-After': String(retryAfterSeconds) },
    ),
  unavailable: () => jsonResponse(503, { error: 'unavailable' }),
  upstream: () => jsonResponse(502, { error: 'upstream_error' }),
};

// --- body parsing (P3) --------------------------------------------------------

export class BodyError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind; // 'type' | 'size' | 'json'
  }
}

/**
 * Reads a JSON body with a hard byte cap. The Content-Length check rejects
 * honest oversized requests early; the streaming count catches clients that
 * lie about it or use chunked encoding.
 */
export async function readJsonBody(request, maxBytes) {
  const type = request.headers.get('content-type') || '';
  if (!/^application\/json(\s*;|$)/i.test(type)) throw new BodyError('type');

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyError('size');

  if (!request.body) throw new BodyError('json');
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new BodyError('size');
    }
    chunks.push(value);
  }
  const text = new TextDecoder().decode(concat(chunks, total));
  try {
    return JSON.parse(text);
  } catch {
    throw new BodyError('json');
  }
}

function concat(chunks, total) {
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}

export function bodyErrorResponse(err) {
  if (err instanceof BodyError) {
    if (err.kind === 'type') return errors.unsupportedMediaType();
    if (err.kind === 'size') return errors.payloadTooLarge();
  }
  return errors.badRequest();
}

// --- client identity (P4/P9) --------------------------------------------------

/**
 * Client IP from Vercel's proxy header via @vercel/functions. `vercel dev`
 * doesn't always set it, so development falls back to loopback. Elsewhere a
 * missing IP lands in one shared "unknown" bucket rather than bypassing limits.
 */
export function getClientIp(request, mode) {
  const ip = ipAddress(request);
  if (ip) return ip;
  return mode === 'development' ? '127.0.0.1' : 'unknown';
}

/**
 * Salted SHA-256 of the IP. This is pseudonymous data, which is still
 * personal data under GDPR, not anonymous. It is only used as a short-lived
 * rate-limit key (TTL ≤ 24 h) and in logs.
 */
export function hashIp(ip, salt) {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

// --- logging (P9) -------------------------------------------------------------

/**
 * One structured line per request: endpoint, outcome, latency, hashed IP.
 * Never message content, prompts, tokens, keys or upstream bodies.
 */
export function logEvent(fields) {
  try {
    console.info(JSON.stringify({ t: new Date().toISOString(), ...fields }));
  } catch {
    /* logging must never break a request */
  }
}

