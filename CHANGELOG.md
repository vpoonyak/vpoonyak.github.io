# Changelog

All notable changes to this project will be documented in this file.

## [2026-09-13] - Credential Archive: Direct Verification Links and Restored Training Certificates

### Added
- **Direct license/credential verification**: The Medical & Public Health
  block now links straight to primary-source verification instead of
  stopping at "we have a license" text — Authorized Seafarers' Medical
  Examiner links to its certificate PDF, Tour Leader License links to its
  official Dept. of Tourism record, and Medical License (Thailand) submits
  a native POST form to the Medical Council of Thailand's register
  (name-only lookup; no license number in visible copy, hidden fields, or
  markup). Added a standalone shareable page at `/verify/medical-license/`
  that auto-submits the same TMC lookup on load, for sharing the
  verification link directly without routing through the archive page.
- **Restored CMU/DDC training certificate links**: Diploma in Clinical
  Statistics, Diploma in Clinical Epidemiology, and Introductory Course in
  Epidemiology & Biostatistics are linked to their certificate images again
  in the homepage Training section, restoring links dropped during the
  Redesign v2 rewrite. The same three were added to the credential
  archive's Medical & Public Health block; the two Chiang Mai University
  diplomas share one compound pill (name + two "View certificate" actions),
  matching the existing Huawei Cloud HCCDA Certifications pattern, since
  both come from the same issuer with no external verification link.
- **Google AI Essentials V1 verification**: Linked via Credly
  (`credly.com/go/air1QPjp`) after losing direct Coursera access to the
  credential.

## [2026-09-11] - Design Consistency Pass: Map Dashboard Rebuild, Archive/Blog Alignment, Contact Feedback

Implements `docs/design-consistency-implementation-plan.md`, itself written from
`docs/design-interaction-audit-2026-09-11.md`.

### Added
- **YF/Malaria Dashboard Redesign**: Replaced the dual floating Leaflet popups
  with one shared, always-visible country-detail panel, full width directly
  below both maps — fixing stale trip-button labels after resize/fullscreen
  and headings clipped in fullscreen. An earlier pass placed this panel
  beside the maps as a 320px column on wide screens, capped to 80vh with its
  own scrollbar so a long country's guidance (India's YF requirements alone
  run to several nested sub-bullets) wouldn't balloon the page; that read as
  an unintuitive nested scroll region, so the panel is full width and part
  of normal page scroll instead, and desktop/trackpad users get a hover
  preview (badges + guidance, gated to hover-capable pointers) as a
  quick-glance alternative to clicking.

  Country search is now a labeled ARIA combobox with
  Up/Down/Enter/Escape keyboard support, active-option tracking, and a
  visible "No countries found" state; selecting a result outside the active
  continent/subregion filters now clears them automatically. Added
  `aria-pressed` to the view/layout toggle buttons, a polite live region for
  selection/trip announcements, a "Filters" disclosure for the continent/
  subregion selects, and a collapsed "Trip (n)" summary toggle in fullscreen
  (expands as a bottom overlay rather than pushing the maps around). Badge
  text now uses separately verified, per-theme, per-category colors instead
  of the raw swatch hex (previously ~2.07:1 contrast for the orange
  category); Leaflet's default zoom glyphs are replaced with the same
  inline-SVG icon pattern already used for the home/fullscreen controls, at
  44×44px. The dashboard itself now runs up to 1440px wide instead of being
  boxed into the case study's 860px reading column.
- **Contact form feedback** (`src/components/Contact.astro`, shared by `/`
  and `/contact/`): submits via `fetch`/`FormData` with a 20s timeout,
  showing sending/success/error states through a live status region;
  field-level validation errors from Formspree are associated with their
  inputs via `aria-invalid`/`aria-describedby`; entered values are kept on
  any failure and cleared only on confirmed success; a network failure or
  timeout offers a manual retry plus the existing email fallback. The
  form's plain `action`/`method` POST fallback is unchanged for
  JS-disabled visitors.
- **`Projects.astro`**: added a "View case study" text affordance inside
  each existing card-copy link (not a new nested anchor).

### Changed
- **Navigation consistency**: all 13 case-study pages, `credentials/`, and
  `project/` now show the same Home/Contact bar items as the rest of the
  standalone pages (previously case studies showed a single "Portfolio"
  item, and the two archive pages were missing "Home"); their footers now
  read "Back to projects" instead of "Back to project archive".
  `site-chrome.js`'s mobile-menu builder no longer hardcodes a duplicate
  "Home" link now that every page's bar carries its own.
- **Credential archive**: card corners now match the homepage's 12px
  (were 4px); the three compound records (TPQI×Huawei, Huawei HCCDA, ISC2
  CC) show their certificate links as distinct bordered action chips with
  descriptive labels ("View Tech certificate", "View AI certificate", …)
  instead of bare inline text mixed into the meta line.
- **Blog**: "Read Article"/its decorative SVG arrow → "Read article" as
  plain sentence-case text; the language filter buttons now carry
  `aria-pressed`.
- **Shared chrome** (`site-chrome.css`): centralized the theme-icon
  visibility rules (fixes `/credentials/` showing both sun and moon at
  once) and added a shared `:focus-visible` ring; removed the `outline:
  none` overrides on the project-archive cards and the contact form fields
  that were suppressing it.

## [2026-09-10] - Project Carousel Controls and Autoplay Reliability

### Changed
- **Control Placement**: The dots/play pill no longer floats over each card's video — it sits in a plain flow-positioned strip below the whole carousel, Apple-product-page style. The floating glass overlay (docked near the video's bottom edge, re-clamped to stay in the viewport as the page scrolled) sometimes landed on top of a project's own on-screen content, and had nowhere clear to sit at all in the desktop side-by-side layout; this removes the per-frame position-tracking JS entirely and guarantees no overlap regardless of what a given project's media looks like.
- **Manual Navigation No Longer Pauses Autoplay Forever**: A swipe, dot click, or arrow key used to set the carousel to manual mode permanently, with nothing to undo it besides pressing Play. It now resumes on its own as soon as the interaction settles — a first pass added a 4.5s grace window before resuming, which read as the carousel being stuck rather than a deliberate pause once seen in an actual screen recording, so that artificial wait was removed. Repeated navigation keeps deferring the resume while it continues, and pressing Play/Pause directly is treated as a final decision that cancels any pending auto-resume.

