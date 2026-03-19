import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    console.log("Starting conversion for:", path);

    // 🚧 TEMP: fake conversion (we'll replace this with real logic later)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: "Conversion started",
      audioPath: path.replace("ebooks", "audio").replace(".epub", ".mp3"),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Conversion failed" },
      { status: 500 }
    );
  }
}
