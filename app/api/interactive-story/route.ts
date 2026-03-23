import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
  }

  const { phase, category, setting, mood, maleRole, femaleRole, maleName, femaleName, history, choice } = await req.json();

  let prompt = "";

  if (phase === "open") {
    prompt = `You are writing an interactive romantic audio drama. Generate the OPENING scene only — approximately 150 words (about 1 minute of narration).

Story details:${category ? `\n- Category: ${category}` : ""}
- Setting: ${setting}
- Mood: ${mood}
- Male character: ${maleRole} named ${maleName}
- Female character: ${femaleRole} named ${femaleName}

Rules:
- Format every line with NARRATOR:, MALE:, or FEMALE: prefix
- End the scene at a moment of romantic tension — a natural pause where something could happen next
- Keep it immersive, sensual, and descriptive
- After the story segment, write exactly this separator on its own line: ---CHOICES---
- Then write exactly 3 short, enticing choices the listener can make, each on its own line starting with CHOICE:
- Choices should be specific, spicy, and meaningfully different from each other
- Each choice should be 5-10 words max

Example format:
NARRATOR: The room was warm...
MALE: I've been watching you all evening.
FEMALE: Have you?
---CHOICES---
CHOICE: Pull him closer and kiss him
CHOICE: Walk to the balcony and wait
CHOICE: Tell him exactly what you want`;

  } else if (phase === "continue") {
    prompt = `You are writing an interactive romantic audio drama. Continue the story based on the listener's choice.

Original story so far:
${history}

The listener chose: "${choice}"

Write the continuation — approximately 250 words (about 2 minutes of narration). Make the chosen action happen naturally and build the romance/tension further.

Rules:
- Format every line with NARRATOR:, MALE:, or FEMALE: prefix  
- Make the choice feel real and immersive — don't just reference it, SHOW it happening
- End at another moment of tension
- After the story, write: ---CHOICES---
- Then write 3 new choices that follow naturally from where the story now is
- Each choice on its own line starting with CHOICE:
- Choices should be 5-10 words max`;
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.85,
    });

    const raw = response.choices[0]?.message?.content || "";

    const parts = raw.split("---CHOICES---");
    const storyText = parts[0]?.trim() || "";
    const choicesRaw = parts[1]?.trim() || "";

    const choices = choicesRaw
      .split("\n")
      .map((l) => l.replace(/^CHOICE:\s*/i, "").trim())
      .filter((l) => l.length > 0)
      .slice(0, 3);

    return Response.json({ story: storyText, choices });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
