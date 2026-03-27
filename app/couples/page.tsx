import Image from "next/image";

export default function CouplesPage() {
  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <a
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Home
      </a>
      <img
        src="/Nakama-AI-July25-White.png"
        alt="Nakama logo"
        className="absolute right-8 top-6 z-20 h-[52px] w-auto sm:h-[63px]"
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 pb-16 pt-24 sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:pb-24 lg:pt-28">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl lg:aspect-auto lg:min-h-[min(70vh,640px)] lg:flex-1 lg:max-w-xl">
          <Image
            src="/couples.jpg"
            alt="Couple sharing a moment together"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <section className="flex flex-1 flex-col justify-center lg:max-w-xl lg:py-8">
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[2.75rem] xl:text-5xl">
            Experience New Adventures. Together
          </h1>
          <div className="mt-10">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(216,178,110,0.35)] bg-[rgba(216,178,110,0.15)] px-8 py-3.5 text-base font-semibold text-[#f1d7a1] transition hover:bg-[rgba(216,178,110,0.22)]"
            >
              Start Now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