### Fixed
- **Autoplay Stopping on Any Touch, Not Just Drags**: `pointerdown` called the "take manual control" handler unconditionally, before it was known whether the gesture became an actual drag — so a tap that never moved (or a touch that started on the carousel but immediately became a vertical page-scroll) silently and permanently stopped autoplay. Fixed with a touch axis-lock: movement only counts as a deliberate carousel swipe once it's horizontal-dominant (`|dx| > |dy|`); a real drag still pauses it as before. The wheel handler had the identical bug (`Math.abs(deltaX) > 0` with no comparison to `deltaY`, so a trackpad's vertical scroll — which commonly carries stray `deltaX` noise — could trigger it) and got the same fix.
- **Hover No Longer Pauses Rotation**: Resting the mouse over the media used to stop autoplay; simply looking at the carousel while it happened to be under the cursor now leaves it running. Only an explicit pause, keyboard focus, or an active drag/scroll stops it.
- **A Failed Autoplay Attempt No Longer Blacklists a Slide for the Whole Session**: A transient failure (a slow first load, a network hiccup) permanently blocked that slide's video from ever trying again. It now gets a fresh attempt (reloading if it hard-errored) each time its slide is reselected.

## [2026-09-10] - Site-wide Consistency and Chatbot Demo Preparation

### Changed
- **Typography and Controls**: Aligned remaining Inter body/headline styles with Helvetica Neue, removed unused web-font requests from standalone pages, and applied pill shapes and 44px targets to blog filters, article navigation, and case-study actions.
- **Light Palette**: Replaced the stronger cream with a lightly warm off-white background and white cards across the homepage, blog, archives, case studies, and 3D backdrop.
- **Navigation and Content**: Standardized device-theme defaults and action capitalization, added Home to standalone menus, restored the full DigiHealth degree wording, and clarified the credential archive's verification wording.
- **Accessibility**: Added main landmarks and skip links to standalone archives/case studies and a primary heading to the standalone Contact page.
- **DDS Chatbot**: Prepared a responsive inline public demo with an explicit open/close control. It appears only when the backend advertises its restricted embedding endpoint; the existing external demo remains available otherwise. The backend change is prepared separately and requires deployment.
- **Audit**: Added `node scripts/audit-site.mjs` to check built content pages for metadata, headings, landmarks, image descriptions, local targets/anchors, structured data, and decorative action arrows.

## [2026-09-10] - Glass Carousel Controls

### Changed
- **Playback Controls**: Added a theme-aware frosted-glass gradient, blur, saturation, and inset rim highlights to the carousel control pill, with a translucent play/pause hover state.
- **Floating Control Dock**: Separated the progress capsule and play/pause circle. As the project media enters the viewport, the controls float above the viewport's lower edge and settle at the media's bottom as it scrolls fully into view. Their movement stays within the media area, leaving descriptions clear; reduced-motion mode keeps the controls in their resting position.
- **Interface Typography**: Replaced JetBrains Mono with the site's sans-serif across labels, metadata, buttons, archives, and case studies. Section numbers, section-rail numbers, and 3D role counters use tabular numerals. Code blocks and technical examples retain monospace; Newsreader remains the editorial accent. Removed unused JetBrains font requests from the homepage and standalone portfolio pages.
- **Overflow Containment**: Moved horizontal clipping from the body to the root and removed section-level clipping from Projects. The carousel track retains its own horizontal scrolling; the section remains in normal page flow.

## [2026-09-10] - Project Video Carousel and Rounded Navigation

