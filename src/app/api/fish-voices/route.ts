import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  if (!process.env.FISH_AUDIO_API_KEY) {
    return Response.json(
      { error: "FISH_AUDIO_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const search = searchParams.get("search") ?? "";
  const pageSize = 20;

  const url = new URL("https://api.fish.audio/model");
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("page_number", String(page));
  url.searchParams.set("sort_by", "task_count");
  if (search) url.searchParams.set("title", search);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json(
      { error: `Fish Audio voices API error: ${errorText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}
