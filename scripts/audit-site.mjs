// Run after `npm run build`. Checks published content; design prototypes and
// the immersive 3D embed intentionally have different page chrome.
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve('dist');
if (!fs.existsSync(root)) throw new Error('Run npm run build first.');
const htmlFiles = fs.readdirSync(root, { recursive: true })
  .filter(file => file.endsWith('.html') && !file.startsWith('prototype/') && !file.startsWith('roles3d/') && !/^google[\da-f]+\.html$/.test(file));
const documents = new Map(htmlFiles.map(file => [path.join(root, file), load(fs.readFileSync(path.join(root, file), 'utf8'))]));
const issues = [];
const report = [];
for (const [file, $] of documents) {
  const route = '/' + path.relative(root, file).replace(/index\.html$/, '');
  const flag = message => issues.push({ page: route, message });
  const title = $('title').text().trim();
  const redirect = $('meta[http-equiv="refresh"]').length > 0;
  if (!title) flag('Missing page title');
  if (!$('html').attr('lang')) flag('Missing document language');
  if (!redirect && $('main').length !== 1) flag('Expected one main landmark');
  if (!redirect && $('h1').length !== 1) flag('Expected one primary heading');
  if (!$('meta[name="description"]').attr('content')) flag('Missing description');
  if (!$('link[rel="canonical"]').attr('href')) flag('Missing canonical URL');
  if (!redirect && !$('.skip-link[href="#main"]').length) flag('Missing skip link');
  const ids = new Set();
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (ids.has(id)) flag(`Duplicate id: ${id}`);
    ids.add(id);
  });
  $('img').each((_, el) => { if ($(el).attr('alt') === undefined) flag(`Missing image alt: ${$(el).attr('src')}`); });
  $('a, button').each((_, el) => {
    if (/[←-⇿]/u.test($(el).text())) flag(`Decorative action arrow: ${$(el).text().trim()}`);
  });
  $('[src], [href], [poster], [data-src]').each((_, el) => {
    for (const attr of ['src', 'href', 'poster', 'data-src']) {
      const value = $(el).attr(attr);
      if (!value) continue;
      const url = new URL(value, `https://vitchakorn.com${route}`);
      if (url.origin !== 'https://vitchakorn.com') continue;
      let target = path.join(root, decodeURIComponent(url.pathname));
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) { flag(`Missing local target: ${value}`); continue; }
      if (url.hash && documents.has(target)) {
        const targetDoc = documents.get(target);
        const id = decodeURIComponent(url.hash.slice(1));
        if (!targetDoc('[id]').toArray().some(node => targetDoc(node).attr('id') === id)) flag(`Missing anchor: ${value}`);
      }
    }
  });
  $('script[type="application/ld+json"]').each((_, el) => {
    try { JSON.parse($(el).text()); } catch { flag('Invalid structured data JSON'); }
  });
  report.push({ route, title, language: $('html').attr('lang'), redirect });
}
console.log(JSON.stringify({ pages: report.length, issues, inventory: report }, null, 2));
if (issues.length) process.exitCode = 1;
