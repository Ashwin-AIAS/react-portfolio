/**
 * Browser client for POST /api/chat (SECURITY_PLAN.md, P2/P3).
 *
 * The browser never holds an API key, never sees a system prompt and never
 * picks a model. It sends `{ persona, messages }` and reads back a small SSE
 * stream of text deltas. The limits below mirror api/_lib/validate.js, so a
 * normal conversation never trips the server's abuse guards.
 */

export const MAX_HISTORY_MESSAGES = 20;
export const MAX_MESSAGE_CHARS = 6000;
const MAX_TOTAL_CHARS = 24000;

export class ChatRequestError extends Error {
  /**
   * @param {'rate_limited'|'unavailable'|'bad_request'|'upstream'|'network'|'aborted'} kind
   * @param {number} [retryAfter] seconds, for rate_limited
   */
  constructor(kind, retryAfter) {
    super(kind);
    this.kind = kind;
    this.retryAfter = retryAfter;
  }
}

/**
 * Turns UI messages into the API's shape: only user/model turns with text,
 * each capped, then the newest turns that fit the message and character
 * budgets. Older turns are dropped so long conversations keep working.
 */
export function toApiMessages(uiMessages) {
  const turns = uiMessages
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'model') &&
        !m.isSystemNotice &&
        !m.isError &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }));

  const kept = [];
  let total = 0;
  for (let i = turns.length - 1; i >= 0 && kept.length < MAX_HISTORY_MESSAGES; i--) {
    total += turns[i].content.length;
    if (total > MAX_TOTAL_CHARS) break;
    kept.unshift(turns[i]);
  }
  return kept;
}

function errorKindForStatus(status) {
  if (status === 429) return 'rate_limited';
  if (status === 400 || status === 413 || status === 415) return 'bad_request';
  if (status === 502) return 'upstream';
  return 'unavailable';
}

/**
 * Streams a reply. Calls onText with the full text so far after each delta.
 * @returns {Promise<{ text: string, model: string | null }>}
 * @throws {ChatRequestError}
 */
export async function streamChat({ persona, messages, signal, onText }) {
  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, messages: toApiMessages(messages) }),
      signal,
    });
  } catch {
    throw new ChatRequestError(signal?.aborted ? 'aborted' : 'network');
  }

  if (!res.ok || !res.body) {
    const retryAfter = Number(res.headers.get('retry-after')) || undefined;
    throw new ChatRequestError(errorKindForStatus(res.status), retryAfter);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line.startsWith('data:')) continue;

        let event;
        try {
          event = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (typeof event.t === 'string') {
          text += event.t;
          onText?.(text);
        } else if (event.done) {
          return { text, model: typeof event.model === 'string' ? event.model : null };
        } else if (event.error) {
          throw new ChatRequestError('upstream');
        }
      }
    }
  } catch (err) {
    if (err instanceof ChatRequestError) throw err;
    throw new ChatRequestError(signal?.aborted ? 'aborted' : 'network');
  }

  // The stream ended without a "done" event: the connection dropped mid-reply.
  throw new ChatRequestError('network');
}
