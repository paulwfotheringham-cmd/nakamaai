"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

const FantasyCatalogueEmbed = dynamic(() => import("./FantasyCatalogueEmbed"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-0 items-center justify-center rounded-2xl border border-amber-900/25 bg-zinc-950/90 text-sm text-stone-500">
      Loading catalogue…
    </div>
  ),
});

export const LIVE_TEST_NAV = [
  { id: "fantasy-catalogue", label: "Fantasy Catalogue" },
  { id: "build-story", label: "Build story" },
  { id: "interactive-story", label: "Interactive story" },
  { id: "couples", label: "Couples" },
  { id: "chat", label: "Chat" },
  { id: "profile", label: "Profile" },
] as const;

export type LiveTestNavId = (typeof LIVE_TEST_NAV)[number]["id"];

const PLACEHOLDER_COPY: Record<LiveTestNavId, string> = {
  "fantasy-catalogue":
    "Browse curated fantasy audio — scenes, moods, and immersive stories from the Nakama library.",
  "build-story":
    "Create your own fantasy with tone, heat, and voice — shaped step by step with your guide.",
  "interactive-story":
    "Play through branching adventures where your choices steer the story in real time.",
  couples:
    "Shared experiences for two — date night modes, surprises, and reconnection series.",
  chat:
    "Talk to your Nakama guide. Type on the right — replies play with voice and lip sync.",
  profile: "Your account, preferences, voices, and subscription — coming soon.",
};

type LiveTestShellProps = {
  rightColumn: ReactNode;
};

export default function LiveTestShell({ rightColumn }: LiveTestShellProps) {
  const [selected, setSelected] = useState<LiveTestNavId>("chat");

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
            const active = item.id === selected;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
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

      {/* Center */}
      <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
        {selected === "fantasy-catalogue" ? (
          <FantasyCatalogueEmbed />
        ) : (
          <div className="flex h-full min-h-0 flex-col justify-center overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-[#0a2a28]/90 to-[#061a1a] px-4 py-6 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)] sm:px-6">
            <p className="mx-auto max-w-md overflow-y-auto text-center text-sm leading-relaxed text-stone-300/95">
              {selected === "chat" ? (
                <>
                  <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
                    {LIVE_TEST_NAV.find((n) => n.id === selected)?.label}
                  </span>
                  {PLACEHOLDER_COPY[selected]}
                </>
              ) : (
                <>
                  <span className="mb-4 block text-xs font-medium uppercase tracking-wider text-amber-600/70">
                    Coming soon
                  </span>
                  Placeholder box for information that shows after you select an option
                  button on the left.
                  <span className="mt-4 block text-sm text-stone-500">
                    {PLACEHOLDER_COPY[selected]}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </section>

      {/* Right — avatar + chat */}
      <aside className="relative z-10 flex h-full min-h-0 w-[clamp(15rem,26vw,20rem)] shrink-0 flex-col gap-2 overflow-hidden border-l border-stone-800/90 bg-black/40 p-2 sm:gap-2.5 sm:p-3">
        {rightColumn}
      </aside>
    </div>
  );
}
