"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { setSpeakingMorphTargets } from "../lib/avatar/lipsync";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
  modelUrl?: string | null;
};

function FallbackHead2D({ imageSrc, isSpeaking }: { imageSrc: string; isSpeaking: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={imageSrc}
        alt="Guide"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#081411] to-transparent" />
    </div>
  );
}

function ModelHead({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  const gltf = useGLTF(modelUrl);

  useMemo(() => {
    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        setSpeakingMorphTargets(obj as THREE.Mesh, isSpeaking, t);
      }
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        const name = bone.name.toLowerCase();
        if (name.includes("jaw") || name.includes("mouth")) {
          const jawTarget = isSpeaking
            ? 0.14 + Math.abs(Math.sin(t * 18)) * 0.28
            : 0.02;
          bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, jawTarget, isSpeaking ? 0.45 : 0.2);
        }
      }
    });
  });

  return (
    <group>
      <primitive object={gltf.scene} scale={1.45} position={[0, -1.0, 0]} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const activeModelUrl = "/models/heads/male-guide-backup.glb";
  const showModel = true;

  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      {showModel ? (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D MODEL ACTIVE
        </div>
      ) : (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D FALLBACK
        </div>
      )}

      {showModel ? (
        <Canvas camera={{ position: [0, 0.05, 3.7], fov: 30 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <ambientLight intensity={0.95} />
          <hemisphereLight intensity={0.75} color="#ffffff" groundColor="#212121" />
          <directionalLight position={[2, 3, 3]} intensity={1.15} color="#ffffff" castShadow />
          <pointLight position={[-2.2, 1.1, 2.2]} intensity={0.8} color="#7ffff0" />

          <Suspense fallback={null}>
            <ModelHead modelUrl={activeModelUrl} isSpeaking={isSpeaking} />
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.35} maxPolarAngle={1.7} />
        </Canvas>
      ) : (
        <FallbackHead2D imageSrc={imageSrc} isSpeaking={isSpeaking} />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[49%] h-[7.5%] w-[16%] -translate-x-1/2 rounded-full border border-black/35 bg-black/55 ${
          isSpeaking ? "guide-mouth-active" : "guide-mouth-idle"
        }`}
      />

      <style jsx>{`
        @keyframes lipPulse {
          0% { transform: translateX(-50%) scaleY(0.45) scaleX(1.02); }
          50% { transform: translateX(-50%) scaleY(1.15) scaleX(0.94); }
          100% { transform: translateX(-50%) scaleY(0.45) scaleX(1.02); }
        }
        .guide-mouth-active {
          animation: lipPulse 120ms ease-in-out infinite;
          opacity: 0.75;
        }
        .guide-mouth-idle {
          transform: translateX(-50%) scaleY(0.45);
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
}
