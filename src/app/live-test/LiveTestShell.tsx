"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  getLiveTestCenterPanel,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";
import LiveTestCouplesProgram from "./LiveTestCouplesProgram";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestCreateAudioFrame from "./LiveTestCreateAudioFrame";
import LiveTestFantasyAudioFrame from "./LiveTestFantasyAudioFrame";
import LiveTestForbiddenChat from "./LiveTestForbiddenChat";
import LiveTestGuideRail from "./LiveTestGuideRail";
import LiveTestInfoPanel from "./LiveTestInfoPanel";
import LiveTestProfilePanel from "./LiveTestProfilePanel";
import LiveTestUniverseNav from "./LiveTestUniverseNav";

export type { LiveTestNavId };

export default function LiveTestShell() {
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const onDashboard = activeNav === null;

  return (
    <div className="relative grid h-full min-h-0 w-full max-w-full overflow-hidden text-stone-200 grid-rows-[auto_1fr_auto] md:grid-cols-[minmax(12rem,14.5rem)_minmax(0,1fr)_minmax(15rem,20rem)] md:grid-rows-1">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Left nav */}
      <aside className="relative z-10 flex shrink-0 flex-col border-b border-stone-800/90 bg-black md:col-start-1 md:row-start-1 md:h-full md:min-h-0 md:border-b-0 md:border-r">
        <div className="flex shrink-0 flex-col items-center gap-2.5 border-b border-stone-800/80 px-3 py-3 md:gap-3 md:px-4 md:py-4">
          <Link href="/" className="flex w-full justify-center">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={280}
              height={76}
              className="h-12 w-auto max-w-[10.5rem] object-contain sm:h-14 md:h-[4.75rem] md:max-w-full"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setActiveNav(null)}
            className={`w-full max-w-[11rem] rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition md:max-w-none md:py-2 md:text-xs ${
              onDashboard
                ? "border-amber-400/55 bg-gradient-to-b from-amber-200/90 to-amber-600 text-zinc-950"
                : "border-stone-700/80 bg-black/40 text-stone-300 hover:border-amber-700/40 hover:text-amber-100"
            }`}
          >
            Dashboard
          </button>
        </div>

        <div className="shrink-0 px-2.5 py-2 md:flex md:min-h-0 md:flex-1 md:flex-col md:px-2.5 md:pb-3 md:pt-3">
          <LiveTestUniverseNav activeId={activeNav} onSelect={setActiveNav} />
        </div>
      </aside>

      {/* Center content */}
      <section className="relative z-10 flex min-h-0 min-w-0 flex-col overflow-hidden p-2 sm:p-3 md:col-start-2 md:row-start-1">
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

      {/* Guide — avatar + chat (always visible, every section) */}
      <aside className="relative z-20 flex min-h-[18rem] shrink-0 flex-col overflow-hidden border-t border-stone-800/90 bg-black/95 p-2 sm:min-h-[20rem] sm:p-3 md:col-start-3 md:row-start-1 md:h-full md:min-h-0 md:border-l md:border-t-0">
        <LiveTestGuideRail />
      </aside>
    </div>
  );
}
