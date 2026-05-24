"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
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
  const [mediaReady, setMediaReady] = useState(false);
  const [playedOnce, setPlayedOnce] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lipSyncRef = hasReferenceVideo ? videoRef : audioRef;
  const audioLevelRef = useSpeechAudioLevel(lipSyncRef, isSpeaking);

  useEffect(() => {
    fetch(LIVE_TEST_REFERENCE_VIDEO, { method: "HEAD" })
      .then((r) => setHasReferenceVideo(r.ok))
      .catch(() => setHasReferenceVideo(false))
      .finally(() => setMediaReady(true));
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
    if (videoRef.current) {
      videoRef.current.pause();
    }
    audioRef.current?.pause();
    speechSynthesis.cancel();
  }, []);

  const scheduleSpeakingStop = useCallback(
    (durationSeconds: number) => {
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
      const ms = Math.min(120000, Math.max(1500, durationSeconds * 1000 + 300));
      speakingTimerRef.current = setTimeout(stopSpeaking, ms);
    },
    [stopSpeaking],
  );

  const playReferenceVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    audioRef.current?.pause();
    speechSynthesis.cancel();

    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;

    const duration =
      video.duration && Number.isFinite(video.duration) ? video.duration : 4;
    scheduleSpeakingStop(duration);

    const onEnded = () => {
      video.removeEventListener("ended", onEnded);
      stopSpeaking();
    };
    video.addEventListener("ended", onEnded);

    setIsSpeaking(true);
    try {
      await video.play();
      return true;
    } catch {
      stopSpeaking();
      return false;
    }
  }, [scheduleSpeakingStop, stopSpeaking]);

  const playTts = useCallback(
    async (text: string) => {
      setIsSpeaking(true);
      scheduleSpeakingStop(text.length * 0.055);

      try {
        videoRef.current?.pause();
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
    [scheduleSpeakingStop, stopSpeaking, voice],
  );

  /** Drives 3D lip sync — uses reference MP4 audio when available. */
  const playGuide = useCallback(async () => {
    setPlayedOnce(true);
    if (hasReferenceVideo) {
      const ok = await playReferenceVideo();
      if (ok) return;
    }
    await playTts(LIVE_TEST_DEMO_SCRIPT);
  }, [hasReferenceVideo, playReferenceVideo, playTts]);

  useEffect(() => {
    if (!mediaReady) return;
    const t = setTimeout(() => {
      void playGuide();
    }, 600);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaReady]);

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
          Reference video on the left (with its own audio). 3D guide on the right lip-syncs to that same
          audio when you play.
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
                  preload="auto"
                  controls
                />
              ) : (
                <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-zinc-500 lg:h-[min(78vh,720px)]">
                  <p>Add your example video at:</p>
                  <code className="text-xs text-zinc-400">public/live-test/guide-reference.mp4</code>
                  <p className="text-xs">Without it, the 3D guide uses TTS instead.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              3D guide (WebGL)
            </p>
            <ClientErrorBoundary>
              <RealisticTalkingGuide isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
            </ClientErrorBoundary>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-zinc-300">
              {hasReferenceVideo
                ? "Lip sync follows the reference video audio."
                : `“${LIVE_TEST_DEMO_SCRIPT}”`}
            </p>
            <button
              type="button"
              onClick={() => void playGuide()}
              className="mt-4 w-full rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 sm:w-auto"
            >
              {playedOnce ? "Play again (3D guide)" : "Play 3D guide"}
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
    </main>
  );
}
