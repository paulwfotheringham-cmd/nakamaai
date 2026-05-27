import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const key = env.match(/CARTESIA_API_KEY=["']?([^"'\n]+)/)?.[1]?.trim();
if (!key) {
  console.error("No CARTESIA_API_KEY");
  process.exit(1);
}

const res = await fetch("https://api.cartesia.ai/voices", {
  headers: { "X-API-Key": key, "Cartesia-Version": "2024-06-10" },
});
const voices = await res.json();
const list = Array.isArray(voices) ? voices : voices.data ?? [];

const names = ["donny", "clint", "damon", "cameron", "alex"];
for (const n of names) {
  const v = list.find((x) => (x.name || "").toLowerCase().includes(n));
  console.log(n, v?.id ?? "NOT FOUND", v?.name ?? "");
}
