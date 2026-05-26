/**
 * Usage: node scripts/verify-simli-key.mjs
 * Reads SIMLI_API_KEY from .env.local and tests POST /compose/token
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

function loadSimliKey() {
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local at project root");
    process.exit(1);
  }
  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("SIMLI_API_KEY="));
  if (!line) {
    console.error("SIMLI_API_KEY not set in .env.local");
    process.exit(1);
  }
  const value = line.slice("SIMLI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  if (!value) {
    console.error("SIMLI_API_KEY is empty — paste your new Simli key in .env.local");
    process.exit(1);
  }
  return value;
}

const apiKey = loadSimliKey();
const faceId = "5514e24d-6086-46a3-ace4-6a7264e5cb7c";

const res = await fetch("https://api.simli.ai/compose/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-simli-api-key": apiKey,
  },
  body: JSON.stringify({
    faceId,
    handleSilence: true,
    maxSessionLength: 3600,
    maxIdleTime: 600,
    model: "fasttalk",
  }),
});

const data = await res.json();
if (res.ok && data.session_token && data.detail !== "INVALID_API_KEY") {
  console.log("OK — Simli API key is valid (session token received).");
  process.exit(0);
}

console.error("FAIL —", data.detail || data, `(HTTP ${res.status})`);
process.exit(1);
