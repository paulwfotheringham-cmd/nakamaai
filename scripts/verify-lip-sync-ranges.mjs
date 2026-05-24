/** Sanity check for balanced lip-sync morph ranges (run before deploy). */

const T = {
  jawBase: 0.12,
  jawFromAudio: 0.32,
  jawFromViseme: 0.05,
  mouthCloseBase: 0.08,
  mouthCloseFromAudio: 0.06,
  mouthCloseMin: 0.02,
};

function computeMouthTargets(level, visemeOpen = 0) {
  const jawOpen = T.jawBase + level * T.jawFromAudio + visemeOpen * T.jawFromViseme;
  const mouthClose = Math.max(T.mouthCloseMin, T.mouthCloseBase - level * T.mouthCloseFromAudio);
  return { jawOpen, mouthClose };
}

const levels = [0, 0.15, 0.35, 0.55, 0.75, 1];
const visemeOpenMax = 0.12 + 0.42;

console.log("Mouth targets — jawOpen must exceed mouthClose when speaking:\n");

let ok = true;
for (const level of levels) {
  const quiet = computeMouthTargets(level, 0);
  const peak = computeMouthTargets(level, visemeOpenMax);
  const gapQuiet = quiet.jawOpen - quiet.mouthClose;
  const gapPeak = peak.jawOpen - peak.mouthClose;
  if (gapQuiet <= 0 || gapPeak <= 0) ok = false;
  console.log(
    `level=${level.toFixed(2)}  jaw=${quiet.jawOpen.toFixed(3)} close=${quiet.mouthClose.toFixed(3)} gap=${gapQuiet.toFixed(3)}  |  peak jaw=${peak.jawOpen.toFixed(3)} gap=${gapPeak.toFixed(3)}`,
  );
}

const oldWide = 0.2 + 1 * 0.95 + visemeOpenMax * 0.2;
const newPeak = computeMouthTargets(1, visemeOpenMax).jawOpen;
console.log(`\nOld wide jaw at level=1: ~${oldWide.toFixed(3)}`);
console.log(`New peak jaw at level=1: ~${newPeak.toFixed(3)} (${Math.round((1 - newPeak / oldWide) * 100)}% reduction)`);

if (!ok) {
  console.error("\nFAIL: mouth would look closed/static at some levels");
  process.exit(1);
}

if (newPeak >= oldWide * 0.55) {
  console.error("\nFAIL: new jaw range still too wide vs old setup");
  process.exit(1);
}

if (computeMouthTargets(0.15, 0).jawOpen < 0.12) {
  console.error("\nFAIL: quiet speech jaw too low — lips may not move");
  process.exit(1);
}

console.log("\nOK: balanced range — visible motion, not wide-open cartoon mouth");
