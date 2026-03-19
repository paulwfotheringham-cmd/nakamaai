"use client";

import { useMemo, useState } from "react";

export default function FantasyAudioPage() {
  const stories = [
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
  ];

  const [index, setIndex] = useState(0);

  const currentStory = useMemo(() => stories[index], [stories, index]);

  function goPrev() {
    setIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  }

  function goNext() {
    setIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  }

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
            Swipe through story types and choose the one you want.
          </p>
        </div>

        <section
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.04)",
            padding: "32px",
            minHeight: "320px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              Stories
            </h2>

            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
                minHeight: "170px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "24px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#d8b26e",
                    marginBottom: "14px",
                  }}
                >
                  Story Type
                </div>

                <div
                  style={{
                    fontSize: "52px",
                    fontWeight: 700,
                    lineHeight: 1.05,
                  }}
                >
                  {currentStory}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <button
              onClick={goPrev}
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                padding: "14px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ← Previous
            </button>

            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "15px",
              }}
            >
              {index + 1} / {stories.length}
            </div>

            <button
              onClick={goNext}
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                padding: "14px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </section>

        <div
          style={{
            marginTop: "28px",
          }}
        >
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "white",
              color: "black",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
