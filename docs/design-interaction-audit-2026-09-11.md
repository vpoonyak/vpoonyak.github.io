# Design and interaction audit — 2026-09-11

Reviewed local commit `b03fbc5` and the live website. A fetch confirmed that
`origin/main` and the working branch were at that commit. This is an audit;
no production styles, behavior, or deployment were changed.

## Recommendation

Keep the existing portfolio identity: Helvetica Neue, restrained blue accents,
warm off-white canvas, editorial accents, rounded project cards, and pill actions.
A whole-site redesign would offer less value than repairing the interaction
inconsistencies below. Prioritize a focused redesign of the YF/Malaria dashboard's
controls and country details, then align the archives and blog with the homepage.

## Coverage and evidence

- Built the latest source with `npm run build`; passed. Existing warnings from
  the Thai tokenizer's Node-module imports remain.
- Ran `node scripts/audit-site.mjs`: 23 documents, zero reported issues. This
  includes the legacy credential redirect and all 22 normal content pages.
- Checked live pages in same-origin Chrome iframes at widths 320, 768, and 1440,
  in light and dark themes: 132 document-width checks, zero page-level horizontal
  overflow results. These checks do not prove that every clipped child, popup,
  focus ring, or overlay fits; the map demonstrates that distinction.
- The live inventory contained 502 anchors and 76 buttons, including generated
  navigation and map controls. These are inventory counts, not 578 manual clicks.
- Static inspection found no placeholder `href="#"` or `javascript:` links.
- Checked shared mobile menu open/Escape-close behavior on Home, Blog, both
  typography articles, both archives, DDS, YF/Malaria, Contact, and 404; passed.
- Theme switching passed on the sampled standalone pages and, after allowing
  the asynchronous transition to finish, Home, Blog, Contact, and 404.
- Blog language filters changed visible entries as expected (All 2, English 1,
  Thai 2). Their programmatic selected state is missing; see below.
- DDS inline demo opened, closed, and reused the same iframe/source on reopen.
  No chat messages were submitted.
- Contact's empty form was invalid as expected. No message was sent, so delivery
  and third-party success/error screens were not tested.
- Native browser inspection covered the homepage, settled project carousel,
  project archive, credential archive, blog, and YF/Malaria search/popups/fullscreen.
  The carousel advanced from DDS to Altitude while visible; choosing project 3
  and pausing updated the status and Play button correctly.
- Browser computed styles measured the actual map fonts and control dimensions.

Normal content pages: `/`, `/contact/`, `/404.html`, `/blog/`,
`/blog/scholarship-guide/`, `/blog/thai-web-typography/`,
`/blog/thai-web-typography-en/`, `/credentials/`, `/project/`, and case studies
`altit`, `bnk48`, `cda2558`, `cirrhosis`, `countries-tiny`, `ddschatbot`,
`group-testing`, `hajjmens`, `hospcode`, `pm2-5`, `sichuan-yunnan`, `th-numeral`,
and `yfmalaria`.

The retained prototype, verification file, and standalone immersive embed are
not normal content pages. External applications, publication destinations,
credential services, and real-device Safari were not exhaustively tested.
The responsive measurements use iframe viewports rather than physical devices.

## Findings, in priority order

### 1. Country search has no keyboard selection path — high priority

On `/project/yfmalaria/`, type `Thailand`, press Down and Enter: the suggestion
remains and no country opens. Clicking the suggestion opens both country popups.
The accessibility tree exposes the suggestion as text, not an option or button.

`setupSearch()` creates clickable `.suggestion-item` divs with no keyboard
handler or combobox/listbox semantics (`public/project/yfmalaria/index.html`,
around lines 2050–2095). Since country shapes use the canvas renderer, search is
especially important as an alternative to pointer selection.

Recommendation: implement a labeled combobox with Arrow Up/Down, Enter, Escape,
an exposed active option, and a visible no-results message.

### 2. Trip button labels become stale after resizing/fullscreen — high priority

Reproduction: search Thailand, click the result, click Add to Trip, then enter
fullscreen. The URL contains `?trip=THA`, and the itinerary contains Thailand
after leaving fullscreen, but both popup buttons say Add to Trip again.
This misstates the action: the underlying toggle would remove an already-pinned
country.

