import fs from "fs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const models = ["/LeePerrySmith.glb", "/scenes/avatar.glb", "/models/heads/male-guide.glb"];

async function inspect(url) {
  const path = "public" + url;
  const buf = fs.readFileSync(path.slice(1).replace(/^\//, "public/"));
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(buf.buffer, "", (gltf) => {
      const info = [];
      gltf.scene.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          const dict = c.morphTargetDictionary;
          const inf = c.morphTargetInfluences;
          info.push({
            name: c.name,
            morphCount: dict ? Object.keys(dict).length : 0,
            keys: dict ? Object.keys(dict).slice(0, 15) : [],
            hasInfluences: !!inf,
          });
        }
      });
      resolve({ url, meshes: info });
    }, reject);
  });
}

for (const m of ["public/LeePerrySmith.glb", "public/scenes/avatar.glb"]) {
  try {
    const buf = fs.readFileSync(m);
    const loader = new GLTFLoader();
    await new Promise((resolve, reject) => {
      loader.parse(buf.buffer, "", (gltf) => {
        console.log("\n===", m, "===");
        gltf.scene.traverse((c) => {
          if (c.isMesh) {
            const d = c.morphTargetDictionary;
            console.log(
              " mesh:",
              c.name || "(unnamed)",
              "morphs:",
              d ? Object.keys(d).length : 0,
              d ? Object.keys(d).join(", ") : "none",
            );
          }
        });
        resolve();
      }, reject);
    });
  } catch (e) {
    console.log(m, "ERR", e.message);
  }
}
