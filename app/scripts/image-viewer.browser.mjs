import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({...(process.env.CHROMIUM_PATH && {executablePath:process.env.CHROMIUM_PATH}),args:['--no-sandbox']});
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const p=await b.newPage();
const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [1440,390]) {
 await p.setViewportSize({width,height:900});
 for(const route of ['/portfolio/genui-bebop','/notes/2025-06-21-making-navigation-feel-like-a-place-to-return','/portfolio/genui-bebop/present#slide-4']) {
  await p.goto(base+route);
  const img=p.locator('[data-zoom-ready]:visible').first();
  const expectedCaption=await img.evaluate(i=>i.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || i.alt);
  await img.click();
  assert.equal(await p.locator('dialog figcaption').textContent(),expectedCaption);
  await p.locator('dialog[open] img').evaluate(async i=>i.decode());
  assert.equal(await p.locator('dialog[open]').count(),1);
  const slide=await p.locator('[data-current]').count() ? await p.locator('[data-current]').textContent() : null;
  await p.keyboard.press('ArrowRight');
  if(slide) assert.equal(await p.locator('[data-current]').textContent(),slide);
  await p.locator('dialog img').click();
  assert.equal(await p.locator('dialog[open]').count(),0);
  await img.focus();await p.keyboard.press('Enter');
  assert.equal(await p.locator('dialog[open]').count(),1);
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('dialog[open]').count(),0);
  assert(await img.evaluate(i=>document.activeElement===i));
  assert.equal(await p.evaluate(()=>document.documentElement.style.overflow),'');
 }
}
await p.goto(base+'/notes');
assert.equal(await p.locator('[data-zoom-ready]').count(),0);
await p.locator('.note-thumb').first().click();
await p.locator('[data-zoom-ready]').first().waitFor();
assert.deepEqual(errors,[]);
console.log('Viewer passed: project, animated Note, presentation; mobile/desktop; click, keyboard, focus, slide isolation, client navigation and thumbnail exclusion.');
await b.close();
