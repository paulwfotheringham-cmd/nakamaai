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

  const moodLineMap: Record<string, string> = {
    romantic: "There was a warm pull between them from the very beginning.",
    playful: "Their conversation was light, teasing, and impossible to forget.",
    intense: "Every glance carried a dangerous kind of tension.",
    dramatic: "The emotions between them felt impossible to ignore.",
    tender: "Something soft and deeply personal began to unfold.",
  };

  const buildUpLineMap: Record<string, string> = {
    "slow burn": "They took their time, letting anticipation build little by little.",
    "medium pace": "The connection grew naturally as the evening moved on.",
    "instant spark": "The attraction was immediate and impossible to deny.",
  };

  const storyTypeLineMap: Record<string, string> = {
    "romantic encounter":
      "What began as a simple meeting quickly became something more meaningful.",
    "forbidden romance":
      "They both knew this connection came with risks, which only made it harder to resist.",
    reunion:
      "Seeing each other again awakened feelings neither of them had truly left behind.",
    "enemies to lovers":
      "Their sharp words hid a chemistry that was becoming harder to fight.",
    "late night confession":
      "As the night deepened, honesty replaced distance.",
  };

  const extraLine = extraDetail
    ? `NARRATOR: One detail made the moment even more unforgettable: ${extraDetail}.`
    : "";

  const story = `NARRATOR: In a ${setting}, a ${maleRole} named ${maleName} crossed paths with a ${femaleRole} named ${femaleName}.
NARRATOR: ${moodLineMap[mood] || moodLineMap.romantic}
NARRATOR: ${buildUpLineMap[buildUp] || buildUpLineMap["slow burn"]}
MALE: I didn't expect tonight to change anything, ${maleName} admitted, but then I saw you.
FEMALE: Maybe some nights are meant to change everything, ${femaleName} replied softly.
NARRATOR: ${storyTypeLineMap[storyType] || storyTypeLineMap["romantic encounter"]}
${extraLine}
MALE: Stay with me a little longer, said ${maleName}, his voice lower now.
FEMALE: I was hoping you would ask, ${femaleName} answered with a knowing smile.
NARRATOR: By the end of the evening, what had begun with curiosity had deepened into a connection neither wanted to lose.`;

  return Response.json({ story });
}
