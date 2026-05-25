import { NextResponse } from "next/server";
import { hasLiveTestLlm, streamLiveTestChat } from "@/lib/live-test/providers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (!hasLiveTestLlm()) {
    return NextResponse.json(
      {
        error:
          "No LLM configured. Set OPENAI_API_KEY (gpt-4o-mini) or GROQ_API_KEY on Vercel.",
      },
      { status: 500 },
    );
  }

  try {
    const stream = await streamLiveTestChat(message);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
