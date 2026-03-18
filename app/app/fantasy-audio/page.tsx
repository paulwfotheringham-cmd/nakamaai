export default function FantasyAudioPage() {
  const categories = [
    "Anime/Hentai",
    "Paranormal / supernatural Shapeshifter",
    "Fairy tales / Monsters / witch / magic",
    "Scifi / Aliens",
    "Dark / Erotic",
    "Historical",
    "Harem",
    "Modern",
    "Medieval",
    "Power dynamics / Sub / Dom",
  ];

  return (
    <main className="min-h-screen bg-white px-10 py-12 text-black">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-12 text-5xl font-bold">
          Stories + Fantasies
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category}
              className="min-h-[200px] border-2 border-blue-500 p-6 text-left text-xl font-semibold transition hover:bg-blue-50"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
