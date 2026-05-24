import * as THREE from "three";

export type FacialAnimationInput = {
  isSpeaking: boolean;
  timeSeconds: number;
  /** Normalized speech energy from Web Audio analyser (0–1). */
  audioLevel: number;
};

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

/** Subtle jaw motion from audio — avoids stacking heavy mouth morphs. */
function jawOpenTarget(audioLevel: number, isSpeaking: boolean, timeSeconds: number): number {
  if (!isSpeaking) return 0.012 + Math.sin(timeSeconds * 0.9) * 0.006;

  const level = THREE.MathUtils.clamp(audioLevel, 0, 1);
  const micro = Math.sin(timeSeconds * 11.5) * 0.015 * level;
  return 0.035 + level * 0.2 + micro;
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
  const jawTarget = jawOpenTarget(level, isSpeaking, timeSeconds);
  const morphSpeed = isSpeaking ? 0.38 : 0.12;

  setMorph(dict, influences, "eyeBlink_L", blink, 0.55);
  setMorph(dict, influences, "eyeBlink_R", blink, 0.55);

  setMorph(dict, influences, "jawOpen", jawTarget, morphSpeed);
  setMorph(dict, influences, "jawForward", isSpeaking ? level * 0.02 : 0, 0.12);

  // Keep lips mostly closed — realistic speech uses a small opening, not a wide gape.
  const closeTarget = isSpeaking ? 0.14 + (1 - level) * 0.1 : 0.06;
  setMorph(dict, influences, "mouthClose", closeTarget, morphSpeed);

  setMorph(dict, influences, "mouthSmile_L", isSpeaking ? 0.02 : 0.03, 0.15);
  setMorph(dict, influences, "mouthSmile_R", isSpeaking ? 0.02 : 0.03, 0.15);
  setMorph(dict, influences, "mouthStretch_L", 0, 0.2);
  setMorph(dict, influences, "mouthStretch_R", 0, 0.2);
  setMorph(dict, influences, "mouthFunnel", 0, 0.2);
  setMorph(dict, influences, "mouthPucker", 0, 0.2);
  setMorph(dict, influences, "mouthLowerDown_L", isSpeaking ? level * 0.06 : 0, 0.18);
  setMorph(dict, influences, "mouthLowerDown_R", isSpeaking ? level * 0.06 : 0, 0.18);
  setMorph(dict, influences, "mouthUpperUp_L", isSpeaking ? level * 0.04 : 0, 0.18);
  setMorph(dict, influences, "mouthUpperUp_R", isSpeaking ? level * 0.04 : 0, 0.18);

  const browLift = isSpeaking ? 0.04 + level * 0.04 : 0.02;
  setMorph(dict, influences, "browInnerUp", browLift, 0.15);
  setMorph(dict, influences, "browOuterUp_L", isSpeaking ? 0.03 : 0.01, 0.12);
  setMorph(dict, influences, "browOuterUp_R", isSpeaking ? 0.03 : 0.01, 0.12);

  const squint = isSpeaking ? 0.02 + level * 0.05 : 0.01;
  setMorph(dict, influences, "eyeSquint_L", squint, 0.14);
  setMorph(dict, influences, "eyeSquint_R", squint, 0.14);
  setMorph(dict, influences, "cheekSquint_L", isSpeaking ? level * 0.03 : 0, 0.12);
  setMorph(dict, influences, "cheekSquint_R", isSpeaking ? level * 0.03 : 0, 0.12);

  const lookX = Math.sin(timeSeconds * 0.45) * (isSpeaking ? 0.03 : 0.015);
  setMorph(dict, influences, "eyeLookOut_L", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_R", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_L", Math.max(0, -lookX), 0.08);
  setMorph(dict, influences, "eyeLookOut_R", Math.max(0, -lookX), 0.08);
}
