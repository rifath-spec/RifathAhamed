/**
 * CENTRALIZED DOCUMENT, IMAGE & ADMIN CONFIGURATION — RIFATH AHAMED PORTFOLIO
 * ===========================================================================
 * Placeholders to customize:
 * - isAdminMode: Set to true to display placeholder Edit buttons on all cards/headers,
 *   or false to hide them for public visitors.
 * - connectionsPlaceholder: Replace "[YOUR CONNECTIONS]" with your verified connection count (e.g. "500+ connections").
 * - cvDocument: Downloadable CV PDF link (Google Drive share link, HTTPS URL, or local path).
 * - cover: Hero cover banner image link (Google Drive share link or local path).
 * - profile: Circular profile photograph link (Google Drive share link or local path).
 * - projects: Screenshots for School Management System and Home Repair & Renovation Website.
 * - certificates: Professional certificate images and document/verification links.
 */

const isAdminMode = true;

const portfolioImages = {
  // Toggle dummy edit buttons across phone, tablet, and desktop
  isAdminMode: isAdminMode,

  // Placeholder for mobile LinkedIn connections line (replace with e.g. "500+ connections")
  connectionsPlaceholder: "[YOUR CONNECTIONS]",

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
  window.isAdminMode = isAdminMode;
  window.portfolioImages = portfolioImages;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isAdminMode, portfolioImages };
}
