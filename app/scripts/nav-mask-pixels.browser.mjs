// Check actual painted frames while navigating; never pause/seek animations.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const cpuRate = Number(process.env.NAV_CPU_RATE || 4);
assert(Number.isFinite(cpuRate) && cpuRate >= 1, 'NAV_CPU_RATE must be at least 1');
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  await page.goto(`${base}/portfolio`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const nav = await page.locator('.desktop-nav').boundingBox();
  const colors = await page.evaluate(() => {
    const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
    return { fill: rgb(getComputedStyle(document.querySelector('.nav-ink')).backgroundColor), light: rgb(getComputedStyle(document.querySelector('.nav-ink span')).color), dark: rgb(getComputedStyle(document.querySelector('.nav-label')).color) };
  });
  // Old implementations used a separate background element.
  if (colors.fill.every(c => c === 0)) colors.fill = await page.locator('.nav-selection').evaluate(e => getComputedStyle(e).backgroundColor.match(/[\d.]+/g).slice(0, 3).map(Number));
  const session = await page.context().newCDPSession(page);
  const frames = [];
  session.on('Page.screencastFrame', frame => {
    frames.push(Buffer.from(frame.data, 'base64'));
    void session.send('Page.screencastFrameAck', { sessionId: frame.sessionId });
  });
  await session.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
  await session.send('Page.startScreencast', { format: 'png', maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  for (const [label, route] of [['Home', '/'], ['Projects', '/portfolio'], ['Home', '/'], ['Notes', '/notes'], ['Enjoying', '/enjoying'], ['Projects', '/portfolio'], ['Home', '/']]) {
    await page.locator('.desktop-nav a').filter({ hasText: label }).click();
    await page.waitForURL(`${base}${route}`);
    await page.waitForTimeout(85);
  }
  await page.waitForTimeout(600);
  await session.send('Page.stopScreencast');
  await session.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  assert(frames.length >= 8, `need actual moving frames; received ${frames.length}`);
  let violations = 0, textPixels = 0;
  const bad = [];
  for (let i = 0; i < frames.length; i++) {
    const meta = await sharp(frames[i]).metadata();
    const scale = meta.width / 1440;
    const { data, info } = await sharp(frames[i]).extract({ left: Math.floor(nav.x * scale), top: Math.floor(nav.y * scale), width: Math.floor(nav.width * scale), height: Math.floor(nav.height * scale) }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const near = (x, y, color, tolerance) => color.every((c, channel) => Math.abs(data[(y * info.width + x) * info.channels + channel] - c) <= tolerance);
    // Recover the capsule from its painted background across the whole frame.
    // Per-row bounds are unreliable where a white glyph covers a curved edge.
    let left = info.width, right = -1, top = info.height, bottom = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      if (near(x, y, colors.fill, 3)) {
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
    assert(right >= left, 'captured frame includes the painted pill');
    const radius = (bottom - top + 1) / 2;
    const centerY = top + radius;
    let whiteOutside = 0, blackInside = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const dx = Math.max(left + radius - (x + .5), 0, x + .5 - (right + 1 - radius));
      const distance = Math.hypot(dx, y + .5 - centerY) - radius;
      // Allow two raster pixels for fractional edges and antialiasing.
      if (near(x, y, colors.light, 1)) { textPixels++; if (distance > 2) whiteOutside++; }
      if (distance < -2 && near(x, y, colors.dark, 3)) blackInside++;
    }
    if (whiteOutside || blackInside) {
      violations += whiteOutside + blackInside;
      bad.push({ frame: i, whiteOutside, blackInside });
      if (process.env.NAV_SCREENSHOTS_DIR) {
        await mkdir(process.env.NAV_SCREENSHOTS_DIR, { recursive: true });
        await sharp(data, { raw: info }).png().toFile(path.join(process.env.NAV_SCREENSHOTS_DIR, `mask-frame-${i}.png`));
      }
    }
  }
  console.log(JSON.stringify({ cpuRate, frames: frames.length, lightTextPixelsChecked: textPixels, badFrames: bad }));
  assert(textPixels > 100, 'capture includes contrasting label pixels');
  assert.equal(violations, 0, 'rendered text must never be light outside the brown pill or dark inside it');
  console.log(`Live paint mask: uninterrupted animation and interrupted clicks passed with ${cpuRate}× CPU throttling.`);
} finally { await browser.close(); }
