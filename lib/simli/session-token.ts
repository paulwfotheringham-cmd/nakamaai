import { DEFAULT_SIMLI_FACE_ID } from "@/lib/simli/config";

export type SimliTokenResponse = {
  session_token?: string;
  detail?: string;
};

/** Simli may return HTTP 400 with detail + session_token; simli-client throws on non-OK. */
export async function fetchSimliSessionToken(
  apiKey: string,
  faceId: string,
): Promise<SimliTokenResponse> {
  const response = await fetch("https://api.simli.ai/compose/token", {
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

  const text = await response.text();
  let data: SimliTokenResponse = {};
  try {
    data = JSON.parse(text) as SimliTokenResponse;
  } catch {
    if (!response.ok) {
      throw new Error(text || `Simli token failed (${response.status})`);
    }
  }

  if (!response.ok && !data.session_token) {
    throw new Error(data.detail || text || `Simli token failed (${response.status})`);
  }

  return data;
}

export async function resolveSimliSessionToken(
  apiKey: string,
  requestedFaceId: string,
): Promise<{ sessionToken: string; faceId: string }> {
  let faceId = requestedFaceId.trim() || DEFAULT_SIMLI_FACE_ID;
  let data = await fetchSimliSessionToken(apiKey, faceId);

  if (data.detail === "INVALID_FACE_ID" && faceId !== DEFAULT_SIMLI_FACE_ID) {
    faceId = DEFAULT_SIMLI_FACE_ID;
    data = await fetchSimliSessionToken(apiKey, faceId);
  }

  if (!data.session_token) {
    throw new Error(data.detail || "Simli session failed");
  }

  if (data.detail === "INVALID_FACE_ID") {
    throw new Error("INVALID_FACE_ID");
  }

  return { sessionToken: data.session_token, faceId };
}
