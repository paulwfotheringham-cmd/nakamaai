import { NextRequest } from "next/server";

function resolveVoiceId(voiceName: string): string | null {
  const key = voiceName.trim();
  const table: Record<string, string> = {
    "Donny - Steady Presence": process.env.CARTESIA_PREVIEW_DONNY_ID ?? "",
    "Clint - Rugged Actor": process.env.CARTESIA_PREVIEW_CLINT_ID ?? "",
    "Damon - Commanding Narrator": process.env.CARTESIA_PREVIEW_DAMON_ID ?? "",
    "Cameron - Chill Companion": process.env.CARTESIA_PREVIEW_CAMERON_ID ?? "",
    "Alex - Smooth Operator": process.env.CARTESIA_PREVIEW_ALEX_ID ?? "",
  };
  const id = table[key]?.trim();
  if (id) return id;
  const fallback = process.env.CARTESIA_PREVIEW_VOICE_ID?.trim();
  return fallback || null;
}

export async function POST(req: NextRequest) {
  if (!process.env.CARTESIA_API_KEY) {
    return Response.json({ error: "CARTESIA_API_KEY not set" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const voice = typeof body.voice === "string" ? body.voice : "";
  const text =
    typeof body.text === "string" && body.text.trim()
      ? body.text.trim()
      : "Hello… I've been waiting for you.";

  const voiceId = resolveVoiceId(voice);
  if (!voiceId) {
    return Response.json(
      {
        error:
          "No Cartesia voice id for this preview. Set CARTESIA_PREVIEW_VOICE_ID or CARTESIA_PREVIEW_*_ID env vars.",
      },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.CARTESIA_API_KEY,
        "Cartesia-Version": "2025-04-16",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-3",
        transcript: text.slice(0, 15000),
        language: "en",
        voice: { mode: "id", id: voiceId },
        output_format: {
          container: "mp3",
          sample_rate: 44100,
          bit_rate: 128000,
        },
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("preview-voice Cartesia fetch:", msg);
    return Response.json({ error: `Network error: ${msg}` }, { status: 502 });
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "(no body)");
    console.error(`preview-voice Cartesia ${res.status}:`, errorText);
    return Response.json(
      { error: `Cartesia error ${res.status}: ${errorText}` },
      { status: res.status }
    );
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
