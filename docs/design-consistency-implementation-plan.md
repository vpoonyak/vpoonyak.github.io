# Website design consistency and interaction improvements

## Summary

Address all findings in the design audit while preserving the portfolio’s current identity and Astro/GitHub Pages architecture.

The main redesign is the YF/Malaria dashboard: replace competing floating popups with one shared country-detail panel. Align controls, navigation, typography, and credential actions across the remaining pages, and add contact-form submission feedback.

Success means predictable click behavior, readable map guidance, accessible keyboard controls, consistent styling, and no regressions in carousel playback, map state, or embedded demos.

## Implementation changes

### 1. Shared design and interaction rules

- Retain Helvetica Neue / Helvetica / Arial for interface text, Newsreader for existing editorial accents, and monospace for code.
- Standardize actions: filled blue primary, outlined secondary, and underlined text links for tertiary actions. Use sentence-case labels and 14px button text.
- Use 44px minimum targets for standalone buttons and icon controls. Keep inline prose links and metadata compact.
- Use pill-shaped actions, 12px credential-card corners, and the existing larger carousel-card corners. Keep segmented controls grouped.
- Apply a consistent 2px blue focus-visible outline with spacing that prevents clipping. Remove archive-card rules that suppress the outline.
- Keep metadata noninteractive and visually quieter than actions. Avoid hover effects that suggest a static element is clickable.
- Share the small set of typography, control, focus, and theme-icon rules between Astro and standalone pages. Keep existing templates; do not migrate every case study into Astro during this work.
- Centralize theme-icon visibility so exactly one icon appears. Align theme transitions with the existing page crossfade and reduced-motion behavior.

### 2. YF/Malaria dashboard

Implement within public/project/yfmalaria/index.html, retaining Leaflet and the existing geographic data.

Layout and reading experience

- Move the dashboard outside the case study’s narrow reading column. Give it a maximum width of 1440px; retain the current narrower introduction and explanatory text.
- Place country search first, followed by map-view controls, fullscreen, and a labeled Filters disclosure containing continent/subregion selectors.
- Replace both rich floating popups with one country-detail panel containing the country heading, region, trip action, and separate Yellow fever and Malaria guidance sections.
- Place a 320px detail panel beside the maps when the dashboard’s available width is at least 1100px. Below that, place it beneath the maps in normal document flow.
- Preserve Both/Yellow fever/Malaria views. Offer Stack/Split only when the remaining map area is at least 768px wide; otherwise render stacked maps.
- Before selection, display “Select a country on the map or search above.” After selection, show complete guidance without the existing 220px popup-height restriction.
- Remove rich hover panels; retain country highlighting and a short country-name tooltip for pointer users.
- In fullscreen, retain the same responsive arrangement inside the fullscreen element. Keep the toolbar accessible and allow vertical scrolling when short screens cannot accommodate the content. Use at least 240px height per visible map.
- Keep the trip summary expanded in normal view and collapsed behind “Trip (n)” in fullscreen. Opening it must not obscure map or detail controls.

State and keyboard behavior

- Use the current selected-country identifier and pinned-country collection as the authoritative state. Derive the detail action, trip count, summary, and URL from that state after every relevant action.
- Ensure selection and pinning survive view switches, resizing, theme changes, and fullscreen transitions.
- Preserve the existing URL parameter names and values for geographic filters, view, layout, and trip. Do not add a new public URL format.
- Search all countries. When selecting a result excluded by geographic filters, clear the conflicting filters and synchronize the URL so the selected country is visible.
- Implement a labeled combobox with Up/Down navigation, Enter selection, Escape dismissal, active-option announcement, and a visible no-results state.
- Expose map-view/layout selection with aria-pressed. Keep a polite status message for selection and trip updates.
- After explicit country selection, focus the detail heading without an unexpected viewport jump. Provide a “Back to map” action; closing details clears selection but preserves pinned countries.
- Preserve native fullscreen and the existing fallback. Restore the previous view/layout on exit unless the visitor explicitly changed it during fullscreen.

Typography and controls

