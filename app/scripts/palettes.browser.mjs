import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:4321';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
const palettes = ['blue-gold', 'forest', 'forest-moss', 'forest-fern', 'forest-pine', 'forest-lichen', 'plum', 'clay', 'parchment'];
const luminance = hex => { const c = hex.match(/\w\w/g).map(x => parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; };
const contrast = (a,b) => {const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
try {
 for (const width of [1440, 375, 320]) {
  const ctx = await browser.newContext({viewport:{width,height:1000}, colorScheme:'light', reducedMotion:'reduce'});
  const page = await ctx.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base);
  await page.locator('[data-palette-picker] summary').click();
  for (const palette of palettes) {
   await page.selectOption('[data-palette-choice]',palette);
   for (const mode of ['light','dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== mode) await page.locator('[data-mode-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
    const tokens=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['paper','ink','muted','fill-ink','rust','surface'].map(k=>[k,s.getPropertyValue('--'+k).trim().replace('#','')]));});
    for(const bg of ['paper','surface']) for(const fg of ['ink','muted']) assert(contrast(tokens[bg],tokens[fg])>=4.5, `${palette} ${mode} ${fg}/${bg}`);
    assert.equal(await page.locator('.home-project').first().evaluate(e => getComputedStyle(e).backgroundColor), await page.evaluate(() => { const probe=document.createElement('i'); probe.style.background='var(--surface)'; document.body.append(probe); const color=getComputedStyle(probe).backgroundColor; probe.remove(); return color; }), 'cards follow palette');
    assert(contrast(tokens.rust,tokens['fill-ink'])>=4.5,`${palette} ${mode} accent`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'no horizontal overflow');
    const box=await page.locator('.theme-panel').boundingBox(); assert(box.x>=0 && box.x+box.width<=width, 'panel fits');
    if(width===1440) await page.screenshot({path:`/tmp/palette-${palette}-${mode}.png`});
   }
  }
  await page.locator('[data-palette-next]').click(); assert.equal(await page.locator('html').getAttribute('data-palette'),'blue-gold');
  await page.selectOption('[data-palette-choice]','forest');
  await page.keyboard.press('Escape'); assert.equal(await page.locator('[data-palette-picker]').getAttribute('open'),null);
  if(width===1440) {await page.locator('.desktop-nav a[href$="/about"]').click(); await page.waitForURL('**/about'); assert.equal(await page.locator('html').getAttribute('data-palette'),'forest');}
  await page.reload(); assert.equal(await page.locator('html').getAttribute('data-palette'),'forest');
  assert.deepEqual(errors,[]); await ctx.close();
 }
 const blocked=await browser.newContext(); await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')}; Storage.prototype.setItem=()=>{throw Error('blocked')};});
 const page=await blocked.newPage(); await page.goto(base); await page.locator('[data-palette-picker] summary').click(); await page.locator('[data-palette-next]').click(); assert.equal(await page.locator('html').getAttribute('data-palette'),'forest'); await blocked.close();
 console.log('PASS: all 18 palette/mode combinations, contrast, desktop/mobile, cycling, mode, navigation, refresh, Escape and blocked storage');
} finally { await browser.close(); }
