import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.CARTESIA_API_KEY) {
    return Response.json({ error: "CARTESIA_API_KEY not set" }, { status: 500 });
  }

  const { text, voiceId, language: langIn } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }

  if (!voiceId || typeof voiceId !== "string" || !voiceId.trim()) {
    return Response.json({ error: "No voice id provided." }, { status: 400 });
  }

  const language = (() => {
    if (typeof langIn !== "string" || !langIn.trim()) return "en";
    const m = langIn.trim().toLowerCase().match(/^([a-z]{2})/);
    return m ? m[1] : "en";
  })();

  let res: Response;
  try {
    res = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.CARTESIA_API_KEY,
        // MP3 output requires `bit_rate`; see https://docs.cartesia.ai/api-reference/tts/bytes
        "Cartesia-Version": "2025-04-16",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-3",
        transcript: text.trim().slice(0, 15000),
        language,
        voice: {
          mode: "id",
          id: voiceId.trim(),
        },
        output_format: {
          container: "mp3",
          sample_rate: 44100,
          bit_rate: 128000,
        },
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Cartesia fetch error:", msg);
    return Response.json({ error: `Network error calling Cartesia: ${msg}` }, { status: 502 });
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "(no body)");
    console.error(`Cartesia TTS error ${res.status}:`, errorText);
    return Response.json(
      { error: `Cartesia error ${res.status}: ${errorText}` },
      { status: res.status }
    );
  }

  const audioBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  const upstreamType = res.headers.get("content-type")?.split(";")[0]?.trim();
  const mime =
    upstreamType && upstreamType.startsWith("audio/")
      ? upstreamType
      : "audio/mpeg";
  const outputUri = `data:${mime};base64,${base64}`;

  return Response.json({ outputUri });
}
