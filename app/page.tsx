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
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          padding: "32px 24px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#d8b26e",
              marginBottom: "18px",
            }}
          >
            Nakama
          </div>

          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              borderRadius: "999px",
              border: "1px solid rgba(216,178,110,0.3)",
              background: "rgba(216,178,110,0.1)",
              padding: "8px 16px",
              fontSize: "14px",
              color: "#f1d7a1",
              marginBottom: "20px",
            }}
          >
            Premium fantasy audio experiences
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "640px",
            }}
          >
            Create immersive romantic audio stories with
            <span style={{ color: "#d8b26e" }}> Nakama</span>
          </h1>

          <p
            style={{
              marginTop: "24px",
              maxWidth: "620px",
              fontSize: "22px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Choose the mood, shape the characters, customise the voices,
            and generate a private audio fantasy built around your taste.
          </p>

          <div
            style={{
              marginTop: "32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              maxWidth: "680px",
            }}
          >
            <FeatureCard
              title="Guided story design"
              text="Pick the setting, tone, pacing, and story type."
            />
            <FeatureCard
              title="Voice customization"
              text="Assign different voices to different characters."
            />
            <FeatureCard
              title="Private audio scenes"
              text="Generate scenes made for listening, not just reading."
            />
            <FeatureCard
              title="Fast iteration"
              text="Adjust one detail and instantly create a new version."
            />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "540px",
            justifySelf: "end",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "28px",
            padding: "32px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#d8b26e",
              marginBottom: "12px",
            }}
          >
            Get started
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "44px",
              fontWeight: 700,
            }}
          >
            Join Nakama
          </h2>

          <p
            style={{
              marginTop: "12px",
              marginBottom: "24px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              fontSize: "17px",
            }}
          >
            Create your account to set up your password and start building your
            first audio experience.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "16px",
                  border: "none",
                  background: "#d8b26e",
                  color: "black",
                  fontWeight: 700,
                  fontSize: "17px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Create Account"}
              </button>
            </form>
          ) : (
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "rgba(72, 187, 120, 0.12)",
                border: "1px solid rgba(72, 187, 120, 0.35)",
                color: "#86efac",
                lineHeight: 1.6,
              }}
            >
              Check your email for your password setup link.
            </div>
          )}

          <div
            style={{
              marginTop: "18px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#d8b26e",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "white",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "14px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.62)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};
