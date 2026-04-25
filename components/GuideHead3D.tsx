"use client";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
  modelUrl?: string | null;
};

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  return (
    <div className="relative h-[420px] w-[280px] shrink-0 overflow-hidden rounded-[28px] border border-emerald-300/15 bg-[#081411]">
      {/* Placeholder slot for real rigged floating-head glTF model */}
      {modelUrl ? (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D MODEL READY
        </div>
      ) : null}

      <img
        src={imageSrc}
        alt="Guide"
        className={`absolute inset-0 h-full w-full object-contain transition-all duration-200 ${
          isSpeaking
            ? "scale-105 -translate-y-2 drop-shadow-[0_0_30px_rgba(0,255,180,0.6)]"
            : "opacity-90"
        }`}
      />

      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 ${
          isSpeaking ? "dashboard-mouth-active" : ""
        }`}
      />

      <div className={`absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#081411] to-transparent ${isSpeaking ? "opacity-80" : "opacity-40"}`} />
    </div>
  );
}
