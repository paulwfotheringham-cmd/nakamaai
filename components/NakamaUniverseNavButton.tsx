"use client";

import type { ReactNode } from "react";

const iconClass = "h-5 w-5 shrink-0";

const NAV_ICONS: Record<string, ReactNode> = {
  audiobooks: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "build-adventure": (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 4 8-4M12 11v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "interactive-adventures": (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M6 4h12v16H6V4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 9h4M10 13h4M10 17h2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  "forbidden-chat": (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "reignite-couples": (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 21s-6-4.35-6-10a4 4 0 0 1 7-2.4A4 4 0 0 1 18 11c0 5.65-6 10-6 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "character-voices": (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v3M8 21h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  ),
};

/** Premium launcher sidebar control — icon + label, strong active state. */
export function NakamaUniverseNavButton({
  id,
  label,
  active = false,
  onClick,
}: {
  id?: string;
  label: string;
  poster?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const icon = NAV_ICONS[id ?? ""] ?? NAV_ICONS.profile;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full min-w-[11rem] shrink-0 items-center gap-3.5 rounded-xl px-3 py-3.5 text-left transition-all duration-300 ease-out md:min-w-0 ${
        active
          ? "bg-gradient-to-r from-amber-950/55 via-amber-950/25 to-transparent text-amber-50 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(198,164,106,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "text-stone-500 hover:-translate-y-px hover:bg-white/[0.04] hover:text-stone-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
      }`}
    >
      {active ? (
        <span
          className="absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_0_14px_rgba(198,164,106,0.65)]"
          aria-hidden
        />
      ) : null}

      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
          active
            ? "bg-amber-900/45 text-amber-200 shadow-[0_0_20px_rgba(198,164,106,0.2)]"
            : "bg-white/[0.03] text-stone-500 group-hover:bg-amber-950/20 group-hover:text-amber-200/90 group-hover:shadow-[0_0_12px_rgba(198,164,106,0.08)]"
        } group-hover:scale-105`}
      >
        {icon}
      </span>

      <span
        className={`min-w-0 flex-1 font-serif text-[14px] leading-[1.35] tracking-tight whitespace-normal md:text-[15px] ${
          active ? "font-semibold text-amber-50" : "font-medium"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
