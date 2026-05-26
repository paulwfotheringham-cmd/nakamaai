import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const line = fs
  .readFileSync(path.join(root, ".env.local"), "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("SIMLI_API_KEY="));
const key = line?.slice("SIMLI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");

async function isValidFace(faceId) {
  const res = await fetch("https://api.simli.ai/compose/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-simli-api-key": key },
    body: JSON.stringify({
      faceId,
      handleSilence: true,
      model: "fasttalk",
    }),
  });
  const data = await res.json();
  return Boolean(data.session_token) && data.detail !== "INVALID_FACE_ID";
}

const urls = [
  "https://raw.githubusercontent.com/simliai/create-simli-app-openai/main/app/page.tsx",
  "https://raw.githubusercontent.com/simliai/create-simli-app-elevenlabs/main/app/page.tsx",
  "https://raw.githubusercontent.com/simliai/create-simli-app-dailybot/main/app/page.tsx",
  "https://raw.githubusercontent.com/simliai/simli-millis-demo/main/app/page.tsx",
];

const uuidRe =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;

const seen = new Set();
for (const url of urls) {
  try {
    const text = await (await fetch(url)).text();
    for (const m of text.matchAll(uuidRe)) seen.add(m[0].toLowerCase());
  } catch {
    /* ignore */
  }
}

seen.add("5514e24d-6086-46a3-ace4-6a7264e5cb7c");
seen.add("6ebf0aa7-6fed-443d-a4c6-fd1e3080b215");

const valid = [];
for (const id of seen) {
  if (await isValidFace(id)) valid.push(id);
  if (valid.length >= 6) break;
}

console.log("Valid faces:", valid.length);
valid.forEach((id) => console.log(id));
