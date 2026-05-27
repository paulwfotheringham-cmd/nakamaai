/** Default Cartesia voice UUIDs for onboarding / live-test (sonic-3). */
export const CARTESIA_VOICE_UUIDS = {
  donny: "d709a7e8-9495-4247-aef0-01b3207d11bf",
  clint: "db69127a-dbaf-4fa9-b425-2fe67680c348",
  damon: "dbfa416f-d5c3-4006-854b-235ef6bdf4fd",
  cameron: "df872fcd-da17-4b01-a49f-a80d7aaee95e",
  alex: "069ff31a-5524-4945-a403-f746ee617507",
} as const;

export type GuideVoiceKey = keyof typeof CARTESIA_VOICE_UUIDS;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isCartesiaVoiceUuid(value: string | undefined | null): value is string {
  return Boolean(value?.trim() && UUID_RE.test(value.trim()));
}

/** Env values on Vercel are sometimes `""`; treat as unset. */
export function readEnvUuid(...keys: (string | undefined)[]): string | undefined {
  for (const raw of keys) {
    const v = raw?.trim().replace(/^["']|["']$/g, "");
    if (isCartesiaVoiceUuid(v)) return v;
  }
  return undefined;
}
