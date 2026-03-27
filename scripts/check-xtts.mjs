#!/usr/bin/env node
/**
 * Quick health check: GET XTTS_SERVER_URL/health
 * Usage: node scripts/check-xtts.mjs
 * Requires XTTS_SERVER_URL in env or .env.local (not loaded here — export or use dotenv manually).
 */
const base = process.env.XTTS_SERVER_URL?.replace(/\/$/, "");
if (!base) {
  console.error("Set XTTS_SERVER_URL (e.g. export XTTS_SERVER_URL=https://....runpod.net)");
  process.exit(1);
}
const path = process.env.XTTS_HEALTH_PATH || "/health";
const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
const res = await fetch(url);
const text = await res.text();
console.log(res.status, text.slice(0, 500));
process.exit(res.ok ? 0 : 1);
