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
        data: { full_name: name },
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
        minHeight: "100vh",
        background: "#07040d",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1300px",
          gap: "80px",
          padding: "40px",
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "72px", lineHeight: 1.05 }}>
            Create immersive
            <br />
            romantic audio
            <br />
            stories with
            <br />
            <span style={{ color: "#d4b26e" }}>Nakama</span>
          </h1>

          <p style={{ marginTop: "24px", fontSize: "20px", color: "#ccc" }}>
            Choose the mood, shape the characters, customise the voices, and
            generate a private audio fantasy built around your taste.
          </p>

          {/* 4 tiles in one row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            {[
              "Guided story design",
              "Voice customization",
              "Private audio scenes",
              "Fast iteration",
            ].map((title) => (
              <div
                key={title}
                style={{
                  background: "#111",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            width: "420px",
            background: "#111",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
            Join Nakama
          </h2>

          <p style={{ marginBottom: "20px", color: "#aaa" }}>
            Create your account to set up your password and start building your
            first audio experience.
          </p>

          {submitted ? (
            <p>Check your email.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />

              <input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#d4b26e",
                  border: "none",
                }}
              >
                Create Account
              </button>
            </form>
          )}

          {/* ✅ LOGIN LINK RESTORED */}
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#aaa" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#d4b26e" }}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
