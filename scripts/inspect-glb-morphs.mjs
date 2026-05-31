import fs from "fs";

const paths = [
  "public/LeePerrySmith.glb",
  "public/models/heads/male-guide.glb",
  "public/models/heads/male-guide-backup.glb",
  "public/scenes/avatar.glb",
];

for (const p of paths) {
  const b = fs.readFileSync(p);
  const t = b.toString("latin1");
  const names = [...t.matchAll(/"([^"\\]{2,50})"/g)].map((m) => m[1]);
  const morphLike = [...new Set(names.filter((s) => /mouth|jaw|eye|brow|viseme|lip|smile|blink|arkit/i.test(s)))];
  console.log(p, "bytes:", b.length);
  console.log("  morph-like:", morphLike.slice(0, 40).join(", ") || "(none found in strings)");
  if (p.includes("male-guide.glb") && !p.includes("backup")) {
    const all = [...new Set(names.filter((s) => /^[a-zA-Z][a-zA-Z0-9_]+$/.test(s) && s.length < 35))];
    const arkit = all.filter((s) =>
      /^(brow|eye|jaw|mouth|cheek|nose|tongue)/.test(s),
    );
    console.log("  ARKit count:", arkit.length);
    console.log(arkit.join("\n"));
  }
}
