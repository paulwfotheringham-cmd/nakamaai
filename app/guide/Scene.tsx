"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Component, type ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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
  const mouthMeshRef = useRef<any>(null);
  const mouthMorphIndexRef = useRef<number | null>(null);
  const morphReadyRef = useRef(false);
  const modelRootRef = useRef<THREE.Group>(null);
  const normalizedScaleRef = useRef(1);
  const offsetRef = useRef(new THREE.Vector3(0, 0, -0.5));

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (typeof window === "undefined" || !clonedScene) return;

    try {
      console.log("Loaded scene:", clonedScene);
      const meshNames: string[] = [];
      let mouthMesh: any = null;
      let mouthMorphIndex: number | null = null;
      let mouthMorphName: string | null = null;
      let bestOverallScore = -1;

      const preferredKeys = [
        "jawOpen",
        "mouthOpen",
        "mouth_open",
        "open",
        "viseme_aa",
        "viseme_AA",
        "aa",
        "A",
      ];
      const preferredLower = new Set(preferredKeys.map((k) => k.toLowerCase()));

      const scoreMorphKey = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes("jawopen") || k === "jawopen") return 100;
        if (k.includes("mouthopen") || k === "mouthopen") return 95;
        if (k.includes("mouth") && k.includes("open")) return 90;
        if (k.includes("open")) return 70;
        if (k.includes("jaw")) return 65;
        if (k.includes("mouth")) return 60;
        if (k.includes("viseme")) return 50;
        return 0;
      };

      clonedScene.traverse((child: any) => {
        console.log(child.name, child.type);
        if (child?.isMesh) {
          meshNames.push(child.name || "(unnamed mesh)");
        }

        if (!child?.isMesh) return;
        if (!child.morphTargetDictionary || !Array.isArray(child.morphTargetInfluences)) return;

        const dict = child.morphTargetDictionary as Record<string, number>;
        console.log("Morph dictionary on mesh:", child.name || "(unnamed mesh)", dict);

        let bestKey: string | null = null;
        let bestScore = -1;

        for (const key of Object.keys(dict)) {
          let score = scoreMorphKey(key);
          if (preferredLower.has(key.toLowerCase())) score = Math.max(score, 120);

          if (score > bestScore) {
            bestScore = score;
            bestKey = key;
          }
        }

        if (bestKey != null && bestScore > 0) {
          if (bestScore > bestOverallScore) {
            bestOverallScore = bestScore;
            mouthMesh = child;
            mouthMorphIndex = dict[bestKey];
            mouthMorphName = bestKey;
          }
        }
      });
      console.log("Scene meshes:", meshNames);

      mouthMeshRef.current = mouthMesh;
      mouthMorphIndexRef.current = mouthMorphIndex;
      morphReadyRef.current = Boolean(mouthMesh && mouthMorphIndex != null);

      if (morphReadyRef.current) {
        console.log("Selected mouth morph:", mouthMorphName, "index:", mouthMorphIndex, "mesh:", mouthMesh?.name);
      } else {
        console.log("No suitable mouth morph found on any mesh.");
      }

      const box = new THREE.Box3().setFromObject(clonedScene);
      if (!box.isEmpty()) {
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 2.6;
        normalizedScaleRef.current = targetSize / maxDim;
        offsetRef.current = new THREE.Vector3(-center.x, -box.min.y, -0.5 - center.z);
      } else {
        normalizedScaleRef.current = 1;
        offsetRef.current = new THREE.Vector3(0, 0, -0.5);
      }
    } catch (error) {
      console.error("Morph init failed:", error);
      mouthMeshRef.current = null;
      mouthMorphIndexRef.current = null;
      morphReadyRef.current = false;
      normalizedScaleRef.current = 1;
      offsetRef.current = new THREE.Vector3(0, 0, -0.5);
    }
  }, [clonedScene]);

  useFrame(({ clock }) => {
    if (typeof window === "undefined" || !morphReadyRef.current) return;

    try {
      const mesh = mouthMeshRef.current;
      const idx = mouthMorphIndexRef.current;
      if (!mesh || idx == null || !Array.isArray(mesh.morphTargetInfluences)) return;
      if (idx < 0 || idx >= mesh.morphTargetInfluences.length) return;

      const t = clock.getElapsedTime();
      const v = (Math.sin(t * 6) + 1) * 0.35;

      mesh.morphTargetInfluences[idx] = v;
    } catch (error) {
      console.error("Morph frame update failed:", error);
      morphReadyRef.current = false;
    }
  });

  return (
    <Center>
      <group ref={modelRootRef} position={[offsetRef.current.x, offsetRef.current.y, offsetRef.current.z]}>
        <primitive object={clonedScene} scale={0.3 * normalizedScaleRef.current} />
      </group>
    </Center>
  );
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
