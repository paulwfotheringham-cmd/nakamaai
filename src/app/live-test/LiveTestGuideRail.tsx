"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLiveTestPcm16 } from "@/lib/live-test/fetch-pcm-client";
import { defaultGuidePreferences, readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import GuideChatPanel, { type SendHandlers } from "./GuideChatPanel";
import type { SimliAvatarHandle } from "@/components/SimliAvatar";
import SimliAvatar from "@/components/SimliAvatar";

type LiveTestGuideRailProps = {
  onNavigate?: (navId: LiveTestNavId) => void;
  onHide?: () => void;
};

async function readStreamingReply(
  res: Response,
  onDelta: (text: string) => void,
): Promise<string> {
  if (!res.body) {
    throw new Error("No response body from chat");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let reply = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    reply += decoder.decode(value, { stream: true });
    onDelta(reply);
  }

  return reply.trim() || "I'm here to help. What would you like to know?";
}

/** Persistent guide avatar + chat — always mounted in the right column. */
export default function LiveTestGuideRail({ onNavigate, onHide }: LiveTestGuideRailProps) {
  const simliRef = useRef<SimliAvatarHandle>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [prefs, setPrefs] = useState<GuidePreferences>(() => defaultGuidePreferences());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrefs(readGuidePreferences());
    setMounted(true);
  }, []);

  const voiceId = prefs.voiceId;

  const handleSend = useCallback(
    async (message: string, { onDelta }: SendHandlers) => {
      setIsBusy(true);
      try {
        await simliRef.current?.unlockAudio();

        const chatRes = await fetch("/api/live-test/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        const contentType = chatRes.headers.get("content-type") ?? "";

        if (!chatRes.ok) {
          const err =
            contentType.includes("application/json")
              ? ((await chatRes.json().catch(() => ({}))) as { error?: string }).error
              : await chatRes.text().catch(() => "");
          throw new Error(err || "Chat failed");
        }

        const reply = await readStreamingReply(chatRes, onDelta);
        onDelta(reply);

        if (!simliRef.current?.isReady()) {
          const deadline = Date.now() + 8000;
          while (Date.now() < deadline) {
            if (simliRef.current?.isReady()) break;
            await new Promise((r) => setTimeout(r, 100));
          }
        }

        if (simliRef.current?.isReady()) {
          try {
            const pcm = await fetchLiveTestPcm16(reply, voiceId);
            await simliRef.current.playPcm(pcm);
          } catch {
            /* keep chat reply */
          }
        }

        return reply;
      } finally {
        setIsBusy(false);
      }
    },
    [voiceId],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="relative mx-auto w-full max-w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent">
        {onHide ? (
          <button
            type="button"
            className="pro-guide-hide-btn"
            aria-label="Hide companion"
            onClick={onHide}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="aspect-[3/4] max-h-[min(36vh,15rem)] min-h-[9rem] w-full sm:min-h-[10rem] md:max-h-[min(38vh,16rem)]">
          {mounted ? (
            <SimliAvatar
              key={prefs.guideId}
              ref={simliRef}
              guideId={prefs.guideId}
              faceId={prefs.simliFaceId}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-stone-600">
              Loading avatar…
            </div>
          )}
        </div>
      </div>

      <GuideChatPanel
        onSend={handleSend}
        onNavigate={onNavigate}
        isBusy={isBusy}
        className="min-h-0 flex-1"
        userName={prefs.userName}
        guideName={prefs.guideName}
      />
    </div>
  );
}
