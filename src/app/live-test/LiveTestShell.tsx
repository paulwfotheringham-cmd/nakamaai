"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { label: "Home", hint: "Coming soon" },
  { label: "Fantasy Audio", hint: "Coming soon" },
  { label: "Create Audio", hint: "Coming soon" },
  { label: "Your Guide", hint: "You are here" },
  { label: "Marketplace", hint: "Coming soon" },
  { label: "Profile", hint: "Coming soon" },
  { label: "Settings", hint: "Coming soon" },
] as const;

type LiveTestShellProps = {
  children: ReactNode;
};

export default function LiveTestShell({ children }: LiveTestShellProps) {
  return (
    <div className="relative flex min-h-screen bg-black text-stone-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-8%,rgba(180,130,50,0.14),transparent_55%)]"
        aria-hidden
      />

      <aside className="relative z-10 flex w-[15.5rem] shrink-0 flex-col border-r border-stone-800/90 bg-zinc-950/95 backdrop-blur-sm lg:w-60">
        <div className="border-b border-stone-800/80 px-4 py-5">
          <Link href="/" className="inline-block">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={200}
              height={52}
              className="h-11 w-auto object-contain object-left sm:h-12"
              priority
            />
          </Link>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600/80">
            Nakama Nights
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = item.label === "Your Guide";
            return (
              <button
                key={item.label}
                type="button"
                disabled
                title={item.hint}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "cursor-default border-amber-500/35 bg-amber-950/40 text-amber-100"
                    : "cursor-not-allowed border-transparent text-stone-500 opacity-55"
                }`}
              >
                <span>{item.label}</span>
                {active ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/90">
                    Live
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-stone-800/80 px-4 py-4">
          <p className="text-[11px] leading-relaxed text-stone-500">
            Navigation links are placeholders for the full Nakama experience.
          </p>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
