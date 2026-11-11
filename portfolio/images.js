/**
 * CENTRALIZED IMAGE LINK SYSTEM — RIFATH AHAMED PORTFOLIO
 * ========================================================
 * Edit the URLs below to update your cover banner, profile photograph,
 * project screenshots, and professional certificate previews across the website.
 *
 * Rules & Capabilities:
 * 1. Supports HTTPS image links, Google Drive share links, or local relative paths.
 * 2. Leave any project or certificate field as "" if you do not want an image displayed yet.
 * 3. For projects, you can provide a single URL string OR an array of URL strings.
 * 4. For certificates, add as many certificate objects as needed. Any entry with
 *    an empty title ("") is automatically hidden on the published website.
 * 5. Do not add degree certificate photographs or scanned academic transcripts.
 */

const portfolioImages = {
  cover: "/assets/cover-banner.jpg",
  profile: "/assets/aistudio/Untitled_9d626b95.png",

  projects: {
    schoolManagement: "",
    homeRenovation: ""
  },

  certificates: [
    {
      title: "",
      issuer: "",
      date: "",
      imageUrl: "",
      verificationUrl: ""
    }
  ]
};

if (typeof window !== "undefined") {
  window.portfolioImages = portfolioImages;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { portfolioImages };
}
