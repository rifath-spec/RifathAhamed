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
  cvDocument?: string;
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
export const RESUME_PDF_PATH = '/assets/resume.pdf';

/**
 * Checks whether the current URL query string unlocks the owner-only Files & Links manager (?edit=true).
 */
export function isOwnerEditMode(searchString: string): boolean {
  if (typeof searchString !== 'string' || !searchString.trim()) return false;
  try {
    const normalized = searchString.startsWith('?') ? searchString : `?${searchString}`;
    const params = new URLSearchParams(normalized);
    return params.get('edit') === 'true';
  } catch {
    return false;
  }
}

/**
 * Extracts a Google Drive file ID from common sharing URL formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 * - https://drive.google.com/thumbnail?id=FILE_ID
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const driveFileMatch = trimmed.match(
    /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
  );
  if (driveFileMatch && driveFileMatch[1]) {
    return driveFileMatch[1];
  }

  if (trimmed.startsWith('https://drive.google.com/')) {
    try {
      const parsed = new URL(trimmed);
      const idParam = parsed.searchParams.get('id');
      if (idParam && /^[a-zA-Z0-9_-]+$/.test(idParam)) {
        return idParam;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Validates whether an image URL string is a non-empty, safe HTTPS, data:image/*, or relative path.
 */
export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:image/')) {
    return /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed);
  }
  if (trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return false;
  }
  // Allow clean local relative asset paths (e.g., "assets/profile.jpg" or "/assets/profile.jpg")
  return /^[a-zA-Z0-9_./-]+(\?[a-zA-Z0-9_=&-]+)?$/.test(trimmed);
}

/**
 * Validates whether a document URL (PDF/credential link) is a safe HTTPS URL, data:application/pdf, or relative asset path.
 */
export function isValidDocumentUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:application/pdf;base64,')) {
    return true;
  }
  if (trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return false;
  }
  return /^[a-zA-Z0-9_./-]+(\?[a-zA-Z0-9_=&-]+)?$/.test(trimmed);
}

/**
 * Converts Google Drive sharing links into direct embeddable image URLs, while returning
 * all other valid URLs trimmed as-is.
 */
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

/**
 * Converts Google Drive file sharing links into direct download links for PDF/documents,
 * while preserving local paths and standard HTTPS URLs.
 */
export function normalizeDocumentUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return RESUME_PDF_PATH;

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
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
      imageUrl: isValidImageUrl(entry.imageUrl) ? normalizeImageUrl(entry.imageUrl) : '',
      verificationUrl: isValidDocumentUrl(entry.verificationUrl)
        ? entry.verificationUrl!.trim()
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
