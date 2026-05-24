import type { HeadMetrics } from "./headMetrics";
import { attachGuideEyebrows } from "./attachGuideEyebrows";
import { attachGuideHair } from "./attachGuideHair";

/** Attach hair + brows to the head mesh; returns a single cleanup fn. */
export function attachGuideAppearance(metrics: HeadMetrics): () => void {
  const cleanHair = attachGuideHair(metrics);
  const cleanBrows = attachGuideEyebrows(metrics);

  return () => {
    cleanBrows();
    cleanHair();
  };
}
