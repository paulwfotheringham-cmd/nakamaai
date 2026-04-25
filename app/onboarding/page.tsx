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
          text: "Helloâ€¦ I've been waiting for you.",
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
    "px-4 py-3 text-sm font-semibold border border-white/20 bg-[#1c4e63] text-white";

  const active =
    "bg-[#8EE26B] text-black border-transparent";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl space-y-6">

        {/* HEADER TEXT */}
        <p className="text-sm text-white/80 max-w-md">
          Thanks for signing up, in order for us to maximise your experience we provide a personal Guide for each user. 
          This Guide where you can choose how they look, talk and act will always be with you on your Nakama Nights experience.
        </p>

        {/* GUIDE ROW */}
        <div className="flex items-center gap-4">
          <div className={`${box} w-[140px]`}>SELECT GUIDE</div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = (guideIndex - 1 + guides.length) % guides.length;
                setGuideIndex(next);
                setGuide(guides[next]);
              }}
              className="h-11 w-11 rounded-full border border-white/25 bg-[#0f2f3d] text-xl text-white transition hover:border-white/45"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => setGuide(guides[guideIndex])}
              className={`rounded-xl border p-2 ${
                guide === guides[guideIndex] ? "border-green-400" : "border-white/20"
              }`}
            >
              <img
                src={`/guides/${guides[guideIndex]}`}
                alt="Guide option"
                className="h-28 w-auto object-contain"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                const next = (guideIndex + 1) % guides.length;
                setGuideIndex(next);
                setGuide(guides[next]);
              }}
              className="h-11 w-11 rounded-full border border-white/25 bg-[#0f2f3d] text-xl text-white transition hover:border-white/45"
            >
              ›
            </button>
          </div>
        </div>

        {/* VOICE ROW */}
        <div className="flex items-center gap-4">
          <div className={`${box} w-[140px]`}>SELECT VOICE</div>

          {voices.map((v) => (
            <div key={v.id} className="flex flex-col gap-2">
              <button
                onClick={() => setVoice(v.name)}
                className={`${box} ${voice === v.name ? active : ""}`}
              >
                {v.name}
              </button>

              <button
                type="button"
                onClick={() => playPreview(v.name)}
                className="text-xs px-3 py-1 bg-[#1c4e63] border border-white/20"
              >
                PREVIEW
              </button>
            </div>
          ))}
        </div>

        {/* TONE ROW */}
        <div className="flex items-center gap-4">
          <div className={`${box} w-[140px]`}>SELECT TONE</div>

          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`${box} ${tone === t ? active : ""}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6">
          <button
            onClick={handleSave}
            className="bg-yellow-500 px-6 py-3 text-black font-bold"
          >
            SAVE
          </button>
        </div>

      </div>

      <audio ref={audioRef} />
    </div>
  );
}

