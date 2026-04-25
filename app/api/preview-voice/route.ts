import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.CARTESIA_API_KEY) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));

  const text =
    typeof body.text === "string" && body.text.trim()
      ? body.text.trim()
      : "Hello… I've been waiting for you.";

  const voiceId = "d46abd1d-9f16-4e59-b5e1-8d4c4d2c8f6c";

  const res = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.CARTESIA_API_KEY!,
      "Cartesia-Version": "2025-04-16",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: "sonic-3",
      transcript: text,
      language: "en",
      voice: { mode: "id", id: voiceId },
      output_format: {
        container: "mp3",
        sample_rate: 44100,
        bit_rate: 128000,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: 500 });
  }

  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
