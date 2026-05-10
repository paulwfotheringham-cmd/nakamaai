import Image from "next/image";
import Link from "next/link";

const heroImage =
  "https://images.unsplash.com/photo-1566024287286-457247b70310?auto=format&fit=crop&w=2400&q=85";

const collections = [
  {
    title: "Spiritual Life",
    image:
      "https://images.unsplash.com/photo-1528360983277-fbfda6f7d58e?auto=format&fit=crop&w=900&q=80",
    alt: "Golden Buddha statue in soft light",
  },
  {
    title: "People of Samui",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    alt: "Portrait inspired by island life",
  },
  {
    title: "Island Life",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    alt: "Tropical shoreline at golden hour",
  },
  {
    title: "Hard Working Hands",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    alt: "Hands at work, craftsmanship",
  },
  {
    title: "Landscapes",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b96ec15a0be?auto=format&fit=crop&w=900&q=80",
    alt: "Misty tropical hills and sea",
  },
] as const;

const features = [
  {
    title: "Travel Friendly",
    description: "Lightweight pieces, ready for your journey home.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: "Worldwide Shipping",
    description: "Carefully packed and insured to your door.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M3 10h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" />
        <path d="M7 10V7l5-3 5 3v3" />
        <path d="M7 20v-4h10v4" />
      </svg>
    ),
  },
  {
    title: "Certificate of Authenticity",
    description: "Every original arrives with provenance you can trust.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M6 3h12v16l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 9h6M9 13h4" />
      </svg>
    ),
  },
  {
    title: "Secure Payment",
    description: "Encrypted checkout with major cards and trusted providers.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="3" y="10" width="18" height="10" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </svg>
    ),
  },
] as const;

function NavLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        href="#gallery"
        className="text-sm tracking-[0.2em] text-white/90 transition hover:text-gold"
      >
        Gallery
      </Link>
      <Link
        href="#collections"
        className="text-sm tracking-[0.2em] text-white/90 transition hover:text-gold"
      >
        Shop
      </Link>
      <Link
        href="#story"
        className="text-sm tracking-[0.2em] text-white/90 transition hover:text-gold"
      >
        Our Story
      </Link>
      <Link
        href="#contact"
        className="text-sm tracking-[0.2em] text-white/90 transition hover:text-gold"
      >
        Contact
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-charcoal">
      {/* Hero */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Cinematic view of fishing boats on the water at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <header className="relative z-20 border-b border-white/10 backdrop-blur-[2px]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 md:px-8">
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.08em] text-white md:text-2xl"
            >
              Soul of Samui
            </Link>

            <NavLinks className="hidden items-center gap-8 md:flex" />

            <details className="group relative md:hidden">
              <summary className="list-none cursor-pointer rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:border-gold/50 hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 top-full z-30 mt-3 min-w-[200px] rounded-2xl border border-white/10 bg-charcoal/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <nav className="flex flex-col gap-4">
                  <Link
                    href="#gallery"
                    className="text-sm tracking-[0.18em] text-white/90 hover:text-gold"
                  >
                    Gallery
                  </Link>
                  <Link
                    href="#collections"
                    className="text-sm tracking-[0.18em] text-white/90 hover:text-gold"
                  >
                    Shop
                  </Link>
                  <Link
                    href="#story"
                    className="text-sm tracking-[0.18em] text-white/90 hover:text-gold"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="#contact"
                    className="text-sm tracking-[0.18em] text-white/90 hover:text-gold"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </details>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl flex-col items-center justify-center px-5 pb-24 pt-12 text-center md:px-8">
          <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/75 md:text-xs">
            Koh Samui · Original fine art
          </p>
          <h1 className="font-serif text-[2.1rem] leading-[1.15] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            The spirit of Koh Samui.
            <span className="mt-2 block font-serif text-white/95">
              The stories of its people.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Original paintings inspired by life, culture and beauty.
          </p>
          <div className="mt-12 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
            <Link
              href="#gallery"
              className="inline-flex items-center justify-center rounded-full border border-gold/80 bg-gold/90 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-gold"
            >
              Explore Gallery
            </Link>
            <Link
              href="#collections"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/15"
            >
              Shop Collection
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="h-14 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </div>
      </section>

      {/* Featured strip teaser → leads into collections */}
      <section id="gallery" className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              Curated originals
            </p>
            <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
              Paintings from the heart of the island
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/70">
              Each canvas captures a moment — fishermen at dawn, temple light at dusk,
              and the quiet dignity of everyday island life.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[collections[3], collections[1], collections[4]].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90 transition group-hover:from-black/65" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-serif text-xl text-white">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Collection */}
      <section id="collections" className="scroll-mt-24 bg-[#f3f1ed] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
                Browse by theme
              </p>
              <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">
                Shop by Collection
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-charcoal/65 md:text-right">
              Discover series that echo devotion, labour, landscape, and the warmth of
              community — available as originals and select prints.
            </p>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {collections.map((item) => (
              <Link
                key={item.title}
                href="#contact"
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_28px_64px_-28px_rgba(0,0,0,0.45)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                  <h3 className="font-serif text-lg text-charcoal">{item.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                    View works
                    <span aria-hidden className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-charcoal py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-8 md:px-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-gold/30 hover:bg-white/[0.06]"
            >
              <div className="text-gold">{f.icon}</div>
              <div>
                <h3 className="font-serif text-lg text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="scroll-mt-24 bg-[#faf9f7] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)] sm:translate-y-6">
                <Image
                  src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=80"
                  alt="Warm gallery interior with framed paintings"
                  fill
                  sizes="(max-width: 1024px) 50vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)] sm:-translate-y-4">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5de?auto=format&fit=crop&w=900&q=80"
                  alt="Portrait of the artist"
                  fill
                  sizes="(max-width: 1024px) 50vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
                Our Story
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-charcoal md:text-4xl">
                A gallery rooted in place, devoted to craft
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-charcoal/75">
                <p>
                  Soul of Samui began as a small studio steps from the shore — a space
                  where island rhythms, temple incense, and the sea breeze found their
                  way onto canvas. Every painting is an invitation to slow down and see
                  Koh Samui through eyes that live here year-round.
                </p>
                <p>
                  The gallery partners closely with local makers and collectors who value
                  authenticity. From expressive portraits to sweeping landscapes, the
                  collection celebrates resilience, grace, and the luminous colours of
                  southern Thailand.
                </p>
                <p>
                  Whether you are visiting for a season or searching for a forever piece,
                  we welcome you to experience work that feels lived-in, soulful, and
                  unmistakably Samui.
                </p>
              </div>
              <Link
                href="#contact"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal shadow-[0_10px_36px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
              >
                Plan your visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-charcoal/10 bg-white py-20 md:py-24"
      >
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Contact</p>
          <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
            Let&apos;s find the right piece for you
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/65">
            Private viewings and shipping consultations are available by appointment.
            Share your dates and we will reply with availability.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:hello@soulofsamui.art"
              className="inline-flex rounded-full border border-gold/70 bg-gold/90 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal shadow-[0_12px_40px_rgba(198,164,106,0.35)] transition hover:-translate-y-0.5 hover:bg-gold"
            >
              Email the gallery
            </a>
            <Link
              href="#collections"
              className="inline-flex rounded-full border border-charcoal/15 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-gold/50 hover:text-charcoal"
            >
              Back to collections
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-charcoal/10 bg-[#faf9f7] py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:text-left md:px-8">
          <p className="font-serif text-lg tracking-[0.06em] text-charcoal">
            Soul of Samui
          </p>
          <p className="text-xs tracking-[0.18em] text-charcoal/45">
            © {new Date().getFullYear()} Soul of Samui Gallery. Crafted on Koh Samui.
          </p>
        </div>
      </footer>
    </div>
  );
}
