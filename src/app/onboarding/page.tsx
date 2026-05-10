"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const GUIDE_CHOICES = [
  "imageedit_14_7182524648.png",
  "imageedit_15_8566388634.png",
  "imageedit_17_9927503197.png",
  "imageedit_19_7924513571.png",
  "imageedit_21_9491173695.png",
  "imageedit_23_8750666346.png",
  "imageedit_24_3470039515.png",
  "imageedit_26_9406286079.png",
  "imageedit_28_6534385177.png",
  "imageedit_30_3631305230.png",
  "imageedit_32_6036981563.png",
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const guideScrollerRef = useRef<HTMLDivElement | null>(null);

  const [guideIndex, setGuideIndex] = useState(0);
  const [guide, setGuide] = useState<string>(GUIDE_CHOICES[0]);
  const [voice, setVoice] = useState("Donny - Steady Presence");
  const [tone, setTone] = useState("Relaxed");

  const guides = GUIDE_CHOICES;
  const voices = [
    { id: "donny", name: "Donny - Steady Presence" },
    { id: "clint", name: "Clint - Rugged Actor" },
    { id: "damon", name: "Damon - Commanding Narrator" },
    { id: "cameron", name: "Cameron - Chill Companion" },
    { id: "alex", name: "Alex - Smooth Operator" }
  ];
  const tones = ["Relaxed", "Playful", "Intense"];

  const selectedGuide = guide;
  const selectedVoice = voice;
  const selectedTone = tone;

  const playPreview = async (voiceName: string) => {
    console.log("CLICKED PREVIEW:", voiceName);

    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice: voiceName,
          text: "Hello... I've been waiting for you.",
        }),
      });

      console.log("API STATUS:", res.status);

      if (!res.ok) {
        const err = await res.text();
        console.error("API ERROR:", err);
        return;
      }

      const blob = await res.blob();
      console.log("BLOB SIZE:", blob.size);

      const url = URL.createObjectURL(blob);

      if (!audioRef.current) {
        console.error("NO AUDIO REF");
        return;
      }

      const audio = audioRef.current;

      audio.pause();
      audio.currentTime = 0;

      audio.src = url;

      console.log("PLAYING AUDIO...");

      await audio.play();

      console.log("PLAY SUCCESS");

    } catch (err) {
      console.error("PREVIEW FAILED:", err);
    }
  };

  const handleSave = () => {
  localStorage.setItem("selectedGuide", selectedGuide || "");
  localStorage.setItem("selectedVoice", selectedVoice || "");
  localStorage.setItem("selectedTone", selectedTone || "");
  router.push("/dashboard");
};

  const box =
    "rounded-lg border border-[#2d4a57] bg-[#183848] px-3 py-2 text-xs font-semibold tracking-[0.08em] text-slate-100";

  const active =
    "border-[#8EE26B] bg-[#7fbf63]/85 text-black shadow-[0_0_0_1px_rgba(142,226,107,0.35)]";

  const scrollGuides = (direction: "left" | "right") => {
    const el = guideScrollerRef.current;
    if (!el) return;
    const amount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-8">

        {/* HEADER TEXT */}
        <p className="max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
          Thanks for signing up, in order for us to maximise your experience we provide a personal Guide for each user. 
          This Guide where you can choose how they look, talk and act will always be with you on your Nakama Nights experience.
        </p>

        {/* GUIDE ROW */}
        <div className="space-y-3">
          <div className={`${box} inline-flex`}>SELECT GUIDE</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollGuides("left")}
              className="h-11 w-11 shrink-0 rounded-full border border-white/25 bg-[#0f2f3d] text-xl text-white transition hover:border-white/45"
              aria-label="Scroll guides left"
            >
              ‹
            </button>

            <div
              ref={guideScrollerRef}
              className="flex min-w-0 flex-1 gap-3 overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {guides.map((g, idx) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGuide(g);
                    setGuideIndex(idx);
                  }}
                  className={`group relative h-36 w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-black transition ${
                    guide === g
                      ? "border-green-400 shadow-[0_0_0_1px_rgba(134,239,172,0.35)]"
                      : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <img
                    src={`/guides/${g}`}
                    alt="Guide option"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                  {guide === g && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent py-1 text-[10px] font-semibold tracking-[0.14em] text-green-300">
                      SELECTED
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollGuides("right")}
              className="h-11 w-11 shrink-0 rounded-full border border-white/25 bg-[#0f2f3d] text-xl text-white transition hover:border-white/45"
              aria-label="Scroll guides right"
            >
              ›
            </button>
          </div>
        </div>

        {/* VOICE ROW */}
        <div className="space-y-3">
          <div className={`${box} inline-flex`}>SELECT VOICE</div>

          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {voices.map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-1.5">
                <button
                  onClick={() => setVoice(v.name)}
                  className={`${box} flex-1 text-left ${voice === v.name ? active : ""}`}
                >
                  {v.name}
                </button>

                <button
                  type="button"
                  onClick={() => playPreview(v.name)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2d4a57] bg-[#173647] text-xs text-white transition hover:border-white/50"
                  aria-label={`Play preview for ${v.name}`}
                  title="Play preview"
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TONE ROW */}
        <div className="space-y-3">
          <div className={`${box} inline-flex`}>SELECT TONE</div>

          <div className="flex flex-wrap gap-2.5">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`${box} min-w-[120px] ${tone === t ? active : ""}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6">
          <button
            onClick={handleSave}
            className="rounded-lg border border-[#b89236] bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-2.5 text-sm font-bold text-black transition hover:from-amber-200 hover:to-amber-400"
          >
            SAVE
          </button>
        </div>

      </div>

      <audio ref={audioRef} />
    </div>
  );
}

