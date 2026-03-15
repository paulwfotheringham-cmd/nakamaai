export async function POST(req: Request) {
  const { prompt } = await req.json();

  const story = `Once upon a time, ${prompt}. 
  The adventure unfolded in ways no one expected, 
  filled with wonder, danger, and a surprising lesson at the end.`;

  return Response.json({ story });
}
