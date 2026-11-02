/**
 * Vercel Function: POST /api/chat. See api/_lib/chatHandler.js.
 * Every method is routed to the handler so non-POST requests get a proper
 * 405 with an Allow header instead of a platform default.
 */
import { createChatHandler } from './_lib/chatHandler.js';

const handler = createChatHandler({ env: process.env });

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

