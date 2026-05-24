"use client";

import * as THREE from "three";

let cachedEyeTexture: THREE.CanvasTexture | null = null;

export function createBlueEyeTexture(): THREE.CanvasTexture {
  if (cachedEyeTexture) return cachedEyeTexture;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cachedEyeTexture = new THREE.CanvasTexture(canvas);
    return cachedEyeTexture;
  }

  ctx.fillStyle = "#f5f3ef";
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = "#1d4ed8";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "#0a1628";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - size * 0.06, cy - size * 0.06, size * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fill();

  cachedEyeTexture = new THREE.CanvasTexture(canvas);
  cachedEyeTexture.colorSpace = THREE.SRGBColorSpace;
  return cachedEyeTexture;
}

export const HAIR_COLOR = 0x4a3728;

/** Short brown hair cap sized for the framed male-guide head. */
export function GuideHair() {
  return (
    <group position={[0, 0.17, -0.015]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.215, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={HAIR_COLOR} roughness={0.88} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.02, 0.01]} scale={[1.08, 0.55, 1.05]} castShadow>
        <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.45]} />
        <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.06, 0.1]} rotation={[0.35, 0, 0]} scale={[0.9, 0.25, 0.35]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.12]} />
        <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  );
}
