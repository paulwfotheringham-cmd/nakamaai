"use client";

const COUPLES_TILES = [
  {
    id: "date-night",
    title: "Date Night Mode",
    description:
      "A mediated 30-min experience for date night at home — sets the mood, builds anticipation, leads somewhere.",
    image: "/couples/date-night.jpg",
    button: "Start",
  },
  {
    id: "surprise",
    title: "Surprise Mode",
    description:
      "Woman makes the story, surprises partner with a fantasy adventure.",
    image: "/couples/surprise.jpg",
    button: "Start",
  },
  {
    id: "reconnection",
    title: "The Reconnection Series",
    description:
      "For couples coming back from distance, stress, new parenthood, or drift — audio that rebuilds intimacy before it becomes physical.",
    image: "/couples/reconnection.jpg",
    button: "Start",
  },
  {
    id: "shared",
    eyebrow: "Together",
    title: "Shared session",
    description:
      "Both partners open the same audio on their devices and play together — guided by a narrator for both of you.",
    image: "/couples/shared-session.jpg",
    button: "Begin shared session",
  },
] as const;

function CouplesTile({
  eyebrow,
  title,
  description,
  image,
  button,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  button: string;
}) {
  return (
    <article className="relative h-full min-h-0 overflow-hidden rounded-xl border border-stone-800/80 bg-zinc-950">
      <img
        src={image}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/30 to-black/55"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-start px-2.5 pb-3 pt-4 text-center sm:px-3 sm:pt-5">
        <div className="max-w-[95%]">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-[11px]">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`font-serif text-xl font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] sm:text-2xl md:text-[1.75rem] ${
              eyebrow ? "mt-1" : ""
            }`}
          >
            {title}
          </h2>
          <p className="mt-2 line-clamp-4 text-xs font-semibold leading-snug text-stone-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] sm:text-[13px]">
            {description}
          </p>
          <button
            type="button"
            className="mx-auto mt-3 w-full max-w-[11rem] rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-4 py-2 text-center text-[11px] font-bold text-zinc-950 shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition hover:from-amber-100 hover:to-amber-500 sm:max-w-[12.5rem] sm:px-5 sm:py-2.5 sm:text-xs"
          >
            {button}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function LiveTestCouplesProgram() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Reignite
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          The Couples Program
        </h1>
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          For long-term partners and married couples — choose how you want to reconnect
          tonight.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 auto-rows-[minmax(8.5rem,1fr)] grid-cols-1 gap-2 overflow-y-auto p-2 sm:grid-cols-2 sm:grid-rows-2 sm:overflow-hidden sm:gap-2.5 sm:p-3">
        {COUPLES_TILES.map((tile) => (
          <CouplesTile key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
}
