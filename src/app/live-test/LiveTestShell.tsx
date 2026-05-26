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
    <div className="relative flex h-full min-h-0 w-full max-w-full overflow-hidden text-stone-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Left — logo, dashboard, Universe nav */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(11.5rem,18vw,13.5rem)] shrink-0 flex-col border-r border-stone-800/90 bg-black">
        <div className="shrink-0 space-y-2.5 border-b border-stone-800/80 bg-black px-2.5 py-3.5 sm:px-3">
          <Link href="/" className="flex justify-center">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={280}
              height={76}
              className="h-14 w-auto max-w-full object-contain sm:h-16"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setActiveNav(null)}
            className={`w-full rounded-full border px-3 py-2 text-xs font-semibold tracking-wide transition ${
              onDashboard
                ? "border-amber-400/55 bg-gradient-to-b from-amber-200/90 to-amber-600 text-zinc-950"
                : "border-stone-700/80 bg-black/40 text-stone-300 hover:border-amber-700/40 hover:text-amber-100"
            }`}
          >
            Dashboard
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-3 pt-3">
          <LiveTestUniverseNav activeId={activeNav} onSelect={setActiveNav} />
        </div>
      </aside>

      {/* Center — dashboard or section content */}
      <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
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

      {/* Right — avatar + chat */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(14rem,24vw,19rem)] shrink-0 flex-col gap-2 overflow-hidden border-l border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3">
        {rightColumn}
      </aside>
    </div>
  );
}
