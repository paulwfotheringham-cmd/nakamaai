"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://nakamaai.vercel.app/set-password",
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#07040d",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(120, 52, 120, 0.22), transparent 45%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "64px",
          padding: "64px 24px",
          flexWrap: "nowrap",
        }}
      >
        <section
          style={{
            flex: 1,
            maxWidth: "760px",
          }}
        >
          <p
            style={{
              marginBottom: "24px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "#c9a96a",
            }}
          >
            Nakama
          </p>

          <div
            style={{
              display: "inline-flex",
              marginBottom: "32px",
              borderRadius: "999px",
              border: "1px solid rgba(111, 87, 49, 0.5)",
              background: "rgba(42, 29, 23, 0.6)",
              padding: "10px 20px",
              fontSize: "14px",
              color: "#e0c185",
            }}
          >
            Premium fantasy audio experiences
          </div>

          <h1
            style={{
              margin: 0,
              maxWidth: "820px",
              fontSize: "clamp(52px, 8vw, 96px)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "white",
            }}
          >
            Create immersive
            <br />
            romantic audio
            <br />
            stories with
            <br />
            <span style={{ color: "#d4b26e" }}>Nakama</span>
          </h1>

          <p
            style={{
              marginTop: "40px",
              maxWidth: "720px",
              fontSize: "clamp(20px, 2.2vw, 32px)",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Choose the mood, shape the characters, customise the voices, and
            generate a private audio fantasy built around your taste.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              maxWidth: "760px",
            }}
          >
            {[
              {
                title: "Guided story design",
                text: "Pick the setting, tone, pacing, and story type.",
              },
              {
                title: "Voice customization",
                text: "Assign different voices to different characters.",
              },
              {
                title: "Private audio scenes",
                text: "Generate scenes made for listening, not just reading.",
              },
              {
                title: "Fast iteration",
                text: "Adjust one detail and instantly create a new version.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                style={{
                  gridColumn: index === 3 ? "1 / 2" : undefined,
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "24px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside
          style={{
            width: "100%",
            maxWidth: "520px",
            flex: "0 0 520px",
          }}
        >
          <div
            style={{
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              padding: "40px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                marginBottom: "24px",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "#c9a96a",
              }}
            >
              Get started
            </p>

            <h2
              style={{
                margin: "0 0 16px 0",
                fontSize: "clamp(42px, 5vw, 56px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "white",
              }}
            >
              Join Nakama
            </h2>

            <p
              style={{
                marginBottom: "32px",
                fontSize: "clamp(18px, 2vw, 28px)",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Create your account to set up your password and start building
              your first audio experience.
            </p>

            {submitted ? (
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(74, 222, 128, 0.2)",
                  background: "rgba(74, 222, 128, 0.1)",
                  padding: "16px 20px",
                  fontSize: "16px",
                  color: "#bbf7d0",
                }}
              >
                Check your email for your magic login link.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    height: "56px",
                    marginBottom: "16px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    padding: "0 20px",
                    color: "white",
                    outline: "none",
                    fontSize: "16px",
                  }}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    height: "56px",
                    marginBottom: "24px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    padding: "0 20px",
                    color: "white",
                    outline: "none",
                    fontSize: "16px",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "56px",
                    marginBottom: "16px",
                    border: "none",
                    borderRadius: "16px",
                    background: "#d4b26e",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: 600,
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Already have an account?{" "}
              <a href="/login" style={{ color: "#d4b26e" }}>
                Log in
              </a>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
