# Security

How this portfolio protects its AI features, and what to do when something goes
wrong. The full rationale is in
[docs/voice-guide/SECURITY_PLAN.md](docs/voice-guide/SECURITY_PLAN.md).

## Reporting a vulnerability

Please report issues privately through GitHub's **Report a vulnerability**
button (Security tab), or via the contact form on the site. Don't open a
public issue for anything that could be abused.

## Architecture

```
Browser ──POST {persona, messages}──▶ /api/chat ──x-goog-api-key──▶ Gemini (text)
Browser ──POST {persona}───────────▶ /api/live-token ──▶ Gemini auth_tokens
Browser ──WebSocket (access_token=single-use token)────▶ Gemini Live (voice)
                                       │
                         Upstash Redis: rate limits + GitHub cache
```

- The Gemini API key exists **only** in Vercel Functions (`GEMINI_API_KEY`).
  Nothing named `VITE_*` may hold a secret: Vite bundles those into public JS.
- The browser sends a persona **id**, never a prompt or a model. Prompts live in
  `shared/personaPrompts.js` and are imported only by `api/`.
- Functions run in `fra1` (Frankfurt).

## Controls

| Area | Control | Where |
|------|---------|-------|
| Secrets | Server-only key; build fails on `VITE_*KEY/SECRET/TOKEN` or on key-like strings / secret values in `dist/` | `scripts/check-no-secrets.mjs` (runs in `npm run build`) |
| Secrets | gitleaks on every push/PR; opt-in pre-commit hook | `.github/workflows/gitleaks.yml`, `scripts/hooks/pre-commit` |
| Prompts and models | Persona allowlist; server builds the prompt; model allowlist; GitHub context fetched server-side | `shared/personaPrompts.js`, `api/_lib/gemini.js`, `api/_lib/github.js` |
| Input | POST + JSON only; body ≤ 64 KB; ≤ 20 messages, ≤ 6,000 chars each, ≤ 24,000 total; roles `user`/`model`; unknown fields rejected | `api/_lib/validate.js`, `api/_lib/security.js` |
| Origin | Exact allowlist per environment: production URL in production, team-scoped preview pattern in previews, `http://localhost:3000` in `vercel dev` only. Defense in depth only: scripts can fake `Origin` | `api/_lib/security.js` |
| Abuse and cost | Upstash rate limits (table below), checked before the body is read; fail closed | `api/_lib/rateLimit.js` |
| Voice | Single-use, server-locked ephemeral tokens (details below) | `api/_lib/liveToken.js` |
| Output | `maxOutputTokens` 2,048, 25 s deadline, upstream aborted when the visitor leaves; generic errors only | `api/_lib/gemini.js` |
| Headers | HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (mic self only), `X-Frame-Options`, CSP (**Report-Only for now**), `no-store` on `/api` | `vercel.json` |
| Logging | One line per request: route, status, latency, salted IP hash. Never message content, prompts, keys or tokens | `api/_lib/security.js` |

### Rate limits

| Endpoint | Per IP | Per IP daily | Global daily |
|----------|--------|--------------|--------------|
| `POST /api/chat` | 10 / min (sliding) | 60 | 1,500 |
| `POST /api/live-token` | 1 / 10 min (sliding) | 3 | 25 |

- Limiters run in order and stop at the first refusal. `ephemeralCache` blocks
  repeat offenders in memory without calling Redis. Refusals return `429` with
  `Retry-After`.
- Identifiers are salted SHA-256 hashes of the client IP (from
  `@vercel/functions` `ipAddress()`). That is **pseudonymous data, still personal
  data under GDPR**. Keys expire on their own after at most 24 h; analytics are off.
- **Fail closed:** no Redis credentials (production and previews), a Redis
  error, or a Redis timeout all return `503`. The library's default on timeout
  is to *allow*; we override that.
- Redis credentials: `UPSTASH_REDIS_REST_URL ?? KV_REST_API_URL` and
  `UPSTASH_REDIS_REST_TOKEN ?? KV_REST_API_TOKEN`.
- **Previews have no Redis, so the AI endpoints return 503 there. That's intended.**

