# Project Context: vk-poonyakanok.github.io

This repository contains the personal portfolio website of Vitchakorn Poonyakanok (Blue), a physician and clinical data analyst focused on travel medicine, clinical AI, and public health data systems.

## Site Structure
- **About**: Professional summary, contact links, and clickable stats.
- **Experience**: Clinical, public health, academic, and education timeline with institutional logos.
- **Projects**: Featured carousel of clinical AI, travel medicine, data visualization, machine learning, and utility projects.
- **Research**: Publications with DOI links and expandable details.
- **Training**: Super AI Engineer Season 6 program details, Foundation AI certificate, The Scamper housing team and Team Site role, minihack Colab/certificate/Kaggle links, Level 2 online challenge rank, and Level 2 on-site hackathon placements.
- **Skills & Certifications**: Technical stack and credential library.
- **Languages**: English and Thai language competency.
- **Contact**: Email and Formspree-powered contact form.

The old `Expertise` section is intentionally hidden because its claims are now better demonstrated through projects, training, publications, and experience.

## Navigation & UI
- **Typography-first portfolio**: Minimal, technical design using Inter and JetBrains Mono.
- **Persistent Theme Toggle**: Light/dark mode with local storage.
- **Desktop Navigation**: Fixed top navigation with active section highlighting.
- **Mobile Navigation**: Horizontally scrollable all-section chip strip with the current section styled like the desktop active state.
- **Scroll Reveal**: Section content fades in as it enters view.
- **Featured Project Carousel**: Eight featured projects with previous/next controls, slide dots, mobile swipe support, and a mobile-only control row placed directly below the active thumbnail.
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
- **Housing Team**: The Scamper, linked to `https://thescamperss6.com/`, with Team Site web developer contribution detail for the Mirror encrypted letter feature.
- **Foundation AI (Theory)**: Verification link in the Training section.
- **Level 1 Minihacks**: Certificate and Colab links for all three minihacks; Kaggle ranks for OCR and FahMai RAG where available.
- **Level 2 Online**: Parasite Eggs, rank 16/166 with Kaggle leaderboard link; cascaded YOLOv8 + DINOv2 parasite egg detection/classification pipeline with gold-label validation, SAHI-style inference, and microscopy artifact calibration.
- **Level 2 On-site Hackathons**: Demand Forecasting at Scale, private Kaggle leaderboard rank #1 across the 30-team on-site cohort and 2nd runner-up overall in final evaluation; Edge-AI for Intelligence Transport System Hackathon, co-honorable mention for Jetson Nano CCTV vehicle analytics; WellSense AIoT & System Product Hackathon, result pending, with FormWings running-form wearable work using Arduino Nano IMU capture, Arduino UNO Q inference, BLE telemetry, and mobile dashboard.

## Asset Notes
- Local logos and project screenshots live in `logo/`, `experience/`, `project/`, `badge/`, `cert/`, and `certlogo/`.
- Featured carousel previews should use optimized `project/*-thumb.webp` assets while keeping original screenshots as source files.
- Tableau uses `favicon/tableau.png`.
- DigiHealth currently uses `experience/digihealth-dh.png`.
- ISC2 CC currently uses `badge/certified-in-cybersecurity-cc.1-white.png`.
- Scamper logo path contains a space and is referenced as `logo/Scamper%20Logo.png`.

## Deployment
- Hosted via GitHub Pages on the `main` branch.
- The site is a static single-page HTML portfolio centered on `index.html`.
