import { NextResponse } from "next/server";

const DEFAULT_FACE_ID = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";

type SimliTokenResponse = {
  session_token?: string;
  sessionToken?: string;
  detail?: string;
};

function simliErrorMessage(detail?: string): string {
  if (detail === "INVALID_API_KEY") {
    return "Simli rejected your API key (invalid or revoked). Create a new key at https://www.simli.com/ and set SIMLI_API_KEY in .env.local and Vercel, then restart dev / redeploy.";
  }
  return detail || "Simli session failed";
}

export async function POST() {
  const apiKey = process.env.SIMLI_API_KEY?.trim();
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
        apiVersion: "v2",
        handleSilence: true,
        maxSessionLength: 3600,
        maxIdleTime: 600,
        audioInputFormat: "pcm16",
      }),
    });

    const data = (await res.json().catch(() => ({}))) as SimliTokenResponse;
    const sessionToken = data.session_token ?? data.sessionToken;

    if (data.detail === "INVALID_API_KEY" || (!sessionToken && data.detail)) {
      return NextResponse.json({ error: simliErrorMessage(data.detail) }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: simliErrorMessage(data.detail) }, { status: res.status });
    }

    if (!sessionToken) {
      return NextResponse.json({ error: "No session token from Simli" }, { status: 502 });
    }

    return NextResponse.json({ sessionToken, faceId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Simli session error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
