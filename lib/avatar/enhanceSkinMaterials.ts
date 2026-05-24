import * as THREE from "three";

/** Natural fair skin fallback when diffuse maps fail to load. */
const SKIN_TONE = 0xe8c4a8;

export function enhanceSkinMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      if (!(material instanceof THREE.MeshStandardMaterial)) continue;

      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
        material.map.anisotropy = 4;
      }
      if (material.normalMap) {
        material.normalMap.colorSpace = THREE.NoColorSpace;
      }

      material.metalness = 0.02;
      material.roughness = THREE.MathUtils.clamp(material.roughness || 0.45, 0.38, 0.62);
      material.envMapIntensity = 0.9;

      if (!material.map) {
        material.color.setHex(SKIN_TONE);
      }

      material.needsUpdate = true;
    }
  });
}
