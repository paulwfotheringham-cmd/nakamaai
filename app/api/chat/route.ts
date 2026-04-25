import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  // TEMP simple logic (we'll upgrade to AI next)
  let reply = "I hear you. Stay with me and tell me a little more.";

  if (message.toLowerCase().includes("hello")) {
    reply = "Hello... I'm here with you now.";
  }

  if (message.toLowerCase().includes("how are you")) {
    reply = "I'm here for you. Tell me what you're feeling.";
  }

  return NextResponse.json({ reply });
}
