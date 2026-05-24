import type { Metadata } from "next";
import LiveGuideStage from "./LiveGuideStage";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — realistic 3D talking guide prototype.",
};

export default function LiveTestPage() {
  return <LiveGuideStage />;
}
