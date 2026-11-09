// Build and serve first. Optional BASE_URL argument and CHROMIUM_PATH env.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
try {
  for (const width of [320, 375, 900, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/portfolio`);
    await page.evaluate(() => document.fonts.ready);
    const start = await page.locator('.topbar').boundingBox();
    await page.evaluate(() => {
      window.originalBar = document.querySelector('.topbar');
      window.barMoves = [];
      document.addEventListener('astro:after-swap', () => {
        const animation = window.originalBar.getAnimations().find(a => a.effect.getKeyframes().some(f => f.transform));
        window.barMoves.push(animation ? animation.effect.getKeyframes() : null);
      });
    });
    await page.locator('.project-open').first().click();
    await page.waitForURL(/\/portfolio\/genui-bebop/);
    await page.waitForFunction(() => document.querySelector('.topbar').getAnimations().every(a => a.playState === 'finished'));
    const centered = await page.locator('.topbar').boundingBox();
    const body = await page.locator('body').boundingBox();
    assert(Math.abs(centered.x + centered.width / 2 - (body.x + body.width / 2)) < 1, `centered at ${width}`);
    assert(await page.evaluate(() => window.originalBar === document.querySelector('.topbar')), 'navigation persists');
    assert(await page.evaluate(() => window.barMoves.at(-1)?.length === 2), 'entry animates');
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'no mobile overflow');
    if (width <= 820) {
      await page.locator('.pill > summary').click();
      const menu = await page.locator('.pill .menu').boundingBox();
      assert(menu.x >= 0 && menu.x + menu.width <= width, 'centered dropdown stays in the viewport');
      await page.keyboard.press('Escape');
    }
    await page.locator('[data-project-back]').click();
    await page.waitForURL(`${base}/portfolio`);
    await page.waitForFunction(() => document.querySelector('.topbar').getAnimations().every(a => a.playState === 'finished'));
    assert(Math.abs((await page.locator('.topbar').boundingBox()).x - start.x) < 1, 'returns to original alignment');
    assert(await page.evaluate(() => window.barMoves.at(-1)?.length === 2), 'exit animates');
    // Reverse the move before it finishes, through browser history.
    await page.locator('.project-open').first().click();
    await page.waitForURL(/\/portfolio\/genui-bebop/);
    await page.goBack();
    await page.waitForURL(`${base}/portfolio`);
    await page.waitForFunction(() => document.querySelector('.topbar').getAnimations().every(a => a.playState === 'finished'));
    assert(Math.abs((await page.locator('.topbar').boundingBox()).x - start.x) < 1, 'interrupted entry settles correctly');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.project-open').first().click();
    await page.waitForURL(/\/portfolio\/genui-bebop/);
    assert.equal(await page.locator('.topbar').evaluate(e => e.getAnimations().length), 0, 'reduced motion skips glide');
    assert.equal(await page.locator('.nav-ink').evaluate(e => e.getAnimations().length), 0, 'reduced motion skips selection animation');
    // Direct visits render in their final position without an entrance slide.
    await page.goto(`${base}/portfolio/icon-scaling-tool`);
    assert.equal(await page.locator('.topbar').getAttribute('data-alignment'), 'center');
    assert.equal(await page.locator('.topbar').evaluate(e => e.getAnimations().length), 0);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Navigation positioning: desktop/mobile entry, return, interrupted history, direct visits, persistence, and reduced motion passed.');
} finally { await browser.close(); }
