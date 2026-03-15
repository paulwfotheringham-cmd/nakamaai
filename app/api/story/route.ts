export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative storyteller who writes short engaging stories."
          },
          {
            role: "user",
            content: `Write a short story about: ${prompt}`
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    console.log(data);

    const story = data.choices?.[0]?.message?.content || "No story generated.";

    return Response.json({ story });

  } catch (error) {
    console.error(error);
    return Response.json({ story: "Error generating story." });
  }
}
