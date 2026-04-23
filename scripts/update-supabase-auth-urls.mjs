import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadPublicSupabaseUrlFromEnvLocal() {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = /^NEXT_PUBLIC_SUPABASE_URL=(.*)$/.exec(t);
    if (m) {
      let v = m[1].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      process.env.NEXT_PUBLIC_SUPABASE_URL = v;
      return;
    }
  }
}

loadPublicSupabaseUrlFromEnvLocal();

/**
 * Updates Supabase Auth site URL and redirect allow-list for nakamanights.com
 * using the Supabase Management API.
 *
 * Prerequisites:
 * 1. Create a personal access token: https://supabase.com/dashboard/account/tokens
 *    (needs auth_config_read + auth_config_write / project scope per Supabase docs)
 * 2. Export it, then run:
 *    set SUPABASE_ACCESS_TOKEN=your_token_here   (Windows CMD)
 *    $env:SUPABASE_ACCESS_TOKEN="your_token"     (PowerShell)
 *
 * Optional:
 *   SUPABASE_PROJECT_REF   (default: parsed from NEXT_PUBLIC_SUPABASE_URL in env)
 *   SITE_URL               (default: https://nakamanights.com)
 */

const SITE_URL = (process.env.SITE_URL || "https://nakamanights.com").replace(
  /\/$/,
  ""
);

const ADDITIONAL_URIS = [
  `${SITE_URL}`,
  `${SITE_URL}/**`,
  "https://nakamaai.vercel.app",
  "https://nakamaai.vercel.app/**",
];

function parseRefFromSupabaseUrl(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const m = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function mergeAllowList(existing) {
  const raw =
    typeof existing === "string"
      ? existing
      : existing == null
        ? ""
        : String(existing);
  const parts = raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const set = new Set(parts);
  for (const u of ADDITIONAL_URIS) set.add(u);
  return [...set].join(",");
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  let ref =
    process.env.SUPABASE_PROJECT_REF ||
    parseRefFromSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!ref) {
    console.error(
      "Missing project ref. Set SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL."
    );
    process.exit(1);
  }

  if (!token) {
    console.error(
      "Missing SUPABASE_ACCESS_TOKEN.\nCreate one at https://supabase.com/dashboard/account/tokens then export it and re-run:\n  node scripts/update-supabase-auth-urls.mjs"
    );
    process.exit(1);
  }

  const base = "https://api.supabase.com/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getRes = await fetch(`${base}/projects/${ref}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const current = await getRes.json().catch(() => ({}));
  if (!getRes.ok) {
    console.error("GET auth config failed:", getRes.status, current);
    process.exit(1);
  }

  const uri_allow_list = mergeAllowList(current.uri_allow_list);

  const body = {
    site_url: SITE_URL,
    uri_allow_list,
  };

  const patchRes = await fetch(`${base}/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const patched = await patchRes.json().catch(() => ({}));
  if (!patchRes.ok) {
    console.error("PATCH auth config failed:", patchRes.status, patched);
    process.exit(1);
  }

  console.log("Supabase Auth URLs updated.");
  console.log("  site_url:", SITE_URL);
  console.log("  uri_allow_list:", uri_allow_list);
}

main();
