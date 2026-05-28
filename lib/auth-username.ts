/** Normalize username for storage and lookup (lowercase, trimmed). */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

const USERNAME_RE = /^[a-zA-Z0-9_]{3,24}$/;

export function validateUsername(username: string): string | null {
  const raw = username.trim();
  if (!raw) return "Username is required.";
  if (!USERNAME_RE.test(raw)) {
    return "Username must be 3–24 characters (letters, numbers, underscore only).";
  }
  if (raw.toLowerCase() === "nakama") {
    return "That username is reserved.";
  }
  return null;
}
