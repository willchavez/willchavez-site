import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
try {
  const context = await browser.newContext();
  await context.route(/google-analytics\.com|googletagmanager\.com/, r => r.fulfill({ status: 200, body: '' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const videoRequests = [];
  page.on('request', r => { if (r.url().endsWith('.mp4')) videoRequests.push(r.url()); });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, selector] of [
      ['/portfolio/fluent-asset-library', '.project-figure img[src*="emoji-scroll"]'],
      ['/portfolio/fluent-asset-library', '.project-figure img[src*="bug-viewer"]'],
      ['/notes/2025-06-21-making-navigation-feel-like-a-place-to-return', '[data-zoom-ready][src*="navigation-explorations-prototype"]'],
      ['/notes/2026-10-16-synth-lessons', '[data-zoom-ready][src*="synth-lessons-demo"]'],
      ...(width > 800 ? [['/portfolio/fluent-asset-library/present#slide-2', '.slide-media img']] : []),
    ]) {
      console.log(width, route, selector);
      await page.goto(base + route);
      const priorRequests = videoRequests.length;
      const opener = page.locator(selector).first();
      await opener.scrollIntoViewIfNeeded();
      assert.equal(videoRequests.length, priorRequests, 'inline GIFs do not load video copies');
      await opener.click();
      const video = page.locator('dialog video:visible');
      await video.waitFor();
      await page.waitForFunction(() => { const v = document.querySelector('dialog video'); return v && !v.paused && v.currentTime > .1; });
      await page.getByRole('button', { name: 'Pause animation', exact: true }).click();
      const frozen = await video.evaluate(v => v.currentTime);
      await page.waitForTimeout(350);
      assert.equal(await video.evaluate(v => v.currentTime), frozen, 'pause freezes the exact frame');
      assert(await page.locator('dialog[open]').count());
      await page.getByRole('button', { name: 'Resume animation', exact: true }).click();
      await page.waitForFunction(t => document.querySelector('dialog video').currentTime > t + .1, frozen);
      await page.keyboard.press('Space');
      assert(await video.evaluate(v => v.paused), 'Space pauses');
      await page.keyboard.press('Space');
      await page.waitForFunction(() => !document.querySelector('dialog video').paused);
      const controlBox = await page.locator('.image-viewer-playback').boundingBox();
      const captionBox = await page.locator('dialog figcaption').boundingBox();
      assert(controlBox.y >= captionBox.y + captionBox.height, 'playback control sits below the caption');
      assert(controlBox.y + controlBox.height <= 900, 'playback control remains in the viewport');
      const box = await video.boundingBox();
      assert(box.width <= width && box.height < 900);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(), 0);
      assert.equal(await page.locator('dialog video').getAttribute('src'), null);
      assert(await opener.evaluate(e => document.activeElement === e));
      if (route.includes('/present')) {
        await page.locator('.deck-exit').click();
        await page.waitForURL(base + '/portfolio/fluent-asset-library');
      }
    }
  }
  await page.goto(base + '/portfolio/fluent-asset-library');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.project-figure').last().scrollIntoViewIfNeeded();
  await page.locator('.project-figure img[src*="bug-viewer"]').evaluate(i => i.decode());
  await page.locator('.project-figure img[src*="bug-viewer"]').click();
  await page.getByRole('button', { name: 'Resume animation', exact: true }).waitFor();
  assert(await page.locator('dialog video').evaluate(v => v.paused));
  await page.getByRole('button', { name: 'Close enlarged image' }).click();
  await page.locator('.project-figure').filter({has:page.locator('img[src*="original"]')}).scrollIntoViewIfNeeded();
  await page.locator('.project-figure img[src*="original"]').evaluate(i => i.decode());
  await page.locator('.project-figure img[src*="original"]').click();
  await page.locator('dialog img:visible').evaluate(i => i.decode());
  assert.equal(await page.locator('.image-viewer-playback:visible').count(), 0);
  await page.locator('dialog img').click();
  // A failed playback asset retains the original zoomed animation.
  await page.route('**/*.mp4', r => r.abort());
  await page.locator('.project-figure').last().scrollIntoViewIfNeeded();
  await page.locator('.project-figure img[src*="bug-viewer"]').evaluate(i => i.decode());
  await page.locator('.project-figure img[src*="bug-viewer"]').click();
  await page.waitForFunction(() => document.querySelector('dialog video').error !== null);
  assert(await page.locator('dialog img').isVisible());
  assert.equal(await page.locator('.image-viewer-playback:visible').count(), 0);
  await page.keyboard.press('Escape');
  await page.goto(base + '/portfolio');
  assert.equal(await page.locator('[data-zoom-ready]').count(), 0, 'thumbnails stay excluded');
  assert.deepEqual(errors, []);
  console.log('Animation viewer passed: optimized WebP and original GIF, exact pause/resume, keyboard, mobile, presentation, focus/cleanup, reduced motion, static images, network fallback, and thumbnail exclusion.');
} finally { await browser.close(); }
