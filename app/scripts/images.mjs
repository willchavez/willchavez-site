// Resize public uploads and portfolio assets into responsive WebP sizes after
// `astro build`. Includes animated GIFs; originals stay in the repo.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

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

// Include the implementation and encoder versions so changes to transforms or
// dependencies cannot reuse an old result. Source bytes handle same-name edits.
const transformVersion = createHash("sha256")
  .update(fs.readFileSync(fileURLToPath(import.meta.url)))
  .update(JSON.stringify(sharp.versions))
  .digest("hex");

export async function buildImages(root = process.cwd()) {
  const cache = path.join(root, ".cache/responsive-images");
  let resized = 0;
  let reused = 0;
  let skipped = 0;
  async function processImages(directory, output, sizes) {
    for (const file of walk(path.join(root, directory))) {
      if (!exts.has(path.extname(file).toLowerCase())) continue;
      const rel = path.relative(path.join(root, directory), file).replace(/\.[^.]+$/, "");
      const destinations = sizes.map((w) => path.join(root, output, String(w), rel + ".webp"));
      try {
        const animated = path.extname(file).toLowerCase() === ".gif";
        const key = createHash("sha256")
          .update(transformVersion)
          .update(JSON.stringify({ sizes, animated }))
          .update(fs.readFileSync(file))
          .digest("hex");
        const cached = sizes.map((w) => path.join(cache, key, `${w}.webp`));
        const hit = cached.every((p) => fs.existsSync(p));
        for (let i = 0; i < sizes.length; i++) {
          if (!fs.existsSync(cached[i])) {
            fs.mkdirSync(path.dirname(cached[i]), { recursive: true });
            const temp = `${cached[i]}.tmp-${process.pid}`;
            try {
              // Trusted uploads can exceed Sharp's pixel ceiling. Preserve
              // animation and the existing quality/size settings.
              const image = sharp(file, { animated, limitInputPixels: false });
              await image.rotate().resize({ width: sizes[i], withoutEnlargement: true }).webp({
                quality: 82,
                effort: 5,
                ...(animated && { minSize: true }),
              }).toFile(temp);
              fs.renameSync(temp, cached[i]);
            } finally {
              fs.rmSync(temp, { force: true });
            }
          }
          fs.mkdirSync(path.dirname(destinations[i]), { recursive: true });
          fs.copyFileSync(cached[i], destinations[i]);
        }
        if (hit) reused++;
        else resized++;
      } catch (error) {
        skipped++;
        for (const dest of destinations) fs.rmSync(dest, { force: true });
        console.warn(`images: skipped ${file}: ${error.message}`);
      }
    }
  }
  // Only current source files are copied into Astro's fresh output directory;
  // deleted or renamed images cannot be resurrected by an older cache.
  await processImages(src, out, widths);
  await processImages(portfolioSrc, portfolioOut, portfolioWidths);
  console.log(`images: resized ${resized}, reused ${reused} image(s) from cache`);
  if (skipped) console.warn(`images: skipped ${skipped} upload(s); originals remain available`);
  return { resized, reused, skipped };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildImages();
}