### Changed
- **Featured Projects**: Replaced the grid with a responsive, rounded scroll-snap carousel. Added muted highlights and poster fallbacks for DDS Chatbot, Altitude Analyzer, YF & Malaria Map, Thai HospSearch, and Group Testing; trimmed the final second from Thai HospSearch. Larger contained media uses a side-by-side description on wide or landscape screens and stacked copy on phones, with floating pill controls over the media. The poster and video now fill that box edge to edge (`object-fit: cover`, cropped as needed) instead of letterboxing to fit inside it — a screen recording's own aspect rarely matches the card's, and the cream/dark bars that showed around a contained frame read as a rendering glitch more than a deliberate frame.
- **Playback**: Added progress dots and a play/pause control. Only the current video plays, and rotation pauses outside the viewport, in hidden tabs, on hover, or after manual navigation. Reduced-motion and data-saving preferences start paused; keyboard navigation, touch swiping, and mouse dragging remain available. The control itself uses two minimal stroke/fill SVG icons (thin double bars for pause, a filled triangle for play) that cross-fade, replacing the earlier Unicode glyphs (`Ⅱ`/`▶`) whose weight and centering varied by platform font — matching the line-icon language already used by the nav's theme toggle.
- **Navigation & Actions**: The top navigation becomes a rounded floating bar after scrolling. On the homepage specifically, the bar instead rides flat and fixed over the hero, then — once scrolled past its own height — slides and fades up out of view rather than staying pinned over hero content; it slides back down as the floating pill only once the visitor reaches About, so the pill never appears "over" the hero composition. Other pages (no hero to hide behind) keep the plain scroll-triggered pill. The collapsed navigation uses an icon-only hamburger at the far right; its dropdown now matches the main bar's own 13px type (a viewport-scaled 16–20px range had been landing oversized on tall, narrow windows — a resized desktop browser more than an actual phone) while still preserving 44px touch targets. Rounded action pills replace square buttons, decorative link arrows are removed, and “Read paper” uses a chevron.
- **Internship Invitation**: A centered pill banner pairs internship details with a filled “View brief” action. It remains inline on phones and clears the featured projects while they are in view. It also now clears the footer: the card was only watching whether the contact section itself was on screen, so a short viewport could scroll that section fully out of view — un-hiding the card — while the footer was still visible beneath it. It now hides for either the contact section or the footer, since nothing follows the footer to scroll back into.
- **Standalone Pages**: Applied the rounded floating navigation and compact icon-only menu to project case studies and archives. Removed decorative arrows from their navigation, calls to action, certificate links, and footer links; removed the redundant Portfolio header link on both archives. Explanatory arrows in article content remain.
- **Small polish**: Training's bulleted lists now use a plain dot marker instead of an arrow (freeing the arrow glyph for actual navigation/external-link cues elsewhere on the page), and the Roles 3D stage's scroll hint reads "Scroll" instead of "Scroll ↓" (the down-arrow read as redundant next to the hint's own downward position on the page).

## [2026-09-10] - YF/Malaria Dashboard: Fullscreen Overhaul, Popup Positioning, and a Data Fix

### Added
- **Per-Map Fullscreen**: A dedicated "⛶" control on each map's own zoom stack (matching the existing home-button pattern), so fullscreening just the YF map or just the Malaria map is one tap instead of first switching view mode with the toolbar buttons, then hitting the separate toolbar Fullscreen button. The same icon doubles as the exit control (icon and label swap to a "compress" glyph/"Exit fullscreen" while active) and stays in sync with the main toolbar button regardless of which one is used to exit.
- **Map-Data Loading/Error State**: The ~550KB GeoJSON fetch now shows a spinner by default (static markup, no flash-of-nothing before JS runs) and a visible error message if the fetch fails, instead of leaving a permanently blank map with only a `console.error` no visitor would ever see.
- **Trip Itinerary Empty State**: The panel is no longer `display:none` until the first pin — it now always renders with a hint ("No countries pinned yet. Click a country on either map, then **Add to Trip**...") so the page's own headline feature (multi-country trip planning) has some visible presence before a first-time visitor has already discovered "Add to Trip" inside a popup.

### Changed
- **Fullscreen Defaults to Stack Layout**: Entering fullscreen while in Split (side-by-side) layout now auto-switches to Stack and restores Split on exit — unless you deliberately pick a layout again while still fullscreen, which cancels the auto-restore. Split at a common ~1280px laptop width left each map with barely 280px of clearance on either side of its own popup, and the selected country ended up mostly hidden behind it; Stack at the identical width comfortably showed the selected country plus most of the surrounding continent, and held up at every other width tested.
- **Fullscreen Hides the Trip Itinerary Panel**: Fullscreen is for the map; the itinerary is a below-the-fold summary of what's already pinned, and its cards run long (full requirements/prophylaxis text per country) — on a phone it was pushing the map itself below the fold once anything was pinned. Still one tap away via Exit Full, and the map sections reclaim the freed vertical space automatically (no leftover blank gap).
- **Toolbar Fits One Line Further Down**: The search box was a rigid `width:260px` block rather than a shrinkable flex item, so `.dashboard-controls` dropped it to its own row entirely below ~1024px even when there was visible room left over next to the other controls. It now shrinks/grows as part of the same flex-wrap sequence (min 140px), and a `.control-groups` rule forcing `width:100%` — which had been claiming the entire row for itself the moment it wrapped, leaving zero room for search to share it — no longer does. Confirmed fitting on one row down to ~850px, where a naive fix based on the search box's own flex-basis alone still missed by a measured 3px (flex-wrap decides whether an item fits its current line using the *hypothetical* pre-shrink size, not the post-shrink one).
- **Project Carousel Highlight Clip Re-Cut**: Replaced the promo clip with a new capture that demonstrates the fullscreen mode and a country popup — the actual headline work above — rather than the previous clip's static, both-maps-stacked view. Re-encoded from the raw ~9.6MB screen recording down to ~500KB (1600px-wide H.264, 30fps, no audio) to match the other four carousel clips' size and settings.

### Fixed
- **Map-Switcher Invisible on Mobile (Regression)**: An earlier fix for the dead `?layout=split` toggle hid `.layout-toggle-group` below 1024px to kill a Stack/Split choice that had become a visual no-op — but `#viewModeGroup` (Both/YF Only/Malaria Only) secretly shares that same CSS class with `#layoutToggleGroup` (Stack/Split), so the rule silently took down the *entire* map-switcher on every mobile-width screen, not just the intended Stack/Split pair. Rescoped to the `#layoutToggleGroup` id specifically.
- **`?layout=split` Silently No-Op Below 1024px**: The state genuinely applied (class set, button showed active) but a `max-width: 1024px` media query force-overrides `flex-direction` back to `column`, so nothing ever looked different — read as "broken" rather than the no-op it actually was. The Split button now hides below that width instead, matching how the same control group already hides entirely in single-map view for the identical reason.
- **Popup Overlapping the Zoom Controls on Narrow Phones**: A horizontally-centered, always-280px-wide popup on a 375px viewport left only ~46px margin per side, while the zoom-control stack (now four buttons tall: zoom in/out, home, fullscreen) reached ~67px in — clipping the popup's own title/subregion text behind the controls, not just a visual near-miss. Popup width is now computed from the viewport at open time (`Math.max(200, Math.min(280, window.innerWidth - 150))`), reserving that corner on both sides.
- **Stale/Garbled Popup After a Hidden Map Reappears**: `selectCountry()` always opens a popup on both maps, even when one is `display:none` (hidden by single-map view mode — reachable via the new per-map fullscreen button). Leaflet computes a popup's width from its container's size at open time, so a zero-size hidden container produced a garbage ~53px-wide popup wrapper whose text then spilled unboxed onto the bare map via the popup's own `overflow: visible` — confirmed via a pixel-cropped screenshot showing the dark background box ending mid-sentence. `invalidateSize()` (already called on every view/layout/fullscreen toggle) never touched an *already-open* popup, so it stayed broken indefinitely once the map became visible again. A `ResizeObserver` on each map container now also calls `.update()` on whichever popup is currently open on it, catching the exact moment the container's real box changes for any reason.
- **"Northern Europe" Continent Filter Showing Only One Country**: A genuine data bug, not a filtering-logic one — `Jan Mayen Island (Norway)` had its `continent` and `subregion` fields swapped in the source GeoJSON (`continent: "Northern Europe"`, `subregion: "Europe"`) while every other European country correctly has `continent: "Europe"`, `subregion: "Northern Europe"`. The bogus `continent` value leaked into the Continent filter dropdown as a nonsense option that only ever matched that one mistagged feature. Fixed at the data level; the real "Northern Europe" *subregion* filter (11 countries: Norway, Sweden, Denmark, the UK, Ireland, Iceland, Finland, the Baltics, the Faroes) was never affected.

## [2026-09-09] - YF/Malaria Dashboard: Stuck Hover Panel on Touch Tap

### Fixed
- **Third Floating Info Box on Country Tap**: Tapping a country on some touch devices (e.g. an iPhone that has ever paired a Bluetooth mouse/trackpad, or used AssistiveTouch) showed three info boxes instead of two — the two real YF/Malaria click popups plus the floating hover-preview panel stuck behind them, with neither a close button nor "Add to Trip". The panel is gated behind `matchMedia('(hover: hover) and (pointer: fine)')` (see the `2026-07-09` entry below) to skip touch devices, since Leaflet fires a synthetic `mouseover` on tap with no matching `mouseout` to close it — but iOS/iPadOS permanently reports `hover: hover`/`pointer: fine` as true once any pointer device has ever been paired, even for later plain finger taps, defeating that gate. The hover panel now also tracks real `touchstart` activity directly and skips opening within 700ms of one, and `selectCountry()` force-closes it as a belt-and-suspenders guard so a click popup can never coexist with it.

## [2026-09-06] - Research Hierarchy, About Balance, and Internship Invitation

### Changed
- **Device Theme Default**: The page and 3D scene follow the device's color scheme before first paint unless a visitor explicitly saved a light/dark choice. Devices without a dark preference use light mode, and system changes update the page while no override is saved.
- **3D Animation Timer**: Replaced deprecated `THREE.Clock` with `THREE.Timer`, updating once per rendered frame and using page visibility handling to avoid elapsed-time jumps after returning to a hidden tab.
- **Typography & Controls**: Kept Helvetica Neue and Newsreader, softened Training headings, changed action/form labels to sentence case, and enlarged small metadata. Standardized buttons, inputs, credential cards, and skill chips on subtle 4px corners while retaining square project thumbnails and unframed photo cutouts.
- **Research & Awards**: Unified award and research typography, supporting text, and row separators. Simplified publication metadata to journal and date, with explicit paper and certificate links. Separated other research from the two published papers.
- **About Composition**: Centered a bounded reading column and brought desktop CV/résumé actions directly below the paragraph while preserving the photo silhouette wrap.
- **Internship Invitation**: Reduced the desktop card's size and replaced the blue fill with a quiet bordered surface. On phones, the invitation now sits inline in the hero before the stats instead of covering scrolling content.

## [2026-07-10] - YF/Malaria Dashboard: Antimeridian Blink, Russia Teleport, and iPhone Fullscreen Fixes

### Fixed
- **Map Blink at the Antimeridian**: On phone-width viewports, panning across ±180° longitude blanked the dragged map until the swipe ended — Leaflet's `worldCopyJump` teleports the map pane a full world width mid-drag (`Map.Drag._onPreDragWrap`) without firing any event, and the canvas renderer only repaints on `moveend`, so the `padding: 1` buffer (one viewport each side) couldn't cover the ~1024px jump at zoom 2. Both maps now detect the wrap (center longitude jumping across the dateline between `move` ticks) and force the renderer to re-center its buffer and repaint immediately. Reproduced and verified headlessly at a 390px viewport (desktop widths never blanked because their wider buffer happens to cover the ≤512px half-world jump).
- **Russia/Fiji/Antarctica Teleporting Across World Copies**: The antimeridian shadow-copy generator deliberately skipped shapes whose longitudes already span both sides of the dateline — exactly Russia, Fiji, and Antarctica, whose geometries are split at ±180° (Chukotka is stored at −180…−170 while Russia's main mass ends at +180). In the adjacent world repeat the main mass had no copy at all, so the shape visibly popped/teleported as the wrap crossed the dateline. These shapes now get the same ±360° shadow copies as everything else, rendering seamlessly across the Bering Strait from either world copy.
- **Fullscreen on iPhone**: The Fullscreen button called `Element.requestFullscreen()`, which iPhone Safari does not implement at all (not even webkit-prefixed), so tapping it silently failed. When the API is missing the button now falls back to a pure-CSS overlay — toggling the existing `is-fullscreen` fixed-position class (with a `100dvh` height override so the collapsing Safari toolbar doesn't cover the bottom) plus a `body` scroll lock; iPad/older desktop Safari use the webkit-prefixed API, and other browsers keep native fullscreen.

## [2026-07-09] - YF/Malaria Dashboard: Trip Planning, Hover Detail Panel, and Map Rendering Fixes

### Added
- **Trip Itinerary Pinning**: Countries can now be pinned from either map's popup ("Add to Trip"); pinned countries appear as a combined YF + malaria summary panel below the maps, addressing the dashboard's original multi-country-comparison problem statement instead of only supporting one-country-at-a-time lookups.
- **Shareable Dashboard State**: Continent/subregion filters, view mode (Both/YF/Malaria), layout mode (Stack/Split), and the pinned trip now sync to the URL via `history.replaceState`, so a filtered/pinned view round-trips correctly through a shared link instead of resetting.
- **Single Floating Hover Detail Panel**: Hovering a country now shows one shared, `position: fixed` detail panel with the full (untruncated) YF or malaria guidance, positioned near the cursor and clamped to the viewport — escapes the map's `overflow: hidden` entirely rather than using per-map Leaflet tooltips, which would otherwise get clipped or duplicate.
- **Home Control**: Added a reset-to-default-view icon button inside each map's own zoom-control stack (matching the Tableau reference layout), rather than a separate labeled toolbar button.
- **CDC Yellow Book 2026 Citation**: Added a source-attribution line under the dashboard and linked it from the case study's Approach section.

### Changed
- **Antimeridian Shapefile Duplication**: Every country now gets a full ±360° longitude shadow copy (not just a curated dateline-adjacent subset), so panning into any `worldCopyJump` world-repeat shows real country shapes everywhere, not just near Tonga/Tuvalu.
- **Map Rendering**: Switched both Leaflet maps to an explicit `L.canvas({ padding: 1 })` renderer instead of per-polygon SVG elements, and throttled the two maps' pan/zoom sync to avoid redundant cross-map `setView` calls — the main levers behind the dashboard feeling laggy with ~250 country polygons rendered twice.
- **Dashed/Bulleted CDC Text**: CDC source fields use `\n- ` (and occasionally nested `• `) prefixed lines as plain-text bullet lists; these now render as real nested `<ul>`/`<li>` markup instead of collapsing into a run-on paragraph.
- **Popup/Tooltip Content**: Dropped the "Other Considerations" field (243/251 countries had near-identical CDC boilerplate with no per-country value) and fixed the `.detail-badge` pill styling, which previously had no actual shape CSS (only inline colors, no border/padding/radius).
- **YF Label Wording**: `YF: Risk countries` → `YF: From Risk countries`.

### Fixed
- **Map Wraparound**: Both maps set `worldCopyJump: true` and are now clamped to the Mercator pole limit (`maxBounds` at ±85.06° latitude, longitude unbounded), so panning past the antimeridian wraps seamlessly while vertical panning stops cleanly at the poles.
- **Drag Rendering Gap**: Leaflet's canvas renderer only pre-paints ~10% beyond the viewport by default, so a fast drag could outrun that buffer and reveal raw unpainted canvas; the wider `padding: 1` buffer above fixes this.
- **Zoom Button Underline**: Scoped `text-decoration: none` onto `.leaflet-bar a` so the site's global link-underline-on-hover rule no longer applies to the +/− zoom buttons.
- **Fullscreen Hover Panel**: The hover detail panel was a DOM sibling of `.dashboard-wrapper`, so entering the Fullscreen API on the wrapper excluded it from the fullscreen render layer entirely; moved it to be a descendant so it renders (and widens responsively via `clamp()`) correctly in fullscreen.

## [2026-07-09] - Project Page Social Cards, Thumbnail Optimization, and Map Wraparound

### Added
- **Project Page Social Cards**: Added `og:title`/`og:description`/`og:image`/`og:url`/`og:type` and `twitter:card`/`twitter:image` tags to every project case-study page (`altit`, `bnk48`, `cda2558`, `cirrhosis`, `countries-tiny`, `ddschatbot`, `hajjmens`, `hospcode`, `pm2-5`, `sichuan-yunnan`, `th-numeral`, `yfmalaria`), so links to individual projects now render rich previews instead of bare URLs.
- **Mobile "Project Archive" Link**: Added a mobile-only nav entry to `/project/` alongside Blog and Contact.

### Changed
- **Project Thumbnail Optimization**: Recompressed all project preview thumbnails to `-thumb.webp` (resized to a 1200px-wide max, quality 75), roughly halving file size across the board; the Projects grid's DDS Chatbot preview now points at the optimized webp instead of the original PNG.

### Fixed
- **YF/Malaria Dashboard Map Wraparound**: Both Leaflet maps on the Yellow Fever & Malaria Prevention Dashboard now set `worldCopyJump: true`, so panning past the antimeridian jumps the view back by a world-width instead of dead-ending — the map now feels continuously scrollable in either direction.

## [2026-07-09] - Astro Migration, Markdown Blog, Standalone Pages, and Mobile UX Polish

### Added
- **Astro Migration**: Migrated the single-file HTML portfolio to a modern Astro structure, splitting sections into reusable components and layout templates.
- **Markdown Blog Engine**: Configured content collections using Content Layer, implementing dynamic blog index listing (`/blog`) and markdown post pages (`/blog/[slug]`).
- **Dedicated Contact Page**: Created a dynamic standalone Contact page at `/contact` with updated layout routing.
- **Dynamic Sitemap Integration**: Configured `@astrojs/sitemap` to dynamically merge blog paths and legacy static project files.

### Changed
- **Mobile Menu Curation**: Cleaned up the mobile drawer links to display only Home, Blog, and Contact, avoiding redundancy with the permanently docked section indicator chips.

### Fixed
- **Globe Canvas & Role Swapper**: Fixed a critical `ReferenceError` for the `htmlEl` context variable in the modularized canvas component script.
- **Pre-warmed Shapes Cache**: Pre-computed the coordinates of `thailand`, `chart`, and `network` shapes on page load to eliminate first-transition GC and calculation lag.
- **Mobile Scroll Fading**: Added a CSS linear-gradient mask to horizontally scrollable nav section chips.
- **Mobile Drawer Transitions**: Replaced the abrupt menu toggle with smooth slide-and-fade dropdown drawer transitions.

## [2026-07-04] - Transition Choreography, Social Card, SEO and Icon Cleanup

### Added
- **Social Share Card**: New 1200×630 `pic/og-card.jpg` (site-styled name, positioning line, portrait) wired into `og:image`/`twitter:image` with `og:image:width/height/alt` and `twitter:image:alt`, replacing the 500×500 square photo that `summary_large_image` cards cropped.

### Changed
- **AI → Travel Transition**: Leaving *AI Engineering*, the camera now dives into the network's output node and the globe blooms out of that point (matching the health zoom-dive grammar), replacing the generic collapse-and-chase return.
- **Health → Data Transition**: The Thailand map now morphs into the chart by direct per-dot flight — each dot flies from its map location to its chart position with the existing left-to-right stagger — replacing the collapse-then-expand beat.
- **Brand Icons Inlined**: Replaced the render-blocking Font Awesome CDN stylesheet (loaded for six icons) with inline `currentColor` SVGs (Simple Icons paths) for LinkedIn, ResearchGate, ORCID, GitHub, Google, and Kaggle.
- **Sitemap**: Removed the duplicate `sitemap-pages.xml` (robots.txt only ever referenced `sitemap.xml`) and refreshed `lastmod`.
- **Kaggle Icon**: Replaced the current Kaggle wordmark SVG with the classic lowercase "k" logomark, traced from the official artwork via `potrace` into a `currentColor` path.
- **Data Analysis Chart Pacing**: The seasonal chart's stream/forecast reveal now paces to fill almost the entire ~6s "data" role window instead of finishing early and sitting frozen for the last ~1.5s.
- **Hero Globe Dot Brightness**: Sphere dots now carry an independent, long-tail-skewed brightness jitter (mostly dim, a minority spiking bright) so the globe reads like scattered city lights instead of a uniform depth-only gradient; dot count raised (3000→4400 desktop, 1600→2200 mobile) for finer texture.
- **Social Share Card**: Recomposed `pic/og-card.jpg` into a centered layout with all content (label, photo, name, tagline, URL) inside the center 630×630 "safe zone" — apps like LINE that crop link-preview images to a square were cutting off the name and photo under the old left-text/right-photo layout.
- **Social Share Card, again**: The center-safe-zone layout still wasn't enough — real-device testing on LINE mobile showed iOS's LinkPresentation framework doing face-priority smart-cropping, zooming into just the photo and discarding all surrounding text regardless of layout. Rebuilt as a 1200×1200 square, full-bleed photo with a bottom gradient scrim and text overlaid directly on the image (`og:image:width/height` now `1200`/`1200`) — square avoids the aspect crop, and putting text on the same image layer as the face means a face-priority crop is far more likely to still catch it.

### Fixed
- **Tableau Icon**: The `currentColor` + `mask`/`-webkit-mask` `.social-icon-mask` span (added to fix hover recolor) turned out not to render in real-world browsers despite working in headless Chromium; replaced with a `currentColor` SVG traced from the source PNG's alpha channel, which recolors on hover and needs no mask support.
- **Hero Screen-Reader Text**: The hero positioning line's `aria-label` (unsupported on paragraph roles, with all visible content `aria-hidden`) is now a static `.sr-only` sentence, so assistive tech reads the full positioning statement.
- **Font Preconnect**: Added `fonts.gstatic.com` `crossorigin` preconnect alongside the existing `fonts.googleapis.com` one.
- **Hero Role-Cycle Layout Shift**: The hero paragraph now reserves a JS-measured `min-height` (covering all four role labels, re-measured on resize since the font uses a fluid `vw` clamp) so retyping a shorter/longer role never reflows the line count and shifts the page below the hero, at any viewport width.
- **About Stats Years**: "Years Clinical Practice" / "Years Data Analysis" are now computed at load from `data-years-since` anchor dates instead of hardcoded numbers, so they never go stale.

## [2026-07-03] - Seasonal Forecast Chart, Section Identity Boost, HF Icon Fix

### Added
- **Seasonal Surveillance Chart**: The *Data Analysis* canvas now shows ~1.5 seasons of fixed history as a raw-observation dot cloud with season tick marks; the current season streams in weekly while a rolling average smooths the full series and a seasonal-naive forecast (same phase last season, scaled to the current level) predicts the next seasonal peak with a widening uncertainty cone.

### Changed
- **Section Identity Visibility**: Raised ghosted motif opacity (0.045 → 0.09), strengthened the active section-number tint, and tinted the active section's mono label so the per-section scroll identity is clearly perceivable.

### Fixed
- **Hugging Face Icon**: Replaced the CSS `mask`-based icon (invisible in browsers without `mask` shorthand support) with an inline `currentColor` SVG matching the Google Scholar icon pattern.

## [2026-07-03] - Live Data Overlays and Section Scroll Identity

### Added
- **Live Surveillance Chart**: The *Data Analysis* canvas state now streams weekly observations into the chart, tracks them with a rolling-average line, and projects a dashed forecast with a widening uncertainty cone past a "now" cursor; each loop generates a new outbreak curve.
- **Roaming Inference Signal**: The *AI Engineering* neural network now routes its pulse along a different random input→hidden→output path each cycle, glowing the traversed edges and nodes.
- **Per-Section Scroll Identity**: Scrolling sets `data-active-section` on `<body>`, driving barely-there per-section accent tints on the big section numbers, one ghosted CSS motif per section (rings, grids, ruled lines, dot matrix), a slide-in reveal variant for section headers, and a 2px scroll-progress bar under the fixed navigation.

### Changed
- **Chart Dot Targets**: The particle field now forms only the axes, gridlines, and a ghost of last season's curve; the live series is drawn as an overlay for smooth motion.

## [2026-07-03] - Morphing Hero Dot Canvas and Role Transitions

### Added
- **Morphing Hero Dot Canvas**: Replaced the static rotating globe with a morphing dotted particle canvas that cycles between four states matching the current active role:
  - *Travel Medicine*: A 3D spinning globe with active flight path arcs (e.g. Pittsburgh to Bangkok).
  - *Public Health*: A hospital-density choropleth map of Thailand with contact-tracing overlays.
  - *Data Analysis*: An epidemiological/data curve chart.
  - *AI Engineering*: A connected, pulsing neural network graph.
- **Hero Role Typewriter Cycler**: Implemented a typewriter role switcher (`#roleSwap`) with a blinking cursor animation in the hero positioning text. It automatically rotates through the four key identities and triggers custom events to synchronize the background canvas morphs.

### Changed
- **Hero Interactive Canvas Layout**: Set canvas pointer-events to `none` to avoid overlapping layout blocking, adjusted dot scaling (1600 dots on mobile, 3000 on desktop) for better mobile performance, and adapted animations to respect `prefers-reduced-motion` preferences.

## [2026-06-13] - Education and Super AI Credential Refresh

### Added
- **AI Practitioner Credential**: Added the Super AI Engineer Season 6 Level 1 AI Practitioner verification link and folded Foundation AI (Theory) plus Level 1 Minihacks into a collapsible detail block.
- **Agent Documentation**: Added `CLAUDE.md` and renamed `AGENT.md` to `AGENTS.md` for broader agent compatibility.
- **Portfolio Declutter Branch**: Added a cleaner information hierarchy with a desktop Top Projects grid, compact Super AI proof strip, collapsible Level 2 method details, collapsed clinical methods training, and a collapsed credential archive.

### Changed
- **DigiHealth Education**: Updated Chulalongkorn DigiHealth wording to `Master of Science in Digital and AI Technologies in Health Systems (DigiHealth)` with the completed date range `2025 — 2026`.
- **About Copy**: Updated the About intro to describe DigiHealth as completed rather than currently pursued.
- **Minihacks Verification**: Replaced local Level 1 Minihacks certificate image links with public Super AI verification URLs.
- **Agent Notes**: Refreshed `AGENTS.md` and `GEMINI.md` to document the current Training structure and DigiHealth wording.
- **Capabilities IA**: Renamed `Skills & Certifications` to `Capabilities`, demoted `Languages` from primary navigation, and reduced first-pass visible text in Training and Capabilities.

## [2026-06-09] - TPQI Huawei Certification Detail

### Added
- **TPQI x Huawei Credentials**: Added compact combined certification badges for Huawei Cloud HCCDA credentials and TPQI x Huawei professional certifications with QR-derived verification links.

### Changed
- **Certification Stat**: Updated the About certification count from `21+` to `23+`.
- **Certification Readability**: Hid long certificate IDs from visible metadata while keeping verification links intact.

## [2026-05-29] - Super AI Season 6 Detail Expansion

### Added
- **Level 2 On-site Hackathons**: Added Edge-AI for Intelligence Transport System detail with project link, Jetson Nano CCTV analytics scope, and co-honorable mention recognition.
- **WellSense AIoT Detail**: Added WellSense AIoT & System Product Hackathon detail with Academic Popular Vote recognition, covering Arduino Nano IMU capture, Arduino UNO Q inference, BLE telemetry, and mobile dashboard work.

## [2026-05-26] - LLM API Skills Update

### Added
- **LLM API Skills**: Added GLM by Z.ai and Grok by xAI to the Large Language Model APIs group with local logo badges.

## [2026-05-15] - Training Hackathon Detail Update

### Added
- **Parasite Eggs Detail**: Expanded the Level 2 Online entry with the cascaded YOLOv8/DINOv2 microscopy pipeline, gold-label validation, SAHI-style inference, and artifact calibration.
- **Level 2 On-site Hackathon**: Added Demand Forecasting at Scale detail for the Coffee Chain Hackathon, including leakage-aware forecasting pipeline work, private Kaggle rank #1, 30-team on-site cohort context, and final placement.

## [2026-05-15] - Mobile Navigation and Project Carousel Refinement

### Added
- **Mobile Project Swipe**: Added touch swipe support for the Featured Work carousel on mobile.
- **Stable Mobile Carousel Controls**: Added a mobile-only carousel control row directly below the active project thumbnail so controls stay stable regardless of caption length.

### Changed
- **Mobile Section Navigation**: Replaced the previous/current/next moving section indicator with a horizontally scrollable all-section navigation strip that keeps the current section styled like the desktop active state.
- **Featured Project Markup**: Split each featured project slide into separate clickable thumbnail and caption links so mobile controls can sit between the media and text without invalid nested interactive elements.

### Fixed
- **Project Carousel Mobile Rhythm**: Prevented long project titles and descriptions from moving the carousel navigation in mobile view.

## [2026-05-14] - Portfolio IA, Training, and Skills Refresh

### Added
- **Standalone Training Section**: Moved Super AI Engineer Season 6 content into its own `Training` section with AIAT/Super AI logos, Foundation AI certificate, The Scamper housing team link, Level 1 minihack Colab/certificate/Kaggle links, and Level 2 Parasite Eggs rank.
- **Languages Section**: Split language competency into a standalone `Languages` section.
- **Mobile Section Navigation**: Added a compact mobile/tablet current-section navigation pattern.
- **Featured Project Carousel Expansion**: Added PM2.5 & Mental Health Dynamics, Cirrhosis Survival Prediction, Thai Numeral Converter, and BNK/CGM48 election analysis to the featured carousel.
- **LLM API Skills**: Added a Large Language Model APIs group covering GPT, Claude, Gemini, and ThaiLLM.
- **Local Skill Logos**: Added local logo-style badges for GPT/OpenAI, ThaiLLM, Power BI, Matplotlib, and Seaborn; reused the local Tableau favicon.

### Changed
- **Information Architecture**: Hid the dry `Expertise` section from navigation and active-section tracking so visitors reach project evidence sooner.
- **Section Numbering**: Renumbered visible sections to About `01`, Experience `02`, Projects `03`, Research `04`, Training `05`, Skills `06`, Languages `07`, and Contact `08`.
- **About Stats Links**: Made stats navigate to relevant sections; the `4+ Years Data Analysis` stat now points to `Skills`.
- **Project Metadata**: Changed Thai Numeral Converter source label from `vpoonyak.github.io` to `Thai Documentation Utility`.
- **Project Tags**: Made project metadata chips static so they no longer behave like outbound links.
- **Skills Ordering**: Moved `Data Analysis & Processing` directly under `Core Tools`.
- **Skills Pruning**: Hid XGBoost, LightGBM, and MLX from the Applied ML & AI chip row.
- **Visualization & Design Skills**: Replaced text-only Shields badges with clearer local logo/lettermark badges for Tableau, Power BI, Matplotlib, Seaborn, Photoshop, and Lightroom.
- **Training Evidence**: Added Colab links for all Level 1 minihacks and Kaggle ranks for OCR, FahMai RAG, and Parasite Eggs.
- **Experience Logo**: Updated DigiHealth logo source from `experience/digihealth.png` to `experience/digihealth-dh.png`.
- **Cybersecurity Certificate Logo**: Switched ISC2 CC badge to `badge/certified-in-cybersecurity-cc.1-white.png`.
- **Training Design**: Integrated The Scamper housing team and removed redundant `AI Training & Selection` text inside the Training card.
- **Applications Section**: Hid the Applications section while keeping the markup available for future reuse.

### Fixed
- **PM2.5 Tableau Link**: Corrected PM2.5 & Mental Health Dynamics to the Tableau Public story URL.
- **Mobile Active Section Tracking**: Updated active-section logic so the mini section carousel follows the section the user is actually viewing, including direct anchor links.
- **Direct Anchor Reveal**: Added delayed reveal/active-nav passes so anchor navigation reliably displays the target section.
- **Training Mobile Wrapping**: Grouped each hackathon title with its related links so mobile wrapping stays readable.

## [2026-05-14] - LANTA HPC Skill Update

### Added
- **LANTA HPC Environment Experience**: Added Linux and LANTA HPC badges to the Environments skill group to reflect practical supercomputer and basic Linux module usage experience.

## [2026-04-29] - Huawei Cloud Certificate Update

### Added
- **Huawei Cloud HCCDA-Tech Essentials**: Added the separate HCCDA-Tech Essentials certificate with certificate no. `HWENDCTEDA695219` and a local certificate image link.
- **Google Developer Profile Link**: Added `g.dev/vitchakorn` to the About section social links.
- **Hackathons**: Added three Super AI Engineer Season 6 hackathon certificates to the Skills section with verification links and certificate IDs.

### Changed
- **Selected Project Order**: Promoted Altitude Itinerary Analyzer to the first pinned project position.
- **External Link Security**: Added `rel="noopener noreferrer"` to new-tab links.
- **Navigation Accessibility**: Added an accessible label to the dot logo back-to-top link.
- **Social Link Priority**: Reordered About social links by professional, research, builder, data, and visualization priority.
- **Certification Stat**: Updated the About certification count from `15+` to `21+`.
- **Certification Organization**: Split Huawei Cloud HCCDA credentials into a dedicated Cloud & Infrastructure category.
- **Certification Order**: Moved Data Science & AI to the top of the certification list.
- **Skills & Certifications Layout**: Converted skill and certification groups into responsive always-visible grouped lists, added Hackathons as its own subsection, removed accordion controls, and kept Core Languages first with Data Science & AI second.
- **Desktop Certification Balance**: Added wide-screen auto-balancing for certification groups so the Skills & Certifications section has a more even desktop rhythm.
- **Section Header Spacing**: Increased desktop spacing between large section numbers and section labels to prevent overlap.
- **Hero Positioning**: Clarified the hero specialty line to identify DigiHealth as an in-progress M.Sc. program.
- **Huawei Cloud HCCDA-AI Metadata**: Clarified the existing HCCDA-AI entry as a separate certificate series and added certificate no. `HWENDCAIDA100092`.

## [2026-04-21] - Branding Standardization & UI Optimization

### Added
- **Project List Toggle**: Implemented a "View All Projects" toggle to curate the "Selected Projects" section, showing the top 4 by default for a cleaner initial view.
- **Enhanced Meta Tags**: Added comprehensive SEO and Open Graph meta tags for improved social media link previews.

### Changed
- **Official Branding**: Standardized all Carnegie Mellon University (Heinz College) and Chulalongkorn University (DigiHealth) references to their official, full-length nomenclature.
- **Social Preview Optimization**: Customized shared link titles and descriptions, ensuring professional representation without local file paths.
- **Footer Updates**: Updated the copyright year to 2026 and refined name-only formatting.
- **Section Badge Consistency**: Re-standardized "Physician & Clinical Data Analyst" badge in the About section.

## [2026-04-20] - New Style Implementation & Refinements

### Added
- **Google Colab Skill**: Added Google Colab to the Environments category in the skills section.
- **New Sleek Design**: Completely overhauled the UI with a modern, GitHub-inspired aesthetic using Inter and JetBrains Mono fonts.
- **CDC Yellow Book Dashboard**: Added "Yellow Fever Vaccine & Malaria Prevention Information" project with Tableau integration.
- **Contact Form**: Implemented a functional HTML contact form using Formspree (Endpoint: myklppap).
- **Years Data Analysis Stat**: Added a new animated count-up milestone starting from May 2022.
- **Travel-Themed Favicon**: Updated browser tab icon to a modern globe SVG to reflect Travel Medicine expertise.

### Changed
- **Navigation**: Moved all social links to the "About Me" section as sleek logos and removed the "VP" branding from the header.
- **Hero Section**: Renamed hero to `#top` and repositioned your name to the top of the page for immediate visibility.
- **Project Layout**: Renamed to "Selected Projects," removed project count stats, and switched to a cleaner, icon-free list.
- **Tableau Branding**: Updated the Tableau icon to use the official `favicon/tableau.png` with a monochrome filter.
- **Expertise Clarity**: Simplified the informatics section by removing specific technical standards you're still exploring.
- **Experience Timeline**: Reintegrated official institution logos into the new vertical timeline.
- **Certifications**: Restored all 16+ verification and certificate-viewing links from the original main branch.

### Fixed
- **OpenCV Logo**: Fixed the OpenCV skill badge visibility by changing it from white-on-white to a purple background with a white logo.
- **Mobile Layout**: Resolved a CSS padding clash that was cutting off your name behind the navigation bar on handsets.
- **Theme Functionality**: Restored missing body styles that were preventing light/dark mode from switching correctly.
- **Mobile Scaling**: Refined `t-hero` font sizes and fluid scaling for perfect fit on all mobile browsers.

### Documentation
- Updated `GEMINI.md` to reflect the new UI structure and project additions.
- Initialized and updated this `CHANGELOG.md`.
