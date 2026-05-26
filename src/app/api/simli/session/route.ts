import { generateIceServers } from "simli-client";
import { NextResponse } from "next/server";
import { getOnboardingGuidesForServer } from "@/lib/guides/catalog.server";
import { getSimliApiKey, getSimliFaceId } from "@/lib/simli/config";
import { resolveSimliSessionToken } from "@/lib/simli/session-token";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function simliErrorMessage(detail?: string): string {
  if (detail === "INVALID_API_KEY") {
    return "Simli rejected your API key (invalid or revoked). Paste a new key from https://www.simli.com/ into SIMLI_API_KEY in .env.local and Vercel, then restart dev / redeploy.";
  }
  if (detail === "INVALID_FACE_ID") {
    return "This guide face is not available. Pick another guide or update SIMLI_FACE_* in Vercel.";
  }
  return detail || "Simli session failed";
}

export async function POST(req: Request) {
  const apiKey = getSimliApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "SIMLI_API_KEY is not configured" }, { status: 500 });
  }

  let faceId = getSimliFaceId();
  try {
    const body = (await req.json()) as { faceId?: string; guideId?: string };
    if (typeof body.guideId === "string" && body.guideId.trim()) {
      const guide = getOnboardingGuidesForServer().find((g) => g.id === body.guideId?.trim());
      if (guide) faceId = guide.simliFaceId;
    } else if (typeof body.faceId === "string" && body.faceId.trim()) {
      faceId = body.faceId.trim();
    }
  } catch {
    /* empty body is fine */
  }

  try {
    const [{ sessionToken, faceId: resolvedFaceId }, iceServers] = await Promise.all([
      resolveSimliSessionToken(apiKey, faceId),
      generateIceServers(apiKey),
    ]);

    return NextResponse.json({
      sessionToken,
      faceId: resolvedFaceId,
      iceServers,
      transport: "livekit" as const,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const status =
      message === "INVALID_API_KEY" ? 401 : message === "INVALID_FACE_ID" ? 400 : 502;
    return NextResponse.json({ error: simliErrorMessage(message) }, { status });
  }
}
