const GUIDE_MODEL_MAP: Record<string, string | null> = {
  // Force all guides to one known-working model for reliable showcase.
  "imageedit_14_7182524648.png": "/models/heads/male-guide.glb",
  "imageedit_15_8566388634.png": "/models/heads/male-guide.glb",
  "imageedit_17_9927503197.png": "/models/heads/male-guide.glb",
  "imageedit_19_7924513571.png": "/models/heads/male-guide.glb",
  "imageedit_21_9491173695.png": "/models/heads/male-guide.glb",
  "imageedit_23_8750666346.png": "/models/heads/male-guide.glb",
  "imageedit_24_3470039515.png": "/models/heads/male-guide.glb",
  "imageedit_26_9406286079.png": "/models/heads/male-guide.glb",
  "imageedit_28_6534385177.png": "/models/heads/male-guide.glb",
  "imageedit_30_3631305230.png": "/models/heads/male-guide.glb",
  "imageedit_32_6036981563.png": "/models/heads/male-guide.glb",
};

export function getHeadModelUrl(selectedGuideFile: string) {
  return GUIDE_MODEL_MAP[selectedGuideFile] ?? null;
}
