"use client";

import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const [guide, setGuide] = useState("/guides/GUIDE1.png");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const g = localStorage.getItem("selectedGuide");
    if (g) setGuide(`/guides/${g}`);

    speak("Hello… welcome to your dashboard.");
  }, []);

  const speak = async (text: string) => {
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white p-10 gap-10">
      <audio ref={audioRef} />

      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-center w-1/2">
        <img
          src={guide}
          className="h-[70vh] animate-alive object-contain"
        />
      </div>

      {/* RIGHT SIDE CHATBOX */}
      <div className="w-1/2 bg-green-400 flex items-center justify-center text-black text-2xl">
        CHATBOX
      </div>
    </div>
  );
}
