"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GuideType = "Man" | "Woman" | "Something else";
type FlowStep =
  | "intro"
  | "guideType"
  | "appearance"
  | "skinTone"
  | "facialHair"
  | "voice"
  | "tone"
  | "time"
  | "creating";

const GUIDE_TYPES: GuideType[] = ["Man", "Woman", "Something else"];

const APPEARANCE_CARDS = [
  { id: "a1", src: "https://picsum.photos/seed/nakama-guide-1/400/520", label: "Option 1" },
  { id: "a2", src: "https://picsum.photos/seed/nakama-guide-2/400/520", label: "Option 2" },
  { id: "a3", src: "https://picsum.photos/seed/nakama-guide-3/400/520", label: "Option 3" },
  { id: "a4", src: "https://picsum.photos/seed/nakama-guide-4/400/520", label: "Option 4" },
  { id: "a5", src: "https://picsum.photos/seed/nakama-guide-5/400/520", label: "Option 5" },
] as const;

const SKIN_OPTIONS = ["Light", "Medium", "Deep"] as const;
const FACIAL_OPTIONS = ["None", "Stubble", "Full beard"] as const;
const VOICE_OPTIONS = [
  { id: "v1", label: "Warm & low" },
  { id: "v2", label: "Bright & clear" },
  { id: "v3", label: "Soft & smooth" },
  { id: "v4", label: "Rich & steady" },
] as const;
const TONE_OPTIONS = ["Intimate", "Playful", "Commanding"] as const;
const TIME_OPTIONS = ["Evenings", "Weekends", "Whenever I need"] as const;

function playPlaceholderTone(freqHz: number) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freqHz;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.36);
    osc.onended = () => void ctx.close();
  } catch {
    // ignore if AudioContext unavailable
  }
}

function optionCardClass(selected: boolean) {
  return [
    "rounded-2xl border-2 px-5 py-4 text-left transition duration-200",
    "bg-zinc-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm",
    selected
      ? "border-amber-300/90 shadow-[0_0_0_1px_rgba(252,211,77,0.25),0_12px_40px_rgba(0,0,0,0.55)] ring-2 ring-amber-200/30"
      : "border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-900",
  ].join(" ");
}

function imageCardClass(selected: boolean) {
  return [
    "group relative overflow-hidden rounded-2xl border-2 transition duration-200",
    "aspect-[4/5] w-full max-w-[140px] sm:max-w-[160px]",
    selected
      ? "border-amber-300/90 ring-2 ring-amber-200/35 shadow-[0_0_0_1px_rgba(252,211,77,0.2),0_16px_48px_rgba(0,0,0,0.6)]"
      : "border-zinc-700/80 hover:border-zinc-500",
  ].join(" ");
}

