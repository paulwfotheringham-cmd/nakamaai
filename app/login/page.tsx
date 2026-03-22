"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  async function handleForgotPassword() {
    if (!email) {
      alert("Enter your email address first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://nakamaai.vercel.app/set-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email for your password reset link.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <a href="/" style={backBtnStyle}>← Home</a>
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
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#d8b26e",
            marginBottom: "12px",
          }}
        >
          Nakama
        </div>

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
          Sign in with your email and password.
        </p>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
          <input
            placeholder="Email Address"
            type="email"
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

        <button
          onClick={handleForgotPassword}
          style={{
            marginTop: "16px",
            background: "transparent",
            border: "none",
            color: "#d8b26e",
            cursor: "pointer",
            padding: 0,
            fontSize: "15px",
          }}
        >
          Forgot Password?
        </button>
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
