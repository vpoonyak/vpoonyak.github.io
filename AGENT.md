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
- Mobile/tablet navigation uses `#navSectionIndicator`, a horizontally scrollable all-section chip strip. The current section should use the same visual language as the desktop active nav state.
- Active-section tracking is based on a viewport reading line in `updateActiveNav()`.
- Featured projects use a custom carousel with previous/next buttons, dot buttons, autoplay while in view, and mobile swipe gestures.
- On mobile, Featured Work controls are duplicated into `.featured-project-mobile-nav` and inserted directly below the active project thumbnail. Keep this row independent from caption height so long titles/descriptions do not move the controls.
- Featured project slides are `article` elements with separate `.featured-project-media-link` and `.featured-project-copy-link` anchors. Preserve this structure to avoid nested interactive elements when mobile controls sit between media and caption.
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
- Mobile/tablet section chip strip: all sections should be scrollable, and the active chip should match desktop active styling.
- Featured project carousel controls on desktop.
- Featured project carousel on mobile: controls should appear below the thumbnail, stay stable when captions change, dots should update, and swipe should not accidentally open project links.
- Project chips remain static.
- About stat links navigate to the expected sections.
- No horizontal overflow on mobile.

Stop the local server when finished.

## Deployment
- Static site deployed with GitHub Pages from the repository.
- No build step is currently required.
