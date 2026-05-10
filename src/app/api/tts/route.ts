import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.UNREALSPEECH_API_KEY) {
    return Response.json(
      { error: "UNREALSPEECH_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  const { text, voiceId } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }

  const safeText = text.trim().slice(0, 3000);

  // Per-voice pitch/speed tuning to make each voice distinctly different
  const VOICE_SETTINGS: Record<string, { pitch: string; speed: string }> = {
    Scarlett: { pitch: "1.05", speed: "0" },     // Young female — slightly bright
    Liv:      { pitch: "1.1",  speed: "0.05" },   // Young female — lighter, breezier
    Amy:      { pitch: "0.97", speed: "-0.05" },  // Mature female — measured, warm
    Dan:      { pitch: "0.95", speed: "0" },      // Young male — natural
    Will:     { pitch: "0.82", speed: "-0.1" },   // Mature male — deep, deliberate
  };

  const settings = VOICE_SETTINGS[voiceId] ?? { pitch: "1", speed: "0" };

  const response = await fetch("https://api.v7.unrealspeech.com/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UNREALSPEECH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Text: safeText,
      VoiceId: voiceId || "Scarlett",
      Bitrate: "192k",
      Speed: settings.speed,
      Pitch: settings.pitch,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json(
      { error: `Unrealspeech API error: ${errorText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json({ outputUri: data.OutputUri });
}
