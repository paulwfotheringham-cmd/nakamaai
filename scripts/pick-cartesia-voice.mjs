import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const key = env.match(/CARTESIA_API_KEY="([^"]+)"/)?.[1];
if (!key) {
  console.error("No CARTESIA_API_KEY in .env.local");
  process.exit(1);
}

const res = await fetch("https://api.cartesia.ai/voices", {
  headers: { "X-API-Key": key, "Cartesia-Version": "2024-06-10" },
});
const voices = await res.json();
const list = Array.isArray(voices) ? voices : voices.data ?? [];
const donny = list.find((v) => (v.name || "").toLowerCase().includes("donny"));
const male = list.find((v) => (v.gender || "").toLowerCase() === "masculine");
const pick = donny || male || list[0];
console.log(JSON.stringify({ id: pick?.id, name: pick?.name, gender: pick?.gender }, null, 2));
