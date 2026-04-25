"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [guide, setGuide] = useState("GUIDE1.png");
  const [voice, setVoice] = useState("Donny - Steady Presence");
  const [tone, setTone] = useState("Relaxed");

  const guides = ["GUIDE1.png", "GUIDE2.png", "GUIDE3.png", "GUIDE4.png", "GUIDE5.png"];
  const voices = [
    { id: "donny", name: "Donny - Steady Presence" },
    { id: "clint", name: "Clint - Rugged Actor" },
    { id: "damon", name: "Damon - Commanding Narrator" },
    { id: "cameron", name: "Cameron - Chill Companion" },
    { id: "alex", name: "Alex - Smooth Operator" }
  ];
  const tones = ["Relaxed", "Playful", "Intense"];

  const playPreview = (voiceName: string) => {
    // TEMP: use same intro audio for all previews (until real voice API wired)
    if (!audioRef.current) return;
    audioRef.current.src = "/audio/intro.mp3";
    audioRef.current.play().catch(() => {});
  };

  const handleSave = () => {
    localStorage.setItem("selectedGuide", guide);
    localStorage.setItem("selectedVoice", voice);
    localStorage.setItem("selectedTone", tone);

    router.push("/guide");
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

          {guides.map((g) => (
            <button
              key={g}
              onClick={() => setGuide(g)}
              className={`p-2 border ${
                guide === g ? "border-green-400" : "border-white/20"
              }`}
            >
              <img
                src={`/guides/${g}`}
                alt={g}
                className="h-28 w-auto object-contain"
              />
            </button>
          ))}
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
            className="bg-yellow-400 text-black px-6 py-3 font-bold"
          >
            SAVE
          </button>
        </div>

      </div>

      <audio ref={audioRef} />
    </div>
  );
}
