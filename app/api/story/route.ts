import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const {
    setting,
    mood,
    buildUp,
    maleRole,
    femaleRole,
    storyType,
    extraDetail,
  } = await req.json();

  const maleNames = ["Luca", "Adrian", "Noah", "Julian", "Theo"];
  const femaleNames = ["Elena", "Sofia", "Clara", "Mia", "Isla"];

  const maleName = maleNames[Math.floor(Math.random() * maleNames.length)];
  const femaleName = femaleNames[Math.floor(Math.random() * femaleNames.length)];

  const prompt = `
Write a full romantic audio story that will take about 10 minutes to read aloud.

Target length: 1,600 to 2,000 words.

Story requirements:
- Setting: ${setting}
- Mood: ${mood}
- Build-up: ${buildUp}
- Male character: ${maleRole} named ${maleName}
- Female character: ${femaleRole} named ${femaleName}
- Story type: ${storyType}
${extraDetail ? `- Extra detail: ${extraDetail}` : ""}

Instructions:
- Create a complete story with beginning, middle, climax, and ending.
- Make it immersive, emotional, and detailed.
- Include rich dialogue and narration.
- Format EVERY line exactly like this:
  NARRATOR:
  MALE:
  FEMALE:
- No paragraphs without labels.
- No explanations or titles — ONLY the story.
`;

  try {
    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
      max_output_tokens: 3000,
    });

    const story =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "";

    return Response.json({ story });
  } catch (error) {
    console.error(error);
    return Response.json({ story: "Failed to generate story." });
  }
}
