/** Login email for username `nakama` (Supabase still uses email+password). */
export const NAKAMA_LOGIN_EMAIL = "nakama@nakamanights.com";

export function resolveLoginEmail(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes("@")) return trimmed;
  if (trimmed.toLowerCase() === "nakama") return NAKAMA_LOGIN_EMAIL;
  return `${trimmed}@nakamanights.com`;
}
