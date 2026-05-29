import type { Metadata } from "next";
import NavConceptsGallery from "./NavConceptsGallery";

export const metadata: Metadata = {
  title: "Navigation Concepts — Nakama Nights",
  description: "Compare five navigation layouts for the live experience.",
};

export default function NavConceptsPage() {
  return (
    <div className="live-test-root h-[100dvh] max-h-[100dvh] w-full overflow-y-auto bg-[#050505] text-stone-200">
      <NavConceptsGallery />
    </div>
  );
}
