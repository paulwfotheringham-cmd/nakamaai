"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  isSimliRateLimitError,
  registerSimliTeardown,
  releaseSimliSlot,
} from "@/lib/simli/connection-guard";
import { formatSimliError } from "@/lib/simli/format-error";
import { LogLevel, SimliClient } from "simli-client";

export type SimliAvatarHandle = {
  playPcm: (pcm: Uint8Array) => Promise<void>;
  isReady: () => boolean;
  unlockAudio: () => Promise<void>;
};

type SimliAvatarProps = {
  className?: string;
  faceId?: string;
  guideId?: string;
};

type ConnectionPhase = "idle" | "session" | "webrtc" | "ready" | "error";

const CHUNK_BYTES = 6000;
const IMMEDIATE_BYTES = 16000 * 2 * 2;
const RATE_LIMIT_COOLDOWN_MS = 30_000;
const TEARDOWN_MS = 1200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForMediaRefs(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  audioRef: React.RefObject<HTMLAudioElement | null>,
  maxMs = 5000,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (videoRef.current && audioRef.current) return true;
    await sleep(50);
  }
  return Boolean(videoRef.current && audioRef.current);
}

const SimliAvatar = forwardRef<SimliAvatarHandle, SimliAvatarProps>(function SimliAvatar(
  { className, faceId, guideId },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clientRef = useRef<SimliClient | null>(null);
  const readyRef = useRef(false);
  const initGenRef = useRef(0);
  const rateLimitUntilRef = useRef(0);
  const [phase, setPhase] = useState<ConnectionPhase>("idle");
  const [error, setError] = useState("");
  const [statusLine, setStatusLine] = useState("");
  const [retryCountdown, setRetryCountdown] = useState(0);

  const unlockAudio = useCallback(async () => {
    try {
      await audioRef.current?.play();
    } catch {
      /* ignore */
    }
  }, []);

  const markReady = useCallback(() => {
    readyRef.current = true;
    setPhase("ready");
    setStatusLine("");
  }, []);

  const stopClient = useCallback(async () => {
    const client = clientRef.current;
    clientRef.current = null;
    readyRef.current = false;
    if (client) {
      try {
        await client.stop();
      } catch {
        /* ignore */
      }
    }
    releaseSimliSlot(stopClient);
  }, []);

  const connectLivekit = useCallback(
    async (sessionToken: string) => {
      const video = videoRef.current;
      const audio = audioRef.current;
      if (!video || !audio) {
        throw new Error("Avatar video elements are not mounted.");
      }

      const client = new SimliClient(
        sessionToken,
        video,
        audio,
        null,
        LogLevel.ERROR,
        "livekit",
      );

      const fail = async (msg: string) => {
        readyRef.current = false;
        if (isSimliRateLimitError(msg)) {
          rateLimitUntilRef.current = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        }
        setError(msg || "Simli WebRTC startup failed");
        setPhase("error");
        clientRef.current = null;
        try {
          await client.stop();
        } catch {
          /* ignore */
        }
      };

      client.on("start", () => {
        markReady();
      });
      client.on("startup_error", (msg: string) => {
        void fail(msg);
      });
      client.on("error", () => {
        void fail("Simli connection lost");
      });

      try {
        await client.start();
        clientRef.current = client;
        if (!readyRef.current) {
          markReady();
        }
      } catch (e) {
        clientRef.current = null;
        try {
          await client.stop();
        } catch {
          /* ignore */
        }
        throw e;
      }
    },
    [markReady],
  );

  const initClient = useCallback(async () => {
    const now = Date.now();
    if (now < rateLimitUntilRef.current) {
      const secs = Math.ceil((rateLimitUntilRef.current - now) / 1000);
      setError(
        `Simli rate limit — wait ${secs}s, then tap Retry. Close other Nakama tabs first.`,
      );
      setPhase("error");
      setRetryCountdown(secs);
      return;
    }

    const gen = ++initGenRef.current;
    await stopClient();
    await sleep(TEARDOWN_MS);
    if (gen !== initGenRef.current) return;

    await registerSimliTeardown(stopClient);

    readyRef.current = false;
    setPhase("session");
    setStatusLine("Requesting Simli session…");
    setError("");
    setRetryCountdown(0);

    const hasRefs = await waitForMediaRefs(videoRef, audioRef);
    if (!hasRefs) {
      setError("Avatar player failed to mount. Refresh the page.");
      setPhase("error");
      return;
    }
    if (gen !== initGenRef.current) return;

    try {
      const sessionBody =
        guideId != null && guideId !== ""
          ? { guideId }
          : faceId
            ? { faceId }
            : {};

      const sessionRes = await fetch("/api/simli/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionBody),
      });
      const sessionJson = (await sessionRes.json()) as {
        sessionToken?: string;
        error?: string;
      };

      if (gen !== initGenRef.current) return;

      if (!sessionRes.ok || !sessionJson.sessionToken) {
        throw new Error(sessionJson.error || "Failed to start Simli session");
      }

      setPhase("webrtc");
      setStatusLine("Connecting avatar…");
      await connectLivekit(sessionJson.sessionToken);

      if (gen !== initGenRef.current) return;
      markReady();
    } catch (e) {
      if (gen !== initGenRef.current) return;
      readyRef.current = false;
      const msg = formatSimliError(e);
      if (isSimliRateLimitError(msg)) {
        rateLimitUntilRef.current = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        setRetryCountdown(Math.ceil(RATE_LIMIT_COOLDOWN_MS / 1000));
      }
      setError(msg);
      setPhase("error");
      await stopClient();
    }
  }, [connectLivekit, markReady, stopClient, faceId, guideId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void initClient();
    }, 0);

    const onHide = () => {
      if (document.visibilityState === "hidden") {
        initGenRef.current += 1;
        void stopClient();
      }
    };
    const onPageHide = () => {
      initGenRef.current += 1;
      void stopClient();
    };

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      initGenRef.current += 1;
      void stopClient();
    };
  }, [initClient, stopClient]);

  useEffect(() => {
    if (retryCountdown <= 0) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((rateLimitUntilRef.current - Date.now()) / 1000));
      setRetryCountdown(left);
      if (left <= 0) {
        setError((prev) =>
          prev.includes("rate limit")
            ? "You can tap Retry now. Close other Nakama tabs if it fails again."
            : prev,
        );
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [retryCountdown]);

  const playPcm = useCallback(
    async (pcm: Uint8Array) => {
      const client = clientRef.current;
      if (!client || pcm.length < 2) {
        throw new Error("Avatar is not ready to speak yet.");
      }

      await unlockAudio();
      client.ClearBuffer();

      const firstLen = Math.min(IMMEDIATE_BYTES, pcm.length);
      client.sendAudioDataImmediate(pcm.subarray(0, firstLen));

      for (let offset = firstLen; offset < pcm.length; offset += CHUNK_BYTES) {
        client.sendAudioData(pcm.subarray(offset, offset + CHUNK_BYTES));
      }

      client.sendAudioData(new Uint8Array(3200));
    },
    [unlockAudio],
  );

  useImperativeHandle(
    ref,
    () => ({
      playPcm,
      unlockAudio,
      isReady: () => readyRef.current && clientRef.current !== null,
    }),
    [playPcm, unlockAudio],
  );

  const showOverlay = phase === "session" || phase === "webrtc";
  const rateLimited = retryCountdown > 0;

  return (
    <div
      className={`relative max-w-full overflow-hidden rounded-2xl border border-amber-900/35 bg-black shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_20px_50px_rgba(0,0,0,0.45)] ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full max-h-full min-h-0 w-full object-contain object-center"
      />
      <audio ref={audioRef} autoPlay playsInline className="sr-only" />

      {showOverlay && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 px-6 text-center">
          <p className="text-sm text-zinc-300">{statusLine || "Connecting Simli avatar…"}</p>
          <p className="text-xs text-zinc-500">This can take up to 30 seconds on first load.</p>
        </div>
      )}

      {phase === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/90 px-6 text-center text-sm text-red-200">
          <p>Simli avatar failed to load.</p>
          <p className="text-xs text-red-300/80">{error}</p>
          {(error.includes("TIMED OUT") || error.includes("Websocket")) && (
            <p className="text-xs text-zinc-400">
              Check your network or VPN, then tap Retry. A firewall can block WebRTC.
            </p>
          )}
          {rateLimited && (
            <p className="text-xs text-amber-200/90">Retry available in {retryCountdown}s</p>
          )}
          <button
            type="button"
            disabled={rateLimited}
            onClick={() => void initClient()}
            className="mt-2 rounded-lg border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-4 py-2 text-xs font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rateLimited ? `Wait ${retryCountdown}s` : "Retry"}
          </button>
        </div>
      )}
    </div>
  );
});

export default SimliAvatar;
