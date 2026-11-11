export interface CertificateImageEntry {
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  verificationUrl?: string;
  watermark?: boolean;
}

export type ProjectImageValue = string | string[];

export interface PortfolioImagesConfig {
  cover?: string;
  profile: string;
  projects: {
    schoolManagement: ProjectImageValue;
    homeRenovation: ProjectImageValue;
    [key: string]: ProjectImageValue;
  };
  certificates: CertificateImageEntry[];
}

export const POPUP_AUTO_CLOSE_MS = 4000;
export const RESUME_PDF_PATH = 'assets/resume.pdf';

/**
 * Validates whether an image URL string is a non-empty, safe HTTPS or relative path.
 */
export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('javascript:') || trimmed.startsWith('data:text')) {
    return false;
  }
  // Allow clean local relative asset paths (e.g., "assets/profile.jpg" or "/assets/profile.jpg")
  return /^[a-zA-Z0-9_./-]+(\?[a-zA-Z0-9_=&-]+)?$/.test(trimmed);
}

/**
 * Converts Google Drive sharing links (e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * or https://drive.google.com/open?id=FILE_ID) into direct embeddable image URLs, while returning
 * all other valid URLs trimmed as-is.
 */
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const driveFileMatch = trimmed.match(
    /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
  );
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  if (trimmed.startsWith('https://drive.google.com/')) {
    try {
      const parsed = new URL(trimmed);
      const idParam = parsed.searchParams.get('id');
      if (idParam && /^[a-zA-Z0-9_-]+$/.test(idParam)) {
        return `https://lh3.googleusercontent.com/d/${idParam}`;
      }
    } catch {
      // fall through
    }
  }

  return trimmed;
}

/**
 * Normalizes a single string or array of strings from portfolioImages.projects[key]
 * into an array of verified, non-empty image URLs.
 */
export function resolveProjectScreenshots(input: ProjectImageValue | undefined | null): string[] {
  if (!input) return [];
  if (typeof input === 'string') {
    return isValidImageUrl(input) ? [normalizeImageUrl(input)] : [];
  }
  if (Array.isArray(input)) {
    return input
      .filter((item): item is string => isValidImageUrl(item))
      .map((item) => normalizeImageUrl(item));
  }
  return [];
}

/**
 * Checks whether a certificate title looks like a prohibited degree certificate photo
 * or scanned academic transcript per Section 9 restrictions.
 */
export function isRestrictedAcademicDocument(title: string): boolean {
  const normalized = title.toLowerCase().trim();
  if (!normalized) return false;
  const prohibitedPatterns = [
    /\bdegree\s+certificate\s+photo/i,
    /\bscanned\s+academic\s+transcript/i,
    /\bacademic\s+transcript\s+scan/i,
  ];
  return prohibitedPatterns.some((pattern) => pattern.test(normalized));
}

/**
 * Filters portfolioImages.certificates to hide empty placeholder entries and
 * prohibited academic transcript scans on the published website.
 */
export function getPublishedCertificates(
  entries: CertificateImageEntry[] | undefined | null
): CertificateImageEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((entry) => {
      if (!entry || typeof entry !== 'object') return false;
      const hasTitle = typeof entry.title === 'string' && entry.title.trim().length > 0;
      if (!hasTitle) return false;
      if (isRestrictedAcademicDocument(entry.title)) return false;
      return true;
    })
    .map((entry) => ({
      title: entry.title.trim(),
      issuer: typeof entry.issuer === 'string' ? entry.issuer.trim() : '',
      date: typeof entry.date === 'string' ? entry.date.trim() : '',
      imageUrl: isValidImageUrl(entry.imageUrl) ? entry.imageUrl.trim() : '',
      verificationUrl:
        typeof entry.verificationUrl === 'string' && entry.verificationUrl.trim().startsWith('https://')
          ? entry.verificationUrl.trim()
          : '',
      watermark: entry.watermark !== false,
    }));
}

/**
 * Pure state transition helper for the Download CV Handshake Popup.
 * Prevents multiple simultaneous popups from stacking.
 */
export function requestPopupOpen(currentlyOpen: boolean): { shouldOpen: boolean; nextState: boolean } {
  if (currentlyOpen) {
    return { shouldOpen: false, nextState: true };
  }
  return { shouldOpen: true, nextState: true };
}
