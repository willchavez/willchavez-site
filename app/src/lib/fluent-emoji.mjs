import { parse, parseFragment, serialize } from 'parse5';
import emoji from '../data/fluent-emoji.json' with { type: 'json' };

const pattern = new RegExp(`(${Object.keys(emoji).sort((a, b) => b.length - a.length).join('|')})\\uFE0F?`, 'gu');
const skip = new Set(['script', 'style', 'code', 'pre', 'textarea', 'title', 'svg', 'math']);

// Transform visible text, including Markdown and card excerpts. Attributes,
// metadata, code samples, and the author's source remain untouched.
export function renderFluentEmoji(html) {
  const doc = parse(html);
  const walk = parent => {
    if (!parent.childNodes || skip.has(parent.tagName)) return;
    parent.childNodes = parent.childNodes.flatMap(node => {
      if (node.nodeName !== '#text') { walk(node); return [node]; }
      let cursor = 0;
      const nodes = [];
      for (const match of node.value.matchAll(pattern)) {
        if (match.index > cursor) nodes.push({ nodeName: '#text', value: node.value.slice(cursor, match.index), parentNode: parent });
        const asset = emoji[match[1]];
        const image = parseFragment(`<img class="fluent-emoji" src="${asset.src}" alt="${match[0]}" title="${asset.label}" width="24" height="24" loading="lazy" decoding="async">`).childNodes[0];
        image.parentNode = parent;
        nodes.push(image);
        cursor = match.index + match[0].length;
      }
      if (!cursor) return [node];
      if (cursor < node.value.length) nodes.push({ nodeName: '#text', value: node.value.slice(cursor), parentNode: parent });
      return nodes;
    });
  };
  walk(doc);
  return serialize(doc);
}
