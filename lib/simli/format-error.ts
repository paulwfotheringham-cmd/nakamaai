import { isSimliRateLimitError } from "@/lib/simli/connection-guard";

/** simli-client often rejects with plain strings (e.g. "CONNECTION TIMED OUT"). */
export function formatSimliError(e: unknown): string {
  const raw =
    typeof e === "string" && e.trim()
      ? e.trim()
      : e instanceof Error && e.message.trim()
        ? e.message.trim()
        : "Simli init failed";

  if (isSimliRateLimitError(raw)) {
    return "Simli rate limit — wait about 30 seconds, then tap Retry (only one avatar session can run at a time).";
  }

  return raw;
}
