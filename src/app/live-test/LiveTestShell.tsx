"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import LiveTestDashboardHome from "./LiveTestDashboardHome";

export const LIVE_TEST_NAV = [
  { id: "fantasy-catalogue", label: "Fantasy Catalogue" },
  { id: "build-story", label: "Build story" },
  { id: "interactive-story", label: "Interactive story" },
  { id: "couples", label: "Couples" },
  { id: "chat", label: "Chat" },
  { id: "profile", label: "Profile" },
] as const;

export type LiveTestNavId = (typeof LIVE_TEST_NAV)[number]["id"];

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

      {/* Left — logo + nav */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(9rem,13vw,13.5rem)] shrink-0 flex-col border-r border-stone-800/90 bg-zinc-950">
        <div className="shrink-0 border-b border-stone-800/80 px-2.5 py-3 sm:px-3">
          <Link href="/" className="inline-block max-w-full">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={180}
              height={48}
              className="h-8 w-auto max-w-full object-contain object-left sm:h-9"
              priority
            />
          </Link>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 py-3 sm:gap-2.5 sm:px-2.5">
          {LIVE_TEST_NAV.map((item) => {
            const active = highlightNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setHighlightNav(item.id)}
                className={`w-full min-w-0 rounded-xl border-2 px-2 py-2.5 text-center text-[11px] font-semibold leading-snug transition sm:rounded-2xl sm:px-2.5 sm:py-3 sm:text-xs ${
                  active
                    ? "border-amber-400/55 bg-amber-950/50 text-amber-100"
                    : "border-amber-800/35 bg-zinc-900/80 text-stone-300 hover:border-amber-600/40 hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center — always dashboard home */}
      <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
        <LiveTestDashboardHome />
      </section>

      {/* Right — avatar + chat */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(15rem,26vw,20rem)] shrink-0 flex-col gap-2 overflow-hidden border-l border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3">
        {rightColumn}
      </aside>
    </div>
  );
}
