"use client";

import { useCallback, useRef, useState } from "react";
import { fetchLiveTestPcm16 } from "@/lib/live-test/fetch-pcm-client";
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

  const handleSend = useCallback(async (message: string, { onDelta }: SendHandlers) => {
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

      const pcmPromise = fetchLiveTestPcm16(reply);

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

      const pcm = await pcmPromise;
      await simliRef.current!.playPcm(pcm);

      return reply;
    } finally {
      setIsBusy(false);
    }
  }, []);

  return (
    <LiveTestShell
      rightColumn={
        <>
          <div className="shrink-0">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Simli avatar (live)
            </p>
            <SimliAvatar ref={simliRef} className="aspect-[4/5] w-full max-h-[min(42vh,380px)]" />
          </div>

          <div className="flex min-h-[min(38vh,420px)] flex-1 flex-col">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Chat (text only)
            </p>
            <GuideChatPanel onSend={handleSend} isBusy={isBusy} className="min-h-0 flex-1" />
          </div>
        </>
      }
    />
  );
}
