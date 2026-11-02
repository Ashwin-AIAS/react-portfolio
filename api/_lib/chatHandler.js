/**
 * POST /api/chat — streams a persona reply from Gemini.
 *
 * Request:  { persona: "<allowlisted id>", messages: [{ role, content }] }
 * Response: text/event-stream of {"t"}, then {"done"} or {"error"} events.
 *
 * The handler is built by a factory so the security tests can inject env,
 * fetch and stores without touching real secrets or the network.
 */
import { preflight } from './guard.js';
import { readJsonBody, bodyErrorResponse, errors, logEvent, BASE_HEADERS } from './security.js';
import { validateChatBody, CHAT_LIMITS } from './validate.js';
import { getGithubContext } from './github.js';
import { openGeminiStream, toClientStream, UPSTREAM_TIMEOUT_MS } from './gemini.js';
import { buildChatSystemPrompt } from '../../shared/personaPrompts.js';

export function createChatHandler({ env, fetchImpl = fetch } = {}) {
  return async function chatHandler(request) {
    const started = Date.now();
    const log = (status, extra = {}) =>
      logEvent({ route: 'chat', status, ms: Date.now() - started, ...extra });

    const pre = preflight(request, { env, method: 'POST' });
    if (pre.response) {
      log(pre.response.status);
      return pre.response;
    }
    const { ipHash, apiKey } = pre;

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

    const githubContext = await getGithubContext({ env, fetchImpl });
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

