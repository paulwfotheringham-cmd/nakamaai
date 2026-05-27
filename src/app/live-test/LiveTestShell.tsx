"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  getLiveTestCenterPanel,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";
import LiveTestCouplesProgram from "./LiveTestCouplesProgram";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestCreateAudioFrame from "./LiveTestCreateAudioFrame";
import LiveTestFantasyAudioFrame from "./LiveTestFantasyAudioFrame";
import LiveTestForbiddenChat from "./LiveTestForbiddenChat";
import LiveTestInfoPanel from "./LiveTestInfoPanel";
import LiveTestProfilePanel from "./LiveTestProfilePanel";
import LiveTestUniverseNav from "./LiveTestUniverseNav";

export type { LiveTestNavId };

type LiveTestShellProps = {
  rightColumn: ReactNode;
};

export default function LiveTestShell({ rightColumn }: LiveTestShellProps) {
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const onDashboard = activeNav === null;

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden text-stone-200 lg:flex-row">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Top / left — logo, dashboard, Universe nav */}
      <aside className="relative z-10 flex shrink-0 flex-col border-b border-stone-800/90 bg-black lg:h-full lg:min-h-0 lg:w-[clamp(11.5rem,18vw,13.5rem)] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex shrink-0 items-center gap-2 border-b border-stone-800/80 px-2.5 py-2 lg:block lg:space-y-2.5 lg:px-3 lg:py-3.5">
          <Link href="/" className="flex shrink-0 justify-center lg:block">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={280}
              height={76}
              className="h-10 w-auto max-w-[8.5rem] object-contain lg:h-16 lg:max-w-full"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setActiveNav(null)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition lg:w-full lg:py-2 lg:text-xs ${
              onDashboard
                ? "border-amber-400/55 bg-gradient-to-b from-amber-200/90 to-amber-600 text-zinc-950"
                : "border-stone-700/80 bg-black/40 text-stone-300 hover:border-amber-700/40 hover:text-amber-100"
            }`}
          >
            Dashboard
          </button>
        </div>

        <div className="shrink-0 px-2.5 py-2 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:px-2.5 lg:pb-3 lg:pt-3">
          <LiveTestUniverseNav activeId={activeNav} onSelect={setActiveNav} />
        </div>
      </aside>

      {/* Main — center content + guide (stacked on mobile, side-by-side on desktop) */}
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
          {centerPanel === "fantasy-audio" && <LiveTestFantasyAudioFrame />}
          {centerPanel === "create-audio" && <LiveTestCreateAudioFrame />}
          {centerPanel === "couples-program" && <LiveTestCouplesProgram />}
          {centerPanel === "build-adventure" && (
            <LiveTestInfoPanel
              eyebrow="Build adventure"
              title="Create your fantasy"
              description="Shape tone, setting, and heat on your terms."
              poster="/tiles/tile2.jpg"
              body="Build Adventure lets you craft custom audio stories step by step — choose characters, mood, pacing, and how far you want to go. Save drafts, revisit scenes, and publish when you’re ready."
            />
          )}
          {centerPanel === "character-voices" && (
            <LiveTestInfoPanel
              eyebrow="Characters & voices"
              title="Your cast, your sound"
              description="Create a character that stays with you across experiences."
              poster="/tiles/tile6.jpg"
              body="Pick or clone the voice you want, define personality and boundaries, and reuse your character in adventures, audiobooks, and chat. Voices and personas travel with you across Nakama Nights."
            />
          )}
          {centerPanel === "forbidden-chat" && <LiveTestForbiddenChat />}
          {centerPanel === "profile" && <LiveTestProfilePanel />}
          {centerPanel === "dashboard" && <LiveTestDashboardHome />}
        </section>

        <aside className="flex h-[min(42dvh,20rem)] min-h-[16rem] shrink-0 flex-col gap-2 overflow-hidden border-t border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3 md:h-full md:min-h-0 md:w-[clamp(15rem,26vw,20rem)] md:shrink-0 md:border-l md:border-t-0">
          {rightColumn}
        </aside>
      </div>
    </div>
  );
}
