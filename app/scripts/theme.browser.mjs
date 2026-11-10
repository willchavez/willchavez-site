// Run against a built site. Google endpoints are intercepted on production.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
async function context(options = {}) {
  const ctx = await browser.newContext(options);
  await ctx.route('**/*', route => /(^|\.)(google-analytics\.com|googletagmanager\.com|analytics\.google\.com)$/.test(new URL(route.request().url()).hostname)
    ? route.fulfill({ status: 200, body: '' }) : route.continue());
  return ctx;
}
try {
  for (const system of ['light', 'dark']) {
    const ctx = await context({ colorScheme: system, viewport: { width: 1440, height: 1000 } });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', error => errors.push(String(error)));
    await page.goto(base + '/');
    const toggle = page.locator('[data-theme-toggle]');
    await toggle.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('[data-theme-toggle]').hasAttribute('data-orbit-ready'));
    assert.equal(await page.locator('html').getAttribute('data-theme'), system);
    assert.equal(await toggle.getAttribute('aria-pressed'), String(system === 'dark'));
    assert(await page.locator('.avatar-orbit').evaluate(e => e.getAnimations().length > 0), 'first-load rise animates');
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.savedAvatar = document.querySelector('[data-theme-toggle]'));
    const next = system === 'dark' ? 'light' : 'dark';
    await toggle.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('data-theme'), next);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('will-theme')), next);
    assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), next === 'dark' ? 'rgb(23, 20, 17)' : 'rgb(247, 245, 242)');
    assert.equal(await toggle.evaluate(e => e.style.getPropertyValue('--orbit-angle')), system === 'dark' ? '360deg' : '180deg');
    // Persisted nav must retain its orbit rather than replaying the sunrise.
    await page.locator('.desktop-nav a[href$="/about"]').click(); await page.waitForURL('**/about');
    assert(await toggle.evaluate(e => e === window.savedAvatar));
    assert.equal(await page.locator('html').getAttribute('data-theme'), next);
    assert.equal(await page.locator('.work-logo-lockheed-martin path').first().evaluate(e => getComputedStyle(e).fill), next === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 82, 155)');
    await page.reload(); assert.equal(await page.locator('html').getAttribute('data-theme'), next);
    await page.goto(base + '/portfolio/genui-bebop/present', { referer: base + '/about' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), next);
    assert.equal(await page.locator('html').evaluate(e => getComputedStyle(e).backgroundColor), next === 'dark' ? 'rgb(23, 20, 17)' : 'rgb(247, 245, 242)');
    await page.goto(base + '/enjoying', { referer: base + '/portfolio/genui-bebop/present' });
    const tag = page.locator('.ent[data-kind="film"] .enjoying-tag').first();
    assert.equal(await tag.evaluate(e => getComputedStyle(e).backgroundColor), next === 'dark' ? 'rgb(223, 121, 85)' : 'rgb(156, 75, 46)');
    for (let i = 0; i < 5; i++) await toggle.click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), system);
    assert.equal(errors.length, 0, errors.join('\n'));
    const newVisit = await ctx.newPage();
    await newVisit.goto(base + '/');
    assert.equal(await newVisit.locator('html').getAttribute('data-theme'), system, 'a new tab follows the OS instead of another tab’s override');
    await newVisit.close();
    await ctx.close();
  }
  const mobile = await context({ colorScheme: 'light', reducedMotion: 'reduce', viewport: { width: 375, height: 850 } });
  const page = await mobile.newPage(); await page.goto(base + '/');
  const toggle = page.locator('[data-theme-toggle]'); await toggle.click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('.avatar-orbit').evaluate(e => e.getAnimations().length), 0);
  assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await mobile.close();
  const automatic = await context({ colorScheme: 'light' }); const auto = await automatic.newPage();
  await auto.goto(base + '/'); await auto.emulateMedia({ colorScheme: 'dark' });
  await auto.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await auto.emulateMedia({ colorScheme: 'light' });
  await auto.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await auto.emulateMedia({ colorScheme: 'dark' });
  await auto.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await auto.locator('[data-theme-toggle]').click();
  await auto.emulateMedia({ colorScheme: 'light' }); await auto.emulateMedia({ colorScheme: 'dark' });
  assert.equal(await auto.locator('html').getAttribute('data-theme'), 'light', 'explicit choice overrides OS');
  await auto.reload();
  assert.equal(await auto.locator('html').getAttribute('data-theme'), 'light', 'refresh retains the manual choice for this visit');
  await auto.goto('about:blank');
  await auto.goto(base + '/');
  assert.equal(await auto.locator('html').getAttribute('data-theme'), 'dark', 'leaving and entering the site again follows the OS');
  await automatic.close();
  const legacy = await context({ colorScheme: 'dark' });
  await legacy.addInitScript(() => localStorage.setItem('will-theme', 'light'));
  const legacyPage = await legacy.newPage();
  await legacyPage.goto(base + '/');
  assert.equal(await legacyPage.locator('html').getAttribute('data-theme'), 'dark', 'old permanent overrides do not prevent OS defaults');
  await legacy.close();
  const blocked = await context(); await blocked.addInitScript(() => { Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  const blockedPage = await blocked.newPage(); await blockedPage.goto(base + '/'); await blockedPage.locator('[data-theme-toggle]').click();
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'), 'dark'); await blocked.close();
  const fallback = await context({ javaScriptEnabled: false, colorScheme: 'dark' });
  const nojs = await fallback.newPage(); await nojs.goto(base + '/');
  assert(await nojs.locator('[data-theme-fallback]').isVisible());
  assert(!await nojs.locator('[data-theme-toggle]').isVisible());
  assert.equal(await nojs.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(23, 20, 17)');
  await fallback.close();
  console.log('Avatar rise/orbit, keyboard/mobile toggle, OS themes and visit-scoped overrides, reset on new visits, legacy preference migration, SPA persistence, standalone presentations, tags/logos, rapid clicks, reduced motion, blocked storage, and no-JS fallback passed.');
} finally { await browser.close(); }
