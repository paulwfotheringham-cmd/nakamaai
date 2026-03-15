export async function POST(req: Request) {
  const { prompt } = await req.json()

  const openings = [
    "On a quiet evening,",
    "Under the warm glow of sunset,",
    "In a town where everyone knew each other,",
    "On a night filled with possibility,",
    "In a place where destiny had its own plans,"
  ]

  const conflicts = [
    "two strangers met and immediately felt a spark neither could explain.",
    "an unexpected encounter changed everything.",
    "a chance meeting turned into something much deeper.",
    "their worlds collided in a way neither of them expected.",
    "a connection began to grow between two people who had been searching for something more."
  ]

  const endings = [
    "What started as curiosity slowly grew into a bond neither wanted to let go of.",
    "They realized some of the best stories begin when you least expect them.",
    "In that moment, both understood their lives had just changed forever.",
    "Neither knew where the journey would lead, but they were ready to discover it together.",
    "Sometimes love begins with a single unexpected moment."
  ]

  const opening = openings[Math.floor(Math.random() * openings.length)]
  const conflict = conflicts[Math.floor(Math.random() * conflicts.length)]
  const ending = endings[Math.floor(Math.random() * endings.length)]

  const story = `${opening} ${prompt}. ${conflict} As the evening unfolded, laughter, shared secrets, and quiet glances filled the air. ${ending}`

  return Response.json({ story })
}
