import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = (process.argv[2] || 'http://127.0.0.1:4330').replace(/\/$/, '');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 956 });
      for (const kind of ['music', 'film', 'book', 'paper']) {
        await page.goto(`${base}/enjoying`);
        const tag = page.locator(`.ent[data-kind="${kind}"] [data-kind-filter]`).first();
        const contrast = await tag.evaluate((el) => {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext('2d');
          const luminance = (color) => {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map(x => {
              x /= 255;
              return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
            }).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
          };
          const border = luminance(getComputedStyle(el).borderTopColor);
          const card = luminance(getComputedStyle(el.closest('.ent')).backgroundColor);
          return (Math.max(border, card) + .05) / (Math.min(border, card) + .05);
        });
        if (width === 375) assert(contrast >= 3, `${kind} ${colorScheme} border contrast: ${contrast}`);
        await tag.scrollIntoViewIfNeeded();
        await tag.focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(k => document.querySelector('#enjoying-results').dataset.kind === k, kind);
        assert.equal(new URL(page.url()).hash, `#${kind}`);
        assert.equal(await page.locator('#kind-current').textContent(), {music:'Music',film:'Films',book:'Books',paper:'Papers'}[kind]);
        assert.equal(await page.locator(`.ent:not([hidden]):not([data-kind="${kind}"])`).count(), 0);
        assert(await page.locator('[data-kind-filter]:visible').first().isDisabled());
        assert(await page.evaluate(() => document.activeElement.matches('#kind-menu > summary, #kind-tabs .chip[aria-pressed="true"]')));
        await page.reload();
        assert.equal(await page.locator('#enjoying-results').getAttribute('data-kind'), kind);
        assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      }
    }
  }
  console.log('All four tag filters passed keyboard, URL, reload, focus and layout checks on mobile/desktop; mobile borders contrast at least 3:1 in light/dark mode.');
} finally { await browser.close(); }
