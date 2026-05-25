/**
 * Simli API key — server-only (Route Handlers / Server Actions).
 * Never use NEXT_PUBLIC_* for this secret; the browser uses /api/simli/session instead.
 */
export function getSimliApiKey(): string | null {
  const raw = process.env.SIMLI_API_KEY?.trim();
  if (!raw) return null;
  // Vercel CLI pull sometimes wraps values in quotes
  const unquoted = raw.replace(/^["']|["']$/g, "").trim();
  return unquoted || null;
}

export const DEFAULT_SIMLI_FACE_ID = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";

export function getSimliFaceId(): string {
  const raw = process.env.SIMLI_FACE_ID?.trim();
  if (!raw) return DEFAULT_SIMLI_FACE_ID;
  return raw.replace(/^["']|["']$/g, "").trim() || DEFAULT_SIMLI_FACE_ID;
}