Source evidence: `togglePinCountry()` updates the current DOM buttons, while
the popup was constructed from a string. `mapResizeObserver` later invokes
`currentPopupYF.update()` / `currentPopupMalaria.update()`. Refreshing from stored
content is the likely reset mechanism; verify this when implementing the fix.

Recommendation: render popup state from the current pinned-country collection
whenever content is refreshed. Keep both map buttons and the trip summary in sync.

### 3. Fullscreen clips open popup headings — high priority

After the same Thailand sequence, native fullscreen at the observed approximately
1230 × 768 viewport showed the country titles partly cut off at the upper edges
of both stacked maps. The popups contain their own scroll regions, and much of
the country guidance sits below the first screenful of each popup.

Source evidence: popup creation disables `autoPan`; selection uses a fixed
latitude offset, while resize updates dimensions without recomputing placement
from the available popup/map height.

Recommendation: at minimum, measure and keep the full header/close action inside
each map after layout changes. The stronger design solution is one country-detail
panel shared by the two maps: beside the map on desktop, below it or in an
accessible sheet on mobile. Separate Yellow fever and Malaria subsections would
retain both risk profiles without two competing floating reading areas.

### 4. Map typography is too small; icon fonts and hit areas vary — medium priority

Measured in Chrome at a 430px emulated viewport:

| Element | Computed font | Size | Target where applicable |
| --- | --- | --- | --- |
| Country title | Helvetica Neue / Helvetica / Arial | 16px, 700 | — |
| Guidance paragraphs | Same site stack | 12px, 400 | — |
| Region subtitle | Same site stack | 10px, 400 | — |
| Guidance labels | Same site stack | 11px, 700 | — |
| View buttons | Same site stack | 11px, 600 | about 26px high |
| Add to Trip | Same site stack | 11px, 600 | about 93 × 27px |
| Zoom symbols | Lucida Console / Monaco / monospace | 22px, 700 | 30 × 30px |
| Popup close | Tahoma / Verdana | 16px, 400 | 24 × 24px |
| Trip remove | Arial | 17.6px, 400 | about 18 × 22px |

The map's body font is already aligned. The principal mismatch is size, weight,
capitalization, spacing, and default icon glyphs. Leaflet's container also orders
its fallbacks as Helvetica Neue, Arial, Helvetica, unlike the site stack.

Recommendation: keep Helvetica Neue; use 14–15px guidance text, 12–13px secondary
labels, and 18px country headings. Use consistent SVG zoom/close symbols and
44px touch targets for principal map actions. Keep segmented controls visually
grouped rather than turning every segment into a separate pill. Use sentence
case: Add to trip, Clear trip, Yellow fever, Malaria, Exit fullscreen.

