# Claude Guide: vpoonyak.github.io

This repository is a static GitHub Pages portfolio for Vitchakorn Poonyakanok. The main implementation lives in `index.html`; there is no build step.

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
- Social share card: `pic/og-card.jpg` (1200×630, from `pic/vitchakorn-wider.png`). Keep all content (label, photo, name, tagline, URL) centered within the middle 630×630 square — apps like LINE crop link-preview images to that center square, and content outside it gets cut off. No source HTML template is kept in-repo; regenerate by rebuilding the centered-layout HTML, rendering at 1200×630 via Playwright, and converting with `sips -s format jpeg -s formatOptions 82`.

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
