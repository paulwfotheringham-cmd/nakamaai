"use client";

type LiveTestInfoPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  poster?: string;
  body?: string;
};

export default function LiveTestInfoPanel({
  eyebrow,
  title,
  description,
  poster,
  body,
}: LiveTestInfoPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          {eyebrow}
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          {title}
        </h1>
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          {description}
        </p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-4 sm:p-6">
        {poster ? (
          <>
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-black/25"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65"
              aria-hidden
            />
          </>
        ) : null}

        <div className="relative z-10 max-w-md text-center">
          <p className="font-serif text-lg font-bold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-xl">
            Coming soon
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-stone-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] sm:text-base">
            {body}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-500/90">
            Your guide can help you explore this area
          </p>
        </div>
      </div>
    </div>
  );
}
