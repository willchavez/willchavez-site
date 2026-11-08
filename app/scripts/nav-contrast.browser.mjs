// Build and serve the site first. Optional args: BASE_URL; CHROMIUM_PATH env.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }),
  args: ['--no-sandbox'],
});
try {
  for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/portfolio`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      window.navPair = [];
      document.addEventListener('astro:after-swap', () => {
        window.navPair = document.querySelector('.nav-ink').getAnimations();
        window.navPair.forEach(a => { a.pause(); a.currentTime = 0; });
      });
    });
    const check = async (time, animated = true) => {
      const state = await page.evaluate(time => {
        window.navPair.forEach(a => a.currentTime = time);
        const ink = document.querySelector('.nav-ink');
        const rect = e => { const r = e.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; };
        const clip = getComputedStyle(ink).clipPath.split('round')[0].match(/[\d.]+/g).map(Number);
        const [t, r = t, b = t, l = r] = clip;
        const bounds = rect(ink);
        const labels = [...document.querySelectorAll('.nav-label')];
        const copies = [...ink.children];
        return {
          animations: window.navPair.length,
          sharedSurface: document.querySelector('.nav-selection') === ink,
          background: getComputedStyle(ink).backgroundColor,
          target: rect(document.querySelector('.desktop-nav a[aria-current]')),
          mask: { left: bounds.left + l, right: bounds.right - r, top: bounds.top + t, bottom: bounds.bottom - b },
          baseInk: getComputedStyle(document.body).color,
          labels: labels.map((e, i) => ({ text: e.textContent, copy: copies[i].textContent, color: getComputedStyle(e).color, inkColor: getComputedStyle(copies[i]).color, rect: rect(e), inkRect: rect(copies[i]) })),
          hiddenCopy: ink.getAttribute('aria-hidden'),
          pointerEvents: getComputedStyle(ink).pointerEvents,
        };
      }, time);
      if (animated) {
        assert.equal(state.animations, 1, 'one clip animation controls both paint and text');
      }
      assert(state.sharedSurface, 'background and contrasting labels must share one clipped element');
      assert.notEqual(state.background, 'rgba(0, 0, 0, 0)');
      if (time === 360) for (const edge of ['left', 'right', 'top', 'bottom']) assert(Math.abs(state.target[edge] - state.mask[edge]) < .75, `mask reaches selected link ${edge}`);
      for (const label of state.labels) {
        assert.equal(label.text, label.copy);
        assert.equal(label.color, state.baseInk, 'new and previous base labels keep their normal color');
        assert.notEqual(label.inkColor, label.color, 'contrasting text exists in the masked layer');
        for (const edge of ['left', 'right', 'top', 'bottom']) assert(Math.abs(label.rect[edge] - label.inkRect[edge]) < .5, 'duplicate glyphs align');
      }
      assert.equal(state.hiddenCopy, 'true');
      assert.equal(state.pointerEvents, 'none');
      return state;
    };
    await page.locator('.desktop-nav a').filter({ hasText: 'Notes' }).click();
    await page.waitForURL(`${base}/notes`);
    for (const time of [0, 40, 90, 180, 270, 360]) {
      await check(time);
      if (process.env.NAV_SCREENSHOTS_DIR) {
        await mkdir(process.env.NAV_SCREENSHOTS_DIR, { recursive: true });
        await page.locator('.topbar').screenshot({ path: path.join(process.env.NAV_SCREENSHOTS_DIR, `${colorScheme}-${time}.png`) });
      }
    }
    await check(90);
    const interrupted = await check(90);
    await page.locator('.desktop-nav a').filter({ hasText: 'Enjoying' }).click();
    await page.waitForURL(`${base}/enjoying`);
    const resumed = await check(0);
    assert(Math.abs(interrupted.mask.left - resumed.mask.left) < .75, 'interrupted navigation continues from the visible pill');
    await check(150);
    await check(360);
    await page.goBack();
    await page.waitForURL(`${base}/notes`);
    await check(90);
    await check(360);
    await page.waitForTimeout(300); // Let the separate content view transition finish.
    await page.setViewportSize({ width: 900, height: 900 });
    await page.waitForTimeout(100);
    await page.evaluate(() => window.navPair = []);
    await check(0, false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.desktop-nav a').filter({ hasText: 'About' }).click();
    await page.waitForURL(`${base}/about`);
    assert.equal((await check(0, false)).animations, 0, 'reduced motion snaps both layers');
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 375, height: 850 });
    await page.locator('.pill summary').click();
    await page.locator('.pill .menu a').filter({ hasText: 'Enjoying' }).click();
    await page.waitForURL(`${base}/enjoying`);
    assert.equal(await page.locator('.pill summary').innerText(), 'Enjoying');
    assert.deepEqual(errors, []);
    await page.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/notes`);
  const fallback = await page.locator('.desktop-nav [aria-current]').evaluate(e => ({ color: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor }));
  assert.notEqual(fallback.color, fallback.background);
  assert.notEqual(fallback.background, 'rgba(0, 0, 0, 0)');
  console.log('Nav contrast: single painted mask at six animation times, interrupted clicks, history, resize, dark mode, reduced motion, mobile, and JavaScript-free fallback passed.');
} finally {
  await browser.close();
}
