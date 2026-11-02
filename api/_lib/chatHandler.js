/**
 * POST /api/chat — streams a persona reply from Gemini.
 *
 * Request:  { persona: "<allowlisted id>", messages: [{ role, content }] }
 * Response: text/event-stream of {"t"}, then {"done"} or {"error"} events.
 *
 * Order: method/env/origin/config (guard.js) → rate limits (rateLimit.js)
 * → body validation → Gemini. The handler is built by a factory so the
 * security tests can inject env, fetch and stores without touching real
 * secrets or the network.
 */
import { preflight } from './guard.js';
import { readJsonBody, bodyErrorResponse, errors, logEvent, BASE_HEADERS } from './security.js';
import { validateChatBody, CHAT_LIMITS } from './validate.js';
import { getBackends } from './rateLimit.js';
import { getGithubContext } from './github.js';
import { openGeminiStream, toClientStream, UPSTREAM_TIMEOUT_MS } from './gemini.js';
import { buildChatSystemPrompt } from '../../shared/personaPrompts.js';

/**
 * @param {object} deps
 * @param {object} deps.env
 * @param {typeof fetch} [deps.fetchImpl]
 * @param {(env, mode) => ({ limiter, redis } | null)} [deps.backends] test hook
 */
export function createChatHandler({ env, fetchImpl = fetch, backends = getBackends } = {}) {
  return async function chatHandler(request) {
    const started = Date.now();
    const log = (status, extra = {}) =>
      logEvent({ route: 'chat', status, ms: Date.now() - started, ...extra });

    const pre = preflight(request, { env, method: 'POST' });
    if (pre.response) {
      log(pre.response.status);
      return pre.response;
    }
    const { mode, ipHash, apiKey } = pre;

    // Fail closed: no limiter (e.g. a preview without Redis) means no AI.
    const stores = backends(env, mode);
    if (!stores) {
      log(503, { ip: ipHash, reason: 'no_rate_limiter' });
      return errors.unavailable();
    }
    let verdict;
    try {
      verdict = await stores.limiter.check('chat', ipHash);
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
      body = await readJsonBody(request, CHAT_LIMITS.maxBodyBytes);
    } catch (err) {
      const res = bodyErrorResponse(err);
      log(res.status, { ip: ipHash });
      return res;
    }
    const valid = validateChatBody(body);
    if (!valid.ok) {
      log(400, { ip: ipHash });
      return errors.badRequest();
    }

    const githubContext = await getGithubContext({ env, redis: stores.redis, fetchImpl });
    const systemPrompt = buildChatSystemPrompt(valid.persona, githubContext);

    // Abort upstream when the visitor goes away or the deadline passes.
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]);
    const opened = await openGeminiStream({
      apiKey,
      systemPrompt,
      contents: valid.contents,
      signal,
      fetchImpl,
    });
    if (!opened) {
      log(502, { ip: ipHash });
      return errors.upstream();
    }

    const stream = toClientStream(opened.upstream, opened.model, {
      onFinish: (outcome) => log(200, { ip: ipHash, persona: valid.persona, outcome }),
    });
    return new Response(stream, {
      status: 200,
      headers: {
        ...BASE_HEADERS,
        'Content-Type': 'text/event-stream; charset=utf-8',
        Connection: 'keep-alive',
      },
    });
  };
}

