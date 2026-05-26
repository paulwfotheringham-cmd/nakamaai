"use client";

/** Embeds /fantasy-audio in the live-test center panel (same page as nakamanights.com/fantasy-audio). */
export default function LiveTestFantasyAudioFrame() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.25)]">
      <iframe
        src="/fantasy-audio?embed=1"
        title="Choose Your Fantasy Audio"
        className="block min-h-0 h-full w-full flex-1 border-0 bg-transparent"
      />
    </div>
  );
}
