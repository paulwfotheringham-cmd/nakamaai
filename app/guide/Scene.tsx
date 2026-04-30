"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Component, type ReactNode, Suspense, useEffect, useRef } from "react";

type SceneErrorBoundaryProps = {
  children: ReactNode;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Guide scene crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return <main className="h-screen w-screen bg-black" />;
    }

    return this.props.children;
  }
}

function AvatarModel() {
  const { scene } = useGLTF("/scenes/avatar.glb");
  const speakingMeshRef = useRef<any>(null);
  const morphReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !scene) return;

    try {
      let found: any = null;

      scene.traverse((child: any) => {
        if (found) return;
        if (child?.isMesh && Array.isArray(child.morphTargetInfluences)) {
          found = child;
        }
      });

      speakingMeshRef.current = found;
      morphReadyRef.current = Boolean(found);
    } catch (error) {
      console.error("Morph init failed:", error);
      speakingMeshRef.current = null;
      morphReadyRef.current = false;
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (typeof window === "undefined" || !morphReadyRef.current) return;

    try {
      const mesh = speakingMeshRef.current;
      if (!mesh || !Array.isArray(mesh.morphTargetInfluences)) return;

      const t = clock.getElapsedTime();
      const v = (Math.sin(t * 8) + 1) / 2;

      for (let i = 0; i < mesh.morphTargetInfluences.length; i += 1) {
        if (typeof mesh.morphTargetInfluences[i] === "number") {
          mesh.morphTargetInfluences[i] = v;
        }
      }
    } catch (error) {
      console.error("Morph frame update failed:", error);
      morphReadyRef.current = false;
    }
  });

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function SceneCanvas() {
  return (
    <main className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 0.2, 2.2], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 1, 1]} intensity={1.2} />
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </main>
  );
}

export default function Scene() {
  return (
    <SceneErrorBoundary>
      <SceneCanvas />
    </SceneErrorBoundary>
  );
}
