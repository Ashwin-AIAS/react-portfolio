/**
 * Vercel Function: POST /api/live-token. See api/_lib/liveToken.js.
 * Every method is routed to the handler so non-POST requests get a proper
 * 405 with an Allow header instead of a platform default.
 */
import { createLiveTokenHandler } from './_lib/liveToken.js';

const handler = createLiveTokenHandler({ env: process.env });

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
