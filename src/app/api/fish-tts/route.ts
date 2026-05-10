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

  // Fish Audio TTS uses msgpack-encoded request body.
  // reference_id is the voice model _id from the /model catalogue.
  const msgpackBody = encode({
    text: safeText,
    reference_id: voiceId ?? null,
    format: "mp3",
    mp3_bitrate: 128,
    normalize: true,
    streaming: false,
  });

  let response: Response;
  try {
    response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        "Content-Type": "application/msgpack",
        "model": "speech-1.6",
      },
      body: msgpackBody,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Fish Audio fetch error:", msg);
    return Response.json({ error: `Network error calling Fish Audio: ${msg}` }, { status: 502 });
  }

  if (!response.ok) {
    // Surface the real error so the frontend can display it.
    const errorText = await response.text().catch(() => "(no body)");
    console.error(`Fish Audio TTS error ${response.status}:`, errorText);
    return Response.json(
      { error: `Fish Audio error ${response.status}: ${errorText}` },
      { status: response.status }
    );
  }

  // Response is a binary MP3 stream — read it all then return as data URL.
  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  const outputUri = `data:audio/mpeg;base64,${base64}`;

  return Response.json({ outputUri });
}
