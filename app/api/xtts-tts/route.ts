import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** Vercel Pro+ can raise this; Hobby caps lower. */
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const base = process.env.XTTS_SERVER_URL?.replace(/\/$/, "");
  if (!base) {
    return Response.json(
      {
        error:
          "XTTS_SERVER_URL is not set. Add your Runpod (or tunnel) base URL with no trailing slash to .env.local and Vercel Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  const path = process.env.XTTS_TTS_PATH || "/tts";
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const { text, voiceId } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }
  if (!voiceId || typeof voiceId !== "string") {
    return Response.json({ error: "No voiceId provided." }, { status: 400 });
  }

  const trimmedText = text.trim().slice(0, 50_000);
  const voiceField = process.env.XTTS_VOICE_FIELD || "voice_id";
  const body: Record<string, string> = { text: trimmedText };
  body[voiceField] = voiceId.trim();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = process.env.XTTS_API_KEY;
  if (key) headers.Authorization = `Bearer ${key}`;
  if (process.env.XTTS_NGROK_BYPASS === "1" || process.env.XTTS_NGROK_BYPASS === "true") {
    headers["ngrok-skip-browser-warning"] = "69420";
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: `XTTS server unreachable: ${msg}` }, { status: 502 });
  }

  const ct = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok) {
    const errBody = ct.includes("application/json")
      ? JSON.stringify(await upstream.json().catch(() => ({})))
      : await upstream.text();
    const t = errBody;
    if (
      t.includes("ERR_NGROK_") ||
      /endpoint .+ is offline/i.test(t) ||
      (t.includes("ngrok") && t.includes("offline"))
    ) {
      return Response.json(
        {
          error:
            "Ngrok tunnel is offline or the URL changed. Update XTTS_SERVER_URL in .env.local / Vercel and restart or redeploy.",
        },
        { status: 502 }
      );
    }
    return Response.json(
      { error: `XTTS upstream error (${upstream.status}): ${t.slice(0, 2000)}` },
      {
        status:
          upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502,
      }
    );
  }

  if (ct.includes("application/json")) {
    const j = (await upstream.json()) as Record<string, unknown>;
    if (typeof j.outputUri === "string" && j.outputUri.length > 0) {
      return Response.json({ outputUri: j.outputUri });
    }
    for (const k of ["output_url", "audio_url", "url"] as const) {
      const v = j[k];
      if (typeof v === "string" && v.length > 0 && (v.startsWith("http") || v.startsWith("data:"))) {
        return Response.json({ outputUri: v });
      }
    }
    const audio = j.audio;
    if (typeof audio === "string" && audio.length > 0) {
      if (audio.startsWith("http://") || audio.startsWith("https://") || audio.startsWith("data:")) {
        return Response.json({ outputUri: audio });
      }
      const fmt = String(j.output_format ?? "wav").toLowerCase();
      const mime = fmt.includes("mp3") ? "audio/mpeg" : "audio/wav";
      return Response.json({ outputUri: `data:${mime};base64,${audio}` });
    }
    return Response.json(
      { error: "XTTS JSON response missing outputUri or audio.", keys: Object.keys(j) },
      { status: 502 }
    );
  }

  const buf = await upstream.arrayBuffer();
  const mime = ct.split(";")[0].trim() || "audio/wav";
  const b64 = Buffer.from(buf).toString("base64");
  return Response.json({ outputUri: `data:${mime};base64,${b64}` });
}
