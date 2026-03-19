import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Supabase credentials missing");
    }

    if (!openAiKey) {
      throw new Error("OpenAI API key missing");
    }

    const openai = new OpenAI({
      apiKey: openAiKey,
    });

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { path } = await req.json();

    if (!path) {
      throw new Error("Missing file path");
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("ebooks")
      .download(path);

    if (downloadError || !fileData) {
      throw new Error("Failed to download ebook");
    }

    let text = "";

    if (path.toLowerCase().endsWith(".epub")) {
      const arrayBuffer = await fileData.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      const fileNames = Object.keys(zip.files);

      const htmlFileName = fileNames.find(
        (name) =>
          !zip.files[name].dir &&
          (name.endsWith(".xhtml") || name.endsWith(".html") || name.endsWith(".htm"))
      );

      if (!htmlFileName) {
        throw new Error("No readable content found in EPUB");
      }

      const htmlContent = await zip.file(htmlFileName)?.async("text");

      if (!htmlContent) {
        throw new Error("Failed to read EPUB content");
      }

      text = htmlContent
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 2000);
    } else if (path.toLowerCase().endsWith(".pdf")) {
      throw new Error("PDF text extraction is not set up yet. Please test with EPUB first.");
    } else {
      throw new Error("Unsupported file type");
    }

    if (!text) {
      throw new Error("No text could be extracted from the ebook");
    }

    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

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
      { error: error instanceof Error ? error.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
