/**
 * Checks shared by every AI endpoint, in the order a request meets them
 * (SECURITY_PLAN.md, P1/P5):
 *
 *   1. method        → 405
 *   2. environment   → 404 in local dev unless ALLOW_DEV_AI=1
 *   3. origin        → 403 unless on the exact allowlist
 *   4. configuration → 503 if a required secret is missing (fail closed)
 */
import {
  errors,
  getMode,
  isAllowedOrigin,
  getClientIp,
  hashIp,
} from './security.js';

const DEV_SALT = 'local-dev-only-salt';

/**
 * @returns {{ response: Response } | { mode: string, ipHash: string, apiKey: string }}
 */
export function preflight(request, { env, method = 'POST' }) {
  if (request.method !== method) return { response: errors.methodNotAllowed(method) };

  const mode = getMode(env);
  if (mode === 'development' && env.ALLOW_DEV_AI !== '1') {
    return { response: errors.notFound() };
  }

  if (!isAllowedOrigin(request.headers.get('origin'), mode)) {
    return { response: errors.forbidden() };
  }

  const apiKey = env.GEMINI_API_KEY;
  const salt = env.RATE_LIMIT_SALT || (mode === 'development' ? DEV_SALT : '');
  if (!apiKey || !salt) return { response: errors.unavailable() };

  const ipHash = hashIp(getClientIp(request, mode), salt);
  return { mode, ipHash, apiKey };
}

