# Security Plan v2: Gemini Backend on Vercel + Rate Limiting

**Host:** Vercel (`react-portfolio-theta-steel.vercel.app`) · **Rate-limit + cache store:** Upstash Redis
**v2 changes** (from your review) are marked 🆕. Facts I checked against the code or current docs are marked ✅.

## Findings

| # | Finding | Severity |
|---|---------|----------|
| F1 | `VITE_GEMINI_API_KEY` is built into the public JS bundle (confirmed in `dist/assets`) | 🔴 Critical |
| F2 | `.env` was committed in `acb935c` and removed later in `f25feb1`. ✅ Both versions contained **only** `VITE_GEMINI_API_KEY`, so no Formspree ID, GitHub token or other secret leaked that way | 🔴 Critical |
| F3 | Voice mode puts the key in the WebSocket URL and logs it (`useGeminiLive.js` L301–303) | 🔴 Critical |
| F4 | The browser sends the system prompt and chooses the model | 🟠 High |
| F5 | No rate limiting or usage caps | 🟠 High |
| F6 | No security headers | 🟡 Medium |
| F7 🆕 | No privacy notice, although chat text and voice audio are sent to Google | 🟡 Medium |

---

## Security protocols

### P1: Secrets management
- `GEMINI_API_KEY` exists **only on the server** (no `VITE_` prefix). All client-side key code is removed.
- `.env.example` lists variable names only. A build check **fails** on any `VITE_*` variable whose name contains `KEY`/`SECRET`/`TOKEN`, and on any `AIza…` string in `dist/`.
- Separate keys for production and dev. Never log secrets, tokens or URLs that contain them.

### P2: Server owns the prompts and models
- The client sends only `{ persona, messages }`. The server builds the system prompt from the 7-persona allowlist and picks the model from a server-side allowlist.
- 🆕 **GitHub context is cached in Upstash Redis** (10-min TTL), not in function memory. With a cache it's ≤ 6 GitHub calls/hour in total. A **fine-grained, read-only GitHub token** (public repos only) is used when `GITHUB_TOKEN` is set; it's optional but recommended because Vercel's outbound IPs are shared with other projects.
- Persona prompts move into `shared/personaPrompts.js`, shared by the UI and the API.

### P3: Input validation
- `POST` + `application/json` only, body ≤ 32 KB. Persona must be in the allowlist, roles must be `user`/`model`, ≤ 2,000 characters per message, ≤ 12,000 in total.
- 🆕 **The client trims history to the last 20 messages before sending**, so long conversations keep working. The server still rejects anything over 20 messages as an abuse guard; a normal visitor never hits that.

### P4: Rate limiting and usage caps (`@upstash/ratelimit`)

| Endpoint | Per IP (sliding) | Per IP daily | Global daily |
|----------|------------------|--------------|--------------|
| `POST /api/chat` | 10 / min | 60 / day | 1,500 / day |
| `POST /api/live-token` 🆕 | 1 / 10 min | **3 / day** | **25 / day** |

- `429` + `Retry-After`, shown as a friendly in-character message.
- 🆕 Client IP comes from `ipAddress()` in `@vercel/functions`, not hand-parsed headers.
- 🆕 **GDPR wording fixed:** IPs are **salted SHA-256 hashes, which is pseudonymous data, still personal data under GDPR**, not anonymous. Data minimisation: keys expire automatically after at most 24 h, and nothing else is stored.
- **Fail closed** if Redis is unreachable.
- 🆕 **Upstash free-tier check** ✅ (current free tier: **500K commands/month**):
  - Limiters run in order and **stop at the first refusal**: per-minute → per-day → global. `ephemeralCache` blocks repeat offenders in memory without calling Redis.
  - A worst-case allowed chat request ≈ 3 limiter calls + 1 cache `GET` (+ a rare `SET`) ≈ **5 commands**. At the full global cap: 1,500 × 5 × 30 ≈ **225K/month**. Voice adds ≈ 25 × 3 × 30 ≈ 2K. Total ≈ **45% of quota, worst case**.
  - Refused requests cost 1–2 commands each. A sustained flood could exhaust the free quota. The free tier **stops serving rather than billing**, so the result is "AI temporarily unavailable" (fail closed), not a bill. If that happens: Vercel Firewall attack mode.

