"use client";

/** Embeds /fantasy-audio in the live-test center panel (same page as nakamanights.com/fantasy-audio). */
export default function LiveTestFantasyAudioFrame() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
      <iframe
        src="/fantasy-audio?embed=1"
        title="Choose Your Fantasy Audio"
        className="min-h-0 w-full flex-1 border-0 bg-black"
      />
    </div>
  );
}
