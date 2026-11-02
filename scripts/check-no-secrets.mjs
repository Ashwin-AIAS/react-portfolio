/**
 * Build guard (SECURITY_PLAN.md, P1). Runs around `vite build`:
 *
 *   node scripts/check-no-secrets.mjs env    before the build
 *   node scripts/check-no-secrets.mjs dist   after the build
 *
 * `env`  fails if any VITE_* variable whose name contains KEY, SECRET or
 *        TOKEN is set in the environment or in a .env file Vite would load.
 *        Vite inlines every VITE_* variable into the public bundle.
 * `dist` fails if the built files contain anything that looks like a key or
 *        token, or the literal value of any server-side secret that is set.
 *
 * It only ever prints variable names, file paths and pattern labels, never
 * the matched text or a value.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SECRET_NAME = /^VITE_.*(KEY|SECRET|TOKEN|PASSWORD|SALT)/i;
const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
  '.env.development',
  '.env.development.local',
];
// Server-side variables whose values must never appear in the bundle.
const SERVER_SECRETS = [
  'GEMINI_API_KEY',
  'RATE_LIMIT_SALT',
  'GITHUB_TOKEN',
  'UPSTASH_REDIS_REST_TOKEN',
  'KV_REST_API_TOKEN',
  'KV_REST_API_READ_ONLY_TOKEN',
  'VERCEL_OIDC_TOKEN',
];
const PATTERNS = [
  ['Google API key (AIza…)', /AIza[0-9A-Za-z_-]{30,}/],
  ['GitHub fine-grained token', /github_pat_[0-9A-Za-z_]{20,}/],
  ['GitHub classic token', /gh[pousr]_[0-9A-Za-z]{30,}/],
  ['Gemini ephemeral token', /auth_tokens\/[0-9A-Za-z_-]{20,}/],
  ['key in a Google API URL', /googleapis\.com[^"'`\s]*[?&]key=/],
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

/** Names (never values) of variables defined in an env file. */
function envFileNames(file) {
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/))
    .filter(Boolean)
    .map((m) => m[1]);
}

/** Values of server secrets, from the environment and local env files. */
function serverSecretValues() {
  const values = new Set();
  for (const name of SERVER_SECRETS) {
    if (process.env[name]) values.add(process.env[name]);
  }
  for (const f of ENV_FILES) {
    const file = join(ROOT, f);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m && SERVER_SECRETS.includes(m[1])) {
        const v = m[2].trim().replace(/^(["'])(.*)\1$/, '$2');
        if (v) values.add(v);
      }
    }
  }
  // Very short values would match by accident; real secrets are long.
  return [...values].filter((v) => v.length >= 12);
}

function checkEnv() {
  const problems = [];
  for (const name of Object.keys(process.env)) {
    if (SECRET_NAME.test(name)) problems.push(`environment variable ${name}`);
  }
  for (const f of ENV_FILES) {
    const file = join(ROOT, f);
    if (!existsSync(file)) continue;
    for (const name of envFileNames(file)) {
      if (SECRET_NAME.test(name)) problems.push(`${name} in ${f}`);
    }
  }
  return problems.map((p) => `${p}: VITE_* variables are bundled into public JS. Drop the VITE_ prefix and read it in api/ instead.`);
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function checkDist() {
  const dist = join(ROOT, 'dist');
  if (!existsSync(dist)) return ['dist/ does not exist; run the build first'];
  const problems = [];
  const secrets = serverSecretValues();
  for (const file of walk(dist)) {
    if (!/\.(js|mjs|cjs|css|html|json|map|txt|svg|webmanifest)$/i.test(file)) continue;
    const text = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    for (const [label, re] of PATTERNS) {
      if (re.test(text)) problems.push(`${rel}: looks like a ${label}`);
    }
    if (secrets.some((v) => text.includes(v))) {
      problems.push(`${rel}: contains the value of a server-side secret`);
    }
  }
  return problems;
}

const mode = process.argv[2];
if (mode !== 'env' && mode !== 'dist') {
  console.error('usage: node scripts/check-no-secrets.mjs env|dist');
  process.exit(2);
}
const problems = mode === 'env' ? checkEnv() : checkDist();
if (problems.length) {
  console.error(`\n✖ check-no-secrets (${mode}) failed:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}
console.log(`✔ check-no-secrets (${mode}): clean`);
