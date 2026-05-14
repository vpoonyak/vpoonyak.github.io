# Agent Guide: vk-poonyakanok.github.io

This repository is a static GitHub Pages portfolio for Vitchakorn Poonyakanok. The main implementation lives in `index.html`.

## Working Principles
- Keep edits tightly scoped and preserve the existing single-file architecture unless the user explicitly asks for a larger refactor.
- Prefer existing visual patterns: section numbers, `section-alt-bg`, JetBrains Mono labels, compact badges, and understated borders.
- Use local assets when available instead of adding fragile external image dependencies.
- Do not remove hidden sections or assets unless the user asks; some content is intentionally kept for later reuse.
- Use `rg` for search and `apply_patch` for manual edits.

## Current Visible Section Order
1. `#about`
2. `#experience`
3. `#projects`
4. `#publications`
5. `#training`
6. `#skills`
7. `#languages`
8. `#contact`

The `#expertise` section exists in the markup but is hidden and excluded from navigation/active-section tracking.

## Key UI Behaviors
- Desktop navigation uses fixed top links with active-state styling.
- Mobile navigation uses `#navSectionIndicator`, a mini carousel that shows previous/current/next section chips.
- Active-section tracking is based on a viewport reading line in `updateActiveNav()`.
- Featured projects use a custom carousel with previous/next buttons and dot buttons.
- Project chips are metadata only; click events on `.project-tags` are stopped so chips do not navigate.
- Scroll reveal uses `.fade-in` and delayed reveal calls for direct anchor navigation.

## Content Decisions
- `Expertise` is hidden because the portfolio now prioritizes proof through projects, training, publications, and experience.
- `Applications` is hidden but retained in markup for future reuse.
- `Training` is a standalone section for Super AI Engineer Season 6.
- `Languages` is a standalone section.
- Thai Numeral Converter uses the kicker `Thai Documentation Utility`.
- `4+ Years Data Analysis` in About points to `#skills`.

## Important Assets
- DigiHealth logo: `experience/digihealth-dh.png`
- Scamper logo: `logo/Scamper Logo.png`, referenced as `logo/Scamper%20Logo.png`
- ThaiLLM logo: `logo/ThaiLLM-logo-white.svg`
- OpenAI/GPT logo: `logo/OpenAI-logo-white.svg`
- Power BI logo: `logo/Power-BI.svg`
- Matplotlib logo: `logo/Matplotlib-logo.svg`
- Seaborn logo: `logo/Seaborn-logo.svg`
- ISC2 CC white badge: `badge/certified-in-cybersecurity-cc.1-white.png`
- Tableau favicon/logo: `favicon/tableau.png`

## QA Checklist
Run these after meaningful edits:

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

Then inspect:
- Desktop, tablet, and mobile section layout.
- Mobile mini section carousel active chip.
- Featured project carousel controls.
- Project chips remain static.
- About stat links navigate to the expected sections.
- No horizontal overflow on mobile.

Stop the local server when finished.

## Deployment
- Static site deployed with GitHub Pages from the repository.
- No build step is currently required.
