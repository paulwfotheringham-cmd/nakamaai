import { generateIceServers, generateSimliSessionToken } from "simli-client";
import { NextResponse } from "next/server";
import { getSimliApiKey, getSimliFaceId } from "@/lib/simli/config";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type SimliTokenResponse = {
  session_token?: string;
  detail?: string;
};

function simliErrorMessage(detail?: string): string {
  if (detail === "INVALID_API_KEY") {
    return "Simli rejected your API key (invalid or revoked). Paste a new key from https://www.simli.com/ into SIMLI_API_KEY in .env.local and Vercel, then restart dev / redeploy.";
  }
  return detail || "Simli session failed";
}

export async function POST(req: Request) {
  const apiKey = getSimliApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "SIMLI_API_KEY is not configured" }, { status: 500 });
  }

  let requestedFaceId: string | undefined;
  try {
    const body = (await req.json()) as { faceId?: string };
    if (typeof body.faceId === "string" && body.faceId.trim()) {
      requestedFaceId = body.faceId.trim();
    }
  } catch {
    /* empty body is fine */
  }

  const faceId = requestedFaceId || getSimliFaceId();
  const config = {
    faceId,
    handleSilence: true,
    maxSessionLength: 3600,
    maxIdleTime: 600,
    model: "fasttalk" as const,
  };

  try {
    const [data, iceServers] = await Promise.all([
      generateSimliSessionToken({ apiKey, config }) as Promise<SimliTokenResponse>,
      generateIceServers(apiKey),
    ]);

    if (data.detail === "INVALID_API_KEY" || !data.session_token) {
      return NextResponse.json(
        { error: simliErrorMessage(data.detail) },
        { status: data.detail === "INVALID_API_KEY" ? 401 : 502 },
      );
    }

    return NextResponse.json({
      sessionToken: data.session_token,
      faceId,
      iceServers,
      transport: "livekit" as const,
    });
  } catch (e) {
    let detail: string | undefined;
    if (typeof e === "string") {
      try {
        const parsed = JSON.parse(e) as SimliTokenResponse;
        detail = parsed.detail;
      } catch {
        return NextResponse.json({ error: e }, { status: 502 });
      }
    } else if (e instanceof Error) {
      try {
        const parsed = JSON.parse(e.message) as SimliTokenResponse;
        detail = parsed.detail;
      } catch {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: simliErrorMessage(detail) },
      { status: detail === "INVALID_API_KEY" ? 401 : 500 },
    );
  }
}
