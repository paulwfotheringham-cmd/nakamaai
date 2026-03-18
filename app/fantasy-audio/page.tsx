export default function FantasyAudioPage() {
  const sections = [
    {
      title: "Stories + Fantasies",
      items: [
        "Anime/Hentai",
        "Paranormal / supernatural",
        "Shapeshifter",
        "Fairy tales",
        "Monsters",
        "Witch",
        "Magic",
        "SciFi / Aliens",
        "Dark / Erotic",
        "Historical",
        "Harem",
        "Modern",
        "Medieval",
        "Power dynamics",
        "Sub / Dom",
      ],
    },
    {
      title: "Mood",
      items: [
        "Romantic",
        "Obsessive",
        "Gentle",
        "Possessive",
        "Forbidden",
        "Jealous",
        "Protective",
        "Seductive",
        "Emotional",
        "Dangerous",
      ],
    },
    {
      title: "Character Type",
      items: [
        "Prince",
        "Knight",
        "Elf",
        "Witch",
        "Vampire",
        "Demon",
        "Monster",
        "Alien",
        "Professor",
        "Bodyguard",
      ],
    },
    {
      title: "Setting",
      items: [
        "Castle",
        "Forest",
        "Hidden village",
        "Academy",
        "Dungeon",
        "Royal court",
        "Battlefield",
        "Space ship",
        "Temple",
        "Moonlit garden",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <div className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-sm text-white/80">
            Paul @ Insight
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Choose Fantasy Audio
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/70">
            Pick a fantasy theme by tapping the buttons below.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
            >
              <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>

              <div className="flex flex-wrap gap-3">
                {section.items.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-3 text-lg font-semibold">Next</h3>
          <p className="mb-4 text-white/70">
            After this page looks right, we’ll connect the dashboard button to open it.
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
