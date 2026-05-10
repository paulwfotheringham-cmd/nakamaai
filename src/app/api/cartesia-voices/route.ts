import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  if (!process.env.CARTESIA_API_KEY) {
    return Response.json({ error: "CARTESIA_API_KEY not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const gender = searchParams.get("gender") ?? "";

  const params = new URLSearchParams();
  if (gender && gender !== "all") params.set("gender", gender);

  let res: Response;
  try {
    res = await fetch(`https://api.cartesia.ai/voices?${params}`, {
      headers: {
        "X-API-Key": process.env.CARTESIA_API_KEY,
        "Cartesia-Version": "2024-06-10",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Network error: ${msg}` }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    return Response.json({ error: `Cartesia API error ${res.status}: ${text}` }, { status: res.status });
  }

  const voices = await res.json();

  const filtered = search
    ? voices.filter((v: { name: string; description?: string }) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
      )
    : voices;

  return Response.json({ voices: filtered, total: filtered.length });
}
