"use client";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
};

export default function GuideHead3D({ imageSrc, isSpeaking }: GuideHead3DProps) {
  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
        GUIDE LIVE
      </div>

      <img
        src={imageSrc}
        alt="Guide"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Stable speaking indicator aligned to lower face area. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[58%] h-[7%] w-[19%] -translate-x-1/2 rounded-full border border-black/45 bg-black/70 ${
          isSpeaking ? "guide-mouth-active" : "guide-mouth-idle"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-[#081411] via-[#081411]/70 to-transparent" />

      <style jsx>{`
        @keyframes lipPulse {
          0% { transform: translateX(-50%) scaleY(0.32) scaleX(1.06); }
          45% { transform: translateX(-50%) scaleY(1.25) scaleX(0.9); }
          100% { transform: translateX(-50%) scaleY(0.32) scaleX(1.06); }
        }
        .guide-mouth-active {
          animation: lipPulse 105ms ease-in-out infinite;
          opacity: 0.95;
        }
        .guide-mouth-idle {
          transform: translateX(-50%) scaleY(0.32);
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
}
