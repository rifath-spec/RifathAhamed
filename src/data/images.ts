import { PortfolioImagesConfig } from '../utils/portfolioLogic';

declare global {
  interface Window {
    portfolioImages?: PortfolioImagesConfig;
  }
}

export const defaultPortfolioImages: PortfolioImagesConfig = {
  cover: '/assets/cover-banner.jpg',
  profile: '/assets/aistudio/Untitled_9d626b95.png',

  projects: {
    schoolManagement: '',
    homeRenovation: '',
  },

  certificates: [
    {
      title: '',
      issuer: '',
      date: '',
      imageUrl: '',
      verificationUrl: '',
    },
  ],
};

/**
 * Retrieves the live portfolioImages configuration from window.portfolioImages
 * (loaded from /images.js) or falls back to defaultPortfolioImages.
 */
export function getPortfolioImages(): PortfolioImagesConfig {
  if (typeof window !== 'undefined' && window.portfolioImages) {
    return {
      cover: window.portfolioImages.cover ?? defaultPortfolioImages.cover,
      profile: window.portfolioImages.profile ?? '',
      projects: {
        ...defaultPortfolioImages.projects,
        ...(window.portfolioImages.projects ?? {}),
      },
      certificates: Array.isArray(window.portfolioImages.certificates)
        ? window.portfolioImages.certificates
        : defaultPortfolioImages.certificates,
    };
  }
  return defaultPortfolioImages;
}
