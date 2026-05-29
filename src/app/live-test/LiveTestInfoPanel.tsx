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
    <div className="launcher-panel animate-panel-in">
      <header className="launcher-panel-header border-b border-white/[0.04] pb-6">
        <p className="launcher-eyebrow">{eyebrow}</p>
        <h1 className="launcher-title text-2xl sm:text-3xl">{title}</h1>
        <p className="launcher-subtitle">{description}</p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-8 sm:p-10">
        {poster ? (
          <>
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover brightness-[0.88] contrast-[1.05]"
            />
            <div className="launcher-card-overlay-featured pointer-events-none absolute inset-0" aria-hidden />
            <div className="launcher-card-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          </>
        ) : null}

        <div className="relative z-10 max-w-lg text-center">
          <p className="font-display text-card font-medium leading-snug text-luxury-primary sm:text-3xl">
            Coming soon
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-300/90 sm:text-lg">
            {body}
          </p>
          <p className="launcher-section-label mt-8">
            Your guide can help you explore this area
          </p>
        </div>
      </div>
    </div>
  );
}
