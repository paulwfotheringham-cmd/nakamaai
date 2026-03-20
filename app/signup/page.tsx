
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    router.push(
      `/set-password?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(name)}`
    );
  }

export default function Page() {
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
            "radial-gradient(circle at top center, rgba(120, 52, 120, 0.22), transparent 45%)",
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
          gap: "96px",
          padding: "56px 32px",
          flexWrap: "wrap",
        }}
      >
        <section
          style={{
            flex: 1,
            maxWidth: "700px",
            minWidth: "320px",
          }}
        >
          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "13px",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "#c9a96a",
            }}
          >
            Nakama
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "28px",
              borderRadius: "999px",
              border: "1px solid rgba(201,169,106,0.28)",
              background: "rgba(64, 43, 33, 0.45)",
              padding: "12px 20px",
              fontSize: "14px",
              color: "#e5c888",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            Premium fantasy audio experiences
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(64px, 7vw, 98px)",
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#f7f5f2",
            }}
          >
            Ready to turn
            <br />
            up the heat?
          </h1>

          <p
            style={{
              margin: "34px 0 0 0",
              maxWidth: "720px",
              fontSize: "22px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Craving something steamier than standard audiobooks?
          </p>

          <p
            style={{
              margin: "18px 0 0 0",
              maxWidth: "720px",
              fontSize: "22px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Whisper your wildest fantasies.
          </p>

          <p
            style={{
              margin: "18px 0 0 0",
              maxWidth: "720px",
              fontSize: "20px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Join Nakama today and transform your reading time into an
            unforgettable auditory experience.
          </p>

          <p
            style={{
              margin: "28px 0 0 0",
              maxWidth: "720px",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            We&apos;re the only professional service dedicated exclusively to
            bringing your romantic fantasies to life through sound.
          </p>

          <p
            style={{
              margin: "16px 0 0 0",
              maxWidth: "720px",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            We convert your favorite romantic books into breathtaking, sexy
            audio stories.
          </p>

          <p
            style={{
              margin: "20px 0 0 0",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#d2b56f",
            }}
          >
            100% private. 100% yours.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "18px",
              marginTop: "42px",
              maxWidth: "640px",
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
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.03))",
                  padding: "22px 20px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "17px",
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.66)",
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
              borderRadius: "34px",
              border: "1px solid rgba(255,255,255,0.09)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.035))",
              padding: "38px",
              boxShadow: "0 22px 80px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                margin: "0 0 22px 0",
                fontSize: "13px",
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "#c9a96a",
              }}
            >
              Get started
            </p>

            <h2
              style={{
                margin: "0 0 18px 0",
                fontSize: "58px",
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                fontWeight: 700,
                color: "#f7f5f2",
              }}
            >
              Join Nakama
            </h2>

            <p
              style={{
                margin: "0 0 28px 0",
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              Create your account to set up your password and start building
              your first audio experience.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "58px",
                  marginBottom: "14px",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0 18px",
                  color: "white",
                  boxSizing: "border-box",
                  fontSize: "16px",
                  outline: "none",
                }}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "58px",
                  marginBottom: "18px",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0 18px",
                  color: "white",
                  boxSizing: "border-box",
                  fontSize: "16px",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "60px",
                  border: "none",
                  borderRadius: "18px",
                  background: "#d2b56f",
                  color: "#111111",
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Continuing..." : "Create Account"}
              </button>
            </form>

            <p
              style={{
                margin: "18px 0 0 0",
                fontSize: "14px",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#d2b56f",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Log in
              </a>
            </p>
          </div>
        </aside>
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-lg">
        <p className="text-xs tracking-widest text-yellow-500 mb-2">
          GET STARTED
        </p>

        <h1 className="text-3xl font-bold mb-4">Join Nakama</h1>

        <p className="text-zinc-400 mb-6">
          create your account and sign up for a subscription or a FREE 7 day trial
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          />

          <button className="w-full rounded-lg bg-yellow-400 p-3 font-semibold text-black">
            Create Account
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Already have an account?{" "}
          <span className="text-yellow-400 cursor-pointer">Log in</span>
        </p>
      </div>
    </main>
    </div>
  );
}
