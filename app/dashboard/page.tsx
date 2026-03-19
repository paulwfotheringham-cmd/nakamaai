import Link from "next/link";

type Tile = {
  title: string;
  description: string;
  href?: string;
  icon: string;
  disabled?: boolean;
  cta?: string;
};

const tiles: Tile[] = [
  {
    title: "Choose fantasy Audio",
    description:
      "Browse and begin your next immersive audio experience.",
    href: "/choose-fantasy-audio",
    icon: "📚",
    cta: "Open",
  },
  {
    title: "Create your own fantasy audio",
    description:
      "Adjust mood, voices, characters, and generate your scene.",
    href: "/create-your-own-fantasy-audio",
    icon: "✨",
    cta: "Open",
  },
  {
    title: "Convert ebook to fantasy audio",
    description:
      "Upload your favourite ebook and transform it into an immersive fantasy audio experience.",
    href: "/convert-ebook-to-fantasy-audio",
    icon: "🎧",
    cta: "Open",
  },
  {
    title: "Marketplace",
    description:
      "Explore and discover fantasy audio experiences from the community.",
    icon: "🛍️",
    disabled: true,
    cta: "Coming soon",
  },
  {
    title: "Profile",
    description:
      "Manage your details, preferences, and account settings.",
    href: "/profile",
    icon: "👤",
    cta: "Open",
  },
];

function TileCard({ tile }: { tile: Tile }) {
  const content = (
    <div
      className={`group h-full rounded-3xl border p-6 transition-all duration-200 ${
        tile.disabled
          ? "cursor-not-allowed border-white/10 bg-white/5 opacity-70"
          : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        <span aria-hidden="true">{tile.icon}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {tile.title}
        </h3>
        <p className="text-sm leading-6 text-zinc-300">{tile.description}</p>
      </div>

      <div className="mt-6 flex items-center text-sm font-medium text-white">
        <span>{tile.cta}</span>
        {!tile.disabled && <span className="ml-2">→</span>}
      </div>
    </div>
  );

  if (tile.disabled || !tile.href) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Link href={tile.href} className="block h-full">
      {content}
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-400">
            Welcome to your dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your creative hub
          </h1>
          <div className="mt-6 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Pick what you want to do in Nakama
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-300">
              Choose fantasy audio, create your own fantasy audio, convert an
              ebook into fantasy audio, explore the marketplace, or manage your
              profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiles.map((tile) => (
            <TileCard key={tile.title} tile={tile} />
          ))}
        </div>
      </section>
    </main>
  );
}
