# Claude Guide: vpoonyak.github.io

This repository is a static GitHub Pages portfolio for Vitchakorn Poonyakanok, built with Astro (`src/pages/`, `src/components/`, `src/layouts/`) and deployed via `npm run build` in `.github/workflows/deploy.yml`. There is no root `index.html` anymore — the homepage is `src/pages/index.astro`.

## Working Principles
- Keep edits tightly scoped and preserve the single-file site architecture unless the user asks for a larger refactor.
- Match the existing design language: section numbers, understated borders, compact badges, JetBrains Mono labels, and responsive wrapping.
- Use local assets when available. Do not remove hidden sections or unused assets unless explicitly requested.
- Use `rg` for search and `apply_patch` for manual edits.

## Current Visible Section Order
1. `#about`
2. `#experience`
3. `#projects`
4. `#publications`
5. `#training`
6. `#skills`
7. `#contact`

The `#expertise` section exists in markup but is hidden and excluded from navigation/active-section tracking.

## Content Notes
- DigiHealth is complete. Use `Master of Science in Digital and AI Technologies in Health Systems (DigiHealth)` and the date range `2025 — 2026`.
- The About intro should describe DigiHealth as completed, not currently pursued.
- Training has Super AI Engineer Season 6 as a standalone section.
- AI Practitioner is the primary visible Level 1 credential. Its public verification link is `https://mysuperai.aiat.or.th/verify/3893dd94-0ff5-464f-b26f-f8f44e655bdf`.
- Keep Foundation AI (Theory) and the three Level 1 Minihacks inside the collapsible `Level 1 detail` block under AI Practitioner.
- Level 1 Minihacks use public `mysuperai.aiat.or.th/verify/...` links rather than local certificate images.
- Level 2 entries remain visible as separate online/on-site hackathon evidence, but method writeups stay inside collapsible `Method detail` blocks.
- Additional clinical methods training is collapsed under `Additional clinical methods training`.
- `#skills` is labeled `Capabilities` in visible UI and combines selected stack badges with a collapsed credential archive.
- Languages are no longer a standalone section; they live as a `Languages` column inside `#skills`.
- Desktop Projects are a four-item Top Projects grid; mobile keeps the carousel.
- The About stats grid's "Years Clinical Practice" / "Years Data Analysis" numbers are computed at load from `data-years-since` attributes on their `.stat-number` spans (see script's "Stat Years" block), not hand-edited — update the date attribute, not the visible text, if an anchor date changes. Clinical practice anchors to the Nong Khai Hospital start date (`2019-09-09`, confirmed against `profile.yaml`); data analysis anchors to the Chiang Mai University Diploma in Clinical Statistics start (`2022-02-05`).

## Important Assets
- DigiHealth logo: `experience/digihealth-dh.png`
- Scamper logo: `logo/Scamper Logo.png`, referenced as `logo/Scamper%20Logo.png`
- Tableau favicon/logo: `favicon/tableau.png`
- ISC2 CC white badge: `badge/certified-in-cybersecurity-cc.1-white.png`
- Social share card: `pic/og-card.jpg` (1200×1200 square, full-bleed `pic/vitchakorn-wider.png` with a bottom gradient scrim and text overlaid directly on the photo — label, name, tagline, URL). Square + text-on-photo is deliberate: iOS's LinkPresentation framework (used by LINE, iMessage, Mail, etc. for rich link previews) does face-priority smart-cropping on `og:image` and was cutting the name/tagline out entirely when they lived in a separate region from the photo — a square source avoids the aspect-crop, and overlaying text on the same image layer as the face means a face-priority crop is far more likely to still catch nearby text. `og:image:width`/`height` must stay `1200`/`1200` if regenerated. No source HTML template is kept in-repo; rebuild the full-bleed-photo-with-scrim HTML, render at 1200×1200 via Playwright, and convert with `sips -s format jpeg -s formatOptions 80`.

## Project Case-Study Pages
- Each project under `public/project/` lives in its own folder: `public/project/<slug>/index.html` plus that project's own assets (thumb, case images, any data files) alongside it. URLs are clean folder paths, e.g. `/project/yfmalaria/`.
- The old flat `public/project/<slug>.html` paths were removed (no redirect stubs) — old bookmarks/backlinks to those URLs now 404. Don't recreate flat `<slug>.html` files; always use the `<slug>/index.html` folder form.
- `public/project/index.html` (the Project Archive listing) and its per-card links/thumbs must stay in sync with the actual folder names.
- New/renamed project URLs also need updating in `src/components/Projects.astro` (Top Projects carousel) and the `customPages` list in `astro.config.mjs` (sitemap).
- `dist/` is a pure Astro build artifact (gitignored) — CI's `deploy.yml` runs `npm run build` fresh and deploys that, so never hand-edit anything under `dist/`; edit `public/`/`src/` and run `npx astro build` locally only to verify.

## Blog
- "The blog" means the Astro-routed blog at `/blog/` — posts are `src/content/blog/<slug>.md` (Astro content collection, frontmatter: `title`, `description`, `pubDate`, `updatedDate`, `draft`, `lang`, `tags`, `heroImage`), rendered by `src/pages/blog/[slug].astro` + `src/layouts/BlogPost.astro`, listed at `src/pages/blog/index.astro`. Not related to any other "blog"/"post"/"article" wording elsewhere.
- Each post's own images/PDFs live in `public/blog/<slug>/` (same one-folder-per-slug convention as project pages), referenced as `/blog/<slug>/<file>` in the markdown body.
- There's a local-dev-only editor at `/admin/blog` (`integrations/blog-admin.mjs`) for creating/editing posts through a form instead of hand-editing the `.md` files — it only runs under `astro dev` (hooks `astro:server:setup`), never in the static build.
- `BlogPost.astro` renders `<Navigation compact backHref="/blog" backLabel="Blog" />` — a distinct minimal nav variant from the full site nav (`src/components/Navigation.astro`), single-row at every viewport width. Its hamburger dropdown is intentionally trimmed to Home/Project Archive/Contact only (not the full homepage section list) since those anchors don't apply on a blog post page.
- Reading time (`src/utils/readingTime.ts`) strips markdown/HTML syntax before counting, then estimates English words at 200 wpm and Thai characters at 900 chars/min (≈ same 200 wpm baseline, using ~4.5 chars/Thai word) — don't naively lower that constant back down, it was previously 450 and inflated estimates ~2x.
- Sitemap `lastmod` for blog URLs is read directly from each post's own `updatedDate`/`pubDate` frontmatter (see `lastmodForBlogPost` in `astro.config.mjs`), not from git or filesystem mtime.

## QA Checklist
Run after meaningful edits:

```bash
git diff --check
```

Check local asset references:

```bash
node -e "const fs=require('fs'),path=require('path'); const html=fs.readFileSync('index.html','utf8'); const attrs=[...html.matchAll(/(?:src|href)=\\\"([^\\\"]+)\\\"/g)].map(m=>m[1]); const local=attrs.filter(v=>!v.startsWith('http')&&!v.startsWith('mailto:')&&!v.startsWith('#')&&!v.startsWith('tel:')&&!v.startsWith('data:')); const missing=[]; for (const v of local){ const clean=decodeURIComponent(v.split('#')[0].split('?')[0]); if(clean && !fs.existsSync(path.join(process.cwd(),clean))) missing.push(v); } console.log(JSON.stringify({local:local.length,missing},null,2));"
```

For browser QA, run a localhost-only server:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then inspect desktop, tablet, and mobile layouts; section navigation; the Training collapsible detail; and mobile horizontal overflow.
