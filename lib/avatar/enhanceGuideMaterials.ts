import * as THREE from "three";
import { getMeshRole } from "./headMetrics";

/** Fair caucasian skin — warm, visible under studio lighting. */
export const SKIN_COLOR = 0xddb896;

const BROW_KEYWORDS = ["brow", "eyebrow", "lash", "eyelash"];
const HAIR_KEYWORDS = ["hair", "fringe"];
const LIP_KEYWORDS = ["lip"];
const ENHANCED_FLAG = "guideMaterialEnhanced";

let cachedSkinTexture: THREE.CanvasTexture | null = null;

type AppearanceRole = "hair" | "brow" | "lip";

function matchesKeywords(name: string | undefined, keywords: string[]): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  return keywords.some((keyword) => n.includes(keyword));
}

function collectNames(mesh: THREE.Mesh, material: THREE.Material): string[] {
  const names: string[] = [];
  if (mesh.name) names.push(mesh.name);
  if (material.name) names.push(material.name);
  let obj: THREE.Object3D | null = mesh.parent;
  while (obj) {
    if (obj.name) names.push(obj.name);
    obj = obj.parent;
  }
  return names;
}

function detectAppearanceRole(mesh: THREE.Mesh, material: THREE.Material): AppearanceRole | null {
  for (const name of collectNames(mesh, material)) {
    if (matchesKeywords(name, LIP_KEYWORDS)) return "lip";
    if (matchesKeywords(name, BROW_KEYWORDS)) return "brow";
    if (matchesKeywords(name, HAIR_KEYWORDS)) return "hair";
  }
  return null;
}

function asStandardLike(
  material: THREE.Material,
): THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null {
  if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
    return material;
  }
  return null;
}

function safeColor(material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial): THREE.Color {
  return material.color?.clone?.() ?? new THREE.Color(0xffffff);
}

function getMaps(oldMat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial) {
  return {
    map: oldMat.map ?? null,
    alphaMap: oldMat.alphaMap ?? oldMat.map ?? null,
    normalMap: oldMat.normalMap ?? null,
    roughnessMap: oldMat.roughnessMap ?? null,
    color: safeColor(oldMat),
  };
}

function resetTransparencyState(material: THREE.MeshPhysicalMaterial) {
  material.transparent = true;
  material.alphaTest = 0.5;
  material.opacity = 1;
  material.depthWrite = true;
  material.depthTest = true;
  material.blending = THREE.NormalBlending;
  material.premultipliedAlpha = false;
  material.side = THREE.DoubleSide;
}

function createHairMaterial(
  oldMat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
): THREE.MeshPhysicalMaterial {
  const { map, alphaMap, normalMap, roughnessMap, color } = getMaps(oldMat);

  const material = new THREE.MeshPhysicalMaterial({
    map,
    alphaMap,
    normalMap,
    roughnessMap,
    color,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    roughness: 0.72,
    metalness: 0.02,
    clearcoat: 0.15,
    clearcoatRoughness: 0.8,
  });

  resetTransparencyState(material);
  material.userData[ENHANCED_FLAG] = true;
  material.needsUpdate = true;
  return material;
}

function createBrowMaterial(
  oldMat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
): THREE.MeshPhysicalMaterial {
  const material = createHairMaterial(oldMat);
  material.polygonOffset = true;
  material.polygonOffsetFactor = -1;
  material.polygonOffsetUnits = -1;
  material.needsUpdate = true;
  return material;
}

function createLipMaterial(
  oldMat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
): THREE.MeshPhysicalMaterial {
  const { map, alphaMap, normalMap, roughnessMap, color } = getMaps(oldMat);
  color.multiply(new THREE.Color("#ffb3c1"));

  const material = new THREE.MeshPhysicalMaterial({
    map,
    alphaMap,
    normalMap,
    roughnessMap,
    color,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.55,
    depthWrite: true,
    depthTest: true,
    transparent: false,
    opacity: 1,
    blending: THREE.NormalBlending,
  });

  material.userData[ENHANCED_FLAG] = true;
  material.needsUpdate = true;
  return material;
}

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

function applySkinMaterial(
  material: THREE.MeshStandardMaterial,
  role: "eye" | "teeth" | "head",
) {
  if (!material.emissive) material.emissive = new THREE.Color(0x000000);

  if (role === "eye") {
    material.map = null;
    material.alphaMap = null;
    material.color.setHex(0x2563eb);
    material.emissive.setHex(0x1e3a8a);
    material.emissiveIntensity = 0.06;
    material.roughness = 0.35;
    material.metalness = 0.02;
    material.transparent = false;
    material.alphaTest = 0;
    material.opacity = 1;
    material.depthWrite = true;
    material.blending = THREE.NormalBlending;
    material.envMapIntensity = 0.4;
    material.needsUpdate = true;
    return;
  }

  if (role === "teeth") {
    material.map = null;
    material.alphaMap = null;
    material.color.setHex(0xf8f4ee);
    material.roughness = 0.4;
    material.metalness = 0;
    material.transparent = false;
    material.needsUpdate = true;
    return;
  }

  material.map = createProceduralSkinTexture();
  material.color.setHex(SKIN_COLOR);
  material.metalness = 0.02;
  material.roughness = 0.56;
  material.envMapIntensity = 0.85;
  material.transparent = false;
  material.alphaTest = 0;
  material.opacity = 1;
  material.depthWrite = true;
  material.blending = THREE.NormalBlending;
  material.needsUpdate = true;
}

function replaceMaterial(
  mesh: THREE.Mesh,
  index: number,
  material: THREE.Material,
  materials: THREE.Material | THREE.Material[],
) {
  if (Array.isArray(materials)) {
    materials[index] = material;
    mesh.material = materials;
  } else {
    mesh.material = material;
  }
}

function upgradeMaterial(
  mesh: THREE.Mesh,
  src: THREE.Material,
  index: number,
  materials: THREE.Material | THREE.Material[],
) {
  if (!src || src.userData?.[ENHANCED_FLAG]) return;

  const standardLike = asStandardLike(src);
  if (!standardLike) return;

  mesh.renderOrder = 0;

  const appearanceRole = detectAppearanceRole(mesh, src);
  if (appearanceRole === "hair") {
    replaceMaterial(mesh, index, createHairMaterial(standardLike), materials);
    return;
  }
  if (appearanceRole === "brow") {
    replaceMaterial(mesh, index, createBrowMaterial(standardLike), materials);
    return;
  }
  if (appearanceRole === "lip") {
    replaceMaterial(mesh, index, createLipMaterial(standardLike), materials);
    return;
  }

  const role = getMeshRole(mesh);
  const upgraded = standardLike.clone();
  applySkinMaterial(upgraded, role);
  upgraded.userData[ENHANCED_FLAG] = true;
  replaceMaterial(mesh, index, upgraded, materials);
}

/** Traverse GLB scene — alpha-clipped hair/brows, lip PBR, skin/eye/teeth fallback. */
export function enhanceGuideMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;
    child.renderOrder = 0;

    const materials = child.material;
    if (!materials) return;

    if (Array.isArray(materials)) {
      materials.forEach((src, index) => {
        if (src) upgradeMaterial(child, src, index, materials);
      });
    } else {
      upgradeMaterial(child, materials, 0, materials);
    }
  });
}
