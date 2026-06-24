# Project Context: vpoonyak.github.io

This repository contains the personal portfolio website of Vitchakorn Poonyakanok (Blue), a physician and clinical data analyst focused on travel medicine, clinical AI, and public health data systems.

## Site Structure
- **About**: Professional summary, contact links, and clickable stats.
- **Experience**: Clinical, public health, academic, and education timeline with institutional logos.
- **Projects**: Desktop Top Projects grid with the first four proof projects; mobile keeps the featured carousel.
- **Research**: Publications with DOI links and expandable details.
- **Training**: Super AI Engineer Season 6 proof summary, The Scamper housing team, AI Practitioner Level 1 credential with collapsible Foundation AI (Theory) and Minihacks evidence, Level 2 ranks/placements with collapsible method details, and collapsed additional clinical methods training.
- **Capabilities**: Selected technical stack and collapsed credential archive.
- **Languages**: English and Thai language competency; visible as a section but demoted from primary navigation.
- **Contact**: Email and Formspree-powered contact form.

The old `Expertise` section is intentionally hidden because its claims are now better demonstrated through projects, training, publications, and experience.

## Navigation & UI
- **Typography-first portfolio**: Minimal, technical design using Inter and JetBrains Mono.
- **Persistent Theme Toggle**: Light/dark mode with local storage.
- **Desktop Navigation**: Fixed top navigation with active section highlighting.
- **Mobile Navigation**: Horizontally scrollable primary-section chip strip with the current section styled like the desktop active state; Languages is intentionally omitted.
- **Scroll Reveal**: Section content fades in as it enters view.
- **Featured Projects**: Desktop shows the first four projects as a static proof grid; mobile uses the carousel with previous/next controls, slide dots, swipe support, and a mobile-only control row placed directly below the active thumbnail.
- **Static Project Chips**: Project tags are metadata only and should not navigate.
- **Hidden Applications Block**: Application card grid remains in markup but is hidden for now.

## Featured Projects
- **Altitude Itinerary Analyzer**: AI-assisted travel medicine itinerary extraction and altitude risk assessment.
- **Yellow Fever Vaccine & Malaria Prevention Dashboard**: Tableau dashboard based on CDC Yellow Book travel health data.
- **Thai HospSearch**: Thai healthcare facility lookup and normalization tool.
- **Hajj Menstrual Delay Planner**: Clinical counseling tool for menstrual delay planning during Hajj.
- **PM2.5 & Mental Health Dynamics**: Tableau Public story for spatial-temporal PM2.5 and psychiatric disorder patterns.
- **Cirrhosis Survival Prediction**: Kaggle notebook using clinical ML for survival/transplant outcome modeling.
- **Thai Numeral Converter**: Thai Documentation Utility for preserving URLs/emails while converting Arabic numerals to Thai numerals.
- **BNK/CGM48 4th General Election Predictive Analysis**: End-to-end scraping and prediction ML case study.

## Skills Taxonomy
- **Core Tools**: Python, R, SQL, Stata.
- **Data Analysis & Processing**: NumPy, Pandas, OpenCV, jamovi.
- **Applied ML & AI**: YOLO, Scikit-Learn, PyTorch, TensorFlow.
- **Large Language Model APIs**: GPT, Claude, Gemini, GLM, Grok, ThaiLLM.
- **Cloud & Infrastructure**: Google Cloud, Firebase, Huawei Cloud.
- **Visualization & Design**: Tableau, Power BI, Matplotlib, Seaborn, Adobe Photoshop, Adobe Lightroom.
- **Geospatial**: QGIS.
- **Cybersecurity**: Burp Suite, OWASP.
- **Research & Computing Environments**: Jupyter, Anaconda, Google Colab, Linux, LANTA HPC.

## Training Highlights
- **Super AI Engineer Season 6**: Advanced AI Level 2 Participant, AIAT, Apr-Jun 2026.
- **Selection Note**: Selected 150 from 10,000+ applicants.
- **Housing Team**: The Scamper, linked to `https://thescamperss6.com/`.
- **AI Practitioner**: Primary visible Level 1 credential combining Foundation AI (Theory) and Level 1 Minihacks, verified at `https://mysuperai.aiat.or.th/verify/3893dd94-0ff5-464f-b26f-f8f44e655bdf`.
- **Level 1 Detail**: Foundation AI (Theory) and all three Level 1 Minihacks live in the collapsible detail block under AI Practitioner; Minihacks use public `mysuperai.aiat.or.th/verify/...` links plus Colab links and Kaggle ranks where available.
- **Level 2 Online**: Parasite Eggs rank remains visible; the long model-method writeup lives in `Method detail`.
- **Level 2 On-site Hackathons**: Demand Forecasting, Edge-AI, and WellSense placements remain visible; long implementation notes live in `Method detail`.

## Asset Notes
- Local logos and project screenshots live in `logo/`, `experience/`, `project/`, `badge/`, `cert/`, and `certlogo/`.
- Featured carousel previews should use optimized `project/*-thumb.webp` assets while keeping original screenshots as source files.
- Tableau uses `favicon/tableau.png`.
- DigiHealth currently uses `experience/digihealth-dh.png`.
- DigiHealth is complete and should be shown as `Master of Science in Digital and AI Technologies in Health Systems (DigiHealth)` with `2025 — 2026`.
- ISC2 CC currently uses `badge/certified-in-cybersecurity-cc.1-white.png`.
- Scamper logo path contains a space and is referenced as `logo/Scamper%20Logo.png`.

## Deployment
- Hosted via GitHub Pages on the `main` branch.
- The site is a static single-page HTML portfolio centered on `index.html`.
