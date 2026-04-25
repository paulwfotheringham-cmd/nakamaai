"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setSpeakingMorphTargets } from "../lib/avatar/lipsync";

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
  const modelRef = useRef<THREE.Object3D>(null);
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

  useEffect(() => {
    if (!modelRef.current) return;

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const largestAxis = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 1.8;
    const normalizedScale = targetSize / largestAxis;

    modelRef.current.scale.setScalar(normalizedScale);
    modelRef.current.position.set(
      -center.x * normalizedScale,
      -center.y * normalizedScale - 0.1,
      -center.z * normalizedScale,
    );
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
      <primitive ref={modelRef} object={gltf.scene} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const hasModel = typeof modelUrl === "string" && modelUrl.trim().length > 0;
  const [modelFailed, setModelFailed] = useState(false);
  const showModel = hasModel && !modelFailed;

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
        <Canvas camera={{ position: [0, 0.2, 2.2], fov: 34 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <ambientLight intensity={0.5} />
          <hemisphereLight intensity={0.62} color="#d8fff2" groundColor="#0a0909" />
          <directionalLight position={[2, 3, 3]} intensity={1.35} color="#f7fff8" castShadow />
          <pointLight position={[-2.2, 0.9, 1.8]} intensity={0.95} color="#57ffcb" />

          <ModelErrorBoundary onError={() => setModelFailed(true)}>
            <Suspense fallback={null}>
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
                <ModelHead modelUrl={modelUrl!} isSpeaking={isSpeaking} />
              </Float>
            </Suspense>
          </ModelErrorBoundary>

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
