import * as THREE from "three";

const MOUTH_MORPH_ALIASES = [
  "viseme_aa",
  "viseme_AA",
  "aa",
  "A",
  "jawOpen",
  "jaw_open",
  "mouthOpen",
  "mouth_open",
  "Open",
];

export function setSpeakingMorphTargets(mesh: THREE.Mesh, isSpeaking: boolean, timeSeconds: number) {
  const dict = mesh.morphTargetDictionary;
  const influences = mesh.morphTargetInfluences;
  if (!dict || !influences) return;

  let mouthIndex = -1;

  for (const alias of MOUTH_MORPH_ALIASES) {
    const candidate = dict[alias];
    if (typeof candidate === "number") {
      mouthIndex = candidate;
      break;
    }
  }

  if (mouthIndex < 0) return;

  const targetValue = isSpeaking
    ? 0.28 + Math.abs(Math.sin(timeSeconds * 18)) * 0.72
    : 0.02;

  influences[mouthIndex] = THREE.MathUtils.lerp(
    influences[mouthIndex] ?? 0,
    targetValue,
    isSpeaking ? 0.35 : 0.2,
  );
}
