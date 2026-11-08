import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { buildImages } from './images.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'image-cache-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'public/uploads'), { recursive: true });
  await fs.mkdir(path.join(root, 'public/img/portfolio'), { recursive: true });
  return root;
}
async function png(file, background) {
  await sharp({ create: { width: 32, height: 24, channels: 3, background } }).png().toFile(file);
}
async function cleanOutput(root) {
  await fs.rm(path.join(root, 'dist'), { recursive: true, force: true });
}

test('reuse cached output, invalidate edited source, and omit deleted sources', async (t) => {
  const root = await fixture(t);
  const source = path.join(root, 'public/uploads/photo.png');
  await png(source, 'red');
  await png(path.join(root, 'public/img/portfolio/project.png'), 'blue');
  assert.deepEqual(await buildImages(root), { resized: 2, reused: 0, skipped: 0 });
  const output = path.join(root, 'dist/uploads/w/480/photo.webp');
  const original = await fs.readFile(output);
  const expected = await sharp(source).rotate().resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 }).toBuffer();
  assert.deepEqual(original, expected, 'cached encoding preserves the original transform');
  await cleanOutput(root);
  assert.deepEqual(await buildImages(root), { resized: 0, reused: 2, skipped: 0 });
  assert.deepEqual(await fs.readFile(output), original);
  await png(source, 'green');
  await cleanOutput(root);
  assert.deepEqual(await buildImages(root), { resized: 1, reused: 1, skipped: 0 });
  assert.notDeepEqual(await fs.readFile(output), original);
  await fs.unlink(source);
  await cleanOutput(root);
  assert.deepEqual(await buildImages(root), { resized: 0, reused: 1, skipped: 0 });
  await assert.rejects(fs.access(output), { code: 'ENOENT' });
});

test('a partial cache regenerates missing variants', async (t) => {
  const root = await fixture(t);
  await png(path.join(root, 'public/uploads/photo.png'), 'red');
  await buildImages(root);
  const cache = path.join(root, '.cache/responsive-images');
  const [key] = await fs.readdir(cache);
  await fs.unlink(path.join(cache, key, '480.webp'));
  await cleanOutput(root);
  assert.deepEqual(await buildImages(root), { resized: 1, reused: 0, skipped: 0 });
  for (const width of [240, 480, 960, 1600]) {
    assert.equal((await sharp(path.join(root, `dist/uploads/w/${width}/photo.webp`)).metadata()).format, 'webp');
  }
});

test('animated uploads retain every frame on cache misses and hits', async (t) => {
  const root = await fixture(t);
  const pixels = Buffer.from([...Array(12).fill([255, 0, 0]).flat(), ...Array(12).fill([0, 0, 255]).flat()]);
  const source = path.join(root, 'public/uploads/animation.gif');
  await sharp(pixels, { raw: { width: 4, height: 6, channels: 3, pageHeight: 3 } }).gif({ delay: [100, 200], loop: 0 }).toFile(source);
  assert.equal((await sharp(source, { animated: true }).metadata()).pages, 2);
  await buildImages(root);
  const output = path.join(root, 'dist/uploads/w/480/animation.webp');
  const original = await fs.readFile(output);
  assert.equal((await sharp(output, { animated: true }).metadata()).pages, 2);
  await cleanOutput(root);
  assert.deepEqual(await buildImages(root), { resized: 0, reused: 1, skipped: 0 });
  assert.deepEqual(await fs.readFile(output), original);
});
