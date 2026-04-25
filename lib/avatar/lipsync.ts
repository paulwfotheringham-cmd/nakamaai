import * as THREE from "three";

const MOUTH_MORPH_ALIASES = [
  "viseme_aa",
  "viseme_AA",
  "aa",
  "A",
  "jawOpen",
  "JawOpen",
  "jaw_open",
  "mouthOpen",
  "MouthOpen",
  "mouthopen",
  "mouth_open",
  "Open",
];

export function setSpeakingMorphTargets(mesh: THREE.Mesh, isSpeaking: boolean, timeSeconds: number) {
  const dict = mesh.morphTargetDictionary;
  const influences = mesh.morphTargetInfluences;
  if (!dict || !influences) return;

  const mouthIndices: number[] = [];

  for (const alias of MOUTH_MORPH_ALIASES) {
    const candidate = dict[alias];
    if (typeof candidate === "number") {
      mouthIndices.push(candidate);
    }
  }

  // Fallback: include all targets that look mouth/jaw related.
  if (mouthIndices.length === 0) {
    for (const [key, idx] of Object.entries(dict)) {
      const k = key.toLowerCase();
      if (k.includes("mouth") || k.includes("jaw") || k.includes("viseme") || k.includes("open")) {
        mouthIndices.push(idx);
      }
    }
  }

  if (mouthIndices.length === 0) return;

  const targetValue = isSpeaking
    ? 0.45 + Math.abs(Math.sin(timeSeconds * 18)) * 0.55
    : 0.02;

  for (const idx of mouthIndices) {
    influences[idx] = THREE.MathUtils.lerp(
      influences[idx] ?? 0,
      targetValue,
      isSpeaking ? 0.45 : 0.2,
    );
  }
}
