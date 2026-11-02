/**
 * Input validation for /api/chat (SECURITY_PLAN.md, P3).
 *
 * Anything that doesn't match the expected shape is rejected outright rather
 * than "fixed up", with one exception: conversation structure (leading model
 * turns, repeated roles) is normalised, because the UI legitimately produces
 * it (the greeting is a model turn).
 */
import { isPersonaId } from '../../shared/personaPrompts.js';

export const CHAT_LIMITS = Object.freeze({
  // Generous enough for a pasted job description; the client enforces the
  // same per-message cap on the input box and trims history before sending.
  maxBodyBytes: 64 * 1024,
  maxMessages: 20,
  maxMessageChars: 6000,
  maxTotalChars: 24000,
});

const ROLES = new Set(['user', 'model']);

/**
 * @returns {{ ok: true, persona: string, contents: Array } | { ok: false }}
 *   `contents` is already in Gemini's alternating user/model format.
 */
export function validateChatBody(body, limits = CHAT_LIMITS) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false };

  const keys = Object.keys(body);
  if (keys.some((k) => k !== 'persona' && k !== 'messages')) return { ok: false };

  const { persona, messages } = body;
  if (!isPersonaId(persona)) return { ok: false };
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false };
  if (messages.length > limits.maxMessages) return { ok: false };

  let total = 0;
  const contents = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return { ok: false };
    if (Object.keys(m).some((k) => k !== 'role' && k !== 'content')) return { ok: false };
    if (!ROLES.has(m.role) || typeof m.content !== 'string') return { ok: false };

    const text = m.content.trim();
    if (text.length === 0) continue;
    if (text.length > limits.maxMessageChars) return { ok: false };
    total += text.length;
    if (total > limits.maxTotalChars) return { ok: false };

    const last = contents[contents.length - 1];
    if (last && last.role === m.role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      contents.push({ role: m.role, parts: [{ text }] });
    }
  }

  // Gemini requires the conversation to start with a user turn, and the
  // request only makes sense if the visitor spoke last.
  while (contents.length > 0 && contents[0].role !== 'user') contents.shift();
  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    return { ok: false };
  }

  return { ok: true, persona, contents };
}

