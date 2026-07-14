// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import matter from 'gray-matter';
import blogAdmin from './integrations/blog-admin.mjs';

const blogDir = fileURLToPath(new URL('src/content/blog/', import.meta.url));

/** Blog post URLs (`/blog/<slug>/`) don't carry a lastmod by default — read
 * each post's own updatedDate/pubDate frontmatter so the sitemap reflects
 * actual content freshness instead of the build time. */
function lastmodForBlogPost(url) {
  const match = url.match(/\/blog\/([^/]+)\/$/);
  if (!match) return undefined;
  const filePath = path.join(blogDir, `${match[1]}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  const date = data.updatedDate ?? data.pubDate;
  return date ? new Date(date) : undefined;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://vitchakorn.com',
  integrations: [
    sitemap({
      customPages: [
        'https://vitchakorn.com/credentials.html',
        'https://vitchakorn.com/project/',
        'https://vitchakorn.com/project/ddschatbot/',
        'https://vitchakorn.com/project/altit/',
        'https://vitchakorn.com/project/yfmalaria/',
        'https://vitchakorn.com/project/hospcode/',
        'https://vitchakorn.com/project/hajjmens/',
        'https://vitchakorn.com/project/pm2-5/',
        'https://vitchakorn.com/project/cirrhosis/',
        'https://vitchakorn.com/project/th-numeral/',
        'https://vitchakorn.com/project/bnk48/',
        'https://vitchakorn.com/project/cda2558/',
        'https://vitchakorn.com/project/sichuan-yunnan/',
        'https://vitchakorn.com/project/countries-tiny/'
      ],
      serialize(item) {
        const lastmod = lastmodForBlogPost(item.url);
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      }
    }),
    blogAdmin()
  ]
});