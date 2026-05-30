import fs from "fs";
import path from "path";

const roots = ["src/app/live-test", "src/app", "components"];

const replacements = [
  [/type-micro/g, "type-label"],
  [/font-serif text-3xl font-semibold[^\n]*/g, "type-hero"],
  [/font-serif text-4xl[^\n]*/g, "type-hero"],
  [/font-serif text-2xl font-semibold leading-tight/g, "type-card-title"],
  [/font-serif text-base font-semibold leading-tight/g, "type-section-heading"],
  [/font-display text-card font-medium/g, "type-card-title"],
  [/font-display text-section font-medium/g, "type-hero"],
  [/text-lg font-semibold/g, "type-section-heading"],
  [/text-sm font-semibold/g, "type-section-heading"],
  [/text-xs font-semibold/g, "type-label"],
  [/text-\[10px\] font-semibold uppercase tracking[^\s]*/g, "type-label"],
  [/text-\[11px\] font-semibold uppercase tracking[^\s]*/g, "type-label"],
  [/text-\[9px\] font-semibold uppercase tracking[^\s]*/g, "type-label"],
  [/font-bold/g, "font-medium"],
  [/bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300\/90 bg-clip-text text-transparent/g, "text-luxury-primary"],
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out);
    } else if (/\.tsx$/.test(name)) out.push(p);
  }
  return out;
}

let n = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    if (file.includes("LiveTestDashboardHome")) continue;
    let text = fs.readFileSync(file, "utf8");
    const before = text;
    for (const [from, to] of replacements) {
      text = text.replace(from, to);
    }
    if (text !== before) {
      fs.writeFileSync(file, text, "utf8");
      n++;
      console.log(file);
    }
  }
}
console.log(`Updated ${n} files`);
