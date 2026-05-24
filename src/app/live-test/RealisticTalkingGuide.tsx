"use client";

import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { setSpeakingMorphTargets } from "@/lib/avatar/lipsync";

function RealisticHead({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/LeePerrySmith.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        setSpeakingMorphTargets(child, isSpeaking, t);
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.06;
      groupRef.current.position.y = isSpeaking ? Math.sin(t * 2.2) * 0.008 : 0;
    }
  });

  return (
    <group ref={groupRef}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <primitive object={scene} />
        </Center>
      </Bounds>
    </group>
  );
}

export default function RealisticTalkingGuide({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="h-[min(72vh,640px)] w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#0d1a18] to-black shadow-[0_0_48px_rgba(16,185,129,0.08)]">
      <Canvas
        shadows
        camera={{ position: [0, 0.05, 2.15], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={1.6} castShadow />
        <directionalLight position={[-2, 2, 3]} intensity={0.55} />
        <directionalLight position={[0, 1, -3]} intensity={0.35} />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          <RealisticHead isSpeaking={isSpeaking} />
        </Suspense>
        <OrbitControls
          enableZoom
          minDistance={1.2}
          maxDistance={4}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 3.2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/LeePerrySmith.glb");
