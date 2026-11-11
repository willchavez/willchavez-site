import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
const luminance = color => {
  const values = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(n => {
    n /= color.startsWith('color(srgb ') ? 1 : 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
  });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
};
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
async function border(page, selector, mode, hoverSelector = selector) {
  await page.mouse.move(0, 0); await page.waitForTimeout(220);
  const el = page.locator(selector).first();
  const before = await el.evaluate(e => { const s = getComputedStyle(e); return { width: s.borderTopWidth, color: s.borderTopColor }; });
  assert.equal(before.width, '1px', selector);
  await page.locator(hoverSelector).first().hover(); await page.waitForTimeout(220);
  const after = await el.evaluate(e => getComputedStyle(e).borderTopColor);
  assert(mode === 'light' ? luminance(after) < luminance(before.color) : luminance(after) > luminance(before.color), `${mode} hover border: ${selector}`);
}
try {
  for (const mode of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: mode, viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/about');
    const shell = await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor);
    const experience = await page.locator('.work-role').first().evaluate(e => getComputedStyle(e).backgroundColor);
    const picker = page.locator('[data-card-colors-picker]');
    await picker.locator('summary').click();
    const ids = await picker.locator('option').evaluateAll(es => es.map(e => e.value));
    assert.equal(ids.length, 15);
    assert(ids.every(id => id === 'wada-121' || id.startsWith('121-')), 'only 121 studies remain');
    const finishes = new Set(); const fonts = new Set(); const radii = new Set();
    for (const id of ids) {
      await picker.locator('select').selectOption(id);
      assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), shell);
      assert.equal(await page.locator('.work-role').first().evaluate(e => getComputedStyle(e).backgroundColor), experience);
      const cards = await page.locator('.about-cards .about-card').evaluateAll(es => es.map(e => {
        const s = getComputedStyle(e);
        const probe = document.createElement('span'); e.append(probe);
        const colors = ['--ink', '--muted', '--rust'].map(v => { probe.style.color = `var(${v})`; return getComputedStyle(probe).color; });
        probe.remove(); return { surfaces: [s.backgroundColor, ...Array.from(s.backgroundImage.matchAll(/rgb\([^)]*\)/g), m => m[0])], colors, image: s.backgroundImage, font: getComputedStyle(e.querySelector('h2')).fontFamily, radius: s.borderTopLeftRadius };
      }));
      for (const card of cards) {
        finishes.add(card.image); fonts.add(card.font); radii.add(card.radius);
        for (const surface of card.surfaces) for (const text of card.colors) assert(contrast(surface, text) >= 4.5, `${mode}/${id}: ${surface}/${text} contrast ${contrast(surface, text)}`);
      }
      assert.equal(await picker.locator('[data-card-color-description]').textContent() === '', false);
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    }
    assert(finishes.size >= 10, 'studies include distinct surface finishes');
    assert(fonts.size >= 4, 'studies vary title typography');
    assert(radii.size >= 8, 'corner shapes change with the studies');
    await picker.locator('select').selectOption('wada-121');
    await page.keyboard.press('Escape'); assert.equal(await picker.getAttribute('open'), null);
    const about = page.locator('.about-cards .about-card').first();
    await page.mouse.move(0, 0); await page.waitForTimeout(220);
    const aboutBorder = await about.evaluate(e => getComputedStyle(e).borderTopColor);
    await about.hover(); await page.waitForTimeout(220);
    assert.equal(await about.evaluate(e => getComputedStyle(e).borderTopColor), aboutBorder, 'About is not a card link; its border stays static');
    await about.locator('a').first().focus();
    assert.equal(await about.evaluate(e => getComputedStyle(e).borderTopColor), aboutBorder, 'inline link focus does not highlight the card');
    await page.reload(); assert.equal(await page.locator('html').getAttribute('data-card-palette'), 'wada-121');
    await page.locator('.desktop-nav a[href$="/enjoying"]').click(); await page.waitForURL('**/enjoying'); await page.waitForTimeout(350);
    assert.equal(await page.locator('html').getAttribute('data-card-palette'), 'wada-121');
    assert(await page.locator('[data-card-colors-picker]').isVisible());
    const gridPicker = page.locator('[data-card-colors-picker]');
    await gridPicker.locator('summary').click();
    for (const id of ids) {
      await gridPicker.locator('select').selectOption(id);
      await page.waitForTimeout(180);
      assert(!await page.locator('#list .ent:not([hidden])').evaluateAll(es => {
        const rs = es.map(e => e.getBoundingClientRect());
        return rs.some((a, i) => rs.some((b, j) => i < j && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2));
      }), `${id}: typography changes reflow masonry without overlaps`);
    }
    await gridPicker.locator('[data-card-color-next]').click();
    assert.equal(await gridPicker.locator('select').inputValue(), ids[0], 'Next wraps to the first study');
    await gridPicker.locator('[data-card-color-prev]').click();
    assert.equal(await gridPicker.locator('select').inputValue(), ids.at(-1), 'Previous wraps to the last study');
    await page.keyboard.press('Escape');
    await border(page, '#list .ent', mode);
    await page.getByRole('button', { name: 'List view', exact: true }).click();
    assert(!await page.locator('[data-card-colors-picker]').isVisible());
    assert.equal(await page.locator('#list .ent').first().evaluate(e => getComputedStyle(e).backgroundImage), 'none', 'List has no study texture');
    await border(page, '#list .ent', mode);
    await page.goto(base + '/notes');
    assert.equal(await page.locator('[data-card-colors-picker]').count(), 0);
    await border(page, '.note-list .note-card', mode);
    await page.goto(base + '/portfolio');
    await page.getByRole('button', { name: 'List view', exact: true }).click();
    await border(page, '#portfolio-results .portfolio-card', mode);
    await page.getByRole('button', { name: 'Grid view', exact: true }).click();
    await border(page, '#portfolio-results .project-image', mode, '#portfolio-results .project-open');
    assert.equal(await page.locator('.portfolio-card').first().evaluate(e => getComputedStyle(e).boxShadow), 'none');
    assert.equal(errors.length, 0, errors.join('\n')); await context.close();
  }
  const context = await browser.newContext({ colorScheme: 'light' }); const page = await context.newPage();
  for (const width of [320, 393, 641, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto(base + '/about');
    await page.locator('[data-card-colors-picker] summary').click();
    const rect = await page.locator('.card-color-panel').boundingBox();
    assert(rect.x >= 0 && rect.x + rect.width <= width, `panel fits ${width}`);
    await page.goto(base + '/enjoying');
    assert.equal(await page.locator('[data-card-colors-picker]').isVisible(), width > 640);
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  }
  await context.close(); console.log('15 Wada 121 studies: typography, texture/gradient contrast, scope, persistence, responsive picker, and borders passed.');
} finally { await browser.close(); }
