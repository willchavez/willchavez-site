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
let skipped = 0;
for (const file of walk(src)) {
  if (!exts.has(path.extname(file).toLowerCase())) continue;
  const rel = path.relative(src, file).replace(/\.[^.]+$/, "");
  try {
    for (const w of widths) {
      const dest = path.join(out, String(w), rel + ".webp");
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const animated = path.extname(file).toLowerCase() === ".gif";
      // Some original portfolio uploads exceed Sharp's conservative default
      // pixel ceiling. These are trusted local assets that we immediately
      // downsample, so allow Sharp to decode them for the responsive output.
      const image = animated
        ? sharp(file, { animated: true, limitInputPixels: false })
        : sharp(file, { limitInputPixels: false });
      await image.rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
    }
    n++;
  } catch (error) {
    // Keep the original available as a fallback rather than failing the entire
    // site build on an unusually large or unsupported upload.
    skipped++;
    for (const w of widths) {
      const partial = path.join(out, String(w), rel + ".webp");
      if (fs.existsSync(partial)) fs.unlinkSync(partial);
    }
    console.warn(`images: skipped ${file}: ${error.message}`);
  }
}
console.log(`images: resized ${n} upload(s) into ${widths.join("/")}px webp`);
if (skipped) console.warn(`images: skipped ${skipped} upload(s); originals remain available`);
