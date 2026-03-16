"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
        emailRedirectTo: "https://nakamaai.vercel.app/",
        data: { name },
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl w-full p-10">

        <h1 className="text-4xl font-bold mb-8">Join Nakama</h1>

        {!submitted ? (

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              className="w-full p-3 rounded bg-gray-900"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <input
              className="w-full p-3 rounded bg-gray-900"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded bg-yellow-500 text-black font-bold"
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>

          </form>

        ) : (

          <div className="text-green-400">
            Check your email for your login link.
          </div>

        )}

      </div>
    </div>
  );
}
