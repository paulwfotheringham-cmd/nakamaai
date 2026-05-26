"use client";

const PICK_UP_ITEMS = [
  {
    section: "Audiobooks",
    lastActivity: "Gothic · windswept moor",
    when: "Last played 3 days ago",
  },
  {
    section: "Build Adventure",
    lastActivity: "Your draft — slow burn, office setting",
    when: "Saved, not finished",
  },
  {
    section: "Interactive Adventures",
    lastActivity: "Chapter 2 — the choice at the door",
    when: "In progress",
  },
  {
    section: "Reignite for Couples",
    lastActivity: "Date Night Mode — Reconnection Series",
    when: "Last time you were here, 2 days ago",
  },
] as const;

export default function LiveTestDashboardHome() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-amber-600/85 sm:text-[10px]">
          Dashboard
        </p>
        <h1 className="mt-1 font-serif text-lg font-semibold leading-tight tracking-tight text-white sm:text-xl lg:text-2xl">
          This is your dashboard,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
            Jane
          </span>
        </h1>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-stone-400 sm:text-xs">
          Pick up where you left off, or choose from the menu on the left. Your guide is on the
          right when you want to talk.
        </p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="mb-2 shrink-0">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-500/80">
            Pick up where you left off
          </h2>
          <p className="mt-0.5 text-[10px] text-stone-500 sm:text-[11px]">
            Do you want to continue?
          </p>
        </div>

        <ul className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5">
          {PICK_UP_ITEMS.map((item) => (
            <li
              key={item.section}
              className="flex min-h-0 flex-col justify-between overflow-hidden rounded-xl border border-stone-800/80 bg-black/30 px-2.5 py-2 sm:px-3 sm:py-2.5"
            >
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-600/75 sm:text-[10px]">
                  {item.section}
                </p>
                <p className="mt-1 truncate text-xs font-medium text-stone-200 sm:text-sm">
                  {item.lastActivity}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-stone-500">{item.when}</p>
              </div>
              <div className="mt-2 flex shrink-0 flex-wrap gap-1.5">
                <button
                  type="button"
                  className="rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-200/90 to-amber-600 px-2.5 py-1 text-[10px] font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 sm:px-3 sm:text-xs"
                >
                  Yes, continue
                </button>
                <button
                  type="button"
                  className="rounded-full border border-stone-700/80 bg-transparent px-2.5 py-1 text-[10px] font-medium text-stone-400 transition hover:border-stone-600 hover:text-stone-300 sm:px-3 sm:text-xs"
                >
                  Not now
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
