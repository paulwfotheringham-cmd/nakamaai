import {
  CARTESIA_VOICE_UUIDS,
  isCartesiaVoiceUuid,
  readEnvUuid,
  type GuideVoiceKey,
} from "@/lib/guides/voices";

const ENV_BY_VOICE: Record<GuideVoiceKey, () => string | undefined> = {
  donny: () =>
    readEnvUuid(process.env.CARTESIA_VOICE_DONNY, process.env.CARTESIA_PREVIEW_DONNY_ID),
  clint: () =>
    readEnvUuid(process.env.CARTESIA_VOICE_CLINT, process.env.CARTESIA_PREVIEW_CLINT_ID),
  damon: () =>
    readEnvUuid(process.env.CARTESIA_VOICE_DAMON, process.env.CARTESIA_PREVIEW_DAMON_ID),
  cameron: () =>
    readEnvUuid(
      process.env.CARTESIA_VOICE_CAMERON,
      process.env.CARTESIA_PREVIEW_CAMERON_ID,
    ),
  alex: () =>
    readEnvUuid(process.env.CARTESIA_VOICE_ALEX, process.env.CARTESIA_PREVIEW_ALEX_ID),
};

/** Resolve Cartesia voice UUID from onboarding key, label, or raw UUID. */
export function resolveCartesiaVoiceId(voiceKey: string): string {
  const trimmed = voiceKey.trim();
  if (isCartesiaVoiceUuid(trimmed)) return trimmed;

  const key = voiceKey.trim().toLowerCase();

  for (const name of Object.keys(CARTESIA_VOICE_UUIDS) as GuideVoiceKey[]) {
    if (!key.includes(name)) continue;
    return ENV_BY_VOICE[name]() ?? CARTESIA_VOICE_UUIDS[name];
  }

  return ENV_BY_VOICE.donny() ?? CARTESIA_VOICE_UUIDS.donny;
}
