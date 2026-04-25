import Link from "next/link";
import CreateAudioTile from "./CreateAudioTile";

type Tile = {
  title: string;
  description: string;
  href: string;
  icon: string;
  cta: string;
};

const fantasyTile: Tile = {
  title: "Choose fantasy Audio",
  description: "Browse and begin your next immersive audio experience.",
  href: "/fantasy-audio",
  icon: "📚",
  cta: "Browse Library",
};

function TileCard({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="block h-full">
      <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
          <span aria-hidden="true">{tile.icon}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-white">{tile.title}</h3>
          <p className="text-sm leading-6 text-zinc-300">{tile.description}</p>
        </div>
        <div className="mt-6 flex items-center text-sm font-medium text-white">
          <span>{tile.cta}</span>
          <span className="ml-2">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a href="/" className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">← Home</a>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-10">
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Pleasure Portal
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">
            Choose fantasy audio or create your own fantasy audio.
          </p>
        </div>

        <div className="max-w-xl space-y-6">
          <TileCard tile={fantasyTile} />
          <CreateAudioTile />
        </div>
      </section>
    </main>
  );
}
