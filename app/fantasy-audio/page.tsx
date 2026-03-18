export default function FantasyAudioPage() {
  const sections = [
    {
      title: "Stories + Fantasies",
      items: [
        "Anime/Hentai",
        "Paranormal",
        "Supernatural",
        "Shapeshifter",
        "Fairy Tales",
        "Monsters",
        "Witch",
        "Magic",
        "Sci-Fi / Aliens",
        "Dark",
        "Erotic",
        "Historical",
        "Harem",
        "Modern",
        "Medieval",
        "Power Dynamics",
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
        "Hidden Village",
        "Academy",
        "Dungeon",
        "Royal Court",
        "Battlefield",
        "Space Ship",
        "Temple",
        "Moonlit Garden",
      ],
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07040d",
        color: "white",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              fontSize: "14px",
              marginBottom: "14px",
            }}
          >
            Paul @ Insight
          </div>

          <h1
            style={{
              fontSize: "40px",
              fontWeight: 700,
              margin: "0 0 10px 0",
            }}
          >
            Choose Fantasy Audio
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "18px",
              margin: 0,
            }}
          >
            Pick a fantasy theme by tapping the buttons below.
          </p>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {sections.map((section) => (
            <section
              key={section.title}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.04)",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                {section.title}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {section.items.map((item) => (
                  <button
                    key={item}
                    style={{
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      padding: "10px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div
          style={{
            marginTop: "28px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.04)",
            padding: "24px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Next
          </h3>

          <p
            style={{
              margin: "0 0 16px 0",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            After this page looks right, we’ll connect the dashboard button to open it.
          </p>

          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "white",
              color: "black",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
