"use client";

import type { ReactNode } from "react";

const NAV_ICONS: Record<string, ReactNode> = {
  audiobooks: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M10 2a6 6 0 0 0-6 6v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H6V8a4 4 0 1 1 8 0v1h-1a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V8a6 6 0 0 0-6-6Z" />
    </svg>
  ),
  "build-adventure": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2.586l-2 2V5H5v10h5.586l-2 2H4a1 1 0 0 1-1-1V4Zm11.293 6.293 2-2a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414l2-2Z" />
    </svg>
  ),
  "interactive-adventures": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M6 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H6Zm2 3h4v2H8V6Zm0 4h4v2H8v-2Z" />
    </svg>
  ),
  "forbidden-chat": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path fillRule="evenodd" d="M10 2a6 6 0 0 0-3.832 10.657l-1.534 1.534a.75.75 0 1 0 1.06 1.06l1.534-1.534A6 6 0 1 0 10 2Zm0 3a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 10 5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  ),
  "reignite-couples": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M9.653 2.074a1 1 0 0 1 1.294 0l1.147 1.002a1 1 0 0 0 .76.274h1.518c.796 0 1.128 1.02.485 1.488l-1.193.86a1 1 0 0 0-.364 1.118l.456 1.465c.243.78-.637 1.418-1.305.942l-1.234-.888a1 1 0 0 0-1.17 0l-1.234.888c-.668.476-1.548-.162-1.305-.942l.456-1.465a1 1 0 0 0-.364-1.118l-1.193-.86c-.643-.468-.311-1.488.485-1.488h1.518a1 1 0 0 0 .76-.274L9.653 2.074Z" />
    </svg>
  ),
  "character-voices": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M10 2a4 4 0 0 0-4 4v1H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm0 2a2 2 0 0 1 2 2v1H8V6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 16.5A4.5 4.5 0 0 1 10 12a4.5 4.5 0 0 1 6 4.5v.5H4v-.5Z" />
    </svg>
  ),
};

/** Sidebar nav — compact icon + text; active item gets cinematic emphasis. */
export function NakamaUniverseNavButton({
  id,
  label,
  poster,
  active = false,
  onClick,
}: {
  id?: string;
  label: string;
  poster: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const icon = NAV_ICONS[id ?? ""] ?? NAV_ICONS.profile;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`launcher-nav-item shrink-0 lg:shrink lg:min-w-0 ${
        active ? "launcher-nav-item-active" : "launcher-nav-item-inactive"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          active
            ? "bg-amber-900/30 text-amber-300"
            : "bg-white/[0.04] text-stone-500 group-hover:text-stone-300"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-serif text-[13px] leading-tight lg:text-sm ${
            active ? "font-semibold text-amber-50" : "font-medium"
          }`}
        >
          {label}
        </span>
      </span>
      {active && poster ? (
        <span className="hidden h-9 w-12 shrink-0 overflow-hidden rounded-md opacity-80 lg:block">
          <img src={poster} alt="" className="h-full w-full object-cover" />
        </span>
      ) : null}
    </button>
  );
}
