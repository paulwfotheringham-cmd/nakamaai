"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import type { SimliAvatarHandle } from "@/components/SimliAvatar";
import GuideChatPanel from "./GuideChatPanel";

const SimliAvatar = dynamic(() => import("@/components/SimliAvatar"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(78vh,720px)] items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-zinc-500">
      Loading Simli avatar…
    </div>
  ),
});

export default function LiveGuideStage() {
  const simliRef = useRef<SimliAvatarHandle>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSend = useCallback(async (message: string) => {
    setIsBusy(true);
    try {
      const chatRes = await fetch("/api/live-test/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const chatJson = await chatRes.json();
      if (!chatRes.ok) {
        throw new Error(chatJson.error || "Chat failed");
      }

      const reply = chatJson.reply as string;
      await simliRef.current?.speak(reply);
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
