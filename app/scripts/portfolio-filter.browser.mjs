import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const engine = process.env.BROWSER_ENGINE === 'webkit' ? webkit : chromium;
const browser = await engine.launch(engine === chromium ? { ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] } : { ...(process.env.WEBKIT_PATH && { executablePath: process.env.WEBKIT_PATH }) });
const categories = { 'all': null, 'ai-experiences': 'AI experiences', 'design-tooling': 'Design tooling', 'research-learning': 'Research & learning', community: 'Community' };
const settle = page => page.waitForFunction(() => !document.querySelector('#portfolio-results').hasAttribute('data-rearranging'));
async function choose(page, width, kind) {
  if (width <= 1440) await page.locator('#kind-menu summary').click();
  await page.locator(`${width <= 1440 ? '#kind-menu' : '#kind-tabs'} [data-kind="${kind}"]`).click();
  await page.waitForFunction(k => document.querySelector('#portfolio-results').dataset.kind === k, kind);
}
async function check(page, kind) {
  await settle(page);
  assert(await page.locator('.portfolio-card:not([data-layout-exit])').evaluateAll((cards, category) => cards.every(card => card.hidden === (!!category && card.dataset.category !== category)), categories[kind]));
  assert.equal(await page.locator('[data-layout-exit]').count(), 0);
  assert.equal(await page.locator('#portfolio-results').evaluate(e => e.style.minHeight), '');
  assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  assert(!await page.locator('.portfolio-card:visible').evaluateAll(cards => {
    const rs = cards.map(card => card.getBoundingClientRect());
    return rs.some((a, i) => rs.some((b, j) => i < j && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2));
  }), 'settled projects do not overlap');
  assert(await page.locator('.portfolio-card').evaluateAll(cards => cards.every(card => !card.style.gridRowEnd)), 'Projects has no cascading row spans');
}
try {
  for (const [width, scheme] of [[375, 'light'], [820, 'dark'], [1440, 'light'], [1920, 'dark']]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1100 }, colorScheme: scheme });
    const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/portfolio');
    const mobile = width <= 640;
    for (const view of mobile ? ['list'] : ['grid', 'list']) {
      if (!mobile) await page.locator(`.portfolio-view-toggle [data-layout-choice="${view}"]`).click();
      for (const kind of ['design-tooling', 'ai-experiences', 'research-learning', 'community', 'all']) {
        await choose(page, width, kind);
        if (!mobile && kind === 'design-tooling') {
          const moving = await page.locator('#portfolio-results').evaluate(e => e.getAnimations({ subtree: true }).some(a => a.effect.getKeyframes().some(k => String(k.transform).includes('translate('))));
          assert(moving, 'desktop Projects animates surviving cards');
          assert(await page.locator('[data-layout-exit][inert]').count() > 0, 'outgoing copies are inert');
        }
        if (mobile) assert.equal(await page.locator('#portfolio-results').getAttribute('data-rearranging'), null, 'mobile Projects filters instantly');
        await check(page, kind);
      }
      for (const kind of ['ai-experiences', 'community', 'all', 'design-tooling', 'all']) await choose(page, width, kind);
      await check(page, 'all');
    }
    const tags = await page.locator('.portfolio-card').evaluateAll(cards => {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const rgb = color => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
      const luminance = rgb => rgb.map(c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
      const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      return cards.map(card => {
        const labels = [...card.querySelectorAll('.skill-tag')];
        return { category: card.dataset.category, first: labels[0].textContent, labels: labels.map(label => {
          const s = getComputedStyle(label); const bg = luminance(rgb(s.backgroundColor));
          return { text: label.textContent, background: s.backgroundColor, foreground: s.color, border: s.borderTopWidth, font: parseFloat(s.fontSize), ink: contrast(luminance(rgb(s.color)), bg), card: contrast(bg, luminance(rgb(getComputedStyle(card).backgroundColor))) };
        }) };
      });
    });
    assert(tags.every(card => card.first === card.category), 'every project includes its exact filter category');
    const labels = tags.flatMap(card => card.labels);
    assert.equal(new Set(labels.map(label => label.background)).size, 1, 'all tags share one accent fill');
    assert.equal(new Set(labels.map(label => label.foreground)).size, 1, 'all tags share one text color');
    assert(labels.every(label => label.border === '0px' && label.font <= 12), 'Notes-sized borderless chips');
    assert(labels.every(label => label.ink >= 4.5), 'tag text meets WCAG AA contrast');
    assert(labels.every(label => label.card >= 1.2), 'chip backgrounds separate from the card background');
    assert(!labels.some(label => /High-fidelity|Interaction patterns|React & TypeScript/.test(label.text)), 'card labels are concise');
    if (!mobile) assert.equal(await page.locator('.portfolio-grid').evaluate(e => getComputedStyle(e).gridAutoRows), 'auto');
    // Leave while a shuffle is playing; returning must bind one fresh controller.
    await choose(page, width, 'design-tooling');
    await page.goto(base + '/enjoying?view=grid');
    await page.waitForFunction(() => document.querySelector('#enjoying-results').hasAttribute('data-card-motion'));
    assert.equal(await page.locator('.enjoying-view-toggle').isVisible(), !mobile);
    assert.equal(await page.locator('#enjoying-results').getAttribute('data-view'), mobile ? 'list' : 'grid');
    if (mobile) {
      await page.setViewportSize({ width: 1280, height: 1000 }); await page.waitForFunction(() => document.querySelector('#enjoying-results').dataset.view === 'grid');
      await page.setViewportSize({ width: 375, height: 850 }); await page.waitForFunction(() => document.querySelector('#enjoying-results').dataset.view === 'list');
      assert(await page.locator('.enjoying-view-toggle').isHidden());
    }
    assert.equal(await page.locator('[data-kind-filter], button.enjoying-tag').count(), 0);
    assert.equal(await page.locator('.enjoying-tag').first().evaluate(e => getComputedStyle(e).borderTopWidth), '0px');
    assert.deepEqual(errors, []); await ctx.close();
    console.log(`${engine.name()} ${width}px ${scheme}: Projects motion/geometry, category chips/contrast, mobile List, and static Enjoying labels passed`);
  }
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1100 } }); const page = await ctx.newPage();
  await page.goto(base + '/portfolio'); await choose(page, 1440, 'design-tooling');
  assert.equal(await page.locator('#portfolio-results').evaluate(e => e.getAnimations({ subtree: true }).length), 0);
  assert.equal(await page.locator('[data-layout-exit]').count(), 0);
  await ctx.close(); console.log('Reduced-motion Projects filtering passed.');
} finally { await browser.close(); }
