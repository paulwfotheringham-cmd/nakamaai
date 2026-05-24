import * as THREE from "three";

export type FacialAnimationInput = {
  isSpeaking: boolean;
  timeSeconds: number;
  /** Normalized speech energy from Web Audio analyser (0–1). */
  audioLevel: number;
};

/** Tuning caps — jaw peaks ~0.42, old wide-open setup hit ~1.3. */
export const LIP_SYNC_TUNING = {
  jawBase: 0.12,
  jawFromAudio: 0.32,
  jawFromViseme: 0.05,
  mouthCloseBase: 0.08,
  mouthCloseFromAudio: 0.06,
  mouthCloseMin: 0.02,
  stretchMax: 0.18,
  lowerLipMax: 0.14,
  upperLipMax: 0.09,
} as const;

function setMorph(
  dict: Record<string, number>,
  influences: number[],
  name: string,
  target: number,
  speed = 0.28,
) {
  const idx = dict[name];
  if (typeof idx !== "number") return;
  influences[idx] = THREE.MathUtils.lerp(influences[idx] ?? 0, target, speed);
}

function blinkWeight(timeSeconds: number): number {
  const period = 3.4;
  const blinkDuration = 0.13;
  const phase = timeSeconds % period;
  if (phase > blinkDuration) return 0;
  return Math.sin((phase / blinkDuration) * Math.PI);
}

/** Light viseme variation — scaled down so mouth does not stretch wide. */
function visemeWeights(timeSeconds: number, audioLevel: number) {
  const beat = Math.floor(timeSeconds * 13);
  const w = 0.12 + audioLevel * 0.42;
  const slot = beat % 5;
  return {
    open: slot === 0 || slot === 2 ? w : w * 0.55,
    stretch: slot === 1 ? w * 0.35 : 0,
    funnel: slot === 3 ? w * 0.2 : 0,
    pucker: slot === 4 ? w * 0.15 : 0,
  };
}

/** Exported for sanity checks — jaw must stay above mouthClose for visible motion. */
export function computeMouthTargets(level: number, isSpeaking: boolean, visemeOpen = 0) {
  const t = LIP_SYNC_TUNING;
  if (!isSpeaking) {
    return { jawOpen: 0.015, mouthClose: 0.06 };
  }

  const jawOpen = t.jawBase + level * t.jawFromAudio + visemeOpen * t.jawFromViseme;
  const mouthClose = Math.max(t.mouthCloseMin, t.mouthCloseBase - level * t.mouthCloseFromAudio);
  return { jawOpen, mouthClose };
}

export function applyFacialAnimation(mesh: THREE.Mesh, input: FacialAnimationInput) {
  const dict = mesh.morphTargetDictionary;
  const influences = mesh.morphTargetInfluences;
  if (!dict || !influences) return;

  const hasArkit = "jawOpen" in dict || "mouthSmile_L" in dict;
  if (!hasArkit) return;

  const { isSpeaking, timeSeconds, audioLevel } = input;
  const level = THREE.MathUtils.clamp(audioLevel, 0, 1);
  const blink = blinkWeight(timeSeconds);
  const visemes = visemeWeights(timeSeconds, level);
  const emphasis = isSpeaking ? 0.35 + 0.35 * Math.sin(timeSeconds * 3.1) : 0;
  const t = LIP_SYNC_TUNING;

  setMorph(dict, influences, "eyeBlink_L", blink, 0.55);
  setMorph(dict, influences, "eyeBlink_R", blink, 0.55);

  const idleBreath = 0.015 + Math.sin(timeSeconds * 0.9) * 0.008;
  const mouth = computeMouthTargets(level, isSpeaking, visemes.open);

  setMorph(dict, influences, "jawOpen", isSpeaking ? mouth.jawOpen : idleBreath, isSpeaking ? 0.42 : 0.12);
  setMorph(dict, influences, "jawForward", isSpeaking ? level * 0.03 : 0, 0.12);
  setMorph(dict, influences, "mouthClose", isSpeaking ? mouth.mouthClose : 0.06, isSpeaking ? 0.35 : 0.12);

  const smileBase = isSpeaking ? 0.03 + level * 0.05 : 0.03;
  setMorph(dict, influences, "mouthSmile_L", smileBase + visemes.stretch * 0.04, 0.18);
  setMorph(dict, influences, "mouthSmile_R", smileBase + visemes.stretch * 0.04, 0.18);
  setMorph(dict, influences, "mouthStretch_L", visemes.stretch * t.stretchMax, 0.22);
  setMorph(dict, influences, "mouthStretch_R", visemes.stretch * t.stretchMax, 0.22);
  setMorph(dict, influences, "mouthFunnel", visemes.funnel * 0.12, 0.2);
  setMorph(dict, influences, "mouthPucker", visemes.pucker * 0.1, 0.2);
  setMorph(dict, influences, "mouthLowerDown_L", isSpeaking ? level * t.lowerLipMax : 0, 0.18);
  setMorph(dict, influences, "mouthLowerDown_R", isSpeaking ? level * t.lowerLipMax : 0, 0.18);
  setMorph(dict, influences, "mouthUpperUp_L", isSpeaking ? level * t.upperLipMax : 0, 0.18);
  setMorph(dict, influences, "mouthUpperUp_R", isSpeaking ? level * t.upperLipMax : 0, 0.18);

  const browLift = isSpeaking ? 0.06 + emphasis * 0.06 : 0.02;
  setMorph(dict, influences, "browInnerUp", browLift, 0.16);
  setMorph(dict, influences, "browOuterUp_L", isSpeaking ? 0.04 + emphasis * 0.03 : 0.01, 0.14);
  setMorph(dict, influences, "browOuterUp_R", isSpeaking ? 0.04 + emphasis * 0.03 : 0.01, 0.14);

  const squint = isSpeaking ? 0.03 + level * 0.07 : 0.01;
  setMorph(dict, influences, "eyeSquint_L", squint, 0.14);
  setMorph(dict, influences, "eyeSquint_R", squint, 0.14);
  setMorph(dict, influences, "cheekSquint_L", isSpeaking ? smileBase * 0.4 : 0, 0.12);
  setMorph(dict, influences, "cheekSquint_R", isSpeaking ? smileBase * 0.4 : 0, 0.12);

  const lookX = Math.sin(timeSeconds * 0.45) * (isSpeaking ? 0.03 : 0.015);
  setMorph(dict, influences, "eyeLookOut_L", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_R", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_L", Math.max(0, -lookX), 0.08);
  setMorph(dict, influences, "eyeLookOut_R", Math.max(0, -lookX), 0.08);
}
