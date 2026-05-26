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

/** Simli preset "Frank" — younger male concierge (official OpenAI starter). */
export const DEFAULT_SIMLI_FACE_ID = "5514e24d-6086-46a3-ace4-6a7264e5cb7c";

export function getSimliFaceId(): string {
  const raw = process.env.SIMLI_FACE_ID?.trim();
  if (!raw) return DEFAULT_SIMLI_FACE_ID;
  return raw.replace(/^["']|["']$/g, "").trim() || DEFAULT_SIMLI_FACE_ID;
}
