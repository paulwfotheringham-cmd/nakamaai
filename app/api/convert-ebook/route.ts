import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

function cleanHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeFrontMatter(fileName: string, text: string) {
  const lowerName = fileName.toLowerCase();
  const lowerText = text.toLowerCase();

  const badName =
    lowerName.includes("cover") ||
    lowerName.includes("title") ||
    lowerName.includes("toc") ||
    lowerName.includes("nav") ||
    lowerName.includes("contents") ||
    lowerName.includes("copyright") ||
    lowerName.includes("imprint") ||
    lowerName.includes("front");

  const badText =
    lowerText === "cover" ||
    lowerText.startsWith("table of contents") ||
    lowerText.startsWith("contents") ||
    lowerText.startsWith("copyright") ||
    lowerText.startsWith("title page");

  return badName || badText;
}

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

      const fileNames = Object.keys(zip.files).filter((name) => {
        const file = zip.files[name];
        return (
          !file.dir &&
          (name.endsWith(".xhtml") ||
            name.endsWith(".html") ||
            name.endsWith(".htm"))
        );
      });

      if (fileNames.length === 0) {
        throw new Error("No readable content found in EPUB");
      }

      let chosenText = "";

      for (const fileName of fileNames) {
        const htmlContent = await zip.file(fileName)?.async("text");
        if (!htmlContent) continue;

        const extracted = cleanHtmlToText(htmlContent);

        if (!extracted) continue;
        if (extracted.length < 200) continue;
        if (looksLikeFrontMatter(fileName, extracted)) continue;

        chosenText = extracted;
        break;
      }

      if (!chosenText) {
        for (const fileName of fileNames) {
          const htmlContent = await zip.file(fileName)?.async("text");
          if (!htmlContent) continue;

          const extracted = cleanHtmlToText(htmlContent);
          if (extracted.length > chosenText.length) {
            chosenText = extracted;
          }
        }
      }

      text = chosenText.slice(0, 2000);
    } else {
      throw new Error("Only EPUB supported right now");
    }

    if (!text) {
      throw new Error("No text extracted from ebook");
    }

    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioArrayBuffer = await audioResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    const audioPath = path.replace(".epub", ".mp3");

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
      previewText: text.slice(0, 300),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
