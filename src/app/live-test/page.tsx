import type { Metadata } from "next";
import LiveGuideStage from "./LiveGuideStage";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — Simli realtime talking concierge (live test).",
};

export default function LiveTestPage() {
  return <LiveGuideStage />;
}
