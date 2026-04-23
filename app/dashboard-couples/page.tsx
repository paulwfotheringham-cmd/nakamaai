import type { ReactNode } from "react";
import Link from "next/link";
import CreateAudioTile from "../dashboard/CreateAudioTile";
import ConvertEbookTile from "../dashboard/ConvertEbookTile";

type Tile = {
  title: string;
  description: string;
  href?: string;
  icon: string;
  disabled?: boolean;
  cta?: string;
};

const fantasyTile: Tile = {
  title: "Choose fantasy Audio",
  description:
    "Browse and begin your next immersive audio experience.",
  href: "/fantasy-audio",
  icon: "📚",
  cta: "Browse Library",
};

const coupleTile: Tile = {
  title: "Couple Guided Intimacy",
  description:
    "Shared guided experiences designed for connection and intimacy together.",
  icon: "💞",
  disabled: true,
  cta: "Coming soon",
};

const marketplaceTile: Tile = {
  title: "Marketplace",
  description:
    "Explore and discover fantasy audio experiences from the community.",
  href: "/marketplace",
  icon: "🛍️",
  cta: "Enter",
};

const profileTile: Tile = {
  title: "Profile",
  description:
    "Manage your details, preferences, and account settings.",
  href: "/profile",
  icon: "👤",
  cta: "Settings",
};

function TileCard({
  tile,
  className = "",
}: {
  tile: Tile;
  className?: string;
}) {
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

  const wrap = (node: ReactNode) => (
    <div className={`h-full min-w-0 ${className}`.trim()}>{node}</div>
  );

  if (tile.disabled || !tile.href) {
    return wrap(content);
  }

  return wrap(
    <Link href={tile.href} className="block h-full">
      {content}
    </Link>
  );
}

export default function DashboardCouplesPage() {
  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Home
      </a>
      <img
        src="/Nakama-AI-July25-White.png"
        alt="Nakama logo"
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          height: "63px",
          zIndex: 20,
        }}
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-400">
            Welcome to your dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Pleasure Portal
          </h1>
          <div className="mt-6 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Pick what you want to do in Nakama
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-300">
              Choose fantasy audio, create your own fantasy audio, explore
              couple guided intimacy (coming soon), convert an ebook into
              fantasy audio, visit the marketplace, or manage your profile.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <TileCard tile={fantasyTile} />
            <CreateAudioTile />
            <TileCard tile={coupleTile} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ConvertEbookTile />
            <div className="flex min-w-0 flex-col gap-6 md:col-span-1 xl:col-span-2 xl:flex-row xl:justify-end">
              <TileCard
                tile={marketplaceTile}
                className="w-full xl:max-w-sm"
              />
              <TileCard tile={profileTile} className="w-full xl:max-w-sm" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
