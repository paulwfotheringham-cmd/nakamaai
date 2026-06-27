"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { persistAccountEmail } from "@/lib/account-email";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setLoading(false);
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      alert(data.error ?? "Login failed.");
      return;
    }

    if (email.includes("@")) {
      persistAccountEmail(email.trim());
    }

    router.replace("/live-test");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <a href="/" style={backBtnStyle}>
        ← Home
      </a>
      <Link
        href="/"
        style={{
          display: "block",
          marginBottom: "28px",
          flexShrink: 0,
        }}
      >
        <img
          src="/Nakama-AI-July25-White.png"
          alt="Nakama Nights"
          style={{
            display: "block",
            height: "52px",
            width: "auto",
            maxWidth: "min(100%, 280px)",
            objectFit: "contain",
          }}
        />
      </Link>
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Login
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Sign in with your email or username and password.
        </p>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
          <input
            placeholder="Email or username"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "none",
              background: "#d8b26e",
              color: "black",
              fontWeight: 700,
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <Link
          href="/resetpassword"
          style={{
            marginTop: "16px",
            display: "inline-block",
            color: "#d8b26e",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  left: "24px",
  zIndex: 50,
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "8px 14px",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "16px",
  outline: "none",
};
