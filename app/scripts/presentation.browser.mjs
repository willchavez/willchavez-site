// Build and serve first. Optional BASE_URL argument and CHROMIUM_PATH env.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { portfolioProjects } from '../src/data/portfolio-projects.ts';
import { projectPresentations } from '../src/data/project-presentations.ts';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  for (const project of portfolioProjects) {
    await page.goto(`${base}/portfolio/${project.slug}`);
    await page.locator('[data-project-present]').click();
    await page.waitForURL('**/present?**#slide-1');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('[data-print], [data-fullscreen], .deck-keyboard-hint, .deck-article-link').count(), 0);
    const title = await page.locator('.deck-project-name').boundingBox();
    assert(Math.abs(title.x + title.width / 2 - 720) < 1, 'header title is centered');
    const count = projectPresentations[project.slug].slides.length + 1;
    assert.equal(await page.locator('[data-slide]').count(), count);
    assert(await page.locator('[data-previous]').isDisabled());
    for (let index = 0; index < count; index++) {
      assert.equal(await page.locator('[data-slide]:visible').count(), 1);
      assert.equal(await page.locator('[data-slide]:visible').getAttribute('data-slide'), String(index));
      const details = index > 0 && projectPresentations[project.slug].slides[index - 1].details;
      if (details) {
        assert.equal(await page.locator('[data-slide]:visible .slide-details dt').count(), details.length);
        assert.equal(await page.locator('[data-slide]:visible .slide-points').count(), 0, 'structured facts use a grid rather than bullets');
      }
      const failures = await page.locator('[data-slide]:visible img').evaluateAll(async images => {
        const results = await Promise.all(images.map(async image => {
          try { await image.decode(); return null; } catch { return image.src; }
        }));
        return results.filter(Boolean);
      });
      assert.deepEqual(failures, [], project.slug);
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      assert(await page.locator('.deck').evaluate(e => e.scrollHeight <= e.clientHeight + 2), `${project.slug} slide ${index} fits desktop`);
      if (index < count - 1) await page.keyboard.press('ArrowRight');
    }
    assert(await page.locator('[data-next]').isDisabled());
    await page.keyboard.press('Home');
    assert.equal(await page.locator('[data-current]').innerText(), '1');
    await page.keyboard.press('End');
    assert.equal(await page.locator('[data-current]').innerText(), String(count));
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('[data-current]').innerText(), String(count - 1));
    await page.locator('.deck-outline summary').click();
    await page.locator('[data-slide-choice="2"]').click();
    assert.equal(await page.locator('[data-current]').innerText(), '3');
    assert(!await page.locator('.deck-outline').evaluate(e => e.open));
    await page.locator('.deck-exit').click();
    await page.waitForURL(`${base}/portfolio/${project.slug}`);
    assert.equal(await page.locator('.portfolio-project').count(), 1);
  }
  for (const width of [1920, 2560, 3440]) {
    await page.setViewportSize({ width, height: 1440 });
    for (const slug of ['visual-diff', 'agent-builder']) {
      await page.goto(`${base}/portfolio/${slug}/present`);
      const stage = await page.locator('.deck').boundingBox();
      assert(Math.abs(stage.x) < 1 && Math.abs(stage.width - width) < 1, 'presentation background fills wide viewport');
      assert.match(await page.locator('.deck').evaluate(e => getComputedStyle(e).backgroundImage), /linear-gradient/, 'title wash covers the full stage');
      assert((await page.locator('[data-slide]:visible').boundingBox()).width <= 1600, 'slide content remains bounded');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('.deck').evaluate(e => getComputedStyle(e).backgroundImage), 'none', 'title wash clears on other slides');
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    }
  }
  for (const [width, height] of [[320, 850], [375, 850], [768, 1000], [1280, 720]]) {
    await page.goto(base + '/portfolio');
    await page.setViewportSize({ width, height });
    for (const project of portfolioProjects) {
      if (width <= 800) {
        await page.goto(`${base}/portfolio/${project.slug}`);
        assert(!await page.locator('[data-project-present]').isVisible(), 'mobile presentation link is hidden');
        await page.goto(`${base}/portfolio/${project.slug}/present`);
        await page.waitForURL(`${base}/portfolio/${project.slug}`);
        continue;
      }
      await page.goto(`${base}/portfolio/${project.slug}/present`);
      for (let index = 0; index <= projectPresentations[project.slug].slides.length; index++) {
        assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${project.slug} at ${width}`);
        if (width > 800) assert(await page.locator('.deck').evaluate(e => e.scrollHeight <= e.clientHeight + 2), `${project.slug} slide ${index} fits landscape`);
        if (index < projectPresentations[project.slug].slides.length) await page.locator('[data-next]').click();
      }
    }
    if (width <= 800) continue;
    await page.locator('.deck-outline summary').click();
    const menu = await page.locator('.deck-outline nav').boundingBox();
    assert(menu.x >= 0 && menu.x + menu.width <= width, 'outline remains in viewport');
  }
  await page.goto(`${base}/portfolio/peer-survey/present#slide-3`);
  assert.match(await page.locator('[data-slide]:visible').innerText(), /Aaquib Khwaja, Anna Levenberg, and Jackson Lyons/);
  await page.goto(`${base}/portfolio/nav2/present#slide-6`);
  assert.match(await page.locator('[data-slide]:visible').innerText(), /Defer drag-and-drop/);
  await page.goto(`${base}/portfolio/genui-bebop/present#slide-999`);
  assert.equal(await page.locator('[data-current]').innerText(), '7');
  await page.goto(`${base}/portfolio/genui-bebop/present?article=https%3A%2F%2Fevil.example`);
  assert.equal(new URL(await page.locator('.deck-exit').getAttribute('href'), base).origin, new URL(base).origin);
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-slide]:visible').evaluate(e => getComputedStyle(e).animationName), 'none');
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('[data-slide]:visible').count(), 7, 'printing includes hidden slides');
  assert.deepEqual(errors, []);
  const fallback = await browser.newPage({ javaScriptEnabled: false });
  await fallback.goto(`${base}/portfolio/genui-bebop/present`);
  assert.equal(await fallback.locator('[data-slide]:visible').count(), 7);
  console.log('All project presentations: every slide/image, desktop/portrait layouts, article round trips, keyboard, outline, deep links, historical credits, print, reduced motion, dark mode, and no-JS fallback passed.');
} finally { await browser.close(); }
