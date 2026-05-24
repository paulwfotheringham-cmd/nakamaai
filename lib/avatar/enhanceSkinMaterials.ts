import * as THREE from "three";
import { getMeshRole } from "./headMetrics";

/** Fair caucasian skin — warm, visible under studio lighting. */
export const SKIN_COLOR = 0xddb896;
/** Natural lip pink — applied on head mesh mouth vertices. */
export const LIP_COLOR = 0xd67682;

let cachedSkinTexture: THREE.CanvasTexture | null = null;

const skinColor = new THREE.Color(SKIN_COLOR);
const lipColor = new THREE.Color(LIP_COLOR);

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

/** Pink lip tint on mouth-region vertices — part of the head mesh, not floating. */
function applyLipVertexColors(mesh: THREE.Mesh) {
  const geo = mesh.geometry;
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (!box) return;

  const size = box.getSize(new THREE.Vector3());
  if (size.x <= 0 || size.y <= 0 || size.z <= 0) return;

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = (v.x - box.min.x) / size.x;
    const ny = (v.y - box.min.y) / size.y;
    const nz = (v.z - box.min.z) / size.z;

    const inLip =
      nx > 0.36 &&
      nx < 0.64 &&
      ny > 0.33 &&
      ny < 0.43 &&
      nz > 0.68;

    const c = inLip ? lipColor : skinColor;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

function applySkinMaterial(
  material: THREE.MeshStandardMaterial,
  role: "eye" | "teeth" | "head",
  mesh: THREE.Mesh,
) {
  if (role === "eye") {
    material.map = null;
    material.vertexColors = false;
    material.color.setHex(0x2563eb);
    material.emissive.setHex(0x1e3a8a);
    material.emissiveIntensity = 0.06;
    material.roughness = 0.35;
    material.metalness = 0.02;
    material.envMapIntensity = 0.4;
    mesh.renderOrder = 1;
    material.needsUpdate = true;
    return;
  }

  if (role === "teeth") {
    material.map = null;
    material.vertexColors = false;
    material.color.setHex(0xf8f4ee);
    material.roughness = 0.4;
    material.metalness = 0;
    material.needsUpdate = true;
    return;
  }

  applyLipVertexColors(mesh);
  material.map = createProceduralSkinTexture();
  material.vertexColors = true;
  material.color.setHex(0xffffff);
  material.metalness = 0.02;
  material.roughness = 0.56;
  material.envMapIntensity = 0.85;
  mesh.renderOrder = 0;
  material.needsUpdate = true;
}

export function enhanceSkinMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const role = getMeshRole(child);
    const src = child.material;
    if (!(src instanceof THREE.MeshStandardMaterial)) return;

    const cloned = src.clone();
    applySkinMaterial(cloned, role, child);
    child.material = cloned;
  });
}
