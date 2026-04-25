"use client";

import { useEffect, useRef, useState } from "react";

export default function GuidePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [guideImage, setGuideImage] = useState("/guides/GUIDE1.png");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const lines = [
    "Hello… I’ve been waiting for you.",
    "Let me take care of you tonight."
  ];

  // Load selected guide
  useEffect(() => {
    const stored = localStorage.getItem("selectedGuide");
    if (stored) {
      setGuideImage(`/guides/${stored}`);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    // Always trigger speaking regardless of autoplay
    const t = setTimeout(() => {
      setIsSpeaking(true);
    }, 600);

    return () => clearTimeout(t);
  }, []);

  // Line progression
  useEffect(() => {
    if (!isSpeaking) return;

    // show first line clearly first
    setLineIndex(0);

    const t = setTimeout(() => {
      setLineIndex(1);
    }, 3000); // longer so user actually sees it

    return () => clearTimeout(t);
  }, [isSpeaking]);

  const handleClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const currentText = hasInteracted
    ? "Good… just relax."
    : lines[lineIndex];

  return (
    <div
      onClick={handleClick}
      className="relative flex min-h-screen flex-col items-center justify-center bg-black cursor-pointer"
    >
      <audio ref={audioRef} src="/audio/intro.mp3" />

      <img
        src={guideImage}
        alt=""
        className="h-[70vh] object-contain animate-alive"
      />

      {isSpeaking && (
        <p className="mt-10 text-center px-6 text-xl tracking-wide text-white/80 animate-subtitle-in">
          {currentText}
        </p>
      )}
    </div>
  );
}
