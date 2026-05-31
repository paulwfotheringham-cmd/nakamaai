/**
 * Simulator story synopses — evocative 3-paragraph previews for each scenario.
 * Written in second-person to feel immersive before the adventure begins.
 */

const SYNOPSES: Record<string, string[]> = {
  "Robin Hood & Maid Marian": [
    "The forest is black between the oaks and the only light comes from torches a half-mile behind you. You slipped from the castle during the banquet — one reckless decision dressed in borrowed clothes — and now the night belongs entirely to the two of you.",
    "He finds you at the old willow, breathless and laughing, a crown of stolen flowers already wilting in your hair. There's an outlaw's warrant with his name on it and a lord's ring on your finger, and neither of those things matters the moment he pulls you into the shadow of the bark.",
    "Tonight's adventure is a chase, a confession, and a promise made where no court can hear it. By dawn you'll have to choose: go back, or follow the arrow he's already notched in the direction of something entirely new.",
  ],
  "Venice After Midnight": [
    "The last vaporetto stopped an hour ago and the city has turned itself over to reflection — water, stone, and the echo of heels on a bridge no tourist has ever found. Your gondolier didn't ask where you wanted to go; he simply knew.",
    "A figure in a white mask leans against a lantern post at the curve of the canal. You've never seen their face, but the letter that appeared beneath your door this morning was written in a hand you'd recognise anywhere. The city arranged this. You only had to say yes.",
    "Venice keeps its secrets in layers — each alley a parenthesis, each door a sentence left unfinished. Tonight you'll peel one back. What you find on the other side of that bridge will change the word you use for belonging.",
  ],
  "Secret Society": [
    "The password was three words whispered into velvet, and now you're inside. The room is all shadow and candlelight, and every face you pass wears the same calm expression of someone who has decided, once and for all, to stop pretending.",
    "There is a chair reserved with your name on a card. There is wine you've never tasted and music with no instrument you can identify. And there is the one person in the room who is looking at you as though tonight was always going to end exactly like this.",
    "The society has one rule posted above the fireplace: what is said here, desired here, chosen here — stays here. You feel the freedom of that rule settle over your shoulders like a second skin. The night is only just beginning to show you what it knows.",
  ],
  "The Last Letter": [
    "The envelope is old — cream paper, fountain-ink address — and it arrived on a day when you had stopped expecting anything. Inside: two pages in a voice so familiar it shortens your breath, describing a night that hasn't happened yet.",
    "The letter is a map. Not of places but of moments: a specific restaurant, a window table, a phrase to say when the waiter walks away. Someone wrote this for you in meticulous, loving detail and sent it forward through time to arrive exactly now.",
    "Following it feels less like obedience and more like remembering. By the third instruction you understand what this is — not a message from the past, but a promise about the future, written by the only person who knows how this story ends.",
  ],
  "Moonlit Train": [
    "Carriage seven, berth four — the reservation was made six months ago and the destination doesn't matter. What matters is the rhythmic sway of tracks beneath you, the blue dark outside the window, and the particular privacy that only a moving train provides.",
    "Dinner is served at the table between your seats: a bottle of something deep and red, bread that's still warm, and a silence you both agree to break only on your own terms. The world outside is rushing backwards. You are perfectly, deliberately still.",
    "Somewhere past midnight the city lights thin out and give way to open country. You watch fields dissolve into sky and feel the peculiar intimacy of people who have nowhere they need to be until dawn — and have chosen, carefully, to spend that nowhere together.",
  ],
  "Hidden Kingdom": [
    "The door to the east wing has been locked since the old reign, and no one remembers who holds the key except the one person who pressed it into your palm this afternoon without explanation. The palace is asleep. The guards rotate at midnight. You have twelve minutes.",
    "Inside: a garden under glass, impossible in this climate, roses blooming in December against walls carved with a language older than the throne. Someone kept this alive in secret for decades, tending it for an occasion that was always going to be this one.",
    "In the centre of the garden is a bench, and on the bench is a note, and the note contains three things: a name, a question, and an answer that only makes sense once you've read it twice. You read it twice. The door behind you locks itself softly, and neither of you moves to check it.",
  ],
  "Runaway Royalty": [
    "The bags were packed before breakfast and left by the service entrance — no motorcade, no protocol, no one who knows your title. Tonight you are simply two people who made a decision: the city, unescorted, for as long as the night holds.",
    "The first hour is the best: a street cart, a neon sign, a bar where no one looks up when you walk in. You order something you'd never be offered at an official reception and it tastes like every boundary you've crossed to be sitting here.",
    "The city offers you its less-photographed face — back alleys and jazz from a half-open door and a rooftop bar that isn't in any guide. By the time the first light touches the skyline you've collected enough stories to fill a state occasion you'll never give, and you wouldn't trade a single one.",
  ],
  "Lost in Paris": [
    "The map went into a rubbish bin on the Rue du Temple because neither of you wanted to be found tonight. Rain began on the Marais and hasn't stopped, and that is, objectively, perfect.",
    "You found the hotel the way you find things when you're not looking: a blue door, a hand-written tarif in the window, a patronne who gave you the room at the top with the mansard window and a look that suggested she approved of the circumstances. The ceiling slants down to a bed and a candle and a view of rooftop gutters singing in the rain.",
    "Paris when you are lost in it with someone specific is not a city. It is a permission. Every street a parenthesis around the only thing that matters, which is the particular way one person sounds when they say your name in the dark.",
  ],
  "Desert Oasis": [
    "The tent was pitched before you arrived — silk panels in amber and rose, a low lantern already burning, and the scent of something warm and resinous drifting in from beyond the dune. Your guide withdrew without a word. You are entirely alone with the silence and the stars and each other.",
    "Supper is set on a low table: pomegranate, flatbread, lamb slow-cooked with saffron, and a tea poured from a height that makes the glass ring. The desert at night is not empty — it is full of sound, insect and wind and the occasional argument of distant jackals — but all of it falls outside the circle of your lamp.",
    "Later, the sand still holds the heat of the day and the sky overhead is baroque with stars you'll never see from a city. There is no clock out here, no obligation before morning, and no reason at all to do anything except exactly what you want.",
  ],
  "Forbidden Masquerade": [
    "The invitation arrived without a name on it, only a time and an address and a single instruction: wear gold. The ballroom is full of people who have agreed, collectively, to be anyone except themselves tonight — and the anonymity is extraordinary, a second skin over every conversation.",
    "You knew it was them by the hands. Not by the mask or the voice or the way they moved through the crowd, but by the specific stillness that settles over them when they find what they're looking for. They found you in the third room, beside the window overlooking the canal, and they didn't speak first.",
    "The rules of the masquerade are simple: nothing begun here needs a name, and nothing ends when the mask comes off — it only becomes something else. The clock above the arch shows eleven. You have an hour before the unmasking, and you intend to use every minute.",
  ],
  "Storm on the Coast": [
    "The power went at seven and the inn has been running on candlelight ever since. Outside, the storm is doing something theatrical to the sea — waves collapsing against the cliff with a percussion that you feel in your chest — and inside, the whole building smells of woodsmoke and beeswax and wet wool drying by the grate.",
    "The landlord left a bottle and two glasses on the table before retreating to wherever landlords go when guests clearly wish to be left alone. The window rattles in its frame every few minutes. The candle between you bends and straightens and bends again.",
    "There is something about a storm that removes the ambiguity from things. The weather makes the decision for you: you're staying, the road is gone, the night is long, and the only reasonable response is to turn toward the warmth and the one person who chose to be here with you.",
  ],
  "The Private Library": [
    "The key to the library was left with the concierge with a note that simply said after ten. The building is Georgian, the books are alphabetised by mood rather than author, and there is a fireplace tall enough to stand in already lit when you arrive.",
    "Someone selected a volume and left it open on the reading table — a collected letters, two writers in correspondence across an ocean in the 1930s — and it is immediately clear why. The letters say things that letters were the only medium brave enough to say. You read alternate passages aloud and the room listens.",
    "By midnight you've moved from the reading table to the chesterfield, and the book is somewhere behind you, and the fire has been burning for hours, and the library is doing what it was always really built for — not the storing of stories, but the making of them.",
  ],
  "Midnight Rooftop": [
    "The stairwell access was supposed to be locked but the latch was broken and you both knew it, and now you're on the roof with the city spread out below you in every direction like a map of every decision that led here. Somewhere below a jazz quartet is playing through an open window.",
    "The night is warm enough for shirtsleeves and there are two deck chairs that someone dragged up here long before you and angled precisely toward the view. There is a cooler between them. Inside the cooler: ice, two glasses, and a bottle wrapped in a note that says simply good timing.",
    "From up here the city is beautiful in the specific way that things are beautiful when you can see them whole — every street, every light, every late-night taxi making its way toward some small urgency. You are above all of it, briefly, perfectly, together.",
  ],
  "Winter Chalet": [
    "The snow started at noon and hasn't stopped, and by now the road back to the village is theoretical. The chalet is warm — inglenook fireplace, stone floor spread with rugs, a pile of dry logs that someone stacked as though they knew exactly how long you'd be staying.",
    "Dinner was a slow project: both of you in the kitchen, something with wine and rosemary that took two hours and tasted like it was worth every minute. Afterwards the table became a place for a second bottle and a conversation that had no agenda and went wherever it wanted.",
    "Outside the snow has buried the world up to the windowsills and is still falling, soft and absolute and utterly indifferent to anything you might have needed to be elsewhere for. Inside the fire makes shadows and the blanket is large enough for two and the night is only half over.",
  ],
  "The Art Collector": [
    "The gallery closed four hours ago and the security guard who let you in has made himself diplomatically absent. The art is extraordinary and entirely lit — track lights on every painting, a small sculpture garden visible through the glass partition — and you have it all to yourselves.",
    "She came to acquire one piece and ended up in conversation about an entirely different one: a small oil, barely eighteen inches square, of a woman standing at a window with her back to the room. The collector explained what he paid for it. He failed to explain why he keeps coming back to look at it.",
    "There is a private room at the back, accessible through the drawing-room, with a chaise and two glass cases and a painting that has never been publicly exhibited. The collector leads. You follow. What happens in a room full of beautiful things, alone, after midnight, is its own kind of art.",
  ],
  "Harbor at Dusk": [
    "The boat was rigged before you arrived — a forty-footer, teak decks, running lights catching the last of the copper sky. The captain gave you the wheel before you'd even said where you wanted to go, which meant she already knew: out past the headland, to where the harbour lights are just a low glow behind you.",
    "The sea at dusk smells of salt and diesel and distance. Once past the breakwater the wind picks up and the boat finds its angle and everything on land begins to feel very far away and very optional. You handle the lines because someone has to, and because it feels good to have a physical task while the world simplifies around you.",
    "Anchored in the lee of the island, with the engine off and the city invisible and the stars appearing one by one above the mast, you eat from provisions laid into the locker that morning — bread, cured meat, something in a jar that turns out to be excellent. The night is enormous and entirely private.",
  ],
  "Garden of Echoes": [
    "The garden exists between two properties and belongs to neither, which means it belongs to everyone who finds the gap in the wall and chooses to say nothing about it. You found it three years ago and told no one except the one person it seemed made to be shown to.",
    "It is evening and the jasmine is doing something extraordinary. The old stone bench by the fountain is cool beneath you, and the light through the canopy is the particular amber of late summer, and every sound from the city beyond the wall is absorbed and softened before it reaches you.",
    "There is a loose stone near the fountain base, and beneath it a small tin box, and inside the box a folded piece of paper with something written on it in your handwriting from a time you almost remember. Tonight's adventure begins with whatever you wrote down for yourself to find.",
  ],
  "The Jazz Lounge": [
    "The lounge closed to the public at midnight but the band plays until they stop wanting to, and the bartender made it quietly understood that your table near the piano would remain yours for as long as you cared to occupy it. The saxophonist knows your names. You've been coming here long enough for that.",
    "Tonight the set is slow and deliberate — late-night music for a late-night room, everything at half-speed and twice the feeling. The bourbon is good and arrives without being ordered, and the candle on your table is the kind that drips a little and doesn't apologise.",
    "At some point between sets the saxophonist leans over and plays something quiet and specific — something that sounds like the inside of a conversation you've been having for years. He says nothing. He doesn't need to. The music already said it.",
  ],
  "Castle by the Lake": [
    "The castle stands on a promontory above the lake and at this hour it looks exactly like something that has been waiting for you specifically. The key is old iron, heavy enough to feel like consequence, and it opens a door that leads to a corridor that leads to a room that no one has used for two hundred years.",
    "Inside: a fireplace laid but unlit until now, a table set for two as though the castle knew, and windows that look out over water so still it doubles the stars. There is a decanter on the table and two crystal glasses and a note that says simply welcome, you found it.",
    "The stone walls hold a particular silence — not empty but gathered, as though the room has been collecting quiet for decades to spend all at once on exactly this occasion. You light the fire. You pour two glasses. The lake holds the sky and the castle holds you and for once, nowhere else exists.",
  ],
  "Neon Afterglow": [
    "The diner has been here since 1962 and it shows — vinyl booths the colour of old lipstick, a counter with twelve stools, a neon sign in the window that buzzes slightly on the 'O' of OPEN. At two in the morning it is the warmest, most honest room in the city.",
    "The coffee is not good and neither of you care. The pie arrived without being ordered because Marlene, who has worked the overnight shift for eleven years, has a theory about people who come in after midnight and the theory involves dessert first. She isn't wrong.",
    "You came here to talk about something specific and instead talked about everything else, which is how you know the specific thing doesn't need to be talked about at all — it's already been decided, somewhere between the second coffee and the moment you both reached for the check at the same time and started laughing.",
  ],
};

const FALLBACK_SYNOPSIS = [
  "The evening has been set in motion with careful intention — a location chosen, a mood established, and an invitation extended to the one person worth this particular kind of trouble. What happens next belongs entirely to the two of you.",
  "Tonight's adventure exists in the space between the ordinary and the extraordinary: not a fantasy exactly, but a deliberate stepping-outside of the everyday to remember what it felt like before habit made everything predictable. You both chose to be here. That choice matters.",
  "The story begins now. Everything that follows — every conversation, every silence, every moment of surprise or recognition — is yours to keep. Press Play when you're ready. The night is waiting.",
];

export function getStorySynopsis(title: string): string[] {
  return SYNOPSES[title] ?? FALLBACK_SYNOPSIS;
}