44px is a proposed site usability target, not a claim that every smaller control
violates WCAG. The AA minimum is 24 × 24px with exceptions, including spacing.
[W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### 5. Colored risk badges have weak light-theme text contrast — high priority

The YF category color is reused directly as text over a translucent version of
itself (`buildYFDetailContent` and `renderTripSummary`). For example, the orange
`#f5964f` text on its 26/255-opacity tint over white calculates to about **2.07:1**.
The label is only 11px. It was visibly pale in the Thailand popup.

Recommendation: retain the established map colors as swatches/background cues,
but give badge text a darker, theme-specific foreground. Do not change the
clinical categories or their mapping as part of this visual change. Ordinary
small text needs 4.5:1 for the WCAG AA contrast criterion.
[W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### 6. Credential archive shows both theme icons — medium priority

The sun and moon appear side by side in the same theme button on
`/credentials/`. Switching itself works. The page has both SVGs, but lacks the
theme-dependent icon visibility rules present on the other standalone pages;
`site-chrome.css` assumes each page supplies them.

Recommendation: own the icon visibility/transition in shared chrome so a page
cannot omit it. Also align theme transition behavior: Astro uses a page
crossfade while standalone pages use their own direct attribute changes.

### 7. Selected states are visual-only in map and blog filters — medium priority

The map view/layout buttons and Blog language filters use `.active` without
`aria-pressed` or an equivalent selected-state model. The buttons activate, but
assistive technology is not told which choice is active. The carousel already
exposes `aria-current`, and article demo tabs have `aria-selected`.

Recommendation: use one appropriate state pattern per group and update its
visual and accessibility state together. Add a consistent focus-visible ring;
standalone pages currently lack the shared global ring used by the homepage,
and project archive cards explicitly remove the outline in favor of lift/shadow.

### 8. Credential card appearance does not reliably predict the click area — medium priority

Most archive credentials are full-card anchors. TPQI/Huawei and ISC2 compound
records are similarly styled static cards with small links inside. A visitor
cannot reliably predict whether clicking the title/card will do anything.
Archive cards also retain 4px corners while homepage credentials use 12px.

Recommendation: use consistent record rows with clearly labeled View/Verify
actions, especially for multi-certificate records, or visibly distinguish
compound records. Preserve multiple destinations without nesting links.

### 9. Blog retains older action and heading conventions — low priority

The listing displays BLOG in a large uppercase heading and READ ARTICLE with
an SVG arrow. Other pages use sentence-case titles/actions and the user removed
decorative action arrows. The arrow escaped `audit-site.mjs` because that check
only inspects text characters, not SVG geometry.

Recommendation: use Blog and Read article, remove the decorative SVG, and align
the page heading spacing with the archives. Retain readable article widths,
Thai typography handling, and monospace code. A blog needs an editorial reading
layout, not a copy of the homepage hero.

### 10. Navigation and action hierarchy need a small consistency pass — low priority

Standalone case studies use Portfolio to mean the homepage Projects section;
the archives use Contact in that bar position, while Astro content pages expose
Home/Contact. Mobile case-study menus consequently include both Home and
Portfolio. These destinations work, but labels require interpretation.

Primary action styling also varies: homepage actions are filled blue at 14px,
case-study actions use a pale accent fill at 12px, and archive return links are
small plain text. Some variation is useful, but there is no single obvious
primary/secondary/tertiary rule across templates.

Recommendation: use Home, Projects, Blog, Contact consistently; name a contextual
return link Back to projects. Define a small action hierarchy: filled primary,
outlined secondary, underlined text tertiary, and compact static metadata.
Keep action labels and focus treatment consistent without giving metadata the
same emphasis as buttons.

## Suggested redesign scope

1. **YF/Malaria first:** search-first toolbar, larger controls, one stable country
   detail panel, legible text/badges, a clear trip count and summary. Keep map
   synchronization, geographic data, deep links, and fullscreen capabilities.
   Make filters secondary to finding a destination.
2. **Archives and blog next:** shared heading rhythm, consistent credential action
   locations, matching card radii, predictable navigation, and sentence-case
   actions. Their content organization can stay.
3. **Homepage: refinement only.** Keep the portrait, palette, project videos,
   current carousel controls beneath the cards, and proof sections. A concise
   visible project action such as View case study could improve discoverability;
   preserve the existing separate media/copy anchors. Do not restart the earlier
   scroll-pinning or control-overlay experiments.
4. **Contact: optional polish.** Add in-page sending/success/error feedback and
   retain the typed message on failure. This is a proposed improvement; actual
   delivery was deliberately not tested in this audit.

## Implementation acceptance checks

- Search and select a country with keyboard only; tab to Add to trip and remove
  it again. Verify focus visibility and announced selected state.
- Pin a country, toggle Stack/Split and single-map view, enter/exit fullscreen,
  resize, and confirm popup labels, trip count, URL, and summary remain consistent.
- Check long country guidance at 320px, 430px, tablet, and short landscape heights;
  all headings and close actions must remain reachable.
- Verify badge contrast in both themes, using text colors separately from map fills.
- Verify one theme icon per page, consistent focus styles, and obvious click
  targets for compound credentials.
- Repeat the build/static audit and responsive measurements after changes; extend
  the audit to cover semantic selected states and visual icons where appropriate.
- Preserve external demo fallbacks and the DDS iframe instance across close/reopen.

No files outside this audit document were intentionally edited. No deployment,
contact submission, or external chat submission was performed.
