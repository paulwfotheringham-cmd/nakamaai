#!/usr/bin/env node
/**
 * Stop then resume your XTTS Runpod so it pulls a fresh :latest image (if configured).
 * Add to .env.local: RUNPOD_API_KEY=... (Runpod → Settings → API Keys)
 * Pod id: RUNPOD_POD_ID or auto from XTTS_SERVER_URL (…/{podId}-{port}.proxy.runpod.net)
 *
 * Usage: npm run restart-runpod-xtts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const fileEnv = loadEnvLocal();
const env = { ...fileEnv, ...process.env };
const key = env.RUNPOD_API_KEY?.trim();
let podId = env.RUNPOD_POD_ID?.trim();
const xtts = env.XTTS_SERVER_URL?.trim();

if (!podId && xtts) {
  const u = xtts.match(/https?:\/\/([a-z0-9]+)-(\d+)\.proxy\.runpod\.net/i);
  if (u) podId = u[1];
}

if (!key) {
  console.error(
    "Missing RUNPOD_API_KEY. Add it to .env.local (Runpod console → Settings → API Keys), then run again."
  );
  process.exit(1);
}
if (!podId) {
  console.error(
    "Missing pod id. Set RUNPOD_POD_ID in .env.local or a valid XTTS_SERVER_URL Runpod proxy URL."
  );
  process.exit(1);
}

const gpuCount = Math.max(1, parseInt(env.RUNPOD_GPU_COUNT || "1", 10) || 1);

async function gql(query) {
  const r = await fetch(`https://api.runpod.io/graphql?api_key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return r.json();
}

const qid = JSON.stringify(podId);
console.log(`Runpod: stopping pod ${podId} …`);
let j = await gql(`mutation { podStop(input: { podId: ${qid} }) { id desiredStatus } }`);
if (j.errors?.length) {
  console.error("podStop:", JSON.stringify(j.errors, null, 2));
  process.exit(1);
}
console.log("podStop:", j.data?.podStop);

const waitMs = Math.max(3000, parseInt(env.RUNPOD_RESTART_WAIT_MS || "12000", 10) || 12000);
console.log(`Waiting ${waitMs}ms before resume…`);
await new Promise((r) => setTimeout(r, waitMs));

console.log(`Resuming pod ${podId} (gpuCount=${gpuCount}) …`);
j = await gql(
  `mutation { podResume(input: { podId: ${qid}, gpuCount: ${gpuCount} }) { id desiredStatus } }`
);
if (j.errors?.length) {
  console.error("podResume:", JSON.stringify(j.errors, null, 2));
  process.exit(1);
}
console.log("podResume:", j.data?.podResume);
console.log("Done. Allow 1–3 minutes for the image to start and XTTS to load.");