### Voice tokens: what was verified

Checked against the live API on 2026-11-02 with `gemini-3.1-flash-live-preview`:

| Check | Result |
|-------|--------|
| Token created with the full setup in `bidiGenerateContentSetup` and **no `fieldMask`**; client then sends its own `setup` with a different system instruction | ✅ Ignored: the model followed the token's instruction |
| Second session with a `uses: 1` token | ✅ Refused (`1011 Token has been used too many times`) |
| Client adds `contextWindowCompression` / `sessionResumption` to its setup | ⚠️ Can't be blocked. Google enables **session resumption on this model by default**, even when neither the token nor the client asks for it, and returns a resumable handle. An explicit `fieldMask` listing `sessionResumption` doesn't turn it off either. |

Resuming doesn't count as a token use, but it only works while the token is
valid. So the control is a short lifetime:

- `uses: 1`, session must start within **60 s**, token valid for **6 min** (the
  plan said 30 min; shortened because of the finding above).
- The token never configures context compression, so audio sessions hit
  Google's ~15 min cap. Connections end after ~10 min (`GoAway`), and
  resumption is impossible after the 6 min token lifetime.
- **Worst case per token ≈ 16 min** (resume at 5:59 for one more ~10 min
  connection), so 25 tokens/day is ≈ 6.7 h of audio. The client also
  auto-disconnects after 5 min (UX only).

### Content Security Policy

Rolled out in two steps:

1. **Now: `Content-Security-Policy-Report-Only`.** Browse every section of the
   live site with DevTools open and look for `[Report Only]` violations.
2. **Later (separate commit):** rename the header to `Content-Security-Policy`
   once the console is clean.

The theme bootstrap script is `public/theme-init.js` (no inline script), so
`script-src 'self'` needs no hashes. PDFs get `frame-ancestors 'self'` /
`X-Frame-Options: SAMEORIGIN` so the résumé viewer can embed them; everything
else is `frame-ancestors 'none'` / `DENY`.

## Environment variables

See [.env.example](.env.example). Production (Vercel, marked sensitive):
`GEMINI_API_KEY`, `RATE_LIMIT_SALT`, `GITHUB_TOKEN` (optional), and the Redis pair.
Local `vercel dev` also needs `ALLOW_DEV_AI=1`; without Redis it falls back to
an in-memory limiter.

## Verifying

```sh
npm run lint
npm run build        # includes the env + dist/ secret checks
npm run test:api     # handler, limiter, token and config tests (no network, no secrets)
npx vercel dev       # manual end-to-end check (needs .env, see .env.example)
```

## Known limitations

- **`vercel dev` starts a new process per function call**, so the in-memory dev
  limiter doesn't accumulate across requests locally. Its logic is covered by
  `npm run test:api`; production uses Redis.
- `Origin` checks stop casual cross-site use, not scripts. Rate limits and
  Google-side quotas are the real controls.
- Prompt injection is reduced (guardrails, untrusted-input instructions, no
  secrets in prompts), not eliminated.
- A full-history gitleaks scan will flag the Gemini key committed in `acb935c`
  (removed in `f25feb1`). That key is rotated and must stay deleted. The Action
  only scans newly pushed commits.
- `npm audit --omit=dev` is clean; some dev-only build tooling still has
  advisories that don't ship to the browser.

## Incident response

1. **Key leaked or suspicious usage:** in Google Cloud, delete the key, create a
   new one restricted to the Generative Language API with per-day and per-minute
   quotas, and update `GEMINI_API_KEY` in Vercel. Then redeploy.
2. **Traffic flood:** turn on Vercel Firewall **Attack Challenge Mode**. Lower
   the global caps in `api/_lib/rateLimit.js` if needed.
3. **Redis quota exhausted:** the AI features fail closed (503) until the
   monthly quota resets; the rest of the site is unaffected.
4. **Salt leaked:** set a new `RATE_LIMIT_SALT`. Existing counters reset, and
   old hashes can no longer be linked.

Google-side caps (manual): a **budget alert only notifies**, it doesn't stop
spending. The real cap is the API **quota** (requests per day and per minute)
on the key's project.
