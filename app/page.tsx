export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07040d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,52,120,0.22),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c9a96a]">
              Nakama
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">
              Nakama AI
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-base text-white/80">
            Welcome to your dashboard
          </div>
        </div>

        <div className="mb-8 inline-flex rounded-full border border-[#6f5731]/50 bg-[#2a1d17]/60 px-5 py-2 text-sm text-[#e0c185]">
          Your creative hub
        </div>

        <h2 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
          Pick what you want to do in
          <br />
          <span className="text-[#d4b26e]">Nakama</span>
        </h2>

        <p className="mt-10 max-w-4xl text-2xl leading-8 text-white/80">
          Choose fantasy audio, customize your story experience, or manage your
          profile.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <a
            href="/fantasy-audio"
            className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md transition hover:bg-white/[0.07]"
          >
            <div className="mb-6 inline-flex rounded-full border border-[#6f5731]/50 bg-[#2a1d17]/60 px-5 py-2 text-sm uppercase tracking-[0.2em] text-[#d4b26e]">
              Nakama
            </div>

            <h3 className="mb-6 text-5xl font-semibold tracking-[-0.03em] text-white">
              Choose fantasy Audio
            </h3>

            <p className="mb-10 text-2xl leading-9 text-white/65">
              Browse and begin your next immersive audio experience.
            </p>

            <div className="text-3xl font-semibold text-[#d4b26e]">Open →</div>
          </a>

          <a
            href="/custom"
            className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md transition hover:bg-white/[0.07]"
          >
            <div className="mb-6 inline-flex rounded-full border border-[#6f5731]/50 bg-[#2a1d17]/60 px-5 py-2 text-sm uppercase tracking-[0.2em] text-[#d4b26e]">
              Nakama
            </div>

            <h3 className="mb-6 text-5xl font-semibold tracking-[-0.03em] text-white">
              Customize your audio
            </h3>

            <p className="mb-10 text-2xl leading-9 text-white/65">
              Adjust mood, voices, characters, and generate your scene.
            </p>

            <div className="text-3xl font-semibold text-[#d4b26e]">Open →</div>
          </a>

          <a
            href="/profile"
            className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md transition hover:bg-white/[0.07]"
          >
            <div className="mb-6 inline-flex rounded-full border border-[#6f5731]/50 bg-[#2a1d17]/60 px-5 py-2 text-sm uppercase tracking-[0.2em] text-[#d4b26e]">
              Nakama
            </div>

            <h3 className="mb-6 text-5xl font-semibold tracking-[-0.03em] text-white">
              Profile
            </h3>

            <p className="mb-10 text-2xl leading-9 text-white/65">
              Manage your details, preferences, and account settings.
            </p>

            <div className="text-3xl font-semibold text-[#d4b26e]">Open →</div>
          </a>
        </div>
      </div>
    </main>
  );
}
