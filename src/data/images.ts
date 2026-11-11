import { PortfolioImagesConfig } from '../utils/portfolioLogic';

declare global {
  interface Window {
    portfolioImages?: PortfolioImagesConfig;
  }
}

export const defaultPortfolioImages: PortfolioImagesConfig = {
  cvDocument: '/assets/resume.pdf',
  cover: '/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png',
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
      cvDocument: window.portfolioImages.cvDocument ?? defaultPortfolioImages.cvDocument,
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
