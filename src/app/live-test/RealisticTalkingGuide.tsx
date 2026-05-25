"use client";

import { Environment, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { applyFacialAnimation } from "@/lib/avatar/facialAnimation";
import { stripGuideAppearance } from "@/lib/avatar/headMetrics";
import { useGuideGLTF } from "@/lib/avatar/useGuideGLTF";

/** World-space head height — smaller value = smaller face on screen. */
const HEAD_HEIGHT = 0.52;
const CAMERA_Z = 2.65;

const FEATURE_KEYWORDS = {
  hair: ["hair", "fringe"],
  eyebrows: ["brow", "eyebrow"],
  eyelashes: ["lash", "eyelash"],
  lips: ["lip"],
} as const;

type FeatureKey = keyof typeof FEATURE_KEYWORDS;

function matchesFeature(name: string, keywords: readonly string[]): boolean {
  const n = name.toLowerCase();
  return keywords.some((keyword) => n.includes(keyword));
}

function collectHierarchyNames(obj: THREE.Object3D): string[] {
  const names: string[] = [];
  let current: THREE.Object3D | null = obj;
  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }
  return names;
}

function detectFeatures(obj: THREE.Object3D): FeatureKey[] {
  const names = collectHierarchyNames(obj);
  const hits: FeatureKey[] = [];
  for (const [feature, keywords] of Object.entries(FEATURE_KEYWORDS) as [FeatureKey, readonly string[]][]) {
    if (names.some((name) => matchesFeature(name, keywords))) hits.push(feature);
  }
  return hits;
}

function logMaterialDetails(mesh: THREE.Mesh, material: THREE.Material, index?: number) {
  const label = index === undefined ? "  MATERIAL:" : `  MATERIAL[${index}]:`;
  const std = material as THREE.MeshStandardMaterial;
  console.log(label, material.name || "(unnamed)", {
    type: material.type,
    visible: mesh.visible,
    skinnedMesh: mesh instanceof THREE.SkinnedMesh,
    hasAlphaMap: Boolean(std.alphaMap),
    transparent: std.transparent ?? false,
    opacity: std.opacity ?? 1,
  });
  console.log("    map:", std.map ?? null);
  console.log("    alphaMap:", std.alphaMap ?? null);
  console.log("    transparent:", std.transparent);
  console.log("    opacity:", std.opacity);
}

/** Inspect-only pass — logs mesh/material names; does not modify materials. */
function inspectGuideScene(scene: THREE.Object3D) {
  if (scene.userData.guideInspected) return;
  scene.userData.guideInspected = true;

  console.group("[Guide GLB] Scene inspection");

  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    console.log("MESH:", mesh.name || "(unnamed)");

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m, i) => {
        console.log("  MATERIAL:", i, m?.name);
        if (m) logMaterialDetails(mesh, m, i);
      });
    } else if (mesh.material) {
      console.log("  MATERIAL:", mesh.material.name);
      logMaterialDetails(mesh, mesh.material);
    } else {
      console.log("  MATERIAL: (none)");
    }

    const features = detectFeatures(mesh);
    if (features.length > 0) {
      console.log("  FEATURE MATCH:", features.join(", "));
    }
  });

  console.group("[Guide GLB] Feature summary");
  for (const feature of Object.keys(FEATURE_KEYWORDS) as FeatureKey[]) {
    const matches: string[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const names = collectHierarchyNames(mesh);
      const meshHit = names.some((n) => matchesFeature(n, FEATURE_KEYWORDS[feature]));
      const matHit = (Array.isArray(mesh.material) ? mesh.material : [mesh.material])
        .filter(Boolean)
        .some((m) => matchesFeature(m.name || "", FEATURE_KEYWORDS[feature]));
      if (meshHit || matHit) {
        matches.push(mesh.name || "(unnamed mesh)");
      }
    });
    console.log(`${feature}:`, matches.length ? matches : "(no matching mesh/material names)");
  }
  console.groupEnd();

  console.groupEnd();
}

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
  const { scene } = useGuideGLTF();

  useEffect(() => {
    stripGuideAppearance(scene);
    inspectGuideScene(scene);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    if (!scene.userData.guideFramed) {
      scene.userData.guideFramed = true;
      scene.position.sub(center);
      scene.scale.setScalar(HEAD_HEIGHT / Math.max(size.y, 0.001));
      scene.position.y -= size.y * (HEAD_HEIGHT / Math.max(size.y, 0.001)) * 0.04;
    }

    scene.updateMatrixWorld(true);
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let audioLevel = audioLevelRef.current ?? 0;
    if (isSpeaking && audioLevel < 0.08) {
      audioLevel = 0.22 + Math.abs(Math.sin(t * 13)) * 0.18;
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
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.38;
          gl.setClearColor(0x12100e, 1);
        }}
      >
        <PortraitCamera />
        <ambientLight intensity={0.12} color="#fff8f0" />
        <directionalLight
          position={[1.8, 2.8, 2.2]}
          intensity={1.15}
          color="#fff5eb"
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-2.2, 1.2, 1.6]} intensity={0.32} color="#ffd4b8" />
        <directionalLight position={[0, 1.4, -2.6]} intensity={0.22} color="#c8d8ff" />
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
