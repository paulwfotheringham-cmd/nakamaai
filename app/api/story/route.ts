export async function POST(req: Request) {
  const { prompt } = await req.json();

  const maleNames = ["Luca", "Adrian", "Noah", "Julian", "Theo"];
  const femaleNames = ["Elena", "Sofia", "Clara", "Mia", "Isla"];

  const maleName = maleNames[Math.floor(Math.random() * maleNames.length)];
  const femaleName = femaleNames[Math.floor(Math.random() * femaleNames.length)];

  const story = `NARRATOR: On a warm evening, ${prompt}.
MALE: I had a feeling I might find you here, said ${maleName}.
FEMALE: Maybe I wanted to be found, replied ${femaleName} with a quiet smile.
NARRATOR: The air between them felt charged with curiosity, warmth, and possibility.
MALE: Then stay with me a little longer, ${maleName} said softly.
FEMALE: Just for a little while, ${femaleName} answered, though both knew it would mean much more.
NARRATOR: As the night unfolded, conversation turned into connection, and connection into something neither wanted to lose.`;

  return Response.json({ story });
}
