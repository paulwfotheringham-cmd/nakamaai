"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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

function AnimatedHead({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelUrl);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const { actions } = useAnimations(gltf.animations, groupRef);

  useMemo(() => {
    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [model]);

  useEffect(() => {
    const actionEntries = Object.entries(actions);
    if (!actionEntries.length) return;

    const idle =
      actions["Idle"] || actions["Standing"] || actions["Dance"] || actionEntries[0][1];

    const talk =
      actions["Yes"] || actions["No"] || actions["Wave"] || actionEntries[actionEntries.length - 1][1];

    if (!idle || !talk) return;

    idle.reset();
    idle.setLoop(THREE.LoopRepeat, Infinity);
    idle.fadeIn(0.2).play();

    if (isSpeaking) {
      talk.reset();
      talk.setLoop(THREE.LoopRepeat, Infinity);
      talk.fadeIn(0.15).play();
      idle.fadeOut(0.12);
    } else {
      talk.fadeOut(0.18);
      idle.fadeIn(0.15).play();
    }

    return () => {
      for (const act of Object.values(actions)) {
        act?.stop();
      }
    };
  }, [actions, isSpeaking]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.position.y = -1.45 + Math.sin(t * 0.9) * 0.015;
    groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} scale={1.45} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const [failed, setFailed] = useState(false);
  const activeModelUrl =
    typeof modelUrl === "string" && modelUrl.trim().length > 0
      ? modelUrl
      : "/models/heads/robot-expressive.glb";
  const showModel = !failed;

  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
        {showModel ? "3D MODEL ACTIVE" : "3D FALLBACK"}
      </div>

      {showModel ? (
        <Canvas camera={{ position: [0, 1.3, 3.2], fov: 30 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#081411"]} />
          <ambientLight intensity={0.75} />
          <hemisphereLight intensity={0.65} color="#ffffff" groundColor="#1f1f1f" />
          <directionalLight position={[2, 3, 3]} intensity={1.05} color="#ffffff" castShadow />

          <ModelErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <AnimatedHead modelUrl={activeModelUrl} isSpeaking={isSpeaking} />
            </Suspense>
          </ModelErrorBoundary>

          <OrbitControls enableZoom={false} enablePan={false} target={[0, 1.1, 0]} minPolarAngle={1.15} maxPolarAngle={1.9} />
        </Canvas>
      ) : (
        <FallbackHead2D imageSrc={imageSrc} />
      )}
    </div>
  );
}
