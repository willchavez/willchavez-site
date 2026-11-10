import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const base = (process.argv[2] || 'http://localhost:4359').replace(/\/$/, '');
const engine = process.env.BROWSER_ENGINE === 'webkit' ? webkit : chromium;
const executablePath = engine === webkit ? process.env.WEBKIT_PATH : process.env.CHROMIUM_PATH;
const browser = await engine.launch({ ...(executablePath && { executablePath }), ...(engine === chromium && { args: ['--no-sandbox'] }) });
try {
  for (const colorScheme of ['light', 'dark']) for (const width of [320, 375, 393, 480, 640, 641, 820, 1440]) {
    const context = await browser.newContext({ colorScheme, viewport: { width, height: 1100 } });
    await context.route(/google-analytics\.com|googletagmanager\.com|analytics\.google\.com/, route => route.fulfill({ status: 200, body: '' }));
    const page = await context.newPage();
    await page.goto(base + '/notes');
    await page.evaluate(() => document.fonts.ready);
    const cards = await page.locator('.note-card').evaluateAll(elements => elements.map(card => {
      const rect = element => {
        const r = element.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      };
      const meta = card.querySelector('.note-side-meta');
      return {
        title: rect(card.querySelector('.t')), meta: rect(meta),
        date: rect(meta.querySelector('time')), summary: rect(card.querySelector('.s')),
        tags: [...meta.querySelectorAll('.note-topic')].map(rect),
      };
    }));
    assert(cards.length > 0);
    for (const card of cards) {
      assert(Math.abs(card.meta.top - card.title.top) <= 1, 'metadata stays at the top beside the title, including small phones');
      assert(card.title.right <= card.meta.left + 1, 'title does not overlap metadata');
      assert(card.summary.top >= Math.max(card.title.bottom, card.meta.bottom) - 1, 'description sits below the heading');
      assert(card.summary.left <= card.title.left + 1, 'description starts at the left of the copy');
      if (width <= 820) assert(card.summary.right >= card.meta.right - 1, 'description reclaims the metadata column at narrow widths');
      assert(card.tags.length >= 1 && card.tags.length <= 2);
      assert(card.date.bottom <= Math.min(...card.tags.map(tag => tag.top)) + 1, 'date stays above tags');
      for (const tag of card.tags) assert(tag.left >= card.meta.left - 1 && tag.right <= card.meta.right + 1, 'tags fit the right column');
    }
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'no horizontal overflow');
    if (process.env.NOTES_SCREENSHOTS_DIR && [393, 1440].includes(width)) {
      await page.screenshot({ path: `${process.env.NOTES_SCREENSHOTS_DIR}/notes-${engine.name()}-${colorScheme}-${width}.png` });
    }
    await context.close();
    console.log(`${engine.name()} ${colorScheme} ${width}px: Notes top-right metadata, full-width descriptions, and tag containment passed`);
  }
} finally { await browser.close(); }
