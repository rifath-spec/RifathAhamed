# Rifath Ahamed Portfolio — LinkedIn-Style Cover Banner & Two-Column Profile Redesign

This plan redesigns the portfolio into a modern **LinkedIn-style professional profile experience** featuring a full-width top profile card with a custom corporate navy tech cover banner, an overlapping circular profile photograph, and a responsive two-column layout of main profile feed cards and right-hand sidebar cards—while preserving all 10 verified CV sections, centralized image configuration (`cover`, `profile`, `projects`, `certificates`), the animated SVG handshake thank-you popup on **Download CV**, and A4 print support.

## User Review & Critical Decisions

> [!IMPORTANT]
> The decisions below incorporate your confirmed preferences from our clarification step and supersede earlier single-column/square-photo rules where specified.

- **Confirmed Decision 1 — Two-Column LinkedIn Feed & Sidebar Card Architecture**: Below the top LinkedIn profile banner card, desktop screens will display a two-column layout (`~68%` main profile feed on the left for *About / Professional Summary*, *Work Experience*, *Education*, *Academic & Professional Projects*, and *Professional Certifications*; `~32%` sidebar on the right for *Core Competencies*, *Technical Skills*, *Professional Strengths*, *Languages*, and *Contact Information*). On tablet and mobile screens, these cards stack into a clean single-column feed.
- **Confirmed Decision 2 — Circular Profile Photo Overlapping the Cover Banner**: Your profile photograph will render in a LinkedIn-style circular frame (`152px × 152px` on desktop, `116px × 116px` on mobile) with a crisp `4px` white border overlapping the bottom-left edge of the cover photo banner.
- **Confirmed Decision 3 — Custom Corporate Navy Tech Cover Banner & Configurable `cover` Link**: We will generate a high-resolution corporate navy technology and management cover banner as the default cover image and expose `portfolioImages.cover` in your centralized image configuration so you can also swap it anytime using a direct URL or Google Drive share link.

---

## 1. Overview & Core Concept

- **What It Does**: Presents **Rifath Ahamed's** verified CV (`BSc in Management and Information Technology, Second Class Upper Honours, GPA 3.50/4.00`) in an immediately familiar, executive LinkedIn profile layout with a cover banner, overlapping circular headshot, primary action buttons (**Download CV** and **Print / Save A4**), and structured section cards.
- **Target Audience / Persona**: Recruiters, HR managers, and hiring leads who evaluate candidates on LinkedIn and appreciate scannable experience timelines, education badges, project showcases, and sidebar skill summaries.
- **Key Value**: Combines the visual polish and scannability of a LinkedIn profile with the ownership, image protection, custom PDF download + animated handshake thank-you modal, and clean A4 print formatting of a personal portfolio website.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **LinkedIn Hero Profile Card**: Visitors arrive at the top profile card featuring the wide corporate navy cover banner, the overlapping circular portrait of Rifath Ahamed, his name (`RIFATH AHAMED`), headline designation, verified institution highlights (*South Eastern University of Sri Lanka* and *AAT Sri Lanka*), location & email metadata, and the primary **Download CV** and **Print / Save A4** buttons.
  2. **Two-Column Profile Exploration**:
     - **Left Main Feed**: Visitors scroll through rich LinkedIn-style cards for **About (Professional Summary)**, **Experience** (with structured organization icons and bulleted achievements at *Jay Jay Mills Lanka (Pvt) Ltd* and *Grace Construction*), **Education** (*BSc in MIT, GPA 3.50/4.00* and *AAT Sri Lanka*), **Projects** (*School Management System* and *Home Repair & Renovation Website*), and **Licenses & Certifications**.
     - **Right Sidebar**: Visitors simultaneously reference **Core Competencies**, **Technical Skills**, **Professional Strengths**, **Languages**, and **Contact Information**.
  3. **Download CV & Animated Handshake Popup**: Clicking **Download CV** downloads `Rifath_Ahamed_CV.pdf` while opening the animated SVG handshake thank-you popup (*0–300ms* modal entrance, *300–1200ms* handshake animation, *600–1400ms* `"Thank You!"` heading, *1200–2000ms* appreciation message, 4-second auto-close, and manual close / `Escape` support).
  4. **A4 Print / Save as PDF**: Clicking **Print / Save A4** strips the web card backgrounds and cover banner chrome to print a clean, multi-page A4 resume with 1-inch margins.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Executive LinkedIn Profile UI blended with Corporate Navy Identity.
  - *Color Palette & Mood*:
    - `--color-canvas-bg`: `#F3F2EF` / `#E9EDF2` (Subtle LinkedIn-inspired neutral canvas behind white section cards)
    - `--color-card-bg`: `#FFFFFF` (Crisp white surface for the hero profile card, main feed cards, and sidebar cards)
    - `--color-primary-navy`: `#12345A` (Primary brand navy for buttons, headings, and institutional accents)
    - `--color-secondary-navy`: `#1E456F` (Interactive links, hover states, and organization subtitles)
    - `--color-body-text`: `#263238` (Primary prose and bullet points)
    - `--color-muted-text`: `#667085` (Dates, locations, and secondary metadata)
    - `--color-card-border`: `#DCE6F1` / `#CBD5E1` (1px subtle card borders with `12px` rounded corners)
  - *Typography & Hierarchy*:
    - `Plus Jakarta Sans` for headings and body prose; `JetBrains Mono` (`tabular-nums`) for dates, GPA (`3.50 / 4.00`), and tech stack metadata.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Width Container with Two-Column LinkedIn Card Grid**
  - *Chosen Approach*: Use a responsive desktop container with a full-width top Hero Profile Card followed by a two-column CSS Grid (`minmax(0, 2.15fr) minmax(300px, 1fr)`, `24px` gap) that collapses to a single column below `960px`.
  - *Why*: Mirrors the authentic LinkedIn desktop experience where narrative sections (*About*, *Experience*, *Education*, *Projects*) occupy the wide left column and quick-reference credentials (*Core Competencies*, *Technical Skills*, *Strengths*, *Languages*, *Contact*) sit in the right rail.
  - *Alternatives Considered*: Putting all 10 sections into a single wide card stack, which creates overly long text lines on wide desktop screens.

