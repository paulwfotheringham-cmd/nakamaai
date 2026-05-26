"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FANTASY_AUDIO_CATEGORY_OPTIONS } from "@/lib/fantasy-audio-category-options";

const VISIBLE = 2;

const PLAYABLE: Record<string, string> = {
  "Anime 1":
    "https://dowomlnsxwxslpydtitw.supabase.co/storage/v1/object/sign/audio/firstaudio.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjJiZGI3MS1iNzJkLTQ2Y2MtYjUwZS1kMDYyZTU5NmEyZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby9maXJzdGF1ZGlvLm1wMyIsImlhdCI6MTc3NDEzNTU3MywiZXhwIjoxODA1NjcxNTczfQ.Z7lLEDEAbZD0My_312T8M2YA6GAYdHX0Qh8neROAFZ0",
  Werewolf:
    "https://dowomlnsxwxslpydtitw.supabase.co/storage/v1/object/sign/audio/werewolf.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjJiZGI3MS1iNzJkLTQ2Y2MtYjUwZS1kMDYyZTU5NmEyZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby93ZXJld29sZi5tcDMiLCJpYXQiOjE3NzQxMzY1OTYsImV4cCI6MTgwNTY3MjU5Nn0.hYlkbQGvo0BpzZTX6JTVrH-mryufj2ksbwXwIirSUGY",
  "Star Trek": "/sciencefiction.mp3",
};

function visibleItems(items: string[], start: number): string[] {
  return Array.from({ length: Math.min(VISIBLE, items.length) }, (_, i) => {
    return items[(start + i) % items.length];
  });
}

export default function FantasyCatalogueEmbed() {
  const rows = FANTASY_AUDIO_CATEGORY_OPTIONS;
  const [positions, setPositions] = useState(() => rows.map(() => 0));
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visibleRows = useMemo(
    () => rows.map((row, i) => visibleItems(row.items, positions[i] ?? 0)),
    [rows, positions],
  );

  const go = (rowIndex: number, delta: number) => {
    setPositions((prev) =>
      prev.map((pos, i) => {
        if (i !== rowIndex) return pos;
        const len = rows[i].items.length;
        return (pos + delta + len) % len;
      }),
    );
  };

  const togglePlay = (item: string) => {
    const url = PLAYABLE[item];
    if (!url) return;

    if (playing === item) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlaying(item);
    audio.play().catch(() => setPlaying(null));
    audio.onended = () => setPlaying(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a]">
      <div className="shrink-0 border-b border-stone-800/80 px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
          Fantasy audio
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
          Choose your fantasy audio
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-stone-400">
          Browse by mood and setting — same library as{" "}
          <Link href="/fantasy-audio" className="text-amber-400/90 underline-offset-2 hover:underline">
            Fantasy Audio
          </Link>
          .
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
            <div
              key={row.categoryTitle}
              className="rounded-xl border border-stone-800/80 bg-black/30 p-2.5 sm:p-3"
            >
              <p className="mb-2 truncate text-xs font-semibold text-amber-200/90 sm:text-sm">
                {row.categoryTitle}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => go(rowIndex, -1)}
                  aria-label="Previous"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-700/80 text-amber-400/90 hover:bg-amber-950/30"
                >
                  ←
                </button>

                <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5">
                  {visibleRows[rowIndex].map((item) => {
                    const canPlay = Boolean(PLAYABLE[item]);
                    const isPlaying = playing === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => togglePlay(item)}
                        disabled={!canPlay}
                        className={`rounded-lg border px-2 py-2.5 text-left text-[11px] font-medium leading-snug transition sm:text-xs ${
                          isPlaying
                            ? "border-amber-400/50 bg-amber-950/50 text-amber-100"
                            : canPlay
                              ? "border-stone-700/80 bg-zinc-900/60 text-stone-200 hover:border-amber-700/40"
                              : "cursor-default border-stone-800/60 bg-zinc-950/40 text-stone-500"
                        }`}
                      >
                        {canPlay && (
                          <span className="mr-1 opacity-80">{isPlaying ? "⏸" : "▶"}</span>
                        )}
                        {item}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => go(rowIndex, 1)}
                  aria-label="Next"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-700/80 text-amber-400/90 hover:bg-amber-950/30"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {playing && (
        <div className="shrink-0 border-t border-stone-800/80 bg-black/50 px-4 py-2 text-xs text-amber-200/90">
          Now playing: {playing}
        </div>
      )}
    </div>
  );
}
