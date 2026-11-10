// Run against a built preview; BROWSER_ENGINE=webkit checks Safari's engine.
import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const engine = process.env.BROWSER_ENGINE === 'webkit' ? webkit : chromium;
const browser = await engine.launch(engine === chromium ? {
  ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'],
} : { ...(process.env.WEBKIT_PATH && { executablePath: process.env.WEBKIT_PATH }) });
const settle = page => page.waitForFunction(() => !document.querySelector('#enjoying-results')?.hasAttribute('data-rearranging'));
async function choose(page, width, kind) {
  if (width <= 820) await page.locator('#kind-menu summary').click();
  await page.locator(`${width <= 820 ? '#kind-menu' : '#kind-tabs'} [data-kind="${kind}"]`).click();
  await page.waitForFunction(k => document.querySelector('#enjoying-results').dataset.kind === k, kind);
}
async function checkResults(page, kind, view) {
  await settle(page);
  assert(await page.locator('#list > .ent:not([data-layout-exit])').evaluateAll((cards, k) => cards.every(card => card.hidden === (k !== 'all' && card.dataset.kind !== k)), kind));
  assert.equal(await page.locator('[data-layout-exit]').count(), 0, 'exit copies are removed');
  assert.equal(await page.locator('#enjoying-results').evaluate(e => e.style.minHeight), '', 'temporary height is released');
  assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'no horizontal overflow');
  await page.mouse.move(1, 1);
  await page.waitForTimeout(200);
  if (view === 'grid') assert(!await page.locator('#list > .ent:visible').evaluateAll(cards => {
    const rects = cards.map(card => card.getBoundingClientRect());
    return rects.some((a, i) => rects.some((b, j) => i < j && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2));
  }), 'settled grid does not overlap');
}
try {
  for (const width of [375, 820, 1440, 1920]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: width === 820 ? 'dark' : 'light' });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/enjoying?view=grid');
    const mobile = width <= 640;
    await page.waitForFunction(() => document.querySelector('#enjoying-results').hasAttribute('data-card-motion'));
    assert.equal(await page.locator('#enjoying-results').getAttribute('data-view'), mobile ? 'list' : 'grid');
    assert.equal(await page.locator('.enjoying-view-toggle').isVisible(), !mobile);
    assert.equal(await page.getByText('Different sizes, one flowing grid.', { exact: true }).count(), 0);
    assert.equal(await page.locator('[data-layout-playground]').count(), 0);
    const toggle = await page.locator('.enjoying-view-toggle').boundingBox();
    const toolbar = await page.locator('.enjoying-toolbar').boundingBox();
    if (!mobile) assert(Math.abs(toggle.x + toggle.width - toolbar.x - toolbar.width) < 1, 'toggle aligns at right of filter toolbar');
    const siteWidth = await page.locator('body').evaluate(e => e.getBoundingClientRect().width);
    for (const view of mobile ? ['list'] : ['grid', 'list']) {
      if (!mobile) await page.locator(`.enjoying-view-toggle [data-layout-choice="${view}"]`).click();
      await settle(page);
      assert.equal(await page.locator(`.enjoying-view-toggle [data-layout-choice="${view}"]`).getAttribute('aria-pressed'), 'true');
      for (const kind of ['film', 'music', 'paper', 'book', 'all']) {
        await choose(page, width, kind);
        if (view === 'grid' && width === 1440 && kind === 'film') {
          // Inspect real in-flight animations, not only the final hidden state.
          assert(await page.locator('#list > .ent').evaluateAll(cards => cards.some(card => card.getAnimations().some(a => a.effect.getKeyframes().some(k => String(k.transform).includes('translate('))))), 'remaining cards travel to new positions');
          assert(await page.locator('[data-layout-exit][aria-hidden="true"]').count() > 0, 'removed cards shrink away');
          assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'motion does not create horizontal overflow');
        }
        await checkResults(page, kind, view);
      }
      // Rapid changes interrupt earlier motion and settle on the last choice.
      for (const kind of ['film', 'music', 'all', 'book', 'film']) await choose(page, width, kind);
      await checkResults(page, 'film', view);
      await page.mouse.move(width / 2, 750);
      for (let step = 0; step < 5; step++) { await page.mouse.wheel(0, 450); await page.waitForTimeout(200); }
      await page.waitForTimeout(500);
      const before = await page.evaluate(() => scrollY);
      assert(before > 1000, 'scrolling is not stuck after filtering');
      await page.evaluate(() => { dispatchEvent(new Event('resize')); document.querySelector('#list .ent:not([hidden]) img')?.dispatchEvent(new Event('load')); });
      await page.waitForTimeout(300);
      assert(Math.abs(await page.evaluate(() => scrollY) - before) < 3, 'remeasurement preserves scroll position');
    }
    await page.reload();
    assert.equal(await page.locator('#enjoying-results').getAttribute('data-view'), 'list', 'mobile stays in List; desktop selection survives refresh');
    if (!mobile) {
      await page.locator('.enjoying-view-toggle [data-layout-choice="grid"]').focus();
      await page.keyboard.press('Enter'); await settle(page);
      assert.equal(await page.locator('#enjoying-results').getAttribute('data-view'), 'grid', 'keyboard can switch view');
    }
    await choose(page, width, 'all'); await settle(page);
    const card = page.locator('#list > .ent').first(); const title = card.locator('a.t');
    await page.keyboard.press('Tab');
    await title.focus(); assert(await card.evaluate(e => getComputedStyle(e).outlineStyle !== 'none'));
    const href = await title.getAttribute('href'); await card.hover(); await page.waitForTimeout(220);
    assert(await card.evaluate(e => getComputedStyle(e).boxShadow !== 'none'));
    const box = await card.boundingBox(); await page.mouse.click(box.x + box.width - 10, box.y + box.height - 10);
    await page.waitForURL(u => u.pathname === new URL(href, base).pathname);
    await page.goto(base + '/enjoying');
    assert.equal(await page.locator('[data-kind-filter], button.enjoying-tag').count(), 0);
    const label = page.locator('#list > .ent span.enjoying-tag').first();
    assert.equal(await label.evaluate(e => getComputedStyle(e).borderTopWidth), '0px');
    const urlBefore = page.url(); await label.click();
    assert.equal(page.url(), urlBefore, 'plain labels do not navigate or filter');
    assert.equal(await page.locator('#enjoying-results').getAttribute('data-kind'), 'all');
    await page.goto(base + '/portfolio');
    assert.equal(await page.locator('body').evaluate(e => e.getBoundingClientRect().width), siteWidth, 'shared page width is unchanged');
    if (width > 640) {
      assert(await page.locator('.portfolio-view-toggle').isVisible());
      assert(Math.abs((await page.locator('.portfolio-view-toggle').boundingBox()).width - toggle.width) < 5, 'Projects and Enjoying use the same view control');
      await page.locator('.portfolio-view-toggle [data-layout-choice="list"]').click();
      assert.equal(await page.locator('#portfolio-results').getAttribute('data-view'), 'list');
      await page.locator('.portfolio-view-toggle [data-layout-choice="grid"]').click();
      assert.equal(await page.locator('#portfolio-results').getAttribute('data-view'), 'grid');
    } else assert(await page.locator('.portfolio-view-toggle').isHidden());
    if (width === 1440) {
      await page.goto(base + '/enjoying');
      await choose(page, width, 'music');
      await page.locator('.desktop-nav a[href$="/notes"]').click();
      await page.waitForURL(u => u.pathname.endsWith('/notes'));
      assert.equal(await page.locator('[data-layout-exit]').count(), 0, 'navigation cleans up active motion');
      await page.locator('.desktop-nav a[href$="/enjoying"]').click();
      await page.waitForURL(u => u.pathname.endsWith('/enjoying'));
      await choose(page, width, 'film'); await checkResults(page, 'film', 'grid');
    }
    await page.goto(base + '/notes'); assert.equal(await page.locator('.enjoying-view-toggle').count(), 0);
    assert.deepEqual(errors, []); await ctx.close(); console.log(`${engine.name()} ${width}px: views, motion, rapid filters, scrolling, links, keyboard, width, and Projects passed`);
  }
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage(); await page.goto(base + '/enjoying');
  await choose(page, 1440, 'film');
  assert(!await page.locator('#enjoying-results').evaluate(e => e.hasAttribute('data-rearranging')));
  assert.equal(await page.locator('#list').evaluate(e => e.getAnimations({ subtree: true }).length), 0, 'reduced motion changes instantly');
  await page.locator('#list > .ent:visible').first().hover();
  assert.equal(await page.locator('#list > .ent:visible').first().evaluate(e => getComputedStyle(e).transform), 'none');
  await ctx.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false }); const fallback = await nojs.newPage();
  await fallback.goto(base + '/enjoying'); assert(await fallback.locator('.enjoying-view-toggle').isHidden()); assert(await fallback.locator('#list > .ent').first().isVisible()); await nojs.close();
  console.log('Reduced motion and no-JavaScript fallback passed.');
} finally { await browser.close(); }
