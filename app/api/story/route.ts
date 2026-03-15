export async function POST(req: Request) {
  const { prompt } = await req.json()

  const story = `
Once upon a time, ${prompt}.
The adventure began in a small village where no one expected what would happen next.

As the journey unfolded, new friends appeared, strange problems had to be solved, and courage was tested.

In the end, the hero discovered something important — sometimes the greatest magic is believing in yourself.
`

  return Response.json({ story })
}
