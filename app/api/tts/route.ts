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
      Speed: "0",
      Pitch: "1",
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
