import React, { useState } from 'react';
import { isValidImageUrl } from '../utils/portfolioLogic';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  watermarkText?: string;
  fallbackType: 'profile' | 'project' | 'certificate';
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  className = '',
  eager = false,
  watermarkText,
  fallbackType,
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [hasError, setHasError] = useState(false);
  const validSrc = isValidImageUrl(src) && !hasError ? src.trim() : '';

  const preventContextAndDrag = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  if (!validSrc) {
    if (fallbackType === 'profile') {
      return (
        <div
          className={`profile-photo-frame profile-photo-placeholder ${className}`}
          role="img"
          aria-label={alt}
          onContextMenu={preventContextAndDrag}
        >
          <svg
            viewBox="0 0 130 130"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="130" height="130" fill="#F8FAFC" />
            <circle cx="65" cy="48" r="21" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <path
              d="M27 114C27 93.5655 43.5655 77 64 77H66C86.4345 77 103 93.5655 103 114V122H27V114Z"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <text
              x="65"
              y="53"
              textAnchor="middle"
              fill="#12345A"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-ui)"
            >
              RA
            </text>
          </svg>
        </div>
      );
    }

    if (fallbackType === 'project') {
      return (
        <div
          className={`project-preview-placeholder ${className}`}
          role="img"
          aria-label={`${alt} (Configure image URL in images.js)`}
        >
          <div className="project-placeholder-header">
            <span className="project-placeholder-dot" />
            <span className="project-placeholder-dot" />
            <span className="project-placeholder-dot" />
            <span className="project-placeholder-bar" />
          </div>
          <div className="project-placeholder-body">
            <p className="project-placeholder-title">{fallbackTitle || 'Project Screenshot'}</p>
            <p className="project-placeholder-subtitle">
              {fallbackSubtitle || 'Screenshot URL configurable via portfolioImages.projects in images.js'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`certificate-preview-placeholder ${className}`}
        role="img"
        aria-label={alt}
      >
        <p className="certificate-placeholder-title">{fallbackTitle || 'Certificate Preview'}</p>
        <p className="certificate-placeholder-subtitle">
          {fallbackSubtitle || 'Preview URL configurable in images.js'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`protected-image-wrapper ${className}`}
      onContextMenu={preventContextAndDrag}
      onDragStart={preventContextAndDrag}
    >
      <img
        src={validSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        referrerPolicy="no-referrer"
        className="protected-image"
        onContextMenu={preventContextAndDrag}
        onDragStart={preventContextAndDrag}
        onError={() => setHasError(true)}
      />
      {/* Protective transparent shield and optional certificate watermark */}
      <div className="protected-image-shield" aria-hidden="true">
        {watermarkText && <span className="certificate-watermark">{watermarkText}</span>}
      </div>
    </div>
  );
};
