import * as THREE from "three";
import { createBlueEyeTexture } from "./guideAppearance";

/** Fair caucasian skin — warm, visible under studio lighting. */
export const SKIN_COLOR = 0xddb896;
export const SKIN_COLOR_LIGHT = 0xf0c9a8;
export const SKIN_COLOR_SHADOW = 0xb8845c;

let cachedSkinTexture: THREE.CanvasTexture | null = null;

function createProceduralSkinTexture(): THREE.CanvasTexture {
  if (cachedSkinTexture) return cachedSkinTexture;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cachedSkinTexture = new THREE.CanvasTexture(canvas);
    return cachedSkinTexture;
  }

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, "#f2c9a8");
  base.addColorStop(0.45, "#ddb896");
  base.addColorStop(1, "#c8956c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] = Math.min(255, Math.max(0, img.data[i] + n));
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n * 0.8));
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n * 0.5));
  }
  ctx.putImageData(img, 0, 0);

  cachedSkinTexture = new THREE.CanvasTexture(canvas);
  cachedSkinTexture.colorSpace = THREE.SRGBColorSpace;
  cachedSkinTexture.wrapS = THREE.ClampToEdgeWrapping;
  cachedSkinTexture.wrapT = THREE.ClampToEdgeWrapping;
  return cachedSkinTexture;
}

function applySkinMaterial(material: THREE.MeshStandardMaterial, meshName: string) {
  const name = meshName.toLowerCase();

  if (name.includes("eye")) {
    material.map = createBlueEyeTexture();
    material.color.setHex(0xffffff);
    material.roughness = 0.28;
    material.metalness = 0.05;
    material.envMapIntensity = 0.75;
    material.needsUpdate = true;
    return;
  }

  if (name.includes("teeth")) {
    material.map = null;
    material.color.setHex(0xf8f4ee);
    material.roughness = 0.4;
    material.metalness = 0;
    material.needsUpdate = true;
    return;
  }

  // Always use procedural skin albedo so colour is visible even when KTX2 fails.
  material.map = createProceduralSkinTexture();
  material.color.setHex(SKIN_COLOR);
  material.metalness = 0.02;
  material.roughness = 0.56;
  material.envMapIntensity = 0.85;
  material.needsUpdate = true;
}

export function enhanceSkinMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const meshName = child.name || "head";
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    if (!Array.isArray(child.material)) {
      const src = child.material;
      if (src instanceof THREE.MeshStandardMaterial) {
        const cloned = src.clone();
        applySkinMaterial(cloned, meshName);
        child.material = cloned;
      }
      return;
    }

    child.material = materials.map((m) => {
      if (!(m instanceof THREE.MeshStandardMaterial)) return m;
      const cloned = m.clone();
      applySkinMaterial(cloned, meshName);
      return cloned;
    });
  });
}
