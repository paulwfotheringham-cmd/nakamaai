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

function visemeWeights(timeSeconds: number, audioLevel: number) {
  const beat = Math.floor(timeSeconds * 13);
  const w = 0.35 + audioLevel * 0.65;
  const slot = beat % 5;
  return {
    open: slot === 0 || slot === 2 ? w : w * 0.55,
    stretch: slot === 1 ? w * 0.45 : 0,
    funnel: slot === 3 ? w * 0.35 : 0,
    pucker: slot === 4 ? w * 0.25 : 0,
    wide: slot === 2 ? w * 0.2 : 0,
  };
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
  const emphasis = isSpeaking ? 0.5 + 0.5 * Math.sin(timeSeconds * 3.1) : 0;

  setMorph(dict, influences, "eyeBlink_L", blink, 0.55);
  setMorph(dict, influences, "eyeBlink_R", blink, 0.55);

  const idleBreath = 0.015 + Math.sin(timeSeconds * 0.9) * 0.008;
  const jawTarget = isSpeaking ? 0.2 + level * 0.95 + visemes.open * 0.2 : idleBreath;
  setMorph(dict, influences, "jawOpen", jawTarget, isSpeaking ? 0.55 : 0.12);
  setMorph(dict, influences, "jawForward", isSpeaking ? level * 0.08 : 0, 0.15);

  const smileBase = isSpeaking ? 0.1 + level * 0.14 : 0.05;
  setMorph(dict, influences, "mouthSmile_L", smileBase + visemes.stretch * 0.08, 0.22);
  setMorph(dict, influences, "mouthSmile_R", smileBase + visemes.stretch * 0.08, 0.22);
  setMorph(dict, influences, "mouthStretch_L", visemes.stretch, 0.3);
  setMorph(dict, influences, "mouthStretch_R", visemes.stretch, 0.3);
  setMorph(dict, influences, "mouthFunnel", visemes.funnel, 0.28);
  setMorph(dict, influences, "mouthPucker", visemes.pucker, 0.25);
  setMorph(dict, influences, "mouthLowerDown_L", isSpeaking ? level * 0.35 : 0, 0.2);
  setMorph(dict, influences, "mouthLowerDown_R", isSpeaking ? level * 0.35 : 0, 0.2);
  setMorph(dict, influences, "mouthUpperUp_L", isSpeaking ? level * 0.18 : 0, 0.18);
  setMorph(dict, influences, "mouthUpperUp_R", isSpeaking ? level * 0.18 : 0, 0.18);
  setMorph(dict, influences, "mouthClose", isSpeaking ? Math.max(0, 0.25 - level * 0.35) : 0.08, 0.15);

  const browLift = isSpeaking ? 0.1 + emphasis * 0.12 : 0.03;
  setMorph(dict, influences, "browInnerUp", browLift, 0.18);
  setMorph(dict, influences, "browOuterUp_L", isSpeaking ? 0.06 + emphasis * 0.05 : 0.02, 0.15);
  setMorph(dict, influences, "browOuterUp_R", isSpeaking ? 0.06 + emphasis * 0.05 : 0.02, 0.15);

  const squint = isSpeaking ? 0.04 + level * 0.12 : 0.01;
  setMorph(dict, influences, "eyeSquint_L", squint, 0.16);
  setMorph(dict, influences, "eyeSquint_R", squint, 0.16);
  setMorph(dict, influences, "cheekSquint_L", isSpeaking ? smileBase * 0.6 : 0, 0.14);
  setMorph(dict, influences, "cheekSquint_R", isSpeaking ? smileBase * 0.6 : 0, 0.14);

  const lookX = Math.sin(timeSeconds * 0.45) * (isSpeaking ? 0.04 : 0.02);
  setMorph(dict, influences, "eyeLookOut_L", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_R", Math.max(0, lookX), 0.08);
  setMorph(dict, influences, "eyeLookIn_L", Math.max(0, -lookX), 0.08);
  setMorph(dict, influences, "eyeLookOut_R", Math.max(0, -lookX), 0.08);
}
