import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderFluentEmoji } from '../src/lib/fluent-emoji.mjs';
import manifest from '../src/data/fluent-emoji.json' with { type: 'json' };

test('renders inline emoji and preserves skin tones and accessible text', () => {
  const html = renderFluentEmoji('<p>💙🌊😜 🙌🏽 👨🏽‍💻 ❤️</p>');
  assert.equal((html.match(/class="fluent-emoji"/g) || []).length, 6);
  assert.match(html, /alt="👨🏽‍💻"/);
  assert.match(html, /man_technologist_3d_medium.png/);
  assert.match(html, /alt="❤️"/);
});
test('preserves attributes, metadata, code, scripts, and normal symbols', () => {
  const html = renderFluentEmoji('<title>💙</title><p title="💙">© 2026 ↗ 💙</p><pre>💙</pre><code>💙</code><script>const x = "💙";</script>');
  assert.equal((html.match(/class="fluent-emoji"/g) || []).length, 1);
  assert.match(html, /<title>💙<\/title>/);
  assert.match(html, /<p title="💙">© 2026 ↗/);
  assert.match(html, /<pre>💙<\/pre>/);
  assert.match(html, /<script>const x = "💙";<\/script>/);
  assert.equal(renderFluentEmoji(html), html);
});
test('every bundled emoji has a local asset', () => {
  for (const { src } of Object.values(manifest)) assert.ok(fs.existsSync(new URL(`../public${src}`, import.meta.url)), src);
});
