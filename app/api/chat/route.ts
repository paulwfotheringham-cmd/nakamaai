import { NextResponse } from "next/server";

const SCRIPTED_REPLIES: Record<string, string> = {
  great: "I love that. Let's build on what worked and make this one even better.",
  "so so": "Got it. We can tune this to your mood and make it land better today.",
  "nah not for me": "Thanks for being honest. Let's switch direction and find something that fits you now.",
  "something new": "Perfect. I'll craft something fresh, surprising, and tailored to you.",
  "something familiar": "Nice. We'll keep the comfort and elevate the feeling with a stronger arc.",
  "continue something": "Great choice. We'll pick up where your last story left off.",
  "deep / immersive": "Beautiful. I'll slow it down, add detail, and pull you fully into it.",
  "i'll select myself": "Absolutely. Tell me exactly what you want and I'll shape it with you.",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ reply: "I'm here with you. Tell me what you need." });
  }

  const scripted = SCRIPTED_REPLIES[message.toLowerCase()];
  if (scripted) {
    return NextResponse.json({ reply: scripted });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ reply: "I'm here with you. Tell me what you need." });
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
          {
            role: "system",
            content:
              "You are a calm, emotionally intelligent male guide. You speak naturally, briefly, and intimately. Avoid repetition. Always respond in a slightly varied, human tone.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm here with you. Tell me what you need.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "I'm here with you. Tell me what you need." });
  }
}
