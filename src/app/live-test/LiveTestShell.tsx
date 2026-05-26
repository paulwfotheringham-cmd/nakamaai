"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  getLiveTestCenterPanel,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestFantasyAudioFrame from "./LiveTestFantasyAudioFrame";
import LiveTestUniverseNav from "./LiveTestUniverseNav";

export type { LiveTestNavId };

type LiveTestShellProps = {
  rightColumn: ReactNode;
};

export default function LiveTestShell({ rightColumn }: LiveTestShellProps) {
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const centerPanel = getLiveTestCenterPanel(activeNav);

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-full overflow-hidden text-stone-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Left — overlay-label Universe nav */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(11.5rem,18vw,13.5rem)] shrink-0 flex-col border-r border-stone-800/90 bg-zinc-950">
        <div className="shrink-0 border-b border-stone-800/80 px-2.5 py-3.5 sm:px-3">
          <Link href="/" className="block w-full">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={240}
              height={64}
              className="h-11 w-full max-w-full object-contain object-left sm:h-12"
              priority
            />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-3 pt-3">
          <LiveTestUniverseNav activeId={activeNav} onSelect={setActiveNav} />
        </div>
      </aside>

      {/* Center — dashboard or section content */}
      <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
        {centerPanel === "fantasy-audio" ? (
          <LiveTestFantasyAudioFrame />
        ) : (
          <LiveTestDashboardHome />
        )}
      </section>

      {/* Right — avatar + chat */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(14rem,24vw,19rem)] shrink-0 flex-col gap-2 overflow-hidden border-l border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3">
        {rightColumn}
      </aside>
    </div>
  );
}
