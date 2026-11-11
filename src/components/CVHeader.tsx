import React from 'react';
import { CVData } from '../data/cvData';
import { ProtectedImage } from './ProtectedImage';

interface CVHeaderProps {
  personalInfo: CVData['personalInfo'];
  profileImageUrl: string;
  onDownloadCV: (buttonElement: HTMLButtonElement) => void;
  downloadButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export const CVHeader: React.FC<CVHeaderProps> = ({
  personalInfo,
  profileImageUrl,
  onDownloadCV,
  downloadButtonRef,
}) => {
  return (
    <header className="cv-header" aria-label="Curriculum Vitae Header">
      {/*
        SINGLE PROFILE PHOTOGRAPH ELEMENT
        - Desktop (>600px): Left side, 130px x 130px square (grid-column: 1, grid-row: 1 / 4)
        - Mobile (<=600px): 4th in vertical order (below contact info, directly above Download CV button),
          horizontally centered, 120px x 120px square.
      */}
      <div className="cv-photo-wrapper" data-header-item="photo">
        <ProtectedImage
          src={profileImageUrl}
          alt={`${personalInfo.fullName} — Professional Portrait`}
          eager={true}
          fallbackType="profile"
          className="cv-profile-photo"
        />
      </div>

      {/*
        1ST ON MOBILE / TOP-RIGHT ROW 1 ON DESKTOP: Full Name
      */}
      <div className="cv-name-group" data-header-item="name">
        <h1 className="cv-name">{personalInfo.fullName}</h1>
      </div>

      {/*
        SINGLE DOWNLOAD CV BUTTON ELEMENT
        - Desktop (>600px): Same horizontal line as name, 24px (within 20-30px) to the right of the name
        - Mobile (<=600px): 5th in vertical order, centered directly below the profile photo (16px spacing)
      */}
      <div className="cv-download-wrapper print-hidden" data-header-item="download-btn">
        <button
          ref={downloadButtonRef}
          type="button"
          className="cv-download-btn"
          onClick={(e) => onDownloadCV(e.currentTarget)}
        >
          <svg
            className="cv-download-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download CV</span>
        </button>
      </div>

      {/*
        2ND ON MOBILE / ROW 2 ON DESKTOP: Professional Designation
      */}
      <div className="cv-designation-wrapper" data-header-item="designation">
        <p className="cv-designation">{personalInfo.designation}</p>
      </div>

      {/*
        3RD ON MOBILE / ROW 3 ON DESKTOP: Contact Information
      */}
      <div className="cv-header-contact" data-header-item="contact">
        <div className="cv-contact-inline-list">
          <span className="cv-contact-item">
            <strong className="cv-contact-label">Email:</strong>{' '}
            <a href={`mailto:${personalInfo.email}`} className="cv-link">
              {personalInfo.email}
            </a>
          </span>
          <span className="cv-contact-sep" aria-hidden="true">
            ·
          </span>
          <span className="cv-contact-item">
            <strong className="cv-contact-label">Tel:</strong>{' '}
            <span>{personalInfo.telephone}</span>
          </span>
          <span className="cv-contact-sep" aria-hidden="true">
            ·
          </span>
          <span className="cv-contact-item">
            <strong className="cv-contact-label">Location:</strong>{' '}
            <span>{personalInfo.location}</span>
          </span>
          <span className="cv-contact-sep" aria-hidden="true">
            ·
          </span>
          <span className="cv-contact-item">
            <strong className="cv-contact-label">LinkedIn:</strong>{' '}
            {personalInfo.linkedinUrl ? (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-link"
              >
                {personalInfo.linkedinLabel}
              </a>
            ) : (
              <span>{personalInfo.linkedinLabel}</span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
};
