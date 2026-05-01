"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Component, type ReactNode, Suspense } from "react";

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

type ModelErrorBoundaryProps = {
  children: ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Avatar model failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackMesh />;
    }

    return this.props.children;
  }
}

function LoadingFallbackMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#5f5f5f" />
    </mesh>
  );
}

function ErrorFallbackMesh() {
  return (
    <mesh>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#8a1f1f" />
    </mesh>
  );
}

function AvatarModel() {
  const { scene } = useGLTF("/scenes/avatar.glb");
  console.log("LOADING:", "/scenes/avatar.glb");
  return <primitive object={scene} />;
}

function SceneCanvas() {
  return (
    <main className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <gridHelper args={[10, 10, "#3a3a3a", "#1f1f1f"]} />
        <ModelErrorBoundary>
          <Suspense fallback={<LoadingFallbackMesh />}>
            <AvatarModel />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls enableZoom={true} />
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

useGLTF.preload("/scenes/avatar.glb");
