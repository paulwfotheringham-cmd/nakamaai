"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestUniverseNav from "./LiveTestUniverseNav";

export type { LiveTestNavId };

type LiveTestShellProps = {
  rightColumn: ReactNode;
};

export default function LiveTestShell({ rightColumn }: LiveTestShellProps) {
  const [highlightNav, setHighlightNav] = useState<LiveTestNavId | null>(null);

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-full overflow-hidden text-stone-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Left — logo + Universe nav (same cards as homepage, vertical) */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(13.5rem,22vw,15.5rem)] shrink-0 flex-col border-r border-stone-800/90 bg-zinc-950">
        <div className="shrink-0 border-b border-stone-800/80 px-3 py-3">
          <Link href="/" className="inline-block max-w-full">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={180}
              height={48}
              className="h-8 w-auto max-w-full object-contain object-left"
              priority
            />
          </Link>
          <h2 className="mt-3 font-serif text-sm leading-tight text-white">
            Nakama Nights Universe
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-3 pt-3">
          <LiveTestUniverseNav
            activeId={highlightNav}
            onSelect={setHighlightNav}
          />
        </div>
      </aside>

      {/* Center — always dashboard home */}
      <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
        <LiveTestDashboardHome />
      </section>

      {/* Right — avatar + chat */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(14rem,24vw,19rem)] shrink-0 flex-col gap-2 overflow-hidden border-l border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3">
        {rightColumn}
      </aside>
    </div>
  );
}
