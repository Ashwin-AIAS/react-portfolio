/**
 * Upstream Gemini calls for /api/chat (SECURITY_PLAN.md, P2/P7).
 *
 * - The model list lives here, not in the browser.
 * - The key goes in the x-goog-api-key header, never in a URL (URLs end up
 *   in logs).
 * - Output is capped, the whole call has a deadline, and the upstream request
 *   is aborted when the visitor disconnects, so we don't pay for answers
 *   nobody reads.
 * - Google's error bodies never reach the client.
 */

export const CHAT_MODELS = Object.freeze(['gemini-2.5-flash', 'gemini-flash-latest']);
export const UPSTREAM_TIMEOUT_MS = 25_000;
// 2.5 Flash counts its thinking tokens against this cap, so it is set with
// headroom above what a fit-report JSON actually needs.
export const MAX_OUTPUT_TOKENS = 2048;

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export function displayModelName(model) {
  if (model.includes('2.5-flash')) return 'Gemini 2.5 Flash';
  if (model.includes('flash-latest')) return 'Gemini Flash';
  return 'Gemini';
}

/**
 * Tries each model in order until one accepts the request.
 * @returns {Promise<{ upstream: Response, model: string } | null>}
 */
export async function openGeminiStream({ apiKey, systemPrompt, contents, signal, fetchImpl = fetch }) {
  const body = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  });

  for (const model of CHAT_MODELS) {
    if (signal.aborted) return null;
    try {
      const upstream = await fetchImpl(`${API_BASE}/${model}:streamGenerateContent?alt=sse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body,
        signal,
      });
      if (upstream.ok && upstream.body) return { upstream, model };
      // Drain and discard the error body. Only the status is logged.
      await upstream.body?.cancel().catch(() => {});
    } catch {
      if (signal.aborted) return null;
    }
  }
  return null;
}

const encoder = new TextEncoder();
const sse = (obj) => encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

/**
 * Re-encodes Google's SSE stream as a minimal stream of our own:
 *   data: {"t": "<text delta>"}
 *   data: {"done": true, "model": "Gemini 2.5 Flash"}
 *   data: {"error": "stream_error"}
 * Lines are buffered across chunks, since a JSON event can be split anywhere.
 */
export function toClientStream(upstream, model, { onFinish } = {}) {
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finished = false;

  const finish = (controller, payload, outcome) => {
    if (finished) return;
    finished = true;
    controller.enqueue(sse(payload));
    controller.close();
    onFinish?.(outcome);
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          finish(controller, { done: true, model: displayModelName(model) }, 'ok');
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            continue;
          }
          const parts = parsed?.candidates?.[0]?.content?.parts;
          if (Array.isArray(parts)) {
            for (const p of parts) {
              // Skip thought summaries if a model ever returns them.
              if (typeof p?.text === 'string' && p.text && !p.thought) {
                controller.enqueue(sse({ t: p.text }));
              }
            }
          }
        }
      } catch {
        finish(controller, { error: 'stream_error' }, 'stream_error');
      }
    },
    cancel() {
      finished = true;
      reader.cancel().catch(() => {});
      onFinish?.('client_closed');
    },
  });
}

