"use client";

import { Environment, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { applyFacialAnimation } from "@/lib/avatar/facialAnimation";
import { enhanceSkinMaterials } from "@/lib/avatar/enhanceSkinMaterials";
import { useGuideGLTF } from "@/lib/avatar/useGuideGLTF";

/** World-space head height — smaller value = smaller face on screen. */
const HEAD_HEIGHT = 0.52;
const CAMERA_Z = 2.65;

type GuideHeadProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

function PortraitCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.02, CAMERA_Z);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 30;
      camera.near = 0.1;
      camera.far = 20;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
}

function GuideHead({ isSpeaking, audioLevelRef }: GuideHeadProps) {
  const groupRef = useRef<THREE.Group>(null);
  const framedRef = useRef(false);
  const { scene } = useGuideGLTF();

  useEffect(() => {
    if (framedRef.current) return;
    framedRef.current = true;

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    scene.position.sub(center);
    scene.scale.setScalar(HEAD_HEIGHT / Math.max(size.y, 0.001));
    scene.position.y -= size.y * (HEAD_HEIGHT / Math.max(size.y, 0.001)) * 0.04;

    enhanceSkinMaterials(scene);
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const retry = window.setTimeout(() => {
      enhanceSkinMaterials(scene);
      scene.updateMatrixWorld(true);
    }, 400);
    return () => window.clearTimeout(retry);
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let audioLevel = audioLevelRef.current ?? 0;
    if (isSpeaking && audioLevel < 0.08) {
      audioLevel = 0.1 + Math.abs(Math.sin(t * 12)) * 0.08;
    }

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        applyFacialAnimation(child, {
          isSpeaking,
          timeSeconds: t,
          audioLevel: isSpeaking ? audioLevel : 0,
        });
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.04;
      groupRef.current.position.y = isSpeaking ? Math.sin(t * 2.4) * 0.006 : Math.sin(t * 0.7) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
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
    <div className="flex h-[min(78vh,720px)] w-full items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#1a1512] to-[#0a1218] shadow-[0_0_64px_rgba(16,185,129,0.12)]">
      <Canvas
        shadows
        camera={{ position: [0, 0.02, CAMERA_Z], fov: 30, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.38;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x12100e, 1);
        }}
      >
        <PortraitCamera />
        <hemisphereLight intensity={0.45} color="#fff8f0" groundColor="#6b5344" />
        <ambientLight intensity={0.22} />
        <directionalLight position={[2.2, 3.2, 2.5]} intensity={1.5} color="#fff5eb" castShadow />
        <directionalLight position={[-2.5, 2, 2]} intensity={0.45} color="#ffd4b8" />
        <directionalLight position={[0, 1.5, -2.8]} intensity={0.35} color="#c8d8ff" />
        <Suspense fallback={<CanvasLoader />}>
          <Environment preset="apartment" />
          <GuideHead isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
        </Suspense>
        <OrbitControls
          enableZoom
          minDistance={1.8}
          maxDistance={5}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 3.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
