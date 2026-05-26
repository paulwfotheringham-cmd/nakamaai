/** simli-client often rejects with plain strings (e.g. "CONNECTION TIMED OUT"). */
export function formatSimliError(e: unknown): string {
  if (typeof e === "string" && e.trim()) return e.trim();
  if (e instanceof Error && e.message.trim()) return e.message.trim();
  return "Simli init failed";
}
