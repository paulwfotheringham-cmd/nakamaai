"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useRef, useState, type RefObject } from "react";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import type { SimliAvatarHandle } from "@/components/SimliAvatar";
import GuideChatPanel, { type SendHandlers } from "./GuideChatPanel";

const SimliAvatar = dynamic(() => import("@/components/SimliAvatar"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(78vh,720px)] items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-zinc-500">
      Loading Simli avatar…
    </div>
  ),
});

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

async function waitForAvatarReady(
  simliRef: RefObject<SimliAvatarHandle | null>,
  timeoutMs = 20000,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (simliRef.current?.isReady()) return true;
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

export default function LiveGuideStage() {
  const simliRef = useRef<SimliAvatarHandle>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSend = useCallback(async (message: string, { onDelta }: SendHandlers) => {
    setIsBusy(true);
    try {
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

      if (!(await waitForAvatarReady(simliRef))) {
        throw new Error("Avatar is still connecting. Wait a few seconds and try again.");
      }

      await simliRef.current!.speak(reply);

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
          Simli avatar on the left. Type on the right — GPT-4o-mini replies with voice and lip sync.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Simli avatar (live)
            </p>
            <ClientErrorBoundary>
              <SimliAvatar ref={simliRef} />
            </ClientErrorBoundary>
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
