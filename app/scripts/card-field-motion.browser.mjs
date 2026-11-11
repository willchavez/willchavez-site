import { chromium } from 'playwright';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
async function difference(a, b) {
  const aa = await sharp(a).removeAlpha().raw().toBuffer();
  const bb = await sharp(b).removeAlpha().raw().toBuffer();
  assert.equal(aa.length, bb.length);
  let total = 0;
  for (let i = 0; i < aa.length; i++) total += Math.abs(aa[i] - bb[i]);
  return total / aa.length;
}
try {
  for (const mode of ['light', 'dark']) {
    const page = await browser.newPage({ colorScheme: mode, viewport: { width: 1440, height: 1100 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/about'); await page.evaluate(() => document.fonts.ready);
    const card = page.locator('.about-card').first();
    await page.waitForFunction(() => document.querySelector('.about-card').hasAttribute('data-field-moving'));
    const box = await card.locator('p').boundingBox();
    const initial = await card.screenshot();
    const transform = await card.evaluate(e => getComputedStyle(e, '::after').transform);
    await page.waitForTimeout(2300);
    assert.notEqual(await card.evaluate(e => getComputedStyle(e, '::after').transform), transform, 'field transform changes');
    assert(await difference(initial, await card.screenshot()) > .2, `${mode}: motion visibly changes the color field`);
    assert.deepEqual(await card.locator('p').boundingBox(), box, 'text remains still');
    const picker = page.locator('[data-card-colors-picker]'); await picker.locator('summary').click();
    const toggle = picker.locator('[data-card-motion-toggle]'); await toggle.click();
    assert.equal(await toggle.textContent(), 'Play motion');
    assert.equal(await page.locator('[data-field-moving]').count(), 0);
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    const paused = await card.screenshot();
    await page.waitForTimeout(1100);
    assert(await difference(paused, await card.screenshot()) < .05, `${mode}: Pause freezes the visible field`);
    await page.reload(); await page.waitForFunction(() => document.documentElement.dataset.cardMotion === 'paused');
    assert.equal(await page.locator('[data-field-moving]').count(), 0);
    await page.locator('[data-card-colors-picker] summary').click();
    await page.locator('[data-card-motion-toggle]').click(); await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('.about-card').hasAttribute('data-field-moving'));
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() => !document.querySelector('[data-field-moving]'));
    await page.goto(base + '/enjoying');
    await page.waitForFunction(() => document.querySelector('#list .ent')?.hasAttribute('data-field-moving'));
    const ready = await page.locator('#list .ent[data-field-moving]').count();
    assert(ready > 0 && ready < 20, 'only viewport cards animate');
    const artwork = page.locator('#list .ent .cover').first();
    const artworkBox = await artwork.boundingBox(); await page.waitForTimeout(500);
    assert.deepEqual(await artwork.boundingBox(), artworkBox, 'artwork remains still');
    await page.getByRole('button', { name: 'List view', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#enjoying-results').dataset.view === 'list' && !document.querySelector('#list [data-field-moving]'));
    assert.equal(await page.locator('#list .ent').first().evaluate(e => getComputedStyle(e, '::after').content), 'none');
    assert.deepEqual(errors, []); await page.close();
    console.log(`${mode}: visible fluid drift, fixed content, pause/resume/persistence, offscreen suspension, and List scope passed.`);
  }
  const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 393, height: 850 } });
  await page.goto(base + '/about');
  await page.waitForFunction(() => document.documentElement.dataset.cardMotion === 'reduced');
  assert.equal(await page.locator('[data-field-moving]').count(), 0);
  await page.locator('[data-card-colors-picker] summary').click();
  assert(await page.locator('[data-card-motion-toggle]').isDisabled());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => document.querySelector('.about-card').hasAttribute('data-field-moving'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.querySelector('[data-field-moving]'));
  assert.equal(await page.locator('.about-card').first().evaluate(e => getComputedStyle(e, '::after').animationName), 'none');
  await page.close(); console.log('Initial and live reduced-motion preferences passed.');
} finally { await browser.close(); }
