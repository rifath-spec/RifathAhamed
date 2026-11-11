/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useRef, useState } from 'react';
import { cvData } from './data/cvData';
import { getPortfolioImages } from './data/images';
import { requestPopupOpen, RESUME_PDF_PATH } from './utils/portfolioLogic';
import { CVHeader } from './components/CVHeader';
import { CVSections } from './components/CVSections';
import { HandshakeModal } from './components/HandshakeModal';

export default function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const downloadButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const images = getPortfolioImages();

  const triggerPdfDownload = useCallback((pdfPath: string) => {
    // Preserve current scroll position and initiate reliable download without navigating away
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const anchor = document.createElement('a');
    anchor.href = pdfPath;
    anchor.setAttribute('download', 'Rifath_Ahamed_CV.pdf');
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.scrollTo(scrollX, scrollY);
  }, []);

  const handleDownloadCV = useCallback(
    (buttonElement: HTMLButtonElement) => {
      lastTriggerRef.current = buttonElement;
      const transition = requestPopupOpen(isPopupOpen);
      if (transition.shouldOpen) {
        setIsPopupOpen(true);
      }
      triggerPdfDownload(cvData.personalInfo.resumePdfPath || RESUME_PDF_PATH);
    },
    [isPopupOpen, triggerPdfDownload]
  );

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    // Restore focus to the Download CV button without scrolling the page
    const targetBtn = lastTriggerRef.current || downloadButtonRef.current;
    if (targetBtn) {
      window.setTimeout(() => {
        targetBtn.focus({ preventScroll: true });
      }, 10);
    }
  }, []);

  return (
    <div className="cv-page-shell">
      <main className="cv-document" id="cv-document">
        <CVHeader
          personalInfo={cvData.personalInfo}
          profileImageUrl={images.profile}
          onDownloadCV={handleDownloadCV}
          downloadButtonRef={downloadButtonRef}
        />

        <CVSections data={cvData} images={images} />
      </main>

      <HandshakeModal isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}
