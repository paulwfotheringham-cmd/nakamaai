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
export default function LiveTestGuideRail({ onNavigate }: LiveTestGuideRailProps) {
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mx-auto aspect-[4/5] max-h-[42%] min-h-[9rem] w-full max-w-full shrink-0 overflow-hidden sm:max-h-[44%] md:max-h-[46%]">
        {mounted ? (
          <SimliAvatar
            key={prefs.guideId}
            ref={simliRef}
            guideId={prefs.guideId}
            faceId={prefs.simliFaceId}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full min-h-[9rem] items-center justify-center rounded-2xl border border-amber-900/35 bg-black text-xs text-stone-500">
            Loading avatar…
          </div>
        )}
      </div>

      <div className="mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden md:mt-2">
        <GuideChatPanel
          onSend={handleSend}
          onNavigate={onNavigate}
          isBusy={isBusy}
          className="min-h-0 flex-1"
          userName={prefs.userName}
          guideName={prefs.guideName}
        />
      </div>
    </div>
  );
}
