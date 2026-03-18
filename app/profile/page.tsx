"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const fullName =
        (user.user_metadata?.full_name as string | undefined) || "";

      const parts = fullName.split(" ");

      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);

    const full_name = `${firstName} ${lastName}`.trim();

    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        full_name,
      },
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated");
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#d8b26e",
            }}
          >
            Nakama
          </div>

          <h1 style={{ fontSize: "42px", marginTop: "10px" }}>
            Your Profile
          </h1>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            borderRadius: "24px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "30px",
            backdropFilter: "blur(10px)",
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  marginTop: "10px",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "#d8b26e",
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <ActionCard title="Edit First Name" />
          <ActionCard title="Edit Last Name" />
          <ActionCard title="Edit Email" />
          <ActionCard title="Billing (coming soon)" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "16px",
};
