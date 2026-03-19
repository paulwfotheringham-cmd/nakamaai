import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server credentials are missing." },
        { status: 500 }
      );
    }

    if (!openAiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is missing." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: openAiKey,
    });

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    // 1. Download ebook
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("ebooks")
      .download(path);

    if (downloadError || !fileData) {
      throw new Error("Failed to download ebook");
    }

    // 2. TEMP: fake text (we'll fix later)
    const text = "This is a sample audiobook narration from your ebook.";

    // 3. Convert to audio
    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // 4. Save audio to Supabase
    const audioPath = path
      .replace(".epub", ".mp3")
      .replace(".pdf", ".mp3");

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
