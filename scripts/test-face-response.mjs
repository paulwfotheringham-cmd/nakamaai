import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const line = fs
  .readFileSync(path.join(root, ".env.local"), "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("SIMLI_API_KEY="));
const key = line?.slice("SIMLI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");

async function test(id) {
  const res = await fetch("https://api.simli.ai/compose/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-simli-api-key": key },
    body: JSON.stringify({ faceId: id, handleSilence: true, model: "fasttalk" }),
  });
  const text = await res.text();
  console.log(id, "status", res.status, text.slice(0, 150));
}

for (const id of [
  "4145d354-fd78-4c29-b6b1-0663a04e8d7b",
  "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "00000000-0000-4000-8000-000000000000",
]) {
  await test(id);
}
