"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type RefObject } from "react";
import { fetchLiveTestPcm16 } from "@/lib/live-test/fetch-pcm-client";
import SimliAvatar, { type SimliAvatarHandle } from "@/components/SimliAvatar";
import GuideChatPanel, { type SendHandlers } from "./GuideChatPanel";

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

      // Generate speech while avatar is already connected (runs in parallel with UI update).
      const pcmPromise = fetchLiveTestPcm16(reply);

      if (!simliRef.current?.isReady()) {
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
          if (simliRef.current?.isReady()) break;
          await new Promise((r) => setTimeout(r, 100));
        }
        if (!simliRef.current?.isReady()) {
          throw new Error(
            "Avatar is still connecting — wait until the face appears on the left, then send again.",
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
    <main className="min-h-screen bg-[#07040d] text-white">
      <Link
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Home
      </Link>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
          Simli — realtime concierge
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Live test</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Simli avatar on the left. Type on the right — GPT replies with voice and lip sync.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Simli avatar (live)
            </p>
            <SimliAvatar ref={simliRef} />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Chat (text only)
            </p>
            <GuideChatPanel onSend={handleSend} isBusy={isBusy} />
          </div>
        </div>
      </div>
    </main>
  );
}
