import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const line = fs
  .readFileSync(path.join(root, ".env.local"), "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("SIMLI_API_KEY="));
const key = line?.slice("SIMLI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");

async function testFace(faceId) {
  const res = await fetch("https://api.simli.ai/compose/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-simli-api-key": key },
    body: JSON.stringify({
      faceId,
      handleSilence: true,
      maxSessionLength: 3600,
      maxIdleTime: 600,
      model: "fasttalk",
    }),
  });
  const data = await res.json();
  const ok = Boolean(data.session_token) && data.detail !== "INVALID_FACE_ID";
  return { ok, detail: data.detail, status: res.status };
}

const candidates = [
  ["frank", "5514e24d-6086-46a3-ace4-6a7264e5cb7c"],
  ["marcus", "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215"],
  ["clint", "0f0e5f59-2e42-4f5e-9f3d-8b2c4d6e8f0a"],
  ["sienna", "7c9e6679-7425-40de-944b-e07fc1f90ae7"],
];

for (const [name, id] of candidates) {
  const r = await testFace(id);
  console.log(name, id, r.ok ? "OK" : `FAIL (${r.detail || r.status})`);
}
