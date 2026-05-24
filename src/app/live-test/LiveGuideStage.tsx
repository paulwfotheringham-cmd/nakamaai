"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeechAudioLevel } from "@/lib/avatar/useSpeechAudioLevel";
import { LIVE_TEST_DEMO_SCRIPT, LIVE_TEST_REFERENCE_VIDEO } from "./demo-script";

const RealisticTalkingGuide = dynamic(() => import("./RealisticTalkingGuide"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(78vh,720px)] items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-zinc-500">
      Loading 3D guide…
    </div>
  ),
});

export default function LiveGuideStage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState("Donny - Steady Presence");
  const [hasReferenceVideo, setHasReferenceVideo] = useState(false);
  const [playedOnce, setPlayedOnce] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioLevelRef = useSpeechAudioLevel(audioRef, isSpeaking);

  useEffect(() => {
    fetch(LIVE_TEST_REFERENCE_VIDEO, { method: "HEAD" })
      .then((r) => setHasReferenceVideo(r.ok))
      .catch(() => setHasReferenceVideo(false));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("selectedVoice");
    if (stored) setVoice(stored);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
    setIsSpeaking(false);
    videoRef.current?.pause();
  }, []);

  const scheduleSpeakingStop = useCallback(
    (text: string) => {
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
      const ms = Math.min(12000, Math.max(2000, text.length * 55));
      speakingTimerRef.current = setTimeout(stopSpeaking, ms);
    },
    [stopSpeaking],
  );

  const speak = useCallback(
    async (text: string) => {
      setIsSpeaking(true);
      scheduleSpeakingStop(text);

      if (hasReferenceVideo && videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play().catch(() => undefined);
      }

      try {
        audioRef.current?.pause();
        const res = await fetch("/api/preview-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voice, text }),
        });

        if (!res.ok) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = stopSpeaking;
          utterance.onerror = stopSpeaking;
          speechSynthesis.speak(utterance);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = audioRef.current;
        if (!audio) {
          stopSpeaking();
          return;
        }
        audio.onended = () => {
          URL.revokeObjectURL(url);
          stopSpeaking();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          stopSpeaking();
        };
        audio.src = url;
        await audio.play();
      } catch {
        stopSpeaking();
      }
    },
    [hasReferenceVideo, scheduleSpeakingStop, stopSpeaking, voice],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void speak(LIVE_TEST_DEMO_SCRIPT);
      setPlayedOnce(true);
    }, 800);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <Link
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Home
      </Link>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
          Stage 3 — expressive 3D guide
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Live test</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Reference example on the left, expressive 3D guide on the right — lip sync driven by live speech audio.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Reference MP4
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              {hasReferenceVideo ? (
                <video
                  ref={videoRef}
                  src={LIVE_TEST_REFERENCE_VIDEO}
                  className="aspect-[3/4] w-full object-cover lg:h-[min(78vh,720px)] lg:aspect-auto"
                  playsInline
                  muted
                  controls
                />
              ) : (
                <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-zinc-500 lg:h-[min(78vh,720px)]">
                  <p>Add your example video at:</p>
                  <code className="text-xs text-zinc-400">public/live-test/guide-reference.mp4</code>
                  <p className="text-xs">It plays in sync when you press Play.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              3D guide (WebGL)
            </p>
            <RealisticTalkingGuide isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
          </div>
        </div>

        <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-zinc-300">
          &ldquo;{LIVE_TEST_DEMO_SCRIPT}&rdquo;
        </p>
        <button
          type="button"
          onClick={() => void speak(LIVE_TEST_DEMO_SCRIPT)}
          className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          {playedOnce ? "Play again" : "Play demo"}
        </button>
      </div>

      <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
    </main>
  );
}
