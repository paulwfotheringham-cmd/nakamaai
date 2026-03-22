import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("saved_stories")
    .select("id, name, story_text, narrator_voice, male_voice, female_voice, setting, mood, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ stories: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { name, storyText, narratorVoice, maleVoice, femaleVoice, setting, mood } = await req.json();

  if (!storyText?.trim()) {
    return Response.json({ error: "No story text provided." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("saved_stories")
    .insert([{
      name:           name || "Untitled Story",
      story_text:     storyText,
      narrator_voice: narratorVoice || null,
      male_voice:     maleVoice || null,
      female_voice:   femaleVoice || null,
      setting:        setting || null,
      mood:           mood || null,
    }])
    .select("id, name")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ story: data });
}
