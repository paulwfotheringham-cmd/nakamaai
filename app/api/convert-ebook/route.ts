import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    // 🔹 Step 1: Download ebook from Supabase
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("ebooks")
      .download(path);

    if (downloadError || !fileData) {
      throw new Error("Failed to download ebook");
    }

    // 🔹 Step 2: Convert file to text (TEMP — simple placeholder)
    const text = "This is a sample audiobook narration from your ebook.";

    // 🔹 Step 3: Generate audio with OpenAI
    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // 🔹 Step 4: Save audio to Supabase
    const audioPath = path
      .replace("ebooks", "audio")
      .replace(".epub", ".mp3");

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(audioPath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Failed to upload audio");
    }

    return NextResponse.json({
      success: true,
      audioPath,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Conversion failed" },
      { status: 500 }
    );
  }
}
