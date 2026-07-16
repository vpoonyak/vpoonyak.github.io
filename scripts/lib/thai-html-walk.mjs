import * as cheerio from 'cheerio';

// textarea is included because the Thai typography post embeds a live demo
// whose default value is plain, unmodified Thai text that the demo's own
// client-side script processes -- if the postbuild step joins words inside
// it too, the demo's "source" text is corrupted before any JS runs.
const SKIP_TAGS = new Set(['code', 'pre', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'textarea']);

/**
 * Walk every text node under `.markdown-body[lang="th"]` in a cheerio-loaded
 * HTML document, skipping code/pre/a/heading/script/style/textarea subtrees
 * so anchor-id slugs, code samples, and the live demo's own source text are
 * never touched.
 *
 * `visit(text)` is called for each qualifying text node; return an HTML
 * fragment string to replace the node with (e.g. containing `<span>` tags),
 * or `undefined` to leave it unchanged. The returned string is parsed as
 * HTML, not treated as plain text -- callers are responsible for escaping
 * any of the original text they pass through unwrapped.
 */
export function walkThaiTextNodes($, visit) {
  const root = $('.markdown-body[lang="th"]');
  if (root.length === 0) return false;

  let mutated = false;
  const toReplace = [];

  function walk(el) {
    const node = el.get ? el.get(0) : el;
    if (!node) return;

    if (node.type === 'text') {
      const original = node.data;
      if (!original) return;
      const replacementHtml = visit(original);
      if (replacementHtml !== undefined) {
        toReplace.push([node, replacementHtml]);
        mutated = true;
      }
      return;
    }

    if (node.type === 'tag') {
      if (SKIP_TAGS.has(node.name)) return;
      for (const child of node.children || []) {
        walk(child);
      }
    }
  }

  for (const child of root.get(0).children || []) {
    walk(child);
  }

  // Replace after the walk completes, not during -- mutating node.children
  // mid-traversal (which .replaceWith() does) would otherwise disturb the
  // in-progress walk over the original tree.
  for (const [node, html] of toReplace) {
    $(node).replaceWith(html);
  }

  return mutated;
}

/**
 * Extract per-block plain text (paragraphs, list items, headings,
 * blockquotes) from `.markdown-body[lang="th"]`, joined with newlines.
 * Calling .text() block-by-block (instead of once on the whole container)
 * avoids merging adjacent inline runs across block boundaries -- the same
 * artifact that corrupted "สหรัฐฯ" into garbage fragments when this was
 * first attempted with a naive regex tag-strip.
 */
export function extractThaiBlockText($) {
  const root = $('.markdown-body[lang="th"]');
  if (root.length === 0) return '';
  const blocks = [];
  root.find('p, li, h2, h3, h4, blockquote, td, th').each((_, el) => {
    const text = $(el).text().trim();
    if (text) blocks.push(text);
  });
  return blocks.join('\n');
}

export function loadHtml(html) {
  return cheerio.load(html, { xml: false });
}

export function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Break `text` into segments that should stay together (matched words from
 * `sortedWords`, longest-first, plus a Maiyamok-mark segment for every ๆ and
 * the single character before it) versus plain text in between.
 *
 * Returns an array of { type: 'text' | 'nowrap', value } in original order.
 * Grapheme-cluster aware throughout (see toGraphemeClusters below) so a
 * Maiyamok segment never splits a base character from its own combining
 * mark.
 */
export function segmentThaiText(text, sortedWords, toGraphemeClusters) {
  let segments = [{ type: 'text', value: text }];

  for (const word of sortedWords) {
    const next = [];
    for (const seg of segments) {
      if (seg.type !== 'text' || !seg.value.includes(word)) {
        next.push(seg);
        continue;
      }
      const parts = seg.value.split(word);
      parts.forEach((part, i) => {
        if (part) next.push({ type: 'text', value: part });
        if (i < parts.length - 1) next.push({ type: 'nowrap', value: word });
      });
    }
    segments = next;
  }

  // Maiyamok (ๆ, U+0E46) must never start a line -- W3C's Thai Gap Analysis
  // documents every major engine getting this wrong:
  // https://www.w3.org/TR/thai-gap/. Glue it to the single grapheme cluster
  // immediately before it. Only scan remaining 'text' segments -- a ๆ that
  // ended up inside an already-matched curated word is already protected.
  const final = [];
  for (const seg of segments) {
    if (seg.type !== 'text') {
      final.push(seg);
      continue;
    }
    const clusters = toGraphemeClusters(seg.value);
    let buffer = [];
    for (const cluster of clusters) {
      if (cluster === 'ๆ' && buffer.length > 0) {
        const lastCluster = buffer.pop();
        if (buffer.length) final.push({ type: 'text', value: buffer.join('') });
        final.push({ type: 'nowrap', value: lastCluster + 'ๆ' });
        buffer = [];
      } else {
        buffer.push(cluster);
      }
    }
    if (buffer.length) final.push({ type: 'text', value: buffer.join('') });
  }

  return final;
}

export function segmentsToHtml(segments) {
  return segments
    .map((seg) => {
      const escaped = escapeHtml(seg.value);
      return seg.type === 'nowrap' ? `<span style="white-space:nowrap">${escaped}</span>` : escaped;
    })
    .join('');
}
