"use client";

import { useState } from "react";

const options = [
  {
    id: "catalogue",
    label: "Choose from our catalogue of erotic audibles for couples.",
  },
  {
    id: "create-ai",
    label: "Create your own fantasy using Nakama AI",
  },
  {
    id: "write-own",
    label: "Write your own fantasy.",
  },
] as const;

export default function CouplesActions() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="mt-10">
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="inline-flex items-center justify-center rounded-xl border border-[rgba(216,178,110,0.35)] bg-[rgba(216,178,110,0.15)] px-8 py-3.5 text-base font-semibold text-[#f1d7a1] transition hover:bg-[rgba(216,178,110,0.22)]"
        >
          Start Now
        </button>
      </div>
    );
  }

  return (
    <ol className="mt-10 flex list-none flex-col gap-4 p-0">
      {options.map((opt, index) => {
        const n = index + 1;
        const inner = (
          <span className="flex gap-4 text-left">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-[#f1d7a1]"
              aria-hidden
            >
              {n}
            </span>
            <span className="pt-1 text-base font-medium leading-snug text-zinc-100">
              {opt.label}
            </span>
          </span>
        );

        const cardClass =
          "w-full rounded-2xl border border-white/10 bg-white/5 p-5";

        return (
          <li key={opt.id}>
            <div className={cardClass}>{inner}</div>
          </li>
        );
      })}
    </ol>
  );
}
