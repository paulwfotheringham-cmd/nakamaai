export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07040d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,52,120,0.22),transparent_45%)]" />

      <img
        src="/images/sleeping-girl.png"
        alt=""
        className="pointer-events-none absolute right-0 top-0 hidden h-[420px] w-[320px] select-none object-cover opacity-[0.10] blur-sm lg:block"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#07040d] via-[#07040d]/92 to-[#07040d]/75" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-16 px-6 py-16 lg:px-12">
        <section className="max-w-3xl">
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#c9a96a]">
            Nakama
          </p>

          <div className="mb-8 inline-flex rounded-full border border-[#6f5731]/50 bg-[#2a1d17]/60 px-5 py-2 text-sm text-[#e0c185]">
            Premium fantasy audio experiences
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
            Create immersive
            <br />
            romantic audio
            <br />
            stories with
            <br />
            <span className="text-[#d4b26e]">Nakama</span>
          </h1>

          <p className="mt-10 max-w-2xl text-2xl leading-8 text-white/80">
            Choose the mood, shape the characters, customise the voices, and
            generate a private audio fantasy built around your taste.
          </p>

          <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Guided story design
              </h3>
              <p className="text-base leading-7 text-white/65">
                Pick the setting, tone, pacing, and story type.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Voice customization
              </h3>
              <p className="text-base leading-7 text-white/65">
                Assign different voices to different characters.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Private audio scenes
              </h3>
              <p className="text-base leading-7 text-white/65">
                Generate scenes made for listening, not just reading.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Fast iteration
              </h3>
              <p className="text-base leading-7 text-white/65">
                Adjust one detail and instantly create a new version.
              </p>
            </div>
          </div>
        </section>

        <aside className="w-full max-w-[520px]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md md:p-10">
            <p className="mb-6 text-sm uppercase tracking-[0.3em] text-[#c9a96a]">
              Get started
            </p>

            <h2 className="mb-4 text-5xl font-semibold tracking-[-0.03em] text-white">
              Join Nakama
            </h2>

            <p className="mb-8 text-2xl leading-8 text-white/70">
              Create your account to set up your password and start building
              your first audio experience.
            </p>

            <a
              href="/signup"
              className="mb-4 flex h-16 w-full items-center justify-center rounded-2xl bg-[#d4b26e] text-xl font-semibold text-black transition hover:brightness-105"
            >
              Create Account
            </a>

            <a
              href="/login"
              className="flex h-16 w-full items-center justify-center rounded-2xl border border-white/15 bg-white/[0.02] text-xl font-semibold text-white transition hover:bg-white/[0.06]"
            >
              Sign In
            </a>

            <div className="mt-8 rounded-2xl border border-[#6f5731]/35 bg-[#211811]/60 p-5 text-base leading-7 text-[#e7d3a8]">
              A softer, more intimate listening experience — now with a subtle
              late-night visual atmosphere on the homepage.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
