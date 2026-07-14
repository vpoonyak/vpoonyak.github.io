// Local-dev-only admin editor for the `src/content/blog` collection.
//
// This integration hooks `astro:server:setup`, which Astro only ever calls
// while `astro dev` is running its Vite dev server. It is never invoked
// during `astro build` (static build) or `astro preview` (serves the
// already-built `dist/` output as static files, no integration hooks run).
// There are no page files under `src/pages`, no server rendering flags, and
// no adapter involved, so none of this code — and none of the `/admin/blog`
// route — can end up in the static build output by construction.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ADMIN_BASE = '/admin/blog';

/** Escape a string for safe interpolation into HTML text content or attributes. */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]);
}

/** Sanitize a user-supplied slug/filename to `[a-z0-9-]` only. */
function sanitizeSlug(raw) {
  return String(raw ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format a Date (or date-ish value) as an `YYYY-MM-DD` string for a date input. */
function toDateInputValue(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function pageShell(title, bodyHtml) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; margin: 2rem auto; max-width: 860px; padding: 0 1rem; color: #111; }
  h1 { font-size: 1.4rem; }
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { border: 1px solid #ccc; padding: 0.4rem 0.6rem; text-align: left; font-size: 0.9rem; }
  th { background: #f2f2f2; }
  a { color: #0645ad; }
  .toolbar { margin: 1rem 0; }
  form { display: flex; flex-direction: column; gap: 0.9rem; max-width: 640px; }
  label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem; font-weight: 600; }
  input[type=text], input[type=date], select, textarea { font: inherit; padding: 0.4rem; border: 1px solid #999; border-radius: 4px; }
  textarea { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; }
  textarea.body { min-height: 320px; }
  .checkbox-row { flex-direction: row; align-items: center; gap: 0.5rem; }
  .actions { margin-top: 0.5rem; }
  button { font: inherit; padding: 0.5rem 1rem; cursor: pointer; }
  .error { background: #fdecea; border: 1px solid #f5c2c0; color: #7a1c1c; padding: 0.6rem 0.8rem; border-radius: 4px; }
  .muted { color: #666; font-size: 0.85rem; }
  code { background: #f2f2f2; padding: 0.1rem 0.3rem; border-radius: 3px; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function renderList(posts) {
  const rows = posts.length
    ? posts
        .map((p) => {
          const editHref = `${ADMIN_BASE}/edit?slug=${encodeURIComponent(p.slug)}`;
          return `<tr>
  <td><a href="${editHref}">${escapeHtml(p.data.title ?? '(untitled)')}</a></td>
  <td><code>${escapeHtml(p.slug)}</code></td>
  <td>${escapeHtml(p.data.lang ?? 'en')}</td>
  <td>${p.data.draft ? 'yes' : 'no'}</td>
  <td>${escapeHtml(toDateInputValue(p.data.pubDate))}</td>
</tr>`;
        })
        .join('\n')
    : `<tr><td colspan="5" class="muted">No posts yet.</td></tr>`;

  const body = `
<h1>Blog admin</h1>
<div class="toolbar"><a href="${ADMIN_BASE}/new">+ New post</a></div>
<table>
  <thead>
    <tr><th>Title</th><th>Slug</th><th>Lang</th><th>Draft</th><th>Pub date</th></tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>
`;
  return pageShell('Blog admin', body);
}

function renderEditForm({ isNew, slug, data, body, error }) {
  const title = isNew ? 'New post' : `Edit: ${slug}`;
  const tagsValue = Array.isArray(data.tags) ? data.tags.join(', ') : '';

  const slugField = isNew
    ? `<label>Slug / filename
  <input type="text" name="slug" placeholder="my-new-post" value="${escapeHtml(slug ?? '')}" required>
</label>
<p class="muted">Will be sanitized to <code>[a-z0-9-]</code> and saved as <code>&lt;slug&gt;.md</code>. Will not overwrite an existing file.</p>`
    : `<input type="hidden" name="existingSlug" value="${escapeHtml(slug)}">
<p class="muted">Slug: <code>${escapeHtml(slug)}</code></p>`;

  const errorHtml = error ? `<div class="error">${escapeHtml(error)}</div>` : '';

  const formBody = `
<h1>${escapeHtml(title)}</h1>
<p><a href="${ADMIN_BASE}">&larr; Back to list</a></p>
${errorHtml}
<form method="post" action="${ADMIN_BASE}/save">
  ${slugField}
  <label>Title
    <input type="text" name="title" value="${escapeHtml(data.title ?? '')}" required>
  </label>
  <label>Description
    <textarea name="description" rows="3" required>${escapeHtml(data.description ?? '')}</textarea>
  </label>
  <label>Pub date
    <input type="date" name="pubDate" value="${escapeHtml(toDateInputValue(data.pubDate))}" required>
  </label>
  <label>Updated date (optional)
    <input type="date" name="updatedDate" value="${escapeHtml(toDateInputValue(data.updatedDate))}">
  </label>
  <label>Hero image (optional)
    <input type="text" name="heroImage" value="${escapeHtml(data.heroImage ?? '')}">
  </label>
  <label>Tags (comma-separated)
    <input type="text" name="tags" value="${escapeHtml(tagsValue)}">
  </label>
  <label class="checkbox-row">
    <input type="checkbox" name="draft" ${data.draft ? 'checked' : ''}> Draft
  </label>
  <label>Lang
    <select name="lang">
      <option value="en" ${data.lang === 'th' ? '' : 'selected'}>en</option>
      <option value="th" ${data.lang === 'th' ? 'selected' : ''}>th</option>
    </select>
  </label>
  <label>Body (Markdown)
    <textarea class="body" name="body">${escapeHtml(body ?? '')}</textarea>
  </label>
  <div class="actions">
    <button type="submit">Save</button>
  </div>
</form>
`;
  return pageShell(title, formBody);
}

/** Read all posts in the blog content directory, parsed via gray-matter. */
function readAllPosts(blogDir) {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(blogDir, filename), 'utf-8');
      const parsed = matter(raw);
      return { slug, filename, data: parsed.data, content: parsed.content };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

export default function blogAdmin() {
  /** @type {URL | undefined} */
  let blogContentDirUrl;

  return {
    name: 'blog-admin',
    hooks: {
      'astro:config:setup': ({ config }) => {
        blogContentDirUrl = new URL('src/content/blog/', config.root);
      },
      'astro:server:setup': ({ server, logger }) => {
        server.middlewares.use(async (req, res, next) => {
          try {
            if (!req.url || !req.url.startsWith(ADMIN_BASE)) {
              return next();
            }

            const blogDir = fileURLToPath(blogContentDirUrl);
            const url = new URL(req.url, 'http://localhost');
            const pathname = url.pathname;

            // GET /admin/blog — list view
            if (req.method === 'GET' && pathname === ADMIN_BASE) {
              const posts = readAllPosts(blogDir);
              return sendHtml(res, 200, renderList(posts));
            }

            // GET /admin/blog/new — empty edit form
            if (req.method === 'GET' && pathname === `${ADMIN_BASE}/new`) {
              const html = renderEditForm({
                isNew: true,
                slug: '',
                data: { title: '', description: '', pubDate: new Date(), draft: false, lang: 'en' },
                body: '',
              });
              return sendHtml(res, 200, html);
            }

            // GET /admin/blog/edit?slug=<name> — pre-filled edit form
            if (req.method === 'GET' && pathname === `${ADMIN_BASE}/edit`) {
              const slug = url.searchParams.get('slug') || '';
              const filePath = path.join(blogDir, `${slug}.md`);
              if (!slug || !fs.existsSync(filePath)) {
                return sendHtml(res, 404, pageShell('Not found', `<h1>Post not found</h1><p><a href="${ADMIN_BASE}">&larr; Back to list</a></p>`));
              }
              const raw = fs.readFileSync(filePath, 'utf-8');
              const parsed = matter(raw);
              const html = renderEditForm({
                isNew: false,
                slug,
                data: parsed.data,
                body: parsed.content.replace(/^\n+/, ''),
              });
              return sendHtml(res, 200, html);
            }

            // POST /admin/blog/save — create or update
            if (req.method === 'POST' && pathname === `${ADMIN_BASE}/save`) {
              const rawBody = await readBody(req);
              const params = new URLSearchParams(rawBody);

              const existingSlug = params.get('existingSlug');
              const isNew = !existingSlug;
              const title = params.get('title') || '';
              const description = params.get('description') || '';
              const pubDateRaw = params.get('pubDate') || '';
              const updatedDateRaw = params.get('updatedDate') || '';
              const heroImage = params.get('heroImage') || '';
              const tagsRaw = params.get('tags') || '';
              const draft = params.get('draft') === 'on';
              const lang = params.get('lang') === 'th' ? 'th' : 'en';
              const body = params.get('body') || '';

              const tags = tagsRaw
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

              let slug;
              if (isNew) {
                slug = sanitizeSlug(params.get('slug'));
                if (!slug) {
                  const html = renderEditForm({
                    isNew: true,
                    slug: params.get('slug') || '',
                    data: { title, description, pubDate: pubDateRaw, updatedDate: updatedDateRaw, heroImage, tags, draft, lang },
                    body,
                    error: 'Slug is required and must contain at least one letter or digit.',
                  });
                  return sendHtml(res, 400, html);
                }
                const targetPath = path.join(blogDir, `${slug}.md`);
                if (fs.existsSync(targetPath)) {
                  const html = renderEditForm({
                    isNew: true,
                    slug,
                    data: { title, description, pubDate: pubDateRaw, updatedDate: updatedDateRaw, heroImage, tags, draft, lang },
                    body,
                    error: `A post with slug "${slug}" already exists. Choose a different slug, or edit it from the list instead.`,
                  });
                  return sendHtml(res, 409, html);
                }
              } else {
                slug = existingSlug;
              }

              const data = {
                title,
                description,
                pubDate: pubDateRaw ? new Date(pubDateRaw) : new Date(),
                draft,
                lang,
              };
              if (updatedDateRaw) data.updatedDate = new Date(updatedDateRaw);
              if (heroImage) data.heroImage = heroImage;
              if (tags.length) data.tags = tags;

              const fileContents = matter.stringify(`\n${body}\n`, data);
              if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
              fs.writeFileSync(path.join(blogDir, `${slug}.md`), fileContents, 'utf-8');

              res.statusCode = 302;
              res.setHeader('Location', ADMIN_BASE);
              return res.end();
            }

            return next();
          } catch (err) {
            logger.error(String(err && err.stack ? err.stack : err));
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Internal error in blog-admin integration: ' + (err && err.message ? err.message : String(err)));
          }
        });
      },
    },
  };
}