### P5: Origin and environment guard 🆕
- Instead of matching preview URLs with a pattern, **the AI endpoints are disabled outside production**: `VERCEL_ENV !== 'production'` → `404`. Local `vercel dev` is allowed only when `ALLOW_DEV_AI=1` is set locally. That removes the preview-spoofing risk entirely and saves quota.
- In production, `Origin` must **exactly equal** `https://react-portfolio-theta-steel.vercel.app` (plus any custom domain you add later, as exact strings, never patterns).
- Still defense in depth only: scripts can fake `Origin`. P4 and P10 are the real controls.
- Recommended: turn on **Vercel Deployment Protection** for previews as well.

### P6: Short-lived tokens for voice, budgeted in minutes 🆕
- Once connected, **the browser talks to Google directly. We can't end a session from the server.** So the cost is limited by the token's constraints, not by its expiry.
- ✅ Current Live API limits: audio-only sessions cap at **15 min** without context compression, and each WebSocket connection lasts about **10 min** (the server sends a `GoAway` before closing). Compression and session resumption are the features that make sessions *unlimited*.
- Token: `uses: 1`, session must start within **1 min**, token expires in 30 min. `liveConnectConstraints` lock the model, system instruction, response modalities and voice, and the locked config sets **no `contextWindowCompression` and no `sessionResumption`**, so a session can't be extended past the hard cap. During implementation I'll check against the current SDK docs that the lock really prevents the client from adding those fields (`lockAdditionalFields`), and note the result in `SECURITY.md`.
- **Worst-case voice budget:** 25 tokens/day × 15 min ≈ **6.25 h of audio/day** (down from ≈ 37 h). In practice ≈ 4 h because connections drop at ~10 min.
- Client UX: **auto-disconnect after 5 min** with a "session ended" message. This shortens normal sessions but is not a security control.

### P7: Error and output hygiene
- Only generic errors reach the client. `maxOutputTokens: 1024`, a 25 s upstream timeout, and the upstream request is aborted when the visitor disconnects.

### P8: Security headers + CSP rolled out in two steps 🆕
- **Step A (this build): `Content-Security-Policy-Report-Only`.** I test every section, then **Step B** switches it to enforcing in a separate commit, only once the console is clean. Step B is your call after you've browsed the live site.
- 🆕 **The inline theme script moves to `public/theme-init.js`** and loads as a normal blocking `<script src>` from `'self'`, so it still runs before first paint and needs no hash.
- ✅ Allowlist built from what the code actually loads. Some of your suggested entries turned out not to be needed:

| Directive | Sources | Why |
|-----------|---------|-----|
| `default-src` | `'self'` | |
| `script-src` | `'self'` | inline script removed |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | framer-motion writes inline styles |
| `font-src` | `'self' https://fonts.gstatic.com` | |
| `img-src` | `'self' data: blob: https://cdn.simpleicons.org` | skill icons, grain PNG data URI |
| `media-src` | `'self' blob: https://*.public.blob.vercel-storage.com` | narration MP3s, PoseCoach demo video |
| `connect-src` | `'self' https://api.github.com https://github-contributions-api.jogruber.de https://formspree.io wss://generativelanguage.googleapis.com` | client-side GitHub widgets, contact form, voice WebSocket |
| `frame-src` | `'self' https://drive.google.com` | résumé iframe + paper embed in the roadmap |
| `worker-src` | `'self' blob:` | future-proofing for an AudioWorklet (none today, ✅ only a comment) |
| `frame-ancestors` / `object-src` / `base-uri` / `form-action` | `'none'` / `'none'` / `'self'` / `'self' https://formspree.io` | |

  - ✅ **Not needed:** `*.hf.space` (no embeds), `avatars.githubusercontent.com` (no avatar images rendered), Vercel Analytics/Speed Insights (not installed).
  - Step A's testing will catch anything that's missing.
