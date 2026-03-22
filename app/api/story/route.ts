import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

  const prompt = `Write a full romantic audio story that will take about 10 minutes to read aloud.

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
- Create a complete story with beginning, middle, emotional escalation, climax, and ending.
- Make it immersive, emotional, and detailed.
- Include rich dialogue and narration.
- Format EVERY line exactly with one of these prefixes:
  NARRATOR:
  MALE:
  FEMALE:
- No title.
- No explanations.
- Return ONLY the story.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const story =
      message.content[0].type === "text"
        ? message.content[0].text
        : "Failed to generate story.";

    return Response.json({ story });
  } catch (error) {
    console.error(error);
    return Response.json({ story: "Failed to generate story." }, { status: 500 });
  }
}
