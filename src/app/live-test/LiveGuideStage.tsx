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
    <LiveTestShell>
      <header className="shrink-0 border-b border-stone-800/80 px-5 py-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-600/85">
          Your guide
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
            Concierge
          </span>{" "}
          <span className="text-stone-300">live</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
          Talk to your Nakama guide — voice and lip sync in real time.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:gap-6 lg:p-8">
        <section className="flex min-h-[min(52vh,520px)] flex-1 flex-col lg:min-h-0 lg:max-w-[min(52%,640px)]">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
            Live avatar
          </p>
          <SimliAvatar ref={simliRef} className="min-h-0 flex-1" />
        </section>

        <section className="flex min-h-[min(52vh,520px)] flex-1 flex-col lg:min-h-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
            Guide chat
          </p>
          <GuideChatPanel onSend={handleSend} isBusy={isBusy} className="min-h-0 flex-1" />
        </section>
      </div>
    </LiveTestShell>
  );
}
