// Video copies give enlarged animations real pause/resume across browsers.
// Inline images stay animated WebP/GIF; videos load only inside the viewer.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import sharp from 'sharp';
const exec = promisify(execFile);
const version = createHash('sha256').update(await fs.readFile(fileURLToPath(import.meta.url))).update(JSON.stringify(sharp.versions)).digest('hex');
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
export async function buildAnimations(root = process.cwd()) {
  const manifest = {};
  const cache = path.join(root, '.cache/responsive-images/animations');
  const output = path.join(root, 'dist/animation-media');
  const files = [...await walk(path.join(root, 'public')), ...await walk(path.join(root, 'public/img/portfolio'))];
  // public/img/portfolio is a symlink, so explicitly walk it above.
  for (const file of new Set(files)) {
    if (!/\.(gif|webp|png)$/i.test(file)) continue;
    const meta = await sharp(file, { animated: true, limitInputPixels: false }).metadata();
    if ((meta.pages ?? 1) < 2) continue;
    const hash = createHash('sha256').update(version).update(await fs.readFile(file)).digest('hex').slice(0, 24);
    const cached = path.join(cache, `${hash}.mp4`);
    await fs.mkdir(cache, { recursive: true });
    if (!await fs.stat(cached).catch(() => null)) {
      const temp = await fs.mkdtemp(path.join(cache, 'frames-'));
      try {
        // Decode with Sharp so animated WebP and PNG work as well as GIF.
        const { data, info } = await sharp(file, { animated: true, limitInputPixels: false })
          .resize({ width: 1600, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        const height = info.pageHeight ?? info.height / meta.pages;
        const bytes = info.width * height * 4;
        const concat = [];
        for (let frame = 0; frame < meta.pages; frame++) {
          const name = `${String(frame).padStart(5, '0')}.png`;
          await sharp(data.subarray(frame * bytes, (frame + 1) * bytes), { raw: { width: info.width, height, channels: 4 } })
            .flatten({ background: '#fff' }).png().toFile(path.join(temp, name));
          concat.push(`file '${name}'\noption framerate 100\nduration ${Math.max(10, meta.delay?.[frame] ?? 100) / 1000}`);
        }
        // Repeat the last frame so the concat demuxer retains its duration.
        concat.push(`file '${String(meta.pages - 1).padStart(5, '0')}.png'\noption framerate 100`);
        await fs.writeFile(path.join(temp, 'frames.txt'), concat.join('\n'));
        await exec('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(temp, 'frames.txt'),
          '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2:color=white', '-fps_mode', 'vfr', '-c:v', 'libx264', '-level:v', '5.1', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(temp, 'video.mp4')]);
        await fs.rename(path.join(temp, 'video.mp4'), cached);
      } finally { await fs.rm(temp, { recursive: true, force: true }); }
    }
    await fs.mkdir(output, { recursive: true });
    await fs.copyFile(cached, path.join(output, `${hash}.mp4`));
    const relative = path.relative(path.join(root, 'public'), file).split(path.sep).join('/');
    const url = `/animation-media/${hash}.mp4`;
    manifest[`/${relative}`] = url;
    const name = relative.replace(/\.[^.]+$/, '');
    if (relative.startsWith('img/portfolio/')) {
      for (const width of [480, 960, 1600]) manifest[`/portfolio-media/w/${width}/${name.slice('img/portfolio/'.length)}.webp`] = url;
    } else if (relative.startsWith('uploads/')) {
      for (const width of [240, 480, 960, 1600]) manifest[`/uploads/w/${width}/${name.slice('uploads/'.length)}.webp`] = url;
    }
  }
  await fs.mkdir(path.join(root, 'dist'), { recursive: true });
  await fs.writeFile(path.join(root, 'dist/animation-media.json'), JSON.stringify(manifest));
  console.log(`animations: ${new Set(Object.values(manifest)).size} playable animation(s)`);
  return manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildAnimations();
