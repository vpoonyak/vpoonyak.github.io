#!/usr/bin/env node
// Dev-time tool -- NOT part of the production build, NOT shipped anywhere.
//
// Run after `npm run build`. Scans every built `lang="th"` post in dist/,
// tokenizes it with nlpo3-newmm-typescript (a fuller Thai dictionary than
// what ships in browsers), and diffs that against what Intl.Segmenter (the
// same engine browsers use) would do. Anything already in
// thai-word-joins.json is skipped. Prints the rest as candidates.
//
// This does NOT auto-update the approved list. Raw diffs include a lot of
// noise -- ordinary multi-word phrases (เพื่อให้, ไม่ต้อง) that a
// NLP-oriented dictionary treats as one token but that are completely fine
// to wrap across a line. A human has to look at each candidate and decide
// "genuinely atomic word" vs "just a common phrase" before it's safe to add
// to the list that controls real readers' line-wrapping.
//
// Usage: node scripts/thai-word-audit.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NewmmTokenizer } from 'nlpo3-newmm-typescript';
import { loadHtml, extractThaiBlockText } from './lib/thai-html-walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const distBlogDir = path.join(repoRoot, 'dist', 'blog');
const approvedListPath = path.join(repoRoot, 'src', 'data', 'thai-word-joins.json');

if (!existsSync(distBlogDir)) {
  console.error('dist/blog not found -- run `npm run build` first.');
  process.exit(1);
}

const approved = new Set(JSON.parse(readFileSync(approvedListPath, 'utf-8')).words);

const tokenizer = new NewmmTokenizer();
const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
function browserSegments(word) {
  return Array.from(segmenter.segment(word), (s) => s.segment).filter((s) => s.trim().length > 0);
}

// Tokens that start with a Thai combining mark/tone mark/sign can never be a
// real standalone word -- they're artifacts of the tokenizer running into
// an edge case (e.g. abbreviation marks), not genuine candidates.
const COMBINING_START = /^[่้๊๋็์ํฯๆๅ]/;
const THAI_ONLY = /^[฀-๿]+$/;

let totalCandidates = 0;

for (const slug of readdirSync(distBlogDir)) {
  const htmlPath = path.join(distBlogDir, slug, 'index.html');
  if (!existsSync(htmlPath)) continue;

  const html = readFileSync(htmlPath, 'utf-8');
  const $ = loadHtml(html);
  if ($('.markdown-body[lang="th"]').length === 0) continue;

  const text = extractThaiBlockText($);
  if (!text) continue;

  const groundTruth = tokenizer
    .segment(text, true)
    .filter((w) => THAI_ONLY.test(w) && w.length > 1 && !COMBINING_START.test(w));

  const uniqTokens = [...new Set(groundTruth)];
  const candidates = uniqTokens.filter((w) => !approved.has(w) && browserSegments(w).length > 1);

  if (candidates.length > 0) {
    console.log(`\n=== ${slug} ===`);
    console.log(`${candidates.length} new candidate word(s) not yet in thai-word-joins.json:`);
    console.log(candidates.join(', '));
    totalCandidates += candidates.length;
  }
}

if (totalCandidates === 0) {
  console.log('No new candidates found -- every mis-segmented word in the built Thai posts is already in the approved list.');
} else {
  console.log(`\n${totalCandidates} total candidate(s) across all posts.`);
  console.log('Review each one by hand -- keep genuinely atomic words (ตัวเอง-class),');
  console.log('drop ordinary multi-word phrases (เพื่อให้-class) -- then add the good ones');
  console.log('to scripts/thai-word-joins.json manually.');
}
