"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Float, OrbitControls, useGLTF } from "@react-three/drei";
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
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
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
        <Canvas camera={{ position: [0, 0, 4.5], fov: 32 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <ambientLight intensity={0.75} />
          <hemisphereLight intensity={0.85} color="#ffffff" groundColor="#1f1f1f" />
          <directionalLight position={[2, 3, 3]} intensity={1.25} color="#ffffff" castShadow />
          <pointLight position={[-2.2, 1.1, 2.2]} intensity={0.9} color="#7ffff0" />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
                <ModelHead modelUrl={activeModelUrl} isSpeaking={isSpeaking} />
              </Float>
            </Bounds>
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.2} maxPolarAngle={1.95} />
        </Canvas>
      ) : (
        <FallbackHead2D imageSrc={imageSrc} isSpeaking={isSpeaking} />
      )}
    </div>
  );
}
