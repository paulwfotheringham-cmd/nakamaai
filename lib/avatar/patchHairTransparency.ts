import * as THREE from "three";

const HAIR_KEYWORDS = ["hair", "brow", "lash", "eyebrow", "fringe"];

function matchesHairLike(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  return HAIR_KEYWORDS.some((keyword) => n.includes(keyword));
}

function collectNames(obj: THREE.Object3D, material: THREE.Material): string[] {
  const names: string[] = [];
  if (obj.name) names.push(obj.name);
  if (material.name) names.push(material.name);
  let current = obj.parent;
  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }
  return names;
}

function isHairLike(obj: THREE.Object3D, material: THREE.Material): boolean {
  return collectNames(obj, material).some((name) => matchesHairLike(name));
}

/** Patch transparency on existing GLB materials — no replacements, no new materials. */
function patchMaterialInPlace(material: THREE.Material) {
  const m = material as THREE.MeshStandardMaterial;

  m.transparent = true;
  m.alphaTest = 0.35;
  m.depthWrite = true;
  m.depthTest = true;
  m.side = THREE.DoubleSide;
  m.opacity = 1;
  m.blending = THREE.NormalBlending;
  m.premultipliedAlpha = false;
  m.needsUpdate = true;
}

/**
 * Minimal hair/brow/lash fix: alpha-clipped transparency on matched meshes only.
 * All other materials (skin, lips, eyes) are left exactly as exported.
 */
export function patchHairTransparency(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];

    for (const material of materials) {
      if (!material || !isHairLike(obj, material)) continue;

      console.log("PATCHING HAIR:", obj.name, material.name);
      patchMaterialInPlace(material);
      obj.renderOrder = 0;
    }
  });
}
