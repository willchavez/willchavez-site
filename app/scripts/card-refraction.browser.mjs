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
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, colorScheme: mode });
    await page.goto(base + '/about'); await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 0);
    const card = page.locator('.about-card').first();
    const image = await card.evaluate(e => getComputedStyle(e).backgroundImage);
    const decode = async value => page.evaluate(async value => { const img = new Image(); img.src = value.slice(5, -2); await img.decode(); }, value);
    await decode(image);
    const textBox = await card.locator('p').boundingBox();
    const native = await card.screenshot();
    const disable = await page.addStyleTag({ content: '.about-card::before { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }' });
    const withoutBackdrop = await card.screenshot();
    assert(await difference(native, withoutBackdrop) > .2, `${mode}: the native backdrop layer must visibly refract the field`);
    assert.deepEqual(await card.locator('p').boundingBox(), textBox, 'refraction does not move text');
    const xml = decodeURIComponent(image.slice(5, -2).split(',').slice(1).join(','));
    const setSurface = async xml => {
      const value = `url("data:image/svg+xml,${encodeURIComponent(xml)}")`;
      await decode(value); await card.evaluate((e, value) => e.style.backgroundImage = value, value);
    };
    await setSurface(xml.replace(/scale="\d+"/g, 'scale="0"'));
    assert(await difference(withoutBackdrop, await card.screenshot()) > .2, `${mode}: the SVG displacement stage must visibly bend the field`);
    await setSurface(xml.replace('type="saturate" values="4"', 'type="saturate" values="1"'));
    assert(await difference(withoutBackdrop, await card.screenshot()) > .5, `${mode}: amplified color channels must visibly change the field`);
    await disable.evaluate(e => e.remove());
    await page.goto(base + '/enjoying');
    await page.waitForFunction(() => document.querySelector('#list .ent')?.hasAttribute('data-card-tone'));
    const entry = page.locator('#list .ent').first();
    assert((await entry.evaluate(e => getComputedStyle(e, '::before').backdropFilter)).includes('card-refraction'));
    const excerpt = entry.locator('.ent-excerpt');
    const box = await excerpt.boundingBox();
    assert(box);
    const href = await entry.locator('a.t').getAttribute('href');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForURL(url => url.pathname === new URL(href, base).pathname);
    await page.close(); console.log(`${mode}: native refraction, SVG displacement, saturation, sharp text geometry, and whole-card links passed.`);
  }
} finally { await browser.close(); }
