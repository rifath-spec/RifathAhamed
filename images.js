/**
 * CENTRALIZED DOCUMENT & IMAGE LINK SYSTEM — RIFATH AHAMED PORTFOLIO
 * ==================================================================
 * Edit the URLs below (or use the on-page "Files & Links" button) to update:
 * - cvDocument: Downloadable CV PDF link (Google Drive share link, HTTPS URL, or local path)
 * - cover: Hero cover banner image link
 * - profile: Circular profile photograph link
 * - projects: Screenshots for School Management System and Home Repair & Renovation Website
 * - certificates: Professional certificate images and document/verification links
 *
 * Rules & Capabilities:
 * 1. Supports HTTPS links, Google Drive share links (drive.google.com/file/d/...), or local relative paths.
 * 2. Leave any project or certificate field as "" if you do not want an image displayed yet.
 * 3. For projects, you can provide a single URL string OR an array of URL strings.
 * 4. For certificates, add as many certificate objects as needed. Any entry with
 *    an empty title ("") is automatically hidden on the published website.
 */

const portfolioImages = {
  // Downloadable CV / Resume PDF link (supports Google Drive file link or local path)
  cvDocument: "/assets/resume.pdf",

  // Hero Cover Banner & Profile Photograph (supports Google Drive file link or local path)
  cover: "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
  profile: "/assets/aistudio/Untitled_9d626b95.png",

  // Project Screenshots (single URL string or array of URLs)
  projects: {
    schoolManagement: "",
    homeRenovation: ""
  },

  // Professional Certificates & Document Links
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
