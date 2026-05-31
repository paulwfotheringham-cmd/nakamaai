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
if (!apiKey) {
  console.error("No SIMLI_API_KEY");
  process.exit(1);
}

const res = await fetch("https://api.simli.ai/faces", {
  headers: { "x-simli-api-key": apiKey },
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
