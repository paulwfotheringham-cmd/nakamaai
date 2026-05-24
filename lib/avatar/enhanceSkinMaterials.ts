import * as THREE from "three";
import { getMeshRole } from "./headMetrics";

/** Fair caucasian skin — warm, visible under studio lighting. */
export const SKIN_COLOR = 0xddb896;

let cachedHeadTexture: THREE.CanvasTexture | null = null;

function paintLipsOnTexture(ctx: CanvasRenderingContext2D, mesh: THREE.Mesh, size: number) {
  const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute | undefined;
  const pos = mesh.geometry.attributes.position as THREE.BufferAttribute | undefined;
  if (!uv || !pos) return;

  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) return;

  const sz = box.getSize(new THREE.Vector3());
  if (sz.x <= 0 || sz.y <= 0 || sz.z <= 0) return;

  const mouthUVs: Array<{ u: number; v: number }> = [];

  for (let i = 0; i < pos.count; i++) {
    const nx = (pos.getX(i) - box.min.x) / sz.x;
    const ny = (pos.getY(i) - box.min.y) / sz.y;
    const nz = (pos.getZ(i) - box.min.z) / sz.z;

    const isMouth =
      nx > 0.32 &&
      nx < 0.68 &&
      ny > 0.16 &&
      ny < 0.52 &&
      nz > 0.42;

    if (isMouth) mouthUVs.push({ u: uv.getX(i), v: uv.getY(i) });
  }

  if (mouthUVs.length === 0) return;

  let minU = 1;
  let maxU = 0;
  let minV = 1;
  let maxV = 0;
  for (const p of mouthUVs) {
    minU = Math.min(minU, p.u);
    maxU = Math.max(maxU, p.u);
    minV = Math.min(minV, p.v);
    maxV = Math.max(maxV, p.v);
  }

  const pad = 0.025;
  minU -= pad;
  maxU += pad;
  minV -= pad;
  maxV += pad;

  const cx = ((minU + maxU) / 2) * size;
  const cy = (1 - (minV + maxV) / 2) * size;
  const rx = ((maxU - minU) / 2) * size * 1.2;
  const ry = ((maxV - minV) / 2) * size * 1.25;

  ctx.save();
  ctx.filter = "blur(4px)";
  ctx.fillStyle = "#c85a6a";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#de6e7e";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.92, ry * 0.88, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ea8894";
  ctx.beginPath();
  ctx.ellipse(cx, cy - ry * 0.12, rx * 0.72, ry * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d15565";
  for (const p of mouthUVs) {
    ctx.beginPath();
    ctx.arc(p.u * size, (1 - p.v) * size, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createHeadSkinTexture(headMesh: THREE.Mesh): THREE.CanvasTexture {
  if (cachedHeadTexture) return cachedHeadTexture;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cachedHeadTexture = new THREE.CanvasTexture(canvas);
    return cachedHeadTexture;
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

  paintLipsOnTexture(ctx, headMesh, size);

  cachedHeadTexture = new THREE.CanvasTexture(canvas);
  cachedHeadTexture.colorSpace = THREE.SRGBColorSpace;
  cachedHeadTexture.wrapS = THREE.ClampToEdgeWrapping;
  cachedHeadTexture.wrapT = THREE.ClampToEdgeWrapping;
  return cachedHeadTexture;
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

  material.map = createHeadSkinTexture(mesh);
  material.vertexColors = false;
  material.color.setHex(0xffffff);
  material.metalness = 0.02;
  material.roughness = 0.56;
  material.envMapIntensity = 0.85;
  mesh.renderOrder = 0;
  material.needsUpdate = true;
}

export function enhanceSkinMaterials(root: THREE.Object3D) {
  cachedHeadTexture = null;

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
