import { NextResponse } from "next/server";
import { hasLiveTestTts, synthesizeLiveTestPcm16 } from "@/lib/live-test/providers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const voiceKey = typeof body?.voiceId === "string" ? body.voiceId.trim() : undefined;

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (!hasLiveTestTts()) {
    return NextResponse.json(
      {
        error:
          "No TTS configured. Set OPENAI_API_KEY or CARTESIA_API_KEY on Vercel.",
      },
      { status: 500 },
    );
  }

  try {
    const pcm16 = await synthesizeLiveTestPcm16(text, voiceKey);
    return new NextResponse(Buffer.from(pcm16), {
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