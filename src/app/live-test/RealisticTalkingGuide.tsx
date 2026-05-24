"use client";

import { Bounds, Center, ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { applyFacialAnimation } from "@/lib/avatar/facialAnimation";

const GUIDE_MODEL = "/models/heads/male-guide.glb";

type GuideHeadProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

function GuideHead({ isSpeaking, audioLevelRef }: GuideHeadProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GUIDE_MODEL);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = 0.62;
          child.material.metalness = 0.04;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let audioLevel = audioLevelRef.current ?? 0;
    if (isSpeaking && audioLevel < 0.06) {
      audioLevel = 0.32 + Math.abs(Math.sin(t * 15)) * 0.48;
    }

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        applyFacialAnimation(child, { isSpeaking, timeSeconds: t, audioLevel });
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.19) * 0.012;
      groupRef.current.position.y = isSpeaking ? Math.sin(t * 2.4) * 0.006 : Math.sin(t * 0.7) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <Bounds fit clip observe margin={1.15}>
        <Center>
          <primitive object={scene} />
        </Center>
      </Bounds>
    </group>
  );
}

type RealisticTalkingGuideProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

export default function RealisticTalkingGuide({ isSpeaking, audioLevelRef }: RealisticTalkingGuideProps) {
  return (
    <div className="h-[min(78vh,720px)] w-full overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#101820] via-[#0a1218] to-black shadow-[0_0_64px_rgba(16,185,129,0.12)]">
      <Canvas
        shadows
        camera={{ position: [0, 0.02, 1.85], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.42} />
        <directionalLight position={[2.5, 3.5, 2]} intensity={1.45} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-2, 2.5, 2.5]} intensity={0.5} />
        <directionalLight position={[0, 0.5, -2.5]} intensity={0.35} color="#b8d4ff" />
        <spotLight position={[0, 3, 1.2]} intensity={0.35} angle={0.4} penumbra={0.6} />
        <Environment preset="studio" />
        <ContactShadows position={[0, -0.55, 0]} opacity={0.35} scale={2.2} blur={2.2} far={1.2} />
        <Suspense fallback={null}>
          <GuideHead isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
        </Suspense>
        <OrbitControls
          enableZoom
          minDistance={1}
          maxDistance={3.2}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 3.4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(GUIDE_MODEL);
