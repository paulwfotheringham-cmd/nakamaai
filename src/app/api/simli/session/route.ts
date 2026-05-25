import { NextResponse } from "next/server";

const DEFAULT_FACE_ID = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";

export async function POST() {
  const apiKey = process.env.SIMLI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SIMLI_API_KEY is not configured" }, { status: 500 });
  }

  const faceId = process.env.SIMLI_FACE_ID || DEFAULT_FACE_ID;

  try {
    const res = await fetch("https://api.simli.ai/compose/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-simli-api-key": apiKey,
      },
      body: JSON.stringify({
        faceId,
        handleSilence: true,
        maxSessionLength: 3600,
        maxIdleTime: 600,
        model: "fasttalk",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || "Simli session failed" }, { status: res.status });
    }

    const data = await res.json();
    const sessionToken = data.session_token ?? data.sessionToken;
    if (!sessionToken) {
      return NextResponse.json({ error: "No session token from Simli" }, { status: 502 });
    }

    return NextResponse.json({ sessionToken, faceId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Simli session error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
