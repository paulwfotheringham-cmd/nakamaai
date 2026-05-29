import fs from "fs";
import path from "path";

const roots = ["src/app", "src/components", "components", "lib"];

const replacements = [
  [/tracking-\[0\.28em\]/g, "tracking-micro"],
  [/tracking-\[0\.24em\]/g, "tracking-micro"],
  [/tracking-\[0\.22em\]/g, "tracking-micro"],
  [/tracking-\[0\.2em\]/g, "tracking-micro"],
  [/tracking-\[0\.18em\]/g, "tracking-micro"],
  [/tracking-\[0\.16em\]/g, "tracking-micro"],
  [/tracking-\[0\.14em\]/g, "tracking-micro"],
  [/tracking-\[0\.12em\]/g, "tracking-micro"],
  [/tracking-\[0\.1em\]/g, "tracking-label"],
  [/font-serif text-5xl font-bold tracking-wide/g, "type-hero font-display font-medium"],
  [/font-serif text-4xl leading-\[1\.08\]/g, "type-section font-display"],
  [/font-serif text-3xl font-semibold tracking-tight/g, "type-section font-display font-medium"],
  [/font-serif text-2xl font-semibold leading-tight/g, "font-display text-card font-medium leading-snug"],
  [/font-serif text-2xl font-semibold/g, "font-display text-card font-medium"],
  [/font-serif text-xl font-semibold/g, "font-display text-card font-medium"],
  [/font-serif text-3xl text-stone-100/g, "font-display text-section text-luxury-primary"],
  [/font-serif text-4xl text-stone-100/g, "font-display text-section text-luxury-primary"],
  [/font-serif text-2xl text-white/g, "font-display text-card text-luxury-primary"],
  [/font-serif text-base font-semibold uppercase tracking-micro/g, "font-display text-card font-medium tracking-label"],
  [/font-serif text-lg font-semibold uppercase tracking-micro/g, "font-display text-card font-medium tracking-label"],
  [/text-\[10px\] font-semibold uppercase tracking-micro/g, "type-micro"],
  [/text-\[11px\] font-semibold uppercase tracking-micro/g, "type-micro"],
  [/text-\[9px\] font-semibold uppercase tracking-micro/g, "type-micro"],
  [/text-sm font-semibold uppercase tracking-wide/g, "text-small font-medium tracking-label"],
  [/text-xs font-semibold uppercase tracking-wide/g, "text-small font-medium tracking-label"],
  [/text-xs font-semibold uppercase tracking-micro/g, "type-micro"],
  [/text-xs font-medium uppercase tracking-micro/g, "type-micro"],
  [/h1 className="[^"]*uppercase[^"]*"/g, (m) => m.replace(/\s*uppercase\s*/g, " ")],
  [/h2 className="[^"]*uppercase[^"]*"/g, (m) => m.replace(/\s*uppercase\s*/g, " ")],
  [/h3 className="[^"]*uppercase[^"]*"/g, (m) => m.replace(/\s*uppercase\s*/g, " ")],
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out);
    } else if (/\.(tsx|ts|jsx|js)$/.test(name)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    let text = fs.readFileSync(file, "utf8");
    const before = text;
    for (const [from, to] of replacements) {
      text = text.replace(from, to);
    }
    if (text !== before) {
      fs.writeFileSync(file, text, "utf8");
      changed++;
      console.log(file);
    }
  }
}
console.log(`Updated ${changed} files`);
