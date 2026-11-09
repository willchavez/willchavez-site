// Exercise Google's actual tag against a local production build. All collection
// requests are fulfilled locally: this test never sends visits to GA reports.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const id = 'G-RPXX4TMRSH';
const tag = execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '30', `https://www.googletagmanager.com/gtag/js?id=${id}`], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--no-sandbox'] });
async function eventually(check, message) {
  const until = Date.now() + 20000;
  while (!check() && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 100));
  assert(check(), message);
}
async function fixture(host) {
  const context = await browser.newContext();
  const events = [], errors = [];
  let tagLoads = 0;
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname === host) {
      const response = await route.fetch({ url: base + url.pathname + url.search });
      await route.fulfill({ response });
    } else if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
      tagLoads++;
      await route.fulfill({ status: 200, contentType: 'text/javascript', body: tag });
    } else if (url.hostname.endsWith('google-analytics.com')) {
      for (const line of (request.postData() || '').split(/\r?\n/)) {
        const params = new URLSearchParams(url.search);
        for (const [key, value] of new URLSearchParams(line)) params.set(key, value);
        if (params.get('en')) events.push(Object.fromEntries(params));
      }
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
    } else await route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  return { context, page, events, errors, get tagLoads() { return tagLoads; }, views: () => events.filter(event => event.en === 'page_view') };
}
try {
  const f = await fixture('willchavez.com'), page = f.page;
  await page.goto('https://willchavez.com/');
  await eventually(() => f.views().length === 1, 'initial page view reaches Google tag collection');
  await page.locator('.home-button').click();
  await page.waitForURL('https://willchavez.com/portfolio');
  await page.waitForTimeout(1300); // Enhanced Measurement debounces history events.
  await page.locator('.desktop-nav a').filter({ hasText: 'Notes' }).click();
  await page.waitForURL('https://willchavez.com/notes');
  await page.waitForTimeout(1300);
  await page.goBack();
  await page.waitForURL('https://willchavez.com/portfolio');
  await page.waitForTimeout(1300);
  await page.goForward();
  await page.waitForURL('https://willchavez.com/notes');
  await eventually(() => f.views().length === 5, 'Astro navigation and browser history each produce a page view');
  await page.waitForTimeout(5500); // Allow batched automatic events to expose duplicates.
  assert.equal(f.views().length, 5);
  assert.equal(f.tagLoads, 1, 'one tag load across Astro page swaps');
  assert.deepEqual(f.views().map(event => new URL(event.dl).pathname), ['/', '/portfolio', '/notes', '/portfolio', '/notes']);
  assert.match(f.views()[1].dt, /Projects/);
  assert.match(f.views()[2].dt, /Notes/);
  assert(f.views().every(event => event.tid === id));
  await page.goto('https://willchavez.com/portfolio/genui-bebop');
  await eventually(() => f.views().length === 6, 'project article sends a page view');
  await page.locator('[data-project-present]').click();
  await page.waitForURL('**/present?**#slide-1');
  await eventually(() => f.views().length === 7, 'standalone presentation sends a page view');
  await page.locator('[data-next]').click();
  await page.locator('[data-next]').click();
  await page.waitForTimeout(5500);
  assert.equal(f.views().length, 7, 'slide hash changes do not inflate page views');
  assert.deepEqual(f.errors, []);
  await f.context.close();
  const www = await fixture('www.willchavez.com');
  await www.page.goto('https://www.willchavez.com/');
  await eventually(() => www.views().length === 1, 'www production hostname is tracked');
  await www.context.close();
  for (const host of ['preview.example', 'localhost']) {
    const preview = await fixture(host);
    for (const route of ['/', '/portfolio', '/about', '/portfolio/genui-bebop/present']) await preview.page.goto(`http://${host}${route}`);
    await preview.page.waitForTimeout(500);
    assert.equal(preview.tagLoads, 0, 'preview/local does not load Google tag');
    assert.equal(preview.events.length, 0);
    assert.deepEqual(preview.errors, []);
    await preview.context.close();
  }
  console.log('Actual Google tag: initial/SPA/back/forward page views and titles, single initialization, project/presentation coverage, no slide duplicates, and production-only hosts passed. Collection requests were intercepted; no test visits were sent to Google.');
} finally { await browser.close(); }
