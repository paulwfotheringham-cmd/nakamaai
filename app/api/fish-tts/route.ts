import { NextRequest } from "next/server";
import { encode } from "@msgpack/msgpack";

export async function POST(req: NextRequest) {
  if (!process.env.FISH_AUDIO_API_KEY) {
    return Response.json(
      { error: "FISH_AUDIO_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  const { text, voiceId } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }

  const safeText = text.trim().slice(0, 3000);

  const body = encode({
    text: safeText,
    reference_id: voiceId,
    format: "mp3",
    mp3_bitrate: 128,
    streaming: false,
  });

  const response = await fetch("https://api.fish.audio/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
      "Content-Type": "application/msgpack",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json(
      { error: `Fish Audio API error: ${errorText}` },
      { status: response.status }
    );
  }

  // Fish Audio returns binary audio — convert to base64 data URL so the
  // client can play it directly without needing a storage bucket.
  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  const outputUri = `data:audio/mpeg;base64,${base64}`;

  return Response.json({ outputUri });
}
