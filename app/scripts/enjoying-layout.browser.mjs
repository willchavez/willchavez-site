// Run against a built preview. BROWSER_ENGINE=webkit also checks Safari's engine.
import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const engine = process.env.BROWSER_ENGINE === 'webkit' ? webkit : chromium;
const browser = await engine.launch(engine === chromium ? {
  ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'],
} : { ...(process.env.WEBKIT_PATH && { executablePath: process.env.WEBKIT_PATH }) });
try {
  for (const width of [375, 820, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: width === 820 ? 'dark' : 'light' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/enjoying?layout=cascade');
    await page.locator('[data-layout-playground]:visible').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const mode of ['cascade', 'editorial', 'cards']) {
      await page.locator(`[data-layout-mode="${mode}"]`).click();
      for (const kind of ['film', 'music', 'book', 'paper', 'all']) {
        const filter = width <= 820 ? page.locator(`#kind-menu [data-kind="${kind}"]`) : page.locator(`#kind-tabs [data-kind="${kind}"]`);
        if (width <= 820) await page.locator('#kind-menu summary').click();
        await filter.click();
        await page.waitForFunction(k => document.querySelector('#enjoying-results').dataset.kind === k, kind);
        await page.waitForTimeout(350);
        assert(await page.locator('#list .ent:visible').evaluateAll((cards, k) => cards.every(card => k === 'all' || card.dataset.kind === k), kind));
        assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
        await page.mouse.move(1, 1);
        if (mode !== 'cards') {
          assert(!await page.locator('#list .ent:visible').evaluateAll(cards => {
            const rects = cards.map(card => card.getBoundingClientRect());
            return rects.some((a, i) => rects.some((b, j) => i < j && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2));
          }), `${mode}/${kind}/${width}: cards do not overlap`);
        }
        // Scroll through filtered results while late media and resize callbacks
        // remeasure the grid. The document must not collapse and clamp scrollY.
        if (kind !== 'paper') {
          await page.mouse.move(width / 2, 700);
          for (let step = 0; step < 3; step++) {
            const before = await page.evaluate(() => scrollY);
            await page.mouse.wheel(0, 450);
            await page.waitForTimeout(150);
            assert(await page.evaluate(y => document.documentElement.scrollHeight - innerHeight - y < 25 || scrollY > y + 20, before), `${mode}/${kind}/${width}: wheel scrolling does not get stuck`);
          }
          // WebKit can still be finishing the wheel gesture after dispatch.
          await page.waitForTimeout(500);
          const before = await page.evaluate(() => scrollY);
          await page.evaluate(() => {
            dispatchEvent(new Event('resize'));
            document.querySelector('#list .ent:not([hidden]) img')?.dispatchEvent(new Event('load'));
          });
          await page.waitForTimeout(350);
          const after = await page.evaluate(() => scrollY);
          assert(Math.abs(after - before) < 3, `${mode}/${kind}/${width}: remeasurement preserves scroll position (${before} → ${after})`);
        }
      }
    }
    await page.goto(base + '/enjoying?layout=cascade');
    const card = page.locator('#list .ent').first();
    const title = card.locator('a.t');
    const href = await title.getAttribute('href');
    await title.focus();
    assert(await card.evaluate(e => getComputedStyle(e).outlineStyle !== 'none'), 'keyboard focus outlines the whole card');
    await page.mouse.move(1, 1);
    await card.hover();
    await page.waitForTimeout(220);
    assert(await card.evaluate(e => getComputedStyle(e).boxShadow !== 'none'), 'hover shows a shadow');
    assert(await card.evaluate(e => Number(getComputedStyle(e).transform.match(/matrix\(([^,]+)/)?.[1]) > 1), 'hover slightly expands the card');
    // Click the padding, outside the thumbnail/title: this is a real link.
    const box = await card.boundingBox();
    await page.mouse.click(box.x + box.width - 10, box.y + box.height - 10);
    await page.waitForURL(url => url.pathname === new URL(href, base).pathname);
    assert.equal(await page.locator('html').getAttribute('data-layout-experiment'), null, 'detail page is not a grid');
    await page.goto(base + '/enjoying?layout=cascade');
    await page.locator('#list .ent:visible [data-kind-filter]').first().click();
    await page.waitForFunction(() => document.querySelector('#enjoying-results').dataset.kind === 'film');
    assert(new URL(page.url()).pathname.endsWith('/enjoying'), 'tag filters instead of opening the post');
    // Astro navigation must remove experiment state and restore regular indexes.
    for (const route of ['notes', 'portfolio']) {
      const link = page.locator(`.desktop-nav a[href$="/${route}"]`);
      if (await link.isVisible()) await link.click();
      else await page.goto(base + '/' + route);
      await page.waitForURL(url => url.pathname.endsWith('/' + route));
      assert.equal(await page.locator('[data-layout-playground]').count(), 0);
      assert.equal(await page.locator('html').getAttribute('data-layout-experiment'), null);
      if (route === 'portfolio' && width > 640) assert(await page.locator('.portfolio-view-toggle').isVisible());
    }
    assert.deepEqual(errors, []);
    console.log(`Enjoying checks passed at ${width}px`);
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(base + '/enjoying?layout=cascade');
  await page.locator('#list .ent').first().hover();
  assert.equal(await page.locator('#list .ent').first().evaluate(e => getComputedStyle(e).transform), 'none');
  await context.close();
  console.log('Enjoying layouts, filters, scrolling during remeasurement, full-card links, tag controls, hover/focus, reduced motion, and regular Notes/Projects passed.');
} finally { await browser.close(); }
