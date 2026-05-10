import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Voice = {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: string | null;
  accent: string | null;
  age: string | null;
  is_public: boolean;
};

const DEFAULT_VOICES: Voice[] = [
  {
    id: "naughty",
    name: "naughty",
    description: "Reference WAV on the pod (/speakers/naughty.wav). Match id to filename without .wav.",
    language: "en",
    gender: "female",
    accent: null,
    age: null,
    is_public: true,
  },
  {
    id: "werewolf",
    name: "werewolf",
    description: "Reference WAV on the pod (e.g. /speakers/werewolf.wav). Match id to filename without .wav.",
    language: "en",
    gender: "female",
    accent: null,
    age: null,
    is_public: true,
  },
];

export async function GET() {
  const raw = process.env.XTTS_VOICES_JSON;
  if (raw?.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const voices = Array.isArray(parsed)
        ? parsed
        : (parsed as { voices?: Voice[] }).voices;
      if (Array.isArray(voices) && voices.length > 0) {
        return NextResponse.json({ voices, total: voices.length });
      }
    } catch {
      /* use default */
    }
  }
  return NextResponse.json({ voices: DEFAULT_VOICES, total: DEFAULT_VOICES.length });
}
