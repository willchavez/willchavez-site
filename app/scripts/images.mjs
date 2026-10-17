// Resize public/uploads into responsive WebP sizes after `astro build`.
// Includes animated GIFs; originals stay in the repo.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = "public/uploads";
const out = "dist/uploads/w";
const widths = [240, 480, 960, 1600];
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".gif"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

let n = 0;
for (const file of walk(src)) {
  if (!exts.has(path.extname(file).toLowerCase())) continue;
  const rel = path.relative(src, file).replace(/\.[^.]+$/, "");
  for (const w of widths) {
    const dest = path.join(out, String(w), rel + ".webp");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const animated = path.extname(file).toLowerCase() === ".gif";
    const image = animated ? sharp(file, { animated: true }) : sharp(file);
    await image.rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  }
  n++;
}
console.log(`images: resized ${n} upload(s) into ${widths.join("/")}px webp`);
