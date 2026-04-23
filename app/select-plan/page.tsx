import Link from "next/link";

type SelectPlanPageProps = {
  searchParams?: {
    name?: string | string[];
    email?: string | string[];
  };
};

function readParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default function SelectPlanPage({ searchParams }: SelectPlanPageProps) {
  const name = readParam(searchParams?.name);
  const email = readParam(searchParams?.email);
  const passthrough = new URLSearchParams();
  if (name) passthrough.set("name", name);
  if (email) passthrough.set("email", email);
  const suffix = passthrough.toString();
  const nightsHref = `/fake-checkout?plan=nights${suffix ? `&${suffix}` : ""}`;
  const teaserHref = `/fake-checkout?plan=teaser${suffix ? `&${suffix}` : ""}`;

  const featuresNights = [
    "Cancel anytime",
    "Full History",
    "50 voices",
    "All services",
  ];
  const featuresTeaser = [
    "Standard Voices",
    "Access to all services",
    "No charge today",
    "Cancel before day 10",
  ];

  /** Shared vertical rhythm so both columns line up on md+ */
  const topBlock =
    "flex min-h-[11.5rem] flex-col items-center justify-start text-center sm:min-h-[10.5rem]";
  const eyebrow =
    "h-5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em]";
  const tierTitle =
    "mt-2 max-w-[18ch] text-3xl font-bold leading-tight tracking-tight sm:text-[2.125rem] md:text-4xl md:leading-[1.1]";
  const tagline =
    "mx-auto mt-3 max-w-[17rem] flex-1 text-sm leading-relaxed sm:text-[15px]";
  const priceBox =
    "flex h-[7.25rem] shrink-0 flex-col items-center justify-center text-center";
  const priceMain =
    "text-2xl font-semibold tabular-nums tracking-tight sm:text-[1.65rem] md:text-3xl";
  const featureList = "mt-0 flex flex-1 flex-col gap-2.5";
  const featurePill =
    "flex min-h-[2.75rem] items-center justify-center rounded-full px-3 text-center text-[13px] font-medium tracking-wide sm:text-sm";

  return (
    <main className="relative min-h-screen bg-black text-white antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_-10%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      <Link
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-amber-900/40 bg-zinc-950/90 px-4 py-2.5 text-sm font-medium text-amber-100/90 shadow-sm backdrop-blur-sm transition hover:border-amber-700/50 hover:bg-zinc-900"
      >
        ← Home
      </Link>

      <img
        src="/nakama-nights-logo.png"
        alt="Nakama AI"
        className="pointer-events-none absolute right-8 top-6 z-20 h-[52px] w-auto sm:h-[63px]"
      />

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-24 pt-24 sm:px-8 sm:pt-28">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-600/85">
            Choose your plan
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
            Start your{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
              Nakama
            </span>{" "}
            journey
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-400 sm:text-[17px]">
            Pick the tier that fits how deeply you want to immerse yourself.
          </p>
        </header>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2 md:items-stretch md:gap-8">
          {/* Nakama Nights */}
          <article className="flex min-h-full flex-col rounded-2xl bg-gradient-to-b from-zinc-900/95 to-black px-6 py-8 sm:px-8 sm:py-10">
            <div className={topBlock}>
              <p className={`${eyebrow} text-amber-500/70`}>Full access</p>
              <h2 className={`${tierTitle} text-white`}>Nakama Nights</h2>
              <p className={`${tagline} text-stone-400`}>
                Dive deep into your fantasies
              </p>
            </div>

            <div className={priceBox}>
              <p className={`${priceMain} text-amber-100`}>
                $14.99
                <span className="text-base font-medium text-stone-500 sm:text-lg">
                  {" "}
                  / month
                </span>
              </p>
            </div>

            <ul className={featureList}>
              {featuresNights.map((label) => (
                <li
                  key={label}
                  className={`${featurePill} border border-amber-900/35 bg-black/50 text-stone-300`}
                >
                  {label}
                </li>
              ))}
            </ul>

            <a
              href={nightsHref}
              className="mt-8 inline-flex w-full shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-6 py-3.5 text-center text-sm font-semibold text-zinc-950 shadow-md transition hover:from-amber-100 hover:to-amber-500 sm:py-4 sm:text-[15px]"
            >
              Select plan
            </a>
          </article>

          {/* The Teaser */}
          <article className="flex min-h-full flex-col rounded-2xl bg-zinc-950/80 px-6 py-8 sm:px-8 sm:py-10">
            <div className={topBlock}>
              <p className={`${eyebrow} text-stone-500`}>Try first</p>
              <h2 className={`${tierTitle} text-stone-100`}>The Teaser</h2>
              <p className={`${tagline} text-stone-500`}>
                Enjoy 10 days free use of the Platform
              </p>
            </div>

            <div className={priceBox}>
              <div className={`${priceMain} leading-tight text-stone-100`}>
                <span className="block text-lg font-medium text-stone-500 sm:text-xl">
                  Free for
                </span>
                <span className="mt-1 block bg-gradient-to-r from-amber-200/90 to-amber-400/80 bg-clip-text text-transparent">
                  10 days
                </span>
              </div>
            </div>

            <ul className={featureList}>
              {featuresTeaser.map((label) => (
                <li
                  key={label}
                  className={`${featurePill} border border-stone-800 bg-black/30 text-stone-400`}
                >
                  {label}
                </li>
              ))}
            </ul>

            <a
              href={teaserHref}
              className="mt-8 inline-flex w-full shrink-0 items-center justify-center rounded-full border border-amber-800/50 bg-transparent px-6 py-3.5 text-center text-sm font-semibold text-amber-100/95 transition hover:border-amber-600/60 hover:bg-amber-950/30 sm:py-4 sm:text-[15px]"
            >
              Select plan
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
