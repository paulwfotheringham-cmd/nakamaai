"use client";

const COUPLES_MODES = [
  {
    id: "date-night",
    title: "Date Night Mode",
    description:
      "A mediated 30-min experience designed to be played during a date night at home — sets the mood, builds anticipation, leads somewhere.",
    image: "/tiles/tile5.jpg",
  },
  {
    id: "surprise",
    title: "Surprise Mode",
    description:
      "Woman makes the story, surprises partner with a fantasy adventure.",
    image: "/tiles/lover.jpg",
  },
  {
    id: "reconnection",
    title: "The Reconnection Series",
    description:
      "For couples coming back from distance, stress, new parenthood, or simply drift — emotionally intelligent audio that rebuilds intimacy from the ground up before it becomes physical.",
    image: "/scenes/moor.jpg",
  },
] as const;

export default function LiveTestCouplesProgram() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-amber-600/85 sm:text-[10px]">
          Reignite
        </p>
        <h1 className="mt-1 font-serif text-lg font-semibold leading-tight text-white sm:text-xl lg:text-2xl">
          The Couples Program
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-stone-400 sm:text-sm">
          A dedicated section for long-term partners and married couples — choose
          how you want to reconnect tonight.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          {COUPLES_MODES.map((mode) => (
            <article
              key={mode.id}
              className="relative flex min-h-[9.5rem] flex-col overflow-hidden rounded-xl border border-stone-800/80 bg-black/35"
            >
              <img
                src={mode.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/45"
                aria-hidden
              />
              <div className="relative flex min-h-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div>
                  <h2 className="font-serif text-base font-semibold text-amber-100 sm:text-lg">
                    {mode.title}
                  </h2>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-stone-300 sm:text-xs">
                    {mode.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-3 w-fit rounded-full border border-amber-400/45 bg-gradient-to-b from-amber-200/90 to-amber-600 px-4 py-1.5 text-[11px] font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 sm:text-xs"
                >
                  Start
                </button>
              </div>
            </article>
          ))}

          <article className="relative overflow-hidden rounded-xl border border-amber-800/35 bg-black/40 sm:col-span-2">
            <img
              src="/tiles/tile5.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/60"
              aria-hidden
            />
            <div className="relative flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-500/90">
                  Together
                </p>
                <h2 className="mt-1 font-serif text-base font-semibold text-white sm:text-lg">
                  Shared session
                </h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-stone-300 sm:text-xs">
                  Both partners open the same audio on their own devices and hit
                  play simultaneously — guided by a narrator who speaks to both of
                  you, directing the experience together.
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-amber-400/45 bg-gradient-to-b from-amber-200/90 to-amber-600 px-5 py-2 text-xs font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500"
              >
                Begin shared session
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
