"use client";

/** Embeds /create-audio in the live-test center panel — shell header + two-column embed body. */
export default function LiveTestCreateAudioFrame() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="type-label text-amber-600/85">
          Interactive adventures
        </p>
        <h1 className="mt-0.5 type-section-heading text-luxury-primary sm:text-lg">
          Create your fantasy audio
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Set your scene on the left — your story and choices play on the right.
        </p>
      </header>
      <iframe
        src="/create-audio?embed=1"
        title="Create your fantasy audio"
        className="min-h-0 w-full flex-1 border-0 bg-transparent"
      />
    </div>
  );
}
