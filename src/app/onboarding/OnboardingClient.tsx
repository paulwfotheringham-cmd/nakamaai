"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import SimliAvatar, { type SimliAvatarHandle } from "@/components/SimliAvatar";
import {
  GUIDE_TONES,
  GUIDE_VOICES,
  getOnboardingGuides,
  type GuideTone,
  type OnboardingGuide,
} from "@/lib/guides/catalog";
import { readAccountUsername } from "@/lib/account-username";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
  resolveGuideDisplayName,
  writeGuidePreferences,
} from "@/lib/guides/preferences";

export default function OnboardingClient() {
  const router = useRouter();
  const simliRef = useRef<SimliAvatarHandle>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const guides = useMemo(() => getOnboardingGuides(), []);
  const [selectedGuide, setSelectedGuide] = useState<OnboardingGuide>(() => guides[0]);
  const [guideDisplayNames, setGuideDisplayNames] = useState<Record<string, string>>(() => {
    const saved = readGuidePreferences().guideDisplayNames ?? {};
    const initial: Record<string, string> = {};
    for (const g of getOnboardingGuides()) {
      initial[g.id] = saved[g.id]?.trim() || g.name;
    }
    return initial;
  });
  const [voiceId, setVoiceId] = useState(GUIDE_VOICES[0].id);
  const [tone, setTone] = useState<GuideTone>("Relaxed");
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedVoice = useMemo(
    () => GUIDE_VOICES.find((v) => v.id === voiceId) ?? GUIDE_VOICES[0],
    [voiceId],
  );

  const displayNameFor = (guide: OnboardingGuide) =>
    guideDisplayNames[guide.id]?.trim() || guide.name;

  const selectedDisplayName = displayNameFor(selectedGuide);

  const setGuideDisplayName = (guideId: string, name: string) => {
    setGuideDisplayNames((prev) => ({ ...prev, [guideId]: name }));
  };

  const playVoicePreview = async (previewKey: string, label: string) => {
    setPreviewingVoice(previewKey);
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: label,
          text: `Hi, I'm ${selectedDisplayName}. I'll be your guide on Nakama Nights.`,
        }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.src = url;
      await audio.play();
    } catch {
      /* ignore preview errors */
    } finally {
      setPreviewingVoice(null);
    }
  };

  const handleSave = () => {
    setSaving(true);
    const names: Record<string, string> = {};
    for (const g of guides) {
      const custom = guideDisplayNames[g.id]?.trim();
      names[g.id] = custom || g.name;
    }

    writeGuidePreferences({
      guideId: selectedGuide.id,
      guideName: resolveGuideDisplayName(selectedGuide.id, names),
      simliFaceId: selectedGuide.simliFaceId,
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      tone,
      userName:
        readAccountUsername() ||
        readGuidePreferences().userName ||
        DEFAULT_USER_NAME,
      guideDisplayNames: names,
    });
    router.push("/live-test");
  };

  return (
    <main className="relative min-h-screen bg-black text-white antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_-10%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      <Link
        href="/select-plan"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-amber-900/40 bg-zinc-950/90 px-4 py-2.5 text-sm font-medium text-amber-100/90 shadow-sm backdrop-blur-sm transition hover:border-amber-700/50 hover:bg-zinc-900"
      >
        ← Back
      </Link>

      <img
        src="/Nakama-AI-July25-White.png"
        alt="Nakama Nights"
        className="pointer-events-none absolute right-8 top-6 z-20 h-[52px] w-auto sm:h-[63px]"
      />

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-600/85">
            Choose your guide
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Meet your{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
              Nakama
            </span>{" "}
            guide
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-400">
            Pick who will accompany you — face, voice, and tone. Your guide stays with you
            on your dashboard and in every conversation.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500/90">
                Select guide
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                3 men · 1 woman · tap to preview · rename each guide below
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {guides.map((guide) => {
                  const active = selectedGuide.id === guide.id;
                  const defaultName = guide.name;
                  return (
                    <div
                      key={guide.id}
                      className={`rounded-2xl border text-left transition ${
                        active
                          ? "border-amber-400/60 bg-gradient-to-b from-amber-950/40 to-zinc-950 shadow-[0_0_0_1px_rgba(251,191,36,0.2)]"
                          : "border-stone-800/80 bg-zinc-950/60 hover:border-amber-800/50 hover:bg-zinc-900/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGuide(guide)}
                        className="w-full p-4 pb-2 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
                            {guide.gender}
                          </p>
                          {active && (
                            <span className="shrink-0 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-snug text-stone-400">{guide.tagline}</p>
                      </button>
                      <div className="px-4 pb-4 pt-0">
                        <label
                          htmlFor={`guide-name-${guide.id}`}
                          className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-stone-500"
                        >
                          Guide name
                        </label>
                        <input
                          id={`guide-name-${guide.id}`}
                          type="text"
                          value={guideDisplayNames[guide.id] ?? defaultName}
                          onChange={(e) => setGuideDisplayName(guide.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={() => setSelectedGuide(guide)}
                          maxLength={32}
                          placeholder={defaultName}
                          className="w-full rounded-lg border border-stone-700/80 bg-black/50 px-2.5 py-2 font-serif text-lg font-semibold text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500/90">
                Select voice
              </h2>
              <ul className="mt-4 space-y-2">
                {GUIDE_VOICES.map((v) => {
                  const active = voiceId === v.id;
                  return (
                    <li
                      key={v.id}
                      className={`flex items-center gap-2 rounded-xl border p-1.5 transition ${
                        active
                          ? "border-amber-500/40 bg-amber-950/20"
                          : "border-stone-800/80 bg-zinc-950/50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setVoiceId(v.id)}
                        className={`min-w-0 flex-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                          active ? "text-amber-100" : "text-stone-300 hover:text-white"
                        }`}
                      >
                        {v.name}
                      </button>
                      <button
                        type="button"
                        disabled={previewingVoice === v.previewKey}
                        onClick={() => void playVoicePreview(v.previewKey, v.name)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-800/40 bg-black/40 text-xs text-amber-200 transition hover:border-amber-500/50 hover:bg-amber-950/30 disabled:opacity-50"
                        aria-label={`Preview ${v.name}`}
                      >
                        ▶
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500/90">
                Select tone
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {GUIDE_TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition ${
                      tone === t
                        ? "border-amber-400/50 bg-gradient-to-b from-amber-200 to-amber-600 text-zinc-950"
                        : "border-stone-700 bg-zinc-950/80 text-stone-300 hover:border-amber-800/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-amber-900/30 bg-gradient-to-b from-zinc-950/95 to-black p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
                Live preview
              </p>
              <p className="mt-1 font-serif text-xl text-white">{selectedDisplayName}</p>
              <div className="mt-4 aspect-[4/5] max-h-[min(52vh,420px)] w-full overflow-hidden rounded-xl border border-stone-800/80 bg-black">
                <SimliAvatar
                  key={selectedGuide.id}
                  ref={simliRef}
                  guideId={selectedGuide.id}
                  faceId={selectedGuide.simliFaceId}
                  className="h-full w-full rounded-xl"
                />
              </div>
              <p className="mt-3 text-center text-xs text-stone-500">
                Powered by Simli · {tone} tone
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="mt-6 w-full rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-6 py-4 text-center text-sm font-bold text-zinc-950 shadow-md transition hover:from-amber-100 hover:to-amber-500 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save & go to dashboard"}
            </button>
          </div>
        </div>
      </section>

      <audio ref={audioRef} className="sr-only" />
    </main>
  );
}
