// Production card refinements must preserve the original light/dark palettes.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4323').replace(/\/$/, '');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
const brightness = value => value.match(/[\d.]+/g).slice(0, 3).map(Number).reduce((sum, n, i) => sum + n * (value.startsWith('color(srgb') ? 255 : 1) * [.2126, .7152, .0722][i], 0);
try {
  for (const mode of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: mode, viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    for (const [route, selector, hoverSelector, view] of [
      ['/notes', '.note-card', '.note-card'],
      ['/portfolio', '.project-image', '.project-open', 'Grid view'],
      ['/portfolio', '.portfolio-card', '.portfolio-card', 'List view'],
      ['/enjoying', '#list .ent', '#list .ent', 'Grid view'],
      ['/enjoying', '#list .ent', '#list .ent', 'List view'],
      ['/about', '.about-cards .about-card', '.about-cards .about-card'],
    ]) {
      await page.goto(base + route);
      if (view) await page.getByRole('button', { name: view, exact: true }).click();
      await page.mouse.move(0, 0); await page.waitForTimeout(250);
      assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), mode === 'light' ? 'rgb(247, 245, 242)' : 'rgb(23, 20, 17)');
      assert.equal(await page.locator('[data-card-colors-picker], [data-palette-picker], feTurbulence, #card-refraction').count(), 0);
      const card = page.locator(selector).first();
      const styles = await card.evaluate(e => {const s=getComputedStyle(e);return { width:s.borderTopWidth, color:s.borderTopColor, image:s.backgroundImage, backdrop:getComputedStyle(e,'::before').backdropFilter };});
      assert.equal(styles.width, '1px', `${route} ${view}`);
      assert.equal(styles.image, 'none');
      assert.equal(styles.backdrop, 'none');
      await page.locator(hoverSelector).first().hover(); await page.waitForTimeout(250);
      const hover = await card.evaluate(e => getComputedStyle(e).borderTopColor);
      if (route === '/about') assert.equal(hover, styles.color, 'non-link About border stays static');
      else {
        assert(mode === 'light' ? brightness(hover) < brightness(styles.color) : brightness(hover) > brightness(styles.color), `${route} ${view}: border responds to mode`);
        await page.mouse.move(0, 0);
        await page.keyboard.press('Tab');
        const link = page.locator(hoverSelector).first();
        await (await link.evaluate(e => e.matches('a')) ? link : link.locator('a:visible').first()).focus();
        await page.waitForTimeout(250);
        assert.equal(await card.evaluate(e => getComputedStyle(e).borderTopColor), hover, `${route} ${view}: keyboard focus receives the same border`);
      }
    }
    assert.deepEqual(errors, []);
    await page.goto(base + '/');
    assert.equal(await page.locator('.home-enjoying').first().getAttribute('href'), '/enjoying/strange-love-wild-pink');
    if (mode === 'light') {
      await page.goto(base + '/notes'); await page.screenshot({path:'/tmp/promoted-notes.png'});
    }
    await context.close();
  }
  console.log('Card borders: light/dark hover and keyboard focus, static About, original theme, no experimental surfaces, and Ratboys preserved.');
} finally { await browser.close(); }
