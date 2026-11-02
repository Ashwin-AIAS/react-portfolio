/**
 * GitHub context for the chat prompt (SECURITY_PLAN.md, P2).
 *
 * Fetched server-side so the browser can't inject its own "context", using a
 * fine-grained read-only token when GITHUB_TOKEN is set (Vercel's outbound IPs
 * are shared, so the unauthenticated 60/hour limit isn't reliable).
 *
 * The result is cached in Redis for 10 minutes, not in function memory:
 * serverless instances don't share memory and lose it on cold starts. With no
 * Redis (local dev only) it is simply fetched each time.
 */

const CACHE_KEY = 'portfolio:github-context:v1';
const CACHE_TTL_SECONDS = 600;
const GITHUB_URL = 'https://api.github.com/users/Ashwin-AIAS/repos?sort=updated&per_page=10';
const FALLBACK = 'GitHub data unavailable.';

export async function getGithubContext({ env, redis = null, fetchImpl = fetch }) {
  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (typeof cached === 'string' && cached.length > 0) return cached;
    } catch {
      // A cache miss is not worth failing the chat for; carry on and fetch.
    }
  }

  let context = FALLBACK;
  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'react-portfolio-ai',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

    const res = await fetchImpl(GITHUB_URL, { headers, signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        context = repos
          .slice(0, 10)
          .map((r) => {
            const name = String(r?.name ?? '').slice(0, 100);
            const desc = String(r?.description || 'No description').slice(0, 300);
            const lang = String(r?.language || 'N/A').slice(0, 40);
            return `- ${name}: ${desc} (Language: ${lang})`;
          })
          .join('\n');
      }
    }
  } catch {
    // Network error or timeout: fall through to the fallback text.
  }

  if (redis && context !== FALLBACK) {
    try {
      await redis.set(CACHE_KEY, context, { ex: CACHE_TTL_SECONDS });
    } catch {
      /* best effort */
    }
  }
  return context;
}

