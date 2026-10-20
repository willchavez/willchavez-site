// Resize public uploads and portfolio assets into responsive WebP sizes after
// `astro build`. Includes animated GIFs; originals stay in the repo.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = "public/uploads";
const out = "dist/uploads/w";
const widths = [240, 480, 960, 1600];
const portfolioSrc = "public/img/portfolio";
// Keep generated files outside public/img/portfolio, which is a symlink to
// the shared source asset directory in the repository root.
const portfolioOut = "dist/portfolio-media/w";
const portfolioWidths = [480, 960, 1600];
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
async function processImages(directory, output, sizes) {
  for (const file of walk(directory)) {
    if (!exts.has(path.extname(file).toLowerCase())) continue;
    const rel = path.relative(directory, file).replace(/\.[^.]+$/, "");
    try {
      for (const w of sizes) {
        const dest = path.join(output, String(w), rel + ".webp");
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const animated = path.extname(file).toLowerCase() === ".gif";
        // Some trusted local uploads exceed Sharp's conservative pixel ceiling;
        // these are immediately downsampled into bounded responsive outputs.
        const image = animated
          ? sharp(file, { animated: true, limitInputPixels: false })
          : sharp(file, { limitInputPixels: false });
        await image.rotate().resize({ width: w, withoutEnlargement: true }).webp({
          quality: 82,
          effort: 5,
          ...(animated && { minSize: true }),
        }).toFile(dest);
      }
      n++;
    } catch (error) {
      skipped++;
      for (const w of sizes) {
        const partial = path.join(output, String(w), rel + ".webp");
        if (fs.existsSync(partial)) fs.unlinkSync(partial);
      }
      console.warn(`images: skipped ${file}: ${error.message}`);
    }
  }
}

await processImages(src, out, widths);
await processImages(portfolioSrc, portfolioOut, portfolioWidths);
console.log(`images: resized ${n} image(s) into responsive WebP variants`);
if (skipped) console.warn(`images: skipped ${skipped} upload(s); originals remain available`);