- Use 18px country headings, 15px guidance text with 1.6 line height, and 12–13px secondary labels. Keep search inputs at least 16px.
- Replace Leaflet’s font-based zoom/close glyphs with consistent SVG icons and accessible names.
- Use “Add to trip,” “Remove from trip,” “Clear trip,” and “Exit fullscreen.”
- Preserve map category colors. Use separately defined, theme-aware badge text colors achieving at least 4.5:1 contrast for small text.
- Preserve structured lists in both country details and trip summaries, existing loading/error feedback, and all clinical content.

### 3. Homepage, archives, blog, and navigation

- Keep the homepage composition, section order, project videos, and carousel controls below the cards.
- Add “View case study” within each existing project copy link; do not create another nested link or alter carousel autoplay rules.
- Use Home, Projects, Blog, and Contact consistently for destinations. Label case-study return actions “Back to projects”; retain the homepage’s section navigation and contextual article-language links.
- Convert credential archive entries into consistent static record cards with explicit actions. Single credentials get View or Verify; compound credentials get descriptive actions such as “View Tech certificate” and “View AI certificate.” Preserve every destination.
- Match credential-card corners and spacing to the homepage.
- Align Blog and archive heading sizes and spacing: sentence case, 28–40px responsive page titles, and a consistent reading width.
- Change “Read Article” to “Read article” and remove its decorative SVG arrow. Preserve paper-link chevrons, Thai typography behavior, and code formatting.
- Add aria-pressed to Blog language filters. Preserve existing article-demo selected-state behavior and confirm keyboard operation.

### 4. Contact feedback

- Enhance the shared contact component so Home and Contact behave identically.
- Retain the existing Formspree endpoint, field names, and ordinary HTML POST fallback.
- Submit with native fetch and FormData, requesting JSON responses; add no backend or third-party UI dependency.
- Provide idle, sending, success, and error states. Disable repeated submission while pending and announce outcomes accessibly.
- Reset fields only after confirmed success. Preserve entered text on validation, network, or server failure.
- After a 20-second timeout, explain that submission could not be confirmed; offer manual retry and the existing email link. Do not retry automatically.
- Keep provider messages as text, associate field errors with inputs, and retain native required/email validation. Follow Formspree’s AJAX guidance (https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/).

## Validation and acceptance

- Run npm run build, node scripts/audit-site.mjs, and git diff --check.
- Extend static checks for filter selected-state markup and explicitly prohibited decorative action icons; retain local asset/link checks.
- Repeat all 22 content pages at 320, 430, 768, and 1440px in both themes. Inspect clipping, focus rings, and overlays as well as document overflow.
- Test the map using keyboard only: search, select, read guidance, pin/unpin, change filters, and return to the map.
- Reproduce the Thailand sequence through pinning, fullscreen, resizing, and view/layout changes. Labels, count, summary, and URL must agree throughout.
- Check long guidance, empty results, failed data loading, shared trip URLs, multiple pinned countries, and short landscape screens.
- Confirm map synchronization, antimeridian behavior, tiny-country selection, and fullscreen restoration remain functional.
- Verify menu open/close/Escape, theme icons, credential actions, Blog filters, and article-language navigation.
- Verify carousel autoplay while visible, explicit pause, dot/keyboard navigation, touch swipes, and vertical scrolling.
- Confirm DDS open/close preserves the iframe instance and external fallback.
- Test contact success, validation failure, server failure, timeout, and duplicate-click handling with mocked responses. Do not send real contact or chatbot messages.
- Use localhost-only browser QA; stop only servers started for this work. Record real-device Safari as unverified unless actually tested.

## Delivery and assumptions

- Implement in four reviewable stages: shared controls; map redesign; archive/blog/navigation alignment; contact feedback and final regression checks.
- Start from the latest main, preserve unrelated changes and untracked assets, and update the changelog plus audit evidence.
- Existing URLs, clinical data, credentials, local assets, hidden content, and GitHub Pages hosting remain intact.
- No external application redesign, new analytics, backend migration, or broad framework refactor is included.
- Finish with a verified local result and review summary. Publishing this new release is a separate deployment step; the handoff’s completed deployment refers to the previous release.
