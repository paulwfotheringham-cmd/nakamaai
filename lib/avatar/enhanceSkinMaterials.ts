import * as THREE from "three";
import { findHeadMesh, getMeshRole } from "./headMetrics";

/** Fair caucasian skin — warm, visible under studio lighting. */
export const SKIN_COLOR = 0xddb896;

let cachedHeadTexture: THREE.CanvasTexture | null = null;

type UvPoint = { u: number; v: number };

function collectBrowUvPoints(mesh: THREE.Mesh, side: "left" | "right"): UvPoint[] {
  const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute | undefined;
  const pos = mesh.geometry.attributes.position as THREE.BufferAttribute | undefined;
  if (!uv || !pos) return [];

  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) return [];

  const size = box.getSize(new THREE.Vector3());
  if (size.x <= 0 || size.y <= 0 || size.z <= 0) return [];

  const points: UvPoint[] = [];

  for (let i = 0; i < pos.count; i++) {
    const nx = (pos.getX(i) - box.min.x) / size.x;
    const ny = (pos.getY(i) - box.min.y) / size.y;
    const nz = (pos.getZ(i) - box.min.z) / size.z;

    const onFront = nz > 0.5;
    const inBrowBand = ny > 0.53 && ny < 0.71;
    const onSide =
      side === "left" ? nx > 0.2 && nx < 0.52 : nx > 0.48 && nx < 0.8;

    if (onFront && inBrowBand && onSide) {
      points.push({ u: uv.getX(i), v: uv.getY(i) });
    }
  }

  return points;
}

function uvBounds(points: UvPoint[]) {
  let minU = 1;
  let maxU = 0;
  let minV = 1;
  let maxV = 0;
  for (const p of points) {
    minU = Math.min(minU, p.u);
    maxU = Math.max(maxU, p.u);
    minV = Math.min(minV, p.v);
    maxV = Math.max(maxV, p.v);
  }
  return { minU, maxU, minV, maxV };
}

/** Brown arched brows painted on the head albedo — part of the skin, never floating. */
function paintEyebrowsOnTexture(ctx: CanvasRenderingContext2D, headMesh: THREE.Mesh, size: number) {
  const sides: Array<{ side: "left" | "right"; fallbackU: number }> = [
    { side: "left", fallbackU: 0.36 },
    { side: "right", fallbackU: 0.64 },
  ];

  for (const { side, fallbackU } of sides) {
    let points = collectBrowUvPoints(headMesh, side);

    if (points.length < 8) {
      const v = 0.61;
      points = Array.from({ length: 16 }, (_, i) => ({
        u: fallbackU + (i / 15 - 0.5) * (side === "left" ? -0.1 : 0.1),
        v: v + Math.sin((i / 15) * Math.PI) * 0.012,
      }));
    }

    const { minU, maxU, minV, maxV } = uvBounds(points);
    const cx = ((minU + maxU) / 2) * size;
    const cy = (1 - (minV + maxV) / 2) * size;
    const span = (maxU - minU) * size;
    const innerX = side === "left" ? maxU * size : minU * size;
    const outerX = side === "left" ? minU * size : maxU * size;
    const archY = cy - span * 0.22;

    ctx.save();

    ctx.strokeStyle = "rgba(58, 40, 24, 0.35)";
    ctx.lineWidth = span * 0.22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(innerX, cy + span * 0.04);
    ctx.quadraticCurveTo(cx, archY, outerX, cy + span * 0.02);
    ctx.stroke();

    ctx.strokeStyle = "#4a3728";
    ctx.lineWidth = span * 0.14;
    ctx.beginPath();
    ctx.moveTo(innerX, cy + span * 0.03);
    ctx.quadraticCurveTo(cx, archY + span * 0.04, outerX, cy + span * 0.01);
    ctx.stroke();

    ctx.strokeStyle = "#5c4030";
    ctx.lineWidth = span * 0.07;
    ctx.beginPath();
    ctx.moveTo(innerX + (side === "left" ? -1 : 1) * span * 0.02, cy);
    ctx.quadraticCurveTo(cx, archY + span * 0.08, outerX, cy);
    ctx.stroke();

    for (let i = 0; i < 14; i++) {
      const t = i / 13;
      const x = innerX + (outerX - innerX) * t;
      const y = cy + span * 0.03 + Math.sin(t * Math.PI) * -span * 0.28;
      const angle = side === "left" ? -0.35 + t * 0.25 : 0.35 - t * 0.25;

      ctx.strokeStyle = i % 3 === 0 ? "#3d2914" : "#4a3728";
      ctx.lineWidth = 0.8 + (1 - Math.abs(t - 0.35)) * 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * span * 0.07, y + Math.sin(angle) * span * 0.04 - 1.5);
      ctx.stroke();
    }

    ctx.restore();
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

  paintEyebrowsOnTexture(ctx, headMesh, size);

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
  headMesh: THREE.Mesh | null,
) {
  if (role === "eye") {
    material.map = null;
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
    material.color.setHex(0xf8f4ee);
    material.roughness = 0.4;
    material.metalness = 0;
    material.needsUpdate = true;
    return;
  }

  if (headMesh) {
    material.map = createHeadSkinTexture(headMesh);
  } else {
    material.map = createHeadSkinTexture(mesh);
  }
  material.color.setHex(SKIN_COLOR);
  material.metalness = 0.02;
  material.roughness = 0.56;
  material.envMapIntensity = 0.85;
  mesh.renderOrder = 0;
  material.needsUpdate = true;
}

export function enhanceSkinMaterials(root: THREE.Object3D) {
  cachedHeadTexture = null;
  const headMesh = findHeadMesh(root);

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const role = getMeshRole(child);
    const src = child.material;
    if (!(src instanceof THREE.MeshStandardMaterial)) return;

    const cloned = src.clone();
    applySkinMaterial(cloned, role, child, headMesh);
    child.material = cloned;
  });
}
