"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

export const HAIR_COLOR = 0x4a3728;
const BROW_COLOR = 0x3d2914;
const BROW_HIGHLIGHT = 0x5c4030;

const hairMaterial = new THREE.MeshStandardMaterial({
  color: HAIR_COLOR,
  roughness: 0.88,
  metalness: 0.02,
});

function makeBrowMaterial(color: number) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  return mat;
}

const browMaterial = makeBrowMaterial(BROW_COLOR);
const browHighlightMaterial = makeBrowMaterial(BROW_HIGHLIGHT);

/** Short hair cap fitted to the crown — sits on the scalp, not above it. */
export function GuideHair({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.width * 0.28;

  return (
    <group position={[metrics.center.x, metrics.topY, metrics.center.z]}>
      <mesh castShadow receiveShadow material={hairMaterial} scale={[0.92, 0.72, 0.9]}>
        <sphereGeometry args={[radius, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
      </mesh>
    </group>
  );
}

type BrowSideProps = {
  eye: THREE.Vector3;
  metrics: HeadMetrics;
  side: "left" | "right";
};

function ArchBrow({ eye, metrics, side }: BrowSideProps) {
  const sign = side === "left" ? -1 : 1;
  const surfaceZ = metrics.frontZ - metrics.depth * 0.012;

  const segments = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      z: number;
      w: number;
      h: number;
      d: number;
      rotZ: number;
      material: THREE.MeshStandardMaterial;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const innerBoost = (1 - t) * metrics.height * 0.008;
      const arch = Math.sin(t * Math.PI) * metrics.height * 0.012;
      const x = eye.x + sign * (t - 0.32) * metrics.width * 0.095;
      const y = eye.y + metrics.height * 0.045 + arch + innerBoost;
      const z = surfaceZ + Math.sin(t * Math.PI) * metrics.depth * 0.004;
      const taper = 1 - t * 0.55;

      items.push({
        x,
        y,
        z,
        w: metrics.width * 0.028 * taper,
        h: metrics.height * 0.007 * (0.85 + taper * 0.35),
        d: metrics.depth * 0.005 * taper,
        rotZ: sign * (0.06 - t * 0.1),
        material: i < 2 ? browHighlightMaterial : browMaterial,
      });
    }

    return items;
  }, [eye, metrics, side, sign, surfaceZ]);

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh
          key={i}
          position={[seg.x, seg.y, seg.z]}
          rotation={[0.02, sign * 0.02, seg.rotZ]}
          castShadow
          material={seg.material}
        >
          <boxGeometry args={[seg.w, seg.h, seg.d]} />
        </mesh>
      ))}
    </group>
  );
}

/** Arched eyebrows parented to the head mesh, flush on the forehead. */
export function GuideEyebrows({ metrics }: { metrics: HeadMetrics }) {
  return (
    <group>
      <ArchBrow eye={metrics.leftEye} metrics={metrics} side="left" />
      <ArchBrow eye={metrics.rightEye} metrics={metrics} side="right" />
    </group>
  );
}
