import type { Metadata } from "next";
import NavConceptsGallery from "./NavConceptsGallery";

export const metadata: Metadata = {
  title: "Navigation Concepts — Nakama Nights",
  description: "Full-screen mockups for five navigation layouts.",
};

export default function NavConceptsPage() {
  return (
    <div className="live-test-root min-h-[100dvh] w-full overflow-y-auto bg-[#050505] text-stone-200">
      <NavConceptsGallery />
    </div>
  );
}
