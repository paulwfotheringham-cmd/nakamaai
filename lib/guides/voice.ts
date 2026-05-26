/** Resolve Cartesia voice id from onboarding voice key (matches preview-voice route). */
export function resolveCartesiaVoiceId(voiceKey: string): string {
  const key = voiceKey.toLowerCase();
  const map: Record<string, string | undefined> = {
    donny: process.env.CARTESIA_VOICE_DONNY ?? process.env.CARTESIA_PREVIEW_DONNY_ID,
    clint: process.env.CARTESIA_VOICE_CLINT ?? process.env.CARTESIA_PREVIEW_CLINT_ID,
    damon: process.env.CARTESIA_VOICE_DAMON ?? process.env.CARTESIA_PREVIEW_DAMON_ID,
    cameron:
      process.env.CARTESIA_VOICE_CAMERON ?? process.env.CARTESIA_PREVIEW_CAMERON_ID,
    alex: process.env.CARTESIA_VOICE_ALEX ?? process.env.CARTESIA_PREVIEW_ALEX_ID,
  };

  for (const [name, envVoiceId] of Object.entries(map)) {
    if (key.includes(name) && envVoiceId?.trim()) {
      return envVoiceId.trim().replace(/^["']|["']$/g, "");
    }
  }

  const fallback =
    process.env.CARTESIA_PREVIEW_DONNY_ID ??
    process.env.CARTESIA_VOICE_DONNY ??
    "d709a7e8-9495-4247-aef0-01b3207d11bf";
  return fallback.trim().replace(/^["']|["']$/g, "");
}
