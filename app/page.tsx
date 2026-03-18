export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <img
        src="/images/sleeping-girl.png"
        alt=""
        className="pointer-events-none absolute right-[-80px] top-[-40px] z-0 hidden w-[420px] select-none opacity-20 blur-md md:block"
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-400">
            Nakama AI
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight sm:text-6xl">
            Build your circle.
          </h1>

          <p className="mb-8 text-lg leading-8 text-neutral-300">
            Nakama helps people connect, collaborate, and feel at home online.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/signup"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Get started
            </a>

            <a
              href="#"
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
