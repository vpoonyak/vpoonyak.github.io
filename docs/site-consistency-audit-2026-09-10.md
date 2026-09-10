# Site consistency audit — 2026-09-10

## Coverage

Reviewed the homepage, Contact, 404, blog listing, all three blog articles
(including the Thai/English pair), project archive, credential archive, and
all 13 project case studies: 22 content pages. The legacy credential redirect
is checked separately for valid targets. The Google verification file, retained
design prototype, and immersive 3D embed are not normal content pages; their
distinct structures were preserved. The embed's light backdrop was updated.

## Changes

- Unified remaining Inter body/headline styles with the portfolio's Helvetica
  Neue stack; retained monospace for code and Newsreader for editorial accents.
- Aligned blog filters, article navigation, badges, and project actions with
  pill controls. Interactive controls have at least 44px touch targets where
  changed; descriptive badges remain compact.
- Fixed narrow 404/article navigation. Redundant back links hide on small
  screens; bilingual article switching moves into the hamburger menu.
- Matched standalone theme defaults to the homepage and added Home to menus.
- Added standalone main landmarks and skip links, and the missing Contact h1.
- Restored the full DigiHealth degree title and clarified credential-link wording.
- Used `#faf9f6` for the light canvas and white for cards, including matching
  standalone pages, map neutral surfaces, and the 3D scene background.

## Verification

- `npm run build`, `git diff --check`, and JS syntax checks pass.
- `node scripts/audit-site.mjs`: 23 documents, zero issues. Checks metadata,
  main/h1 structure, unique IDs, image alt attributes, local assets/links/anchors,
  JSON structured data, and decorative arrows in actions. Includes the redirect.
- Chrome iframe viewport checks covered all 22 pages at 320, 768, and 1440px
  (66 checks). Four narrow navigation overflows were found and fixed; a follow-up
  checked those four pages plus Home and Contact at 320px with zero overflows.
- Native HTML video playback advanced from DDS Chatbot (1.18s sampled playback)
  to Altitude Analyzer (1.68s sampled playback) after a complete autoplay interval.
  Only the active video played. Offscreen playback stayed paused as intended.
- Carousel scrolling uses native CSS scroll-snap; JavaScript controls rotation,
  progress, visibility, and user pause. The floating controls remain within the
  media boundaries and do not cover the project description.
- Earlier checks on this branch verified portrait/landscape control bounds,
  glass blur on both controls, and reduced-motion pausing with no floating offset.

These are local Chrome checks, not a separate real-device Safari run. External
publication/credential claims were checked for naming consistency, not independently
re-validated as research or credential verification.

## DDS Chatbot integration

The live Space responds successfully but currently sends `frame-ancestors 'none'`
and `X-Frame-Options: DENY`. It cannot be embedded by the portfolio as deployed.
[Hugging Face documents iframe embedding](https://huggingface.co/docs/hub/spaces-embed).

Prepared backend commit `73fc72e` on `feat/portfolio-embed` in the isolated worktree
`/tmp/ddschatbot-portfolio-embed`. It adds `/embed`, allowing only the three production
portfolio origins, and a data-free `/embed/status` capability check. Other routes
retain framing restrictions. Three isolated production-middleware tests pass;
no inference calls or data/model changes were made.

The case study now supports a responsive inline demo with open/close controls,
but shows its “Try it here” button only after the capability check succeeds.
Until the backend is deployed, the existing external demo link remains available.
Production iframe/chat interaction still needs verification after that deployment.

At audit completion, these changes were local and awaiting deployment approval.
