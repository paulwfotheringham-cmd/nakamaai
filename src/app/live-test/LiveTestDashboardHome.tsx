"use client";

const QUICK_TILES = [
  {
    title: "Fantasy catalogue",
    description: "Browse themed audio collections and find your next mood.",
    icon: "✦",
  },
  {
    title: "Build a story",
    description: "Shape tone, heat, and voice — your fantasy, your way.",
    icon: "◇",
  },
  {
    title: "Interactive story",
    description: "Branching adventures that respond to your choices.",
    icon: "◎",
  },
  {
    title: "Couples",
    description: "Shared experiences for two — date night and reconnect.",
    icon: "♡",
  },
] as const;

const RECENT_PLACEHOLDER = [
  { label: "Pirate on the high seas", meta: "Historical · Last played 3 days ago" },
  { label: "Office after hours", meta: "Modern · In progress" },
];

export default function LiveTestDashboardHome() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-600/85">
            Pleasure portal
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
              Jane
            </span>
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-400">
            Your Nakama home — pick up where you left off or start something new. Your guide
            is ready on the right whenever you want to talk.
          </p>
        </header>

        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500/80">
            Continue
          </h2>
          <ul className="space-y-2">
            {RECENT_PLACEHOLDER.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-800/80 bg-black/30 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-200">{item.label}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{item.meta}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-amber-500/90">Resume →</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500/80">
            Explore
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_TILES.map((tile) => (
              <div
                key={tile.title}
                className="rounded-xl border border-amber-900/20 bg-zinc-900/40 p-4 transition hover:border-amber-700/35 hover:bg-zinc-900/70"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-800/30 bg-amber-950/50 text-sm text-amber-300/90"
                  aria-hidden
                >
                  {tile.icon}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-amber-50/95">{tile.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{tile.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
