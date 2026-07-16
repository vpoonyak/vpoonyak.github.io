#!/usr/bin/env node
// NOT wired into this site's `npm run build` -- deliberately not applied to
// this site's own pages. Run manually via `npm run thai:apply-word-joins`
// if that ever changes. Its only current use is backing the "with
// word-joiner list" tab of the interactive demo in the Thai typography
// post, which runs this exact same logic client-side (see BlogPost.astro)
// purely to demonstrate the mechanism, not to apply it to real content.
//
// Reads src/data/thai-word-joins.json (a small, hand-reviewed list of Thai
// words the browser's own Intl.Segmenter mis-splits) and wraps them -- plus
// every Maiyamok (ๆ) occurrence -- in `<span style="white-space:nowrap">`
// in every built `lang="th"` post's rendered HTML, so no engine has
// grounds to break inside them.
//
// This used to insert U+2060 WORD JOINER between grapheme clusters instead
// of wrapping in spans. That approach had a real bug: injecting WORD JOINER
// characters into the middle of a word could confuse Chromium's Thai
// dictionary-based line-breaker badly enough that it also lost the (valid,
// unrelated) break opportunity *before* the joined word, forcing an
// overflow-wrap fallback break inside the *preceding* word instead --
// observed splitting "อ่าน" into "อ่า"+"น" purely because "รายละเอียด" right
// after it had been joined. `white-space: nowrap` uses ordinary CSS layout
// semantics instead of Unicode line-break-class interactions with the
// dictionary re-scan, and doesn't have this failure mode.
//
// Skips code/pre/a/heading/script/style/textarea subtrees (see
// lib/thai-html-walk.mjs) so anchor-id slugs, code samples, and the live
// demo's own source text are never touched.
//
// No tokenizer, dictionary, or extra JS ships to readers because of this --
// the output is plain static HTML with a few extra <span> wrappers baked in.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtml, walkThaiTextNodes, segmentThaiText, segmentsToHtml } from './lib/thai-html-walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const distBlogDir = path.join(repoRoot, 'dist', 'blog');
const approvedListPath = path.join(repoRoot, 'src', 'data', 'thai-word-joins.json');

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

// Split into user-perceived characters (grapheme clusters), not raw UTF-16
// code units -- word.split('') would split a base consonant apart from its
// own combining vowel/tone marks (e.g. ข + ั + ้ is ONE visual unit, not
// three).
function toGraphemeClusters(word) {
  return Array.from(graphemeSegmenter.segment(word), (s) => s.segment);
}

if (!existsSync(distBlogDir)) {
  console.log('dist/blog not found -- skipping Thai word-join postprocessing.');
  process.exit(0);
}

const words = JSON.parse(readFileSync(approvedListPath, 'utf-8')).words;
// longest-first so a longer listed word (e.g. a future compound containing
// a shorter listed word) is matched before its shorter substring would be
const sortedWords = [...words].sort((a, b) => b.length - a.length);

let filesChanged = 0;
let totalReplacements = 0;

for (const slug of readdirSync(distBlogDir)) {
  const htmlPath = path.join(distBlogDir, slug, 'index.html');
  if (!existsSync(htmlPath)) continue;

  const html = readFileSync(htmlPath, 'utf-8');
  const $ = loadHtml(html);

  let fileReplacements = 0;
  const mutated = walkThaiTextNodes($, (text) => {
    const segments = segmentThaiText(text, sortedWords, toGraphemeClusters);
    const nowrapCount = segments.filter((s) => s.type === 'nowrap').length;
    if (nowrapCount === 0) return undefined;
    fileReplacements += nowrapCount;
    return segmentsToHtml(segments);
  });

  if (mutated) {
    writeFileSync(htmlPath, $.html(), 'utf-8');
    filesChanged++;
    totalReplacements += fileReplacements;
    console.log(`  ${slug}: ${fileReplacements} word-join(s) applied`);
  }
}

console.log(`Thai word-join postprocessing: ${filesChanged} file(s) changed, ${totalReplacements} total replacement(s).`);
