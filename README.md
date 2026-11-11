# Rifath Ahamed — Professional PDF-Style Portfolio Website

A production-ready, continuous PDF-style responsive portfolio website for **Rifath Ahamed** (`BSc in Management and Information Technology, Second Class Upper Honours, GPA 3.50/4.00`).

---

## Project Architecture

This repository includes:

1. **Live Web Application** (`index.html`, `public/images.js`, `public/assets/resume.pdf`, `src/`) — Served automatically in the development/cloud environment on port `3000`.
2. **Standalone Vanilla HTML5 / CSS3 / JS Package** (`portfolio/`) — Ready to open directly in any browser or edit in **Visual Studio Code on Windows 11** without any build tools required:

```text
portfolio/
│
├── index.html
├── style.css
├── script.js
├── images.js
├── README.md
│
└── assets/
    └── resume.pdf
```

---

## How to Customize in Visual Studio Code (Windows 11)

### 1. Updating Profile, Project & Certificate Image URLs (`images.js`)

Open `public/images.js` (or `portfolio/images.js` for the standalone version) in Visual Studio Code:

```javascript
const portfolioImages = {
  profile: "https://your-domain.com/profile-photo.jpg",

  projects: {
    schoolManagement: "https://your-domain.com/school-system.png",
    homeRenovation: [
      "https://your-domain.com/home-repair-1.png",
      "https://your-domain.com/home-repair-2.png"
    ]
  },

  certificates: [
    {
      title: "Certificate Title",
      issuer: "Issuing Institution",
      date: "2025",
      imageUrl: "https://your-domain.com/certificate-preview.jpg",
      verificationUrl: "https://your-domain.com/verify"
    }
  ]
};
```

- **Profile Photo**: Supports HTTPS links or local relative paths (e.g. `"assets/profile.jpg"`). Displays in a 1:1 square frame (`130px × 130px` on desktop, `120px × 120px` centered on mobile).
- **Multiple Project Screenshots**: Each project key (`schoolManagement`, `homeRenovation`) accepts either a single URL string or an array of URL strings.
- **Certificates Gallery**: Add as many certificate objects as you like. Any certificate object with an empty `title: ""` is automatically hidden on the published website.
- **Document Restrictions**: Do not include degree certificate photographs or scanned academic transcripts.

### 2. Replacing the Downloadable CV PDF (`assets/resume.pdf`)

Replace `public/assets/resume.pdf` (and `portfolio/assets/resume.pdf`) with your official PDF resume file named `resume.pdf`. Clicking **Download CV** initiates the PDF download while displaying the animated handshake thank-you popup.

### 3. Updating Contact or Project Details

- In the React web app: edit `src/data/cvData.ts`.
- In the standalone HTML package: edit `portfolio/index.html`.