- **Decision 2: Centralized `portfolioImages.cover` Support with Google Drive Normalization**
  - *Chosen Approach*: Add `cover` to `portfolioImages` in `images.js` pre-configured with the generated corporate navy tech banner, and hydrate `#cover-photo-slot` via `script.js` using the same image protection and Google Drive URL normalization as `profile`.
  - *Why*: Allows you to change your cover banner at any time simply by pasting a new URL or Google Drive link into `images.js`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Layout Diagram**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LinkedIn-Style Portfolio Page Container                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     HERO PROFILE CARD (Full Width)                    │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │        Cover Photo Banner (#cover-photo-slot, 16:9 / 4:1)       │  │  │
│  │  └──────┬──────────────────────────────────────────────────────────┘  │  │
│  │         │  Overlapping Circular Avatar (152×152px, 4px white ring)    │  │
│  │  ┌──────┴──────┐                                                      │  │
│  │  │ ( Portrait )│  RIFATH AHAMED              • South Eastern Univ.    │  │
│  │  └─────────────┘  BSc in MIT (Hons) | MIS    • AAT Sri Lanka          │  │
│  │                   Sri Lanka · Email · Contact Info                    │  │
│  │                   [ Download CV ]  [ Print / Save A4 ]                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────┐ ┌──────────────────────────┐  │
│  │       LEFT MAIN FEED COLUMN (~68%)       │ │  RIGHT SIDEBAR (~32%)    │  │
│  │                                          │ │                          │  │
│  │  ┌────────────────────────────────────┐  │ │  ┌────────────────────┐  │  │
│  │  │ 01. About (Professional Summary)   │  │ │  │ 02. Core           │  │  │
│  │  └────────────────────────────────────┘  │ │  │     Competencies   │  │  │
│  │  ┌────────────────────────────────────┐  │ │  └────────────────────┘  │  │
│  │  │ 03. Experience (Timeline Entries)  │  │ │  ┌────────────────────┐  │  │
│  │  └────────────────────────────────────┘  │ │  │ 06. Technical      │  │  │
│  │  ┌────────────────────────────────────┐  │ │  │     Skills         │  │  │
│  │  │ 04. Education (SEUSL & AAT)        │  │ │  └────────────────────┘  │  │
│  │  └────────────────────────────────────┘  │ │  ┌────────────────────┐  │  │
│  │  ┌────────────────────────────────────┐  │ │  │ 07. Professional   │  │  │
│  │  │ 05. Projects (Showcase & Previews) │  │ │  │     Strengths      │  │  │
│  │  └────────────────────────────────────┘  │ │  └────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │ │  ┌────────────────────┐  │  │
│  │  │ 08. Licenses & Certifications      │  │ │  │ 09. Languages      │  │  │
│  │  └────────────────────────────────────┘  │ │  └────────────────────┘  │  │
│  │                                          │ │  ┌────────────────────┐  │  │
│  │                                          │ │  │ 10. Contact Info   │  │  │
│  │                                          │ │  └────────────────────┘  │  │
│  └──────────────────────────────────────────┘ └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State Updates**:
  - `portfolioImages.cover`: Added to `images.js` (and `src/data/images.ts` / `portfolioLogic.ts`) to store the cover banner URL.
  - `#cover-photo-slot` & `#profile-photo-slot`: Hydrated by `script.js` with `draggable="false"`, right-click protection, and automatic fallback rendering if an image URL fails to load.
