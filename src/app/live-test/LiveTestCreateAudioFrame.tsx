"use client";

/** Embeds /create-audio in the live-test center panel (nakamanights.com/create-audio). */
export default function LiveTestCreateAudioFrame() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
      <iframe
        src="/create-audio?embed=1"
        title="Create your fantasy audio"
        className="min-h-0 w-full flex-1 border-0 bg-black"
      />
    </div>
  );
}
