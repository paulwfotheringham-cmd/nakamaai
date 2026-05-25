import { NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are a helpful male AI concierge for Nakama Nights. Be warm, concise, and natural. Keep replies to 1-3 short sentences suitable for spoken delivery. No markdown.";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured. Add it to .env.local." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = data?.error?.message || "OpenAI chat failed";
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I'm here to help. What would you like to know?";

    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
