"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
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
      <div
        aria-hidden="true"
        className={`absolute left-1/2 top-[67%] h-[13%] w-[34%] -translate-x-1/2 overflow-hidden rounded-[999px] ${
          isSpeaking ? "mouth-active" : "mouth-idle"
        }`}
      >
        <div
          className="h-full w-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "300% 760%",
            backgroundPosition: "50% 87%",
            filter: "contrast(1.12) saturate(1.15)",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#081411] to-transparent" />
    </div>
  );
}

function ModelHead({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
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

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
      groupRef.current.position.y = 0.1 + Math.sin(t * 1.1) * 0.035;
    }

    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        setSpeakingMorphTargets(obj as THREE.Mesh, isSpeaking, t);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={1.35} position={[0, -1.02, 0]} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const hasModel = typeof modelUrl === "string" && modelUrl.trim().length > 0;

  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      {hasModel ? (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D MODEL ACTIVE
        </div>
      ) : (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D FALLBACK
        </div>
      )}

      {hasModel ? (
        <Canvas camera={{ position: [0, 0.1, 2.6], fov: 38 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <hemisphereLight intensity={0.52} color="#d8fff2" groundColor="#0a0909" />
          <directionalLight position={[2, 3, 3]} intensity={1.2} color="#f7fff8" castShadow />
          <pointLight position={[-2.2, 0.9, 1.8]} intensity={0.85} color="#57ffcb" />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
            <ModelHead modelUrl={modelUrl!} isSpeaking={isSpeaking} />
          </Float>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
            <circleGeometry args={[1.3, 48]} />
            <shadowMaterial transparent opacity={0.28} />
          </mesh>

          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.25} maxPolarAngle={1.9} />
        </Canvas>
      ) : (
        <FallbackHead2D imageSrc={imageSrc} isSpeaking={isSpeaking} />
      )}

      <style jsx>{`
        @keyframes mouthTalk {
          0% { transform: translateX(-50%) scaleY(0.86); }
          50% { transform: translateX(-50%) scaleY(1.16); }
          100% { transform: translateX(-50%) scaleY(0.86); }
        }
        .mouth-active {
          animation: mouthTalk 120ms ease-in-out infinite;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35) inset, 0 0 12px rgba(20, 12, 8, 0.35);
        }
        .mouth-idle {
          transform: translateX(-50%) scaleY(0.86);
          opacity: 0.86;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25) inset;
        }
      `}</style>
    </div>
  );
}
