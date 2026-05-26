"use client";

const PICK_UP_ITEMS = [
  {
    section: "Couples",
    lastActivity: "Date Night Mode — Reconnection Series",
    when: "Last time you were here, 2 days ago",
  },
  {
    section: "Fantasy Catalogue",
    lastActivity: "Gothic · windswept moor",
    when: "Browsed last week",
  },
  {
    section: "Build story",
    lastActivity: "Your draft — slow burn, office setting",
    when: "Saved, not finished",
  },
  {
    section: "Interactive story",
    lastActivity: "Chapter 2 — the choice at the door",
    when: "In progress",
  },
] as const;

export default function LiveTestDashboardHome() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-600/85">
            Dashboard
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            This is your dashboard,{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
              Jane
            </span>
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-400">
            Everything you&apos;ve opened lives here. Pick up where you left off, or use the menu
            on the left to try something new. Your guide is on the right if you want to talk.
          </p>
        </header>

        <section>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500/80">
            Pick up where you left off
          </h2>
          <p className="mb-4 text-xs text-stone-500">
            Based on the last places you visited — do you want to continue?
          </p>

          <ul className="space-y-3">
            {PICK_UP_ITEMS.map((item) => (
              <li
                key={item.section}
                className="rounded-xl border border-stone-800/80 bg-black/30 px-3.5 py-3.5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600/75">
                  {item.section}
                </p>
                <p className="mt-1.5 text-sm font-medium text-stone-200">{item.lastActivity}</p>
                <p className="mt-0.5 text-xs text-stone-500">{item.when}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-200/90 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500"
                  >
                    Yes, continue
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-stone-700/80 bg-transparent px-3.5 py-1.5 text-xs font-medium text-stone-400 transition hover:border-stone-600 hover:text-stone-300"
                  >
                    Not now
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
