import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
const line = fs
  .readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("SIMLI_API_KEY="));
const apiKey = line?.slice("SIMLI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");

const faceId = process.argv[2];
if (!apiKey || !faceId) {
  console.error("Usage: node scripts/verify-simli-face.mjs <faceId>");
  process.exit(1);
}

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
console.log(faceId, res.status, data.detail || (data.session_token ? "OK" : data));
