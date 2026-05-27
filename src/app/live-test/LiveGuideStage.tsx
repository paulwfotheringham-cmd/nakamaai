"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLiveTestPcm16 } from "@/lib/live-test/fetch-pcm-client";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";
import SimliAvatar, { type SimliAvatarHandle } from "@/components/SimliAvatar";
import GuideChatPanel, { type SendHandlers } from "./GuideChatPanel";
import LiveTestShell from "./LiveTestShell";

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

export default function LiveGuideStage() {
  const simliRef = useRef<SimliAvatarHandle>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [prefs, setPrefs] = useState<GuidePreferences | null>(null);

  useEffect(() => {
    setPrefs(readGuidePreferences());
  }, []);

  const simliFaceId = prefs?.simliFaceId;
  const voiceId = prefs?.voiceId;

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
          const deadline = Date.now() + 5000;
          while (Date.now() < deadline) {
            if (simliRef.current?.isReady()) break;
            await new Promise((r) => setTimeout(r, 100));
          }
          if (!simliRef.current?.isReady()) {
            throw new Error(
              "Avatar is still connecting — wait until the face appears, then send again.",
            );
          }
        }

        try {
          const pcm = await fetchLiveTestPcm16(reply, voiceId);
          await simliRef.current!.playPcm(pcm);
        } catch {
          // Keep the chat reply even if TTS / lip-sync fails.
        }

        return reply;
      } finally {
        setIsBusy(false);
      }
    },
    [voiceId],
  );

  return (
    <LiveTestShell
      rightColumn={
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="mx-auto h-[clamp(7.5rem,26dvh,11rem)] w-full max-w-full shrink-0 overflow-hidden lg:h-[clamp(10rem,34%,14rem)]">
            {simliFaceId ? (
              <SimliAvatar
                key={simliFaceId}
                ref={simliRef}
                faceId={simliFaceId}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-amber-900/35 bg-black text-xs text-stone-500">
                Loading guide…
              </div>
            )}
          </div>

          <div className="mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden lg:mt-2">
            <GuideChatPanel
              onSend={handleSend}
              isBusy={isBusy}
              className="min-h-0 flex-1"
              userName={prefs?.userName}
              guideName={prefs?.guideName}
            />
          </div>
        </div>
      }
    />
  );
}
