/**
 * CENTRALIZED IMAGE LINK SYSTEM — RIFATH AHAMED PORTFOLIO
 * ========================================================
 * Edit the URLs below to update your cover banner, profile photograph,
 * project screenshots, and professional certificate previews across the website.
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
