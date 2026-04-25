const GUIDE_MODEL_MAP: Record<string, string | null> = {
  // Point these to real rigged head models in /public/models/heads/*.glb when ready.
  "imageedit_14_7182524648.png": null,
  "imageedit_15_8566388634.png": null,
  "imageedit_17_9927503197.png": null,
  "imageedit_19_7924513571.png": null,
  "imageedit_21_9491173695.png": null,
  "imageedit_23_8750666346.png": null,
  "imageedit_24_3470039515.png": null,
  "imageedit_26_9406286079.png": null,
  "imageedit_28_6534385177.png": null,
  "imageedit_30_3631305230.png": null,
  "imageedit_32_6036981563.png": null,
};

export function getHeadModelUrl(selectedGuideFile: string) {
  return GUIDE_MODEL_MAP[selectedGuideFile] ?? null;
}
