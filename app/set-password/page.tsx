"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SetPasswordPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Create your password");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setName(params.get("name") || "");
    setEmail(params.get("email") || "");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setMessage("Missing email address. Please go back and try again.");
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/select-plan");
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
      <a href="/signup" style={backBtnStyle}>← Back</a>
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
            margin: "0 0 16px 0",
          }}
        >
          Create Password
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            marginBottom: "10px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {email && (
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            Creating account for {email}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "none",
              background: "#d8b26e",
              color: "black",
              fontWeight: 700,
              fontSize: "16px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Creating account..." : "Create account"}
          </button>
        </form>
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
