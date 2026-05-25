import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAIApiKey } from "@/lib/openai/config";

/** Downsample mono PCM16 24kHz → 16kHz (Simli expects 16kHz PCM16). */
function downsamplePcm24kTo16k(pcm24: Buffer): Buffer {
  const samples24 = new Int16Array(
    pcm24.buffer,
    pcm24.byteOffset,
    pcm24.byteLength / 2,
  );
  const ratio = 24000 / 16000;
  const outLen = Math.floor(samples24.length / ratio);
  const out = new Int16Array(outLen);
  for (let i = 0; i < outLen; i++) {
    out[i] = samples24[Math.floor(i * ratio)] ?? 0;
  }
  return Buffer.from(out.buffer, out.byteOffset, out.byteLength);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: text.slice(0, 4096),
      response_format: "pcm",
    });

    const pcm24 = Buffer.from(await speech.arrayBuffer());
    const pcm16 = downsamplePcm24kTo16k(pcm24);

    return new NextResponse(new Uint8Array(pcm16), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(pcm16.length),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "TTS failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
