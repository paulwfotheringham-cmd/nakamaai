"use client";

import { useEffect, useRef, useState } from "react";

const dialogueMap = {
  business: [
    "You’ve had a long day, haven’t you?",
    "Come here… let me take control tonight."
  ],
  pirate: [
    "Ah… a curious one, aren’t you?",
    "Careful… I don’t play gentle."
  ],
  victorian: [
    "You shouldn’t be here…",
    "And yet… I’m very glad you are."
  ],
  army: ["Stand still.", "I’ll tell you exactly what to do."],
  highland: [
    "Come closer…",
    "I’ve been thinking about you all day."
  ]
} as const;

type GuideType = keyof typeof dialogueMap;

export default function GuidePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [guideImage, setGuideImage] = useState("/guides/GUIDE1.png");
  const [guideType, setGuideType] = useState<GuideType>("business");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTap, setShowTap] = useState(false);

  const lines = dialogueMap[guideType];

  // Load selected guide
  useEffect(() => {
    const stored = localStorage.getItem("selectedGuide");
    if (stored) {
      setGuideImage(`/guides/${stored}`);

      if (stored === "GUIDE1.png") setGuideType("business");
      if (stored === "GUIDE2.png") setGuideType("pirate");
      if (stored === "GUIDE3.png") setGuideType("victorian");
      if (stored === "GUIDE4.png") setGuideType("army");
      if (stored === "GUIDE5.png") setGuideType("highland");
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

  useEffect(() => {
    if (lineIndex !== 1) return;

    const t = setTimeout(() => {
      setShowTap(true);
    }, 1200); // slight delay after second line

    return () => clearTimeout(t);
  }, [lineIndex]);

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
        <>
          <p className="mt-10 text-center px-6 text-xl tracking-wide text-white/80 animate-subtitle-in">
            {currentText}
          </p>
          {showTap && !hasInteracted && (
            <p className="mt-4 text-sm text-white/40 animate-subtitle-in">
              Tap to continue
            </p>
          )}
        </>
      )}
    </div>
  );
}
