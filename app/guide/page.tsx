"use client";

import { useEffect, useRef, useState } from "react";

const lines = [
  "Hello… I've been waiting for you.",
  "Let me take care of you tonight.",
] as const;

const FIRST_LINE_MS = 2200;
const FADE_OUT_MS = 580;
const BETWEEN_LINES_MS = 160;

export default function GuidePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [isLineExiting, setIsLineExiting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [guideImage, setGuideImage] = useState("/guides/GUIDE1.png");

  useEffect(() => {
    const stored = localStorage.getItem("selectedGuide");
    if (stored) {
      setGuideImage(`/guides/${stored}`);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let fallbackTimer: ReturnType<typeof setTimeout>;
    let speakingTimer: ReturnType<typeof setTimeout>;

    const onPlaying = () => {
      clearTimeout(fallbackTimer);
      clearTimeout(speakingTimer);
      speakingTimer = setTimeout(() => setIsSpeaking(true), 400);
    };

    audio.addEventListener("playing", onPlaying, { once: true });
    audio.volume = 0.3;

    fallbackTimer = setTimeout(() => setIsSpeaking(true), 800);
    void audio.play().catch(() => {});

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(speakingTimer);
      audio.removeEventListener("playing", onPlaying);
    };
  }, []);

  useEffect(() => {
    if (!isSpeaking) return;

    setLineIndex(0);
    setIsLineExiting(false);
    setHasInteracted(false);

    const exitTimer = setTimeout(() => setIsLineExiting(true), FIRST_LINE_MS);
    const secondLineTimer = setTimeout(() => {
      setLineIndex(1);
      setIsLineExiting(false);
    }, FIRST_LINE_MS + FADE_OUT_MS + BETWEEN_LINES_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(secondLineTimer);
    };
  }, [isSpeaking]);

  const subtitleClass =
    "px-6 text-center font-serif text-lg font-light tracking-[0.14em] text-white/58 sm:text-xl md:text-2xl md:tracking-[0.16em]";

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-black cursor-pointer"
      onClick={() => {
        if (!hasInteracted) {
          setHasInteracted(true);
        }
      }}
    >
      <audio
        ref={audioRef}
        src="/audio/intro.mp3"
        preload="auto"
        playsInline
        autoPlay
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-10">
        <div className="animate-fade-in">
          <img
            src={guideImage}
            alt=""
            className="animate-alive h-[min(78vh,860px)] w-auto max-w-[min(92vw,520px)] object-contain will-change-transform [filter:drop-shadow(0_28px_50px_rgba(0,0,0,0.95))_drop-shadow(0_12px_36px_rgba(0,0,0,0.85))]"
          />
        </div>
      </div>

      {isSpeaking ? (
        <div className="flex flex-col items-center px-6 pb-16">
          {hasInteracted ? (
            <p key="after-tap" className={`${subtitleClass} animate-subtitle-in`}>
              Good… just relax.
            </p>
          ) : (
            <p
              key={lineIndex}
              className={`${subtitleClass} ${
                lineIndex === 1
                  ? "animate-subtitle-in"
                  : isLineExiting
                    ? "animate-subtitle-out"
                    : "animate-subtitle-in"
              }`}
            >
              {lines[lineIndex]}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