- Also: HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: microphone=(self), camera=()`, and `Cache-Control: no-store` on `/api/*`.

### P9: Privacy-safe logging + AI privacy notice 🆕
- Logs record endpoint, status, latency and hashed IP. Chat content is **never** logged or stored.
- 🆕 A short note next to the chat input and the mic button: *"Messages and voice audio are processed by Google Gemini. Don't share sensitive info."* It links to a new **Privacy** section that explains:
  - what is sent to Google
  - the IP-hash rate limiting and its 24 h retention
  - Formspree for the contact form
  - if your key is on Gemini's **free tier**, that Google may use inputs to improve its products
- ⚠️ I'll write factual, plain-language copy. It's not legal advice. Since you're in Germany, have the final Datenschutz/Impressum wording checked if you rely on it.

### P10: Google-side caps (manual) 🆕 corrected
- **A billing budget only sends alert emails. It doesn't stop spending.** The real Google-side cap is the **quota**: set a **per-day request limit** (primary) and a per-minute limit on the Generative Language API for the new key, and restrict the key to that API only. Keep a budget alert as notification only.

### P11: Dependency hygiene + secret scanning 🆕
- Pinned new dependencies (`@upstash/ratelimit`, `@upstash/redis`, `@vercel/functions`), plus `npm audit`.
- 🆕 **gitleaks** in two places:
  - a **GitHub Action** on every push/PR (no local install needed)
  - an opt-in local **pre-commit hook** (`scripts/hooks/pre-commit` plus a one-line setup command; needs the `gitleaks` binary installed locally)
- 🆕 Turn on **GitHub secret scanning + push protection** (repo settings, manual).

### P12: Verification before each commit
- `npm run lint` + `npm run build` + the no-secrets check on `dist/`.
- `scripts/test-api-security.mjs` calls the handlers directly and checks: `405` wrong method, `400` bad body, `403` wrong origin, `404` outside production, `429` over limit, and fail-closed behaviour when Redis is unreachable.

---

## Build stages (one commit each, one final push)

| Stage | Contents | Protocols |
|-------|----------|-----------|
| **1** | `api/chat.js`, `api/_lib/security.js`, `shared/personaPrompts.js`; client sends `{persona, messages}` trimmed to 20; key removed from client | P1, P2, P3, P5, P7, P9 logging |
| **2** | `api/_lib/rateLimit.js` (ordered limiters, ephemeral cache, fail closed), Upstash GitHub cache, friendly 429 UI | P2 cache, P4 |
| **3** | `api/live-token.js` with locked constraints; `useGeminiLive.js` on the constrained endpoint; 5-min auto-disconnect; debug logs removed | P6 |
| **4** | `vercel.json` headers + **Report-Only** CSP, `public/theme-init.js`, `.env.example`, no-secrets build check, gitleaks Action + hook, API security tests, `SECURITY.md` | P1, P8, P11, P12 |
| **5** | AI privacy notice next to the chat/mic + Privacy section | P9 notice |
| Later | Switch CSP to enforcing (separate commit after you've browsed the live site) | P8 step B |

---

## Your manual steps, in this order 🆕

> [!IMPORTANT]
> **Do steps 1–4 before I push.** That way the live site switches straight to the secure backend instead of showing "temporarily unavailable" while recruiters are looking. I'll commit each stage locally and **wait for your "env vars are set" before the final `git push`**.

1. **Check the old key's usage graph** in Google Cloud Console (APIs & Services → Generative Language API → Metrics) for unexpected traffic. Then **create a new key**, restrict it to the Generative Language API only, and set the per-day and per-minute **quotas**. Also note whether the key is on the free or paid tier (this goes into the privacy text). Delete the old key **after** the new deployment is live.
2. **Create a free Upstash Redis database** and copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. *(Recommended)* Create a **fine-grained GitHub token**: public repositories, read-only, no extra permissions.
4. **In Vercel → Settings → Environment Variables (Production):** add `GEMINI_API_KEY`, the Upstash pair, `RATE_LIMIT_SALT` (a long random string) and `GITHUB_TOKEN` (optional). **Remove `VITE_GEMINI_API_KEY`.**
5. **In GitHub repo settings → Code security:** turn on secret scanning + push protection. Optionally turn on Vercel Deployment Protection for previews.
6. **Locally:** rename the key in `.env` to `GEMINI_API_KEY`, add `ALLOW_DEV_AI=1`, and use `vercel dev` to test the AI features.

Things we're deliberately not doing: a git-history rewrite (pointless once the key is rotated) and a CAPTCHA (overkill unless real abuse shows up; Vercel Firewall attack mode is the switch to flip if it does).
