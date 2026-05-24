import * as THREE from "three";

export function findHeadMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let headMesh: THREE.Mesh | null = null;

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const morphCount = child.morphTargetDictionary
      ? Object.keys(child.morphTargetDictionary).length
      : 0;
    if (morphCount > 20) headMesh = child;
  });

  if (!headMesh) {
    const named = scene.getObjectByName("head");
    if (named instanceof THREE.Mesh) headMesh = named;
  }

  return headMesh;
}

export function getMeshRole(mesh: THREE.Mesh): "eye" | "teeth" | "head" {
  let obj: THREE.Object3D | null = mesh;
  while (obj) {
    const n = (obj.name || "").toLowerCase();
    if (n.includes("eye")) return "eye";
    if (n.includes("teeth")) return "teeth";
    if (n === "head" || n.includes("head")) return "head";
    obj = obj.parent;
  }

  const morphCount = mesh.morphTargetDictionary
    ? Object.keys(mesh.morphTargetDictionary).length
    : 0;
  if (morphCount > 20) return "head";

  const verts = mesh.geometry.attributes.position?.count ?? 0;
  if (verts > 0 && verts < 900) return "eye";
  if (verts >= 900 && verts < 2000) return "teeth";
  return "head";
}

/** Remove hair/brow overlays from a cached GLB scene (shared across mounts). */
export function stripGuideAppearance(scene: THREE.Object3D) {
  const toRemove: THREE.Object3D[] = [];

  scene.traverse((child) => {
    if (child.name === "guideHair" || child.name === "guideEyebrows") {
      toRemove.push(child);
    }
  });

  for (const obj of toRemove) {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      }
    });
    obj.parent?.remove(obj);
  }
}
