# Changelog

All notable changes to this project will be documented in this file.

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
- **Project Metadata**: Changed Thai Numeral Converter source label from `vk-poonyakanok.github.io` to `Thai Documentation Utility`.
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
