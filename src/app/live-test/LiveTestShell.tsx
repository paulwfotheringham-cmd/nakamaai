"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

const FantasyCatalogueEmbed = dynamic(() => import("./FantasyCatalogueEmbed"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-amber-900/25 bg-zinc-950/90 text-sm text-stone-500">
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
    <div className="relative flex min-h-screen bg-black text-stone-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Left — logo + nav (per wireframe) */}
      <aside className="relative z-10 flex w-[11.5rem] shrink-0 flex-col border-r border-stone-800/90 bg-zinc-950 sm:w-52 lg:w-56">
        <div className="border-b border-stone-800/80 px-3 py-4 sm:px-4">
          <Link href="/" className="inline-block">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={180}
              height={48}
              className="h-9 w-auto object-contain object-left sm:h-10"
              priority
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 py-4 sm:gap-3 sm:px-3">
          {LIVE_TEST_NAV.map((item) => {
            const active = item.id === selected;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                className={`w-full rounded-2xl border-2 px-3 py-3.5 text-center text-[13px] font-semibold leading-snug transition sm:py-4 sm:text-sm ${
                  active
                    ? "border-amber-400/55 bg-amber-950/50 text-amber-100 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.15)]"
                    : "border-amber-800/35 bg-zinc-900/80 text-stone-300 hover:border-amber-600/40 hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center — catalogue or placeholder */}
      <section className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col p-3 sm:p-4 lg:p-5">
        {selected === "fantasy-catalogue" ? (
          <FantasyCatalogueEmbed />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-center rounded-2xl border border-amber-900/25 bg-gradient-to-b from-[#0a2a28]/90 to-[#061a1a] px-6 py-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)] sm:px-10">
            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-stone-300/95 sm:text-base">
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

      {/* Right — avatar + chat stacked */}
      <aside className="relative z-10 flex w-[min(100%,26rem)] shrink-0 flex-col gap-2 border-l border-stone-800/90 bg-black/40 p-3 sm:w-[26rem] sm:gap-3 sm:p-4 lg:w-[28rem]">
        {rightColumn}
      </aside>
    </div>
  );
}
