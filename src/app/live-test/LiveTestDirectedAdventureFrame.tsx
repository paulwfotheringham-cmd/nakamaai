"use client";

const DIRECTED_ADVENTURE_URL = "https://nakamaplayground.vercel.app/directed-adventure";

/** Embeds Nakama Playground directed adventure in the live-test center panel. */
export default function LiveTestDirectedAdventureFrame() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
      <iframe
        src={DIRECTED_ADVENTURE_URL}
        title="Interactive adventures"
        className="min-h-0 w-full flex-1 border-0 bg-black"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
