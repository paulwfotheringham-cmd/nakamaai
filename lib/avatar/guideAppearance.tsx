"use client";

import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

export const HAIR_COLOR = 0x4a3728;
const BROW_COLOR = 0x3d2914;
const EYE_BLUE = 0x2563eb;
const EYE_EMISSIVE = 0x1e3a8a;

const hairMaterial = new THREE.MeshStandardMaterial({
  color: HAIR_COLOR,
  roughness: 0.88,
  metalness: 0.02,
});

const browMaterial = new THREE.MeshStandardMaterial({
  color: BROW_COLOR,
  roughness: 0.92,
  metalness: 0,
});

const eyeMaterial = new THREE.MeshStandardMaterial({
  color: EYE_BLUE,
  roughness: 0.22,
  metalness: 0.08,
  emissive: new THREE.Color(EYE_EMISSIVE),
  emissiveIntensity: 0.25,
});

/** Hair cap fitted to the crown of the head mesh. */
export function GuideHair({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.width * 0.51;
  const capCenterY = metrics.topY - radius * 0.38;

  return (
    <group position={[metrics.center.x, capCenterY, metrics.center.z]}>
      <mesh castShadow receiveShadow material={hairMaterial}>
        <sphereGeometry args={[radius, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      </mesh>
      <mesh
        position={[0, -radius * 0.12, metrics.depth * 0.02]}
        scale={[1.06, 0.5, 1.04]}
        castShadow
        material={hairMaterial}
      >
        <sphereGeometry args={[radius * 0.96, 32, 16, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.42]} />
      </mesh>
    </group>
  );
}

/** Eyebrows on the forehead, aligned to the face surface. */
export function GuideEyebrows({ metrics }: { metrics: HeadMetrics }) {
  const w = metrics.width * 0.13;
  const h = metrics.height * 0.025;
  const d = metrics.depth * 0.04;
  const z = metrics.frontZ - metrics.depth * 0.06;
  const y = metrics.browY;
  const xOff = metrics.width * 0.11;

  return (
    <group>
      <mesh
        position={[metrics.center.x - xOff, y, z]}
        rotation={[0.12, 0.1, 0.06]}
        castShadow
        material={browMaterial}
      >
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh
        position={[metrics.center.x + xOff, y, z]}
        rotation={[0.12, -0.1, -0.06]}
        castShadow
        material={browMaterial}
      >
        <boxGeometry args={[w, h, d]} />
      </mesh>
    </group>
  );
}

/** Blue irises placed on the face surface. */
export function GuideFaceEyes({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.width * 0.042;
  const y = metrics.center.y + metrics.height * 0.06;
  const z = metrics.frontZ - metrics.depth * 0.02;
  const xOff = metrics.width * 0.11;

  return (
    <group>
      <mesh position={[metrics.center.x - xOff, y, z]} renderOrder={3} material={eyeMaterial}>
        <sphereGeometry args={[radius, 20, 20]} />
      </mesh>
      <mesh position={[metrics.center.x + xOff, y, z]} renderOrder={3} material={eyeMaterial}>
        <sphereGeometry args={[radius, 20, 20]} />
      </mesh>
      <mesh position={[metrics.center.x - xOff, y, z + radius * 0.35]} renderOrder={4}>
        <sphereGeometry args={[radius * 0.38, 16, 16]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} />
      </mesh>
      <mesh position={[metrics.center.x + xOff, y, z + radius * 0.35]} renderOrder={4}>
        <sphereGeometry args={[radius * 0.38, 16, 16]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} />
      </mesh>
    </group>
  );
}