export default function OnboardingPage() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [guideType, setGuideType] = useState<GuideType | null>(null);
  const [appearanceId, setAppearanceId] = useState<string | null>(null);
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [facialHair, setFacialHair] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [timePref, setTimePref] = useState<string | null>(null);

  const isMan = guideType === "Man";
  const creatingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMan) setFacialHair(null);
  }, [isMan]);

  const goNextFromSkin = useCallback(() => {
    setStep(isMan ? "facialHair" : "voice");
  }, [isMan]);

  const goBackFromVoice = useCallback(() => {
    setStep(isMan ? "facialHair" : "skinTone");
  }, [isMan]);

  const stepTitle = useMemo(() => {
    switch (step) {
      case "intro":
        return "Create your Guide";
      case "guideType":
        return "Who is your Guide?";
      case "appearance":
        return "Choose an appearance";
      case "skinTone":
        return "Skin tone";
      case "facialHair":
        return "Facial hair";
      case "voice":
        return "Voice";
      case "tone":
        return "Tone";
      case "time":
        return "When do you listen?";
      case "creating":
        return "Almost there";
      default:
        return "";
    }
  }, [step]);

  const stepSubtitle = useMemo(() => {
    switch (step) {
      case "intro":
        return "A few choices — then your Guide is ready to meet you.";
      case "guideType":
        return "Pick the type that fits your fantasy.";
      case "appearance":
        return "Select the look that draws you in.";
      case "skinTone":
        return "Choose what feels right.";
      case "facialHair":
        return "Fine-tune the face.";
      case "voice":
        return "Tap to preview a short tone.";
      case "tone":
        return "How should they speak to you?";
      case "time":
        return "We’ll tune suggestions to your rhythm.";
      case "creating":
        return "We’re shaping your Guide from your choices.";
      default:
        return "";
    }
  }, [step]);

  function handleStartCreating() {
    setStep("creating");
    if (creatingTimer.current) clearTimeout(creatingTimer.current);
    creatingTimer.current = setTimeout(() => {
      creatingTimer.current = null;
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-black text-stone-200">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full space-y-10 text-center">
          <header className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              Nakama Nights
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {stepTitle}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-400 sm:text-base">
              {stepSubtitle}
            </p>
          </header>

          {step === "intro" && (
            <div className="flex flex-col items-center gap-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
              <button
                type="button"
                onClick={() => setStep("guideType")}
                className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-amber-200/50 bg-amber-100/95 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:bg-amber-50 hover:shadow-[0_16px_48px_rgba(251,191,36,0.2)]"
              >
                Start
              </button>
            </div>
          )}

          {step === "guideType" && (
            <div className="space-y-8">
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {GUIDE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGuideType(t)}
                    className={optionCardClass(guideType === t)}
                  >
                    <span className="block text-sm font-medium text-stone-100">{t}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("intro")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!guideType}
                  onClick={() => setStep("appearance")}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "appearance" && (
            <div className="space-y-8">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {APPEARANCE_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setAppearanceId(card.id)}
                    className={imageCardClass(appearanceId === card.id)}
                  >
                    <img
                      src={card.src}
                      alt={card.label}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    {appearanceId === card.id && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("guideType")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!appearanceId}
                  onClick={() => setStep("skinTone")}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "skinTone" && (
            <div className="space-y-8">
              <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-3">
                {SKIN_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkinTone(s)}
                    className={optionCardClass(skinTone === s)}
                  >
                    <span className="text-sm font-medium text-stone-100">{s}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("appearance")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!skinTone}
                  onClick={goNextFromSkin}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "facialHair" && (
            <div className="space-y-8">
              <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-3">
                {FACIAL_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFacialHair(f)}
                    className={optionCardClass(facialHair === f)}
                  >
                    <span className="text-sm font-medium text-stone-100">{f}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("skinTone")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!facialHair}
                  onClick={() => setStep("voice")}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "voice" && (
            <div className="space-y-8">
              <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
                {VOICE_OPTIONS.map((v, i) => {
                  const freqs = [220, 330, 440, 275];
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVoiceId(v.id);
                        playPlaceholderTone(freqs[i] ?? 300);
                      }}
                      className={optionCardClass(voiceId === v.id)}
                    >
                      <span className="block text-sm font-medium text-stone-100">{v.label}</span>
                      <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-stone-500">
                        Tap to preview
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={goBackFromVoice}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!voiceId}
                  onClick={() => setStep("tone")}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "tone" && (
            <div className="space-y-8">
              <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-3">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={optionCardClass(tone === t)}
                  >
                    <span className="text-sm font-medium text-stone-100">{t}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("voice")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!tone}
                  onClick={() => setStep("time")}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "time" && (
            <div className="space-y-8">
              <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-3">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimePref(t)}
                    className={optionCardClass(timePref === t)}
                  >
                    <span className="text-sm font-medium text-stone-100">{t}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("tone")}
                  className="rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 transition hover:border-zinc-500 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!timePref}
                  onClick={handleStartCreating}
                  className="rounded-full border border-amber-200/50 bg-amber-100/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Finish
                </button>
              </div>
            </div>
          )}

          {step === "creating" && (
            <div className="flex flex-col items-center gap-10 py-6">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-amber-300/90 border-r-amber-200/50" />
              </div>
              <p className="font-serif text-2xl text-white sm:text-3xl">Creating your Guide...</p>
              <p className="max-w-sm text-sm text-stone-500">
                This is a preview flow — your choices stay on this device until we connect a backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
