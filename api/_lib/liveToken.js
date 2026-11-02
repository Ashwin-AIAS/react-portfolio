/**
 * POST /api/live-token: a short-lived, single-use token for voice mode
 * (SECURITY_PLAN.md, P6).
 *
 * Request:  { persona: "<allowlisted id>" }
 * Response: { token, model, expiresAt, maxSessionSeconds }
 *
 * Once connected, the browser talks to Google directly and the server can't
 * end the session, so the cost is bounded by the token itself:
 *
 * - uses: 1, and the session must start within 60 s.
 * - The whole setup (model, system instruction, audio-only output, voice,
 *   transcription) is baked into the token. With no fieldMask the token's
 *   setup is used as-is and the client's setup message is ignored (verified:
 *   a client-supplied system instruction had no effect).
 * - No contextWindowCompression is configured, so an audio session hits
 *   Google's hard cap (~15 min) on its own.
 * - Session resumption, however, is enabled by Google on this model even
 *   when neither side asks for it (verified 2026-11-02), and resuming
 *   doesn't count as a token use. Resumption only works while the token is
 *   valid, so expireTime is kept short: a session can't be stretched much
 *   beyond one ~10 min connection. See SECURITY.md.
 */
import { preflight } from './guard.js';
import { readJsonBody, bodyErrorResponse, errors, jsonResponse, logEvent } from './security.js';
import { getBackends } from './rateLimit.js';
import { isPersonaId, buildVoiceSystemPrompt } from '../../shared/personaPrompts.js';

export const LIVE_MODEL = 'gemini-3.1-flash-live-preview';
export const LIVE_VOICE = 'Aoede';
export const TOKEN_TTL_MS = 6 * 60_000;
export const NEW_SESSION_WINDOW_MS = 60_000;
/** Client-side auto-disconnect (UX only, not a security control). */
export const MAX_SESSION_SECONDS = 300;

const TOKENS_URL = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
const MAX_BODY_BYTES = 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

/** The token request. Exported so the tests can check what gets locked. */
export function buildTokenRequest(persona, now = Date.now()) {
  return {
    uses: 1,
    expireTime: new Date(now + TOKEN_TTL_MS).toISOString(),
    newSessionExpireTime: new Date(now + NEW_SESSION_WINDOW_MS).toISOString(),
    bidiGenerateContentSetup: {
      model: `models/${LIVE_MODEL}`,
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: LIVE_VOICE } } },
      },
      systemInstruction: { parts: [{ text: buildVoiceSystemPrompt(persona) }] },
      // Text of what the model says, for the chat transcript.
      outputAudioTranscription: {},
      // Deliberately absent: contextWindowCompression, sessionResumption.
    },
  };
}

export function createLiveTokenHandler({ env, fetchImpl = fetch, backends = getBackends } = {}) {
  return async function liveTokenHandler(request) {
    const started = Date.now();
    const log = (status, extra = {}) =>
      logEvent({ route: 'live-token', status, ms: Date.now() - started, ...extra });

    const pre = preflight(request, { env, method: 'POST' });
    if (pre.response) {
      log(pre.response.status);
      return pre.response;
    }
    const { mode, ipHash, apiKey } = pre;

    const stores = backends(env, mode);
    if (!stores) {
      log(503, { ip: ipHash, reason: 'no_rate_limiter' });
      return errors.unavailable();
    }
    let verdict;
    try {
      verdict = await stores.limiter.check('live-token', ipHash);
    } catch {
      log(503, { ip: ipHash, reason: 'rate_limiter_error' });
      return errors.unavailable();
    }
    if (!verdict.ok) {
      log(429, { ip: ipHash, limit: verdict.limit });
      return errors.rateLimited(verdict.retryAfter);
    }

    let body;
    try {
      body = await readJsonBody(request, MAX_BODY_BYTES);
    } catch (err) {
      const res = bodyErrorResponse(err);
      log(res.status, { ip: ipHash });
      return res;
    }
    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      Object.keys(body).some((k) => k !== 'persona') ||
      !isPersonaId(body.persona)
    ) {
      log(400, { ip: ipHash });
      return errors.badRequest();
    }

    let token;
    try {
      const upstream = await fetchImpl(TOKENS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(buildTokenRequest(body.persona)),
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]),
      });
      if (upstream.ok) {
        const data = await upstream.json();
        if (typeof data?.name === 'string' && data.name.startsWith('auth_tokens/')) token = data.name;
      } else {
        await upstream.body?.cancel().catch(() => {});
      }
    } catch {
      /* network error or timeout: handled below */
    }
    if (!token) {
      log(502, { ip: ipHash });
      return errors.upstream();
    }

    log(200, { ip: ipHash, persona: body.persona });
    return jsonResponse(200, {
      token,
      model: LIVE_MODEL,
      expiresAt: new Date(started + TOKEN_TTL_MS).toISOString(),
      maxSessionSeconds: MAX_SESSION_SECONDS,
    });
  };
}
