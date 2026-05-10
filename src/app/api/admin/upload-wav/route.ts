import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 120;

function slugPart(s: string) {
  const x = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return x || "unnamed";
}

function authOk(req: Request, secret: string) {
  const h = req.headers.get("authorization");
  const token = h?.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!token || !secret) return false;
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.ADMIN_UPLOAD_SECRET?.trim();
  if (!secret) {
    return Response.json(
      { error: "Server misconfigured: ADMIN_UPLOAD_SECRET is not set." },
      { status: 503 }
    );
  }
  if (!authOk(req, secret)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return Response.json(
      { error: "Supabase URL or SUPABASE_SERVICE_ROLE_KEY missing." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const categoryTitle = String(form.get("categoryTitle") ?? "").trim();
  const itemName = String(form.get("itemName") ?? "").trim();
  const file = form.get("file");

  if (!categoryTitle || !itemName) {
    return Response.json(
      { error: "categoryTitle and itemName are required." },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }

  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".wav")) {
    return Response.json({ error: "Only .wav files are allowed." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return Response.json({ error: "Empty file." }, { status: 400 });
  }

  const storagePath = `admin-wav/${slugPart(categoryTitle)}/${slugPart(itemName)}.wav`;

  const supabase = createClient(url, serviceKey);
  const { error } = await supabase.storage.from("audio").upload(storagePath, buf, {
    contentType: "audio/wav",
    upsert: true,
  });

  if (error) {
    return Response.json(
      { error: `Storage upload failed: ${error.message}` },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    path: storagePath,
    bucket: "audio",
    savedAs: `${slugPart(itemName)}.wav`,
  });
}
