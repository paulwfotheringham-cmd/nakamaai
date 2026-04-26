"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
  modelUrl?: string | null;
};

type ModelErrorBoundaryProps = {
  onError: () => void;
  children: React.ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends React.Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function FallbackHead2D({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={imageSrc} alt="Guide" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#081411] to-transparent" />
    </div>
  );
}

function MaleHeadModel({ modelUrl }: { modelUrl: string }) {
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
    if (!groupRef.current) return;
    groupRef.current.position.y = -0.9 + Math.sin(t * 0.9) * 0.01;
    groupRef.current.rotation.y = Math.sin(t * 0.42) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={1.05} position={[0, -0.05, 0]} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking }: GuideHead3DProps) {
  const [failed, setFailed] = useState(false);
  const modelUrl = "/models/heads/male-guide-backup.glb";

  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
        3D MALE MODEL
      </div>

      {!failed ? (
        <Canvas camera={{ position: [0, 0.45, 3.45], fov: 30 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <ambientLight intensity={0.82} />
          <hemisphereLight intensity={0.72} color="#ffffff" groundColor="#1f1f1f" />
          <directionalLight position={[2, 3, 3]} intensity={1.05} color="#ffffff" castShadow />

          <ModelErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <MaleHeadModel modelUrl={modelUrl} />
            </Suspense>
          </ModelErrorBoundary>

          <OrbitControls enableZoom={false} enablePan={false} target={[0, 1.0, 0]} minPolarAngle={1.2} maxPolarAngle={1.85} />
        </Canvas>
      ) : (
        <FallbackHead2D imageSrc={imageSrc} />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[58%] h-[6.5%] w-[18%] -translate-x-1/2 rounded-full border border-black/35 bg-black/60 ${
          isSpeaking ? "guide-mouth-active" : "guide-mouth-idle"
        }`}
      />

      <style jsx>{`
        @keyframes lipPulse {
          0% { transform: translateX(-50%) scaleY(0.4) scaleX(1.03); }
          50% { transform: translateX(-50%) scaleY(1.05) scaleX(0.95); }
          100% { transform: translateX(-50%) scaleY(0.4) scaleX(1.03); }
        }
        .guide-mouth-active {
          animation: lipPulse 120ms ease-in-out infinite;
          opacity: 0.75;
        }
        .guide-mouth-idle {
          transform: translateX(-50%) scaleY(0.4);
          opacity: 0.42;
        }
      `}</style>
    </div>
  );
}
