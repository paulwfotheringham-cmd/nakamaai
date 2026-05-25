/**
 * Set Simli API key locally + Vercel Production, verify, then redeploy.
 * Usage: node scripts/set-simli-key.mjs YOUR_NEW_SIMLI_KEY
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.argv[2]?.trim().replace(/^["']|["']$/g, "");
if (!key) {
  console.error("Usage: node scripts/set-simli-key.mjs YOUR_NEW_SIMLI_KEY");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
if (/^SIMLI_API_KEY=/m.test(env)) {
  env = env.replace(/^SIMLI_API_KEY=.*$/m, `SIMLI_API_KEY=${key}`);
} else {
  env = `SIMLI_API_KEY=${key}\n${env}`;
}
if (!/^OPENAI_API_KEY=/m.test(env)) {
  env += "\nOPENAI_API_KEY=\n";
}
fs.writeFileSync(envPath, env.trim() + "\n");
console.log("Updated .env.local");

const verify = path.join(root, "scripts", "verify-simli-key.mjs");
execSync(`node "${verify}"`, { stdio: "inherit", cwd: root, env: { ...process.env } });

console.log("Updating Vercel Production SIMLI_API_KEY…");
try {
  execSync(`npx vercel env rm SIMLI_API_KEY production --yes`, { cwd: root, stdio: "inherit" });
} catch {
  /* may not exist */
}
execSync(`npx vercel env add SIMLI_API_KEY production --value "${key}" --yes`, {
  cwd: root,
  stdio: "inherit",
});

console.log("Deploying production…");
execSync("npx vercel deploy --prod --yes", { cwd: root, stdio: "inherit" });
console.log("Done. Test https://nakamanights.com/live-test");
