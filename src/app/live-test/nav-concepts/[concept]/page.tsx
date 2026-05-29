import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavConceptFullMock from "../NavConceptFullMock";
import { NAV_CONCEPTS, type NavConceptId } from "../nav-destinations";

type Props = { params: { concept: string } };

function parseConcept(value: string): NavConceptId | null {
  if (value === "a" || value === "b" || value === "c" || value === "d" || value === "e") {
    return value;
  }
  return null;
}

export function generateStaticParams() {
  return NAV_CONCEPTS.map((c) => ({ concept: c.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const id = parseConcept(params.concept);
  const meta = id ? NAV_CONCEPTS.find((c) => c.id === id) : null;
  return {
    title: meta ? `Concept ${id!.toUpperCase()} — ${meta.name}` : "Navigation concept",
  };
}

export default function NavConceptMockPage({ params }: Props) {
  const conceptId = parseConcept(params.concept);
  if (!conceptId) notFound();

  return (
    <div className="live-test-root h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#050505] text-stone-200">
      <NavConceptFullMock conceptId={conceptId} />
    </div>
  );
}
