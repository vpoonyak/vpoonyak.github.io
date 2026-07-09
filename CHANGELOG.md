# Changelog

All notable changes to this project will be documented in this file.

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
