import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  console.log("CHAT INPUT:", message);

  let reply = "";

  if (message.toLowerCase().includes("name")) {
    reply = "You can call me your guide. I'm here for you.";
  } else if (message.toLowerCase().includes("hello")) {
    reply = "Hello... I'm right here with you.";
  } else {
    reply = "Tell me more... I'm listening.";
  }

  console.log("CHAT OUTPUT:", reply);

  return NextResponse.json({ reply });
}
