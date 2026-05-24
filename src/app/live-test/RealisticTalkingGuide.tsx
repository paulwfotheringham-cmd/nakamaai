"use client";

import { Bounds, Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { applyFacialAnimation } from "@/lib/avatar/facialAnimation";
import { setSpeakingMorphTargets } from "@/lib/avatar/lipsync";

const GUIDE_MODEL = "/LeePerrySmith.glb";

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
        setSpeakingMorphTargets(child, isSpeaking, t);
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.04;
      groupRef.current.position.y = isSpeaking ? Math.sin(t * 2.4) * 0.006 : Math.sin(t * 0.7) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <Bounds fit clip observe margin={0.82}>
        <Center>
          <primitive object={scene} />
        </Center>
      </Bounds>
    </group>
  );
}

function CanvasLoader() {
  return (
    <Html center>
      <p className="text-sm text-zinc-400">Loading 3D guide…</p>
    </Html>
  );
}

type RealisticTalkingGuideProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

export default function RealisticTalkingGuide({ isSpeaking, audioLevelRef }: RealisticTalkingGuideProps) {
  return (
    <div className="h-[min(78vh,720px)] w-full overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0a1218] shadow-[0_0_64px_rgba(16,185,129,0.12)]">
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.1], fov: 34 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.setClearColor(0x0a1218, 1);
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2.5, 3.5, 2]} intensity={1.35} castShadow />
        <directionalLight position={[-2, 2.5, 2.5]} intensity={0.55} />
        <directionalLight position={[0, 0.5, -2.5]} intensity={0.3} color="#b8d4ff" />
        <Suspense fallback={<CanvasLoader />}>
          <GuideHead isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
        </Suspense>
        <OrbitControls
          enableZoom
          minDistance={0.9}
          maxDistance={3.5}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 3.2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(GUIDE_MODEL);
