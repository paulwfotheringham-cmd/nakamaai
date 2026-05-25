"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LogLevel, SimliClient } from "simli-client";

export type SimliAvatarHandle = {
  speak: (text: string) => Promise<void>;
  isReady: () => boolean;
};

type SimliAvatarProps = {
  className?: string;
};

const CHUNK_BYTES = 6000;

const SimliAvatar = forwardRef<SimliAvatarHandle, SimliAvatarProps>(function SimliAvatar(
  { className },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clientRef = useRef<SimliClient | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const initClient = useCallback(async () => {
    if (!videoRef.current || !audioRef.current) return;

    setStatus("loading");
    setError("");

    try {
      const sessionRes = await fetch("/api/simli/session", { method: "POST" });
      const sessionJson = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionJson.error || "Failed to start Simli session");
      }

      const client = new SimliClient(
        sessionJson.sessionToken,
        videoRef.current,
        audioRef.current,
        null,
        LogLevel.INFO,
        "livekit",
      );

      client.on("start", () => setStatus("ready"));
      client.on("startup_error", (msg: string) => {
        setError(msg);
        setStatus("error");
      });
      client.on("error", () => {
        setError("Simli connection error");
        setStatus("error");
      });

      await client.start();
      clientRef.current = client;
      setStatus("ready");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Simli init failed";
      setError(msg);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void initClient();
    return () => {
      void clientRef.current?.stop();
      clientRef.current = null;
    };
  }, [initClient]);

  const speak = useCallback(async (text: string) => {
    const client = clientRef.current;
    if (!client || !text.trim()) return;

    client.ClearBuffer();

    const audioRes = await fetch("/api/live-test/simli-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!audioRes.ok) {
      const err = await audioRes.json().catch(() => ({}));
      throw new Error(err.error || "Failed to generate speech audio");
    }

    const pcm = new Uint8Array(await audioRes.arrayBuffer());

    for (let offset = 0; offset < pcm.length; offset += CHUNK_BYTES) {
      client.sendAudioData(pcm.subarray(offset, offset + CHUNK_BYTES));
    }
  }, []);

  useImperativeHandle(ref, () => ({
    speak,
    isReady: () => status === "ready" && clientRef.current !== null,
  }));

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-[min(78vh,720px)] w-full object-cover"
      />
      <audio ref={audioRef} autoPlay className="hidden" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm text-zinc-400">
          Connecting Simli avatar…
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/90 px-6 text-center text-sm text-red-200">
          <p>Simli avatar failed to load.</p>
          <p className="text-xs text-red-300/80">{error}</p>
          <button
            type="button"
            onClick={() => void initClient()}
            className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
});

export default SimliAvatar;
