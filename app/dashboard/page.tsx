import Link from "next/link";

const tiles = [
  {
    title: "Choose fantasy Audio",
    description: "Browse and begin your next immersive audio experience.",
    href: "/choose-fantasy-audio",
  },
  {
    title: "Create your own fantasy audio",
    description: "Adjust mood, voices, characters, and generate your scene.",
    href: "/create-your-own-fantasy-audio",
  },
  {
    title: "Convert ebook to fantasy audio",
    description:
      "Upload your favourite ebook and transform it into an immersive fantasy audio experience.",
    href: "/convert-ebook-to-fantasy-audio",
  },
  {
    title: "Marketplace",
    description:
      "Explore and discover fantasy audio experiences from the community.",
  },
  {
    title: "Profile",
    description:
      "Manage your details, preferences, and account settings.",
    href: "/profile",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Your creative hub</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className="border rounded-xl p-6 shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">{tile.title}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {tile.description}
              </p>

              {tile.href ? (
                <Link
                  href={tile.href}
                  className="inline-block mt-4 text-blue-600"
                >
                  Open →
                </Link>
              ) : (
                <span className="inline-block mt-4 text-gray-400">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
