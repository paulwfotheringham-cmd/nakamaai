/**
 * OpenAI API key — server-only. Never use NEXT_PUBLIC_OPENAI_API_KEY.
 */
export function getOpenAIApiKey(): string | null {
  const raw = process.env.OPENAI_API_KEY?.trim();
  if (!raw) return null;
  const unquoted = raw.replace(/^["']|["']$/g, "").trim();
  if (!unquoted || unquoted === "PASTE_OPENAI_API_KEY_HERE") return null;
  return unquoted;
}
