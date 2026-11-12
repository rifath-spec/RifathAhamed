import React, { useEffect, useRef } from 'react';
import { DUMMY_EDIT_MODAL_MESSAGE, formatEditModalTitle } from '../utils/portfolioLogic';

export interface EditModalProps {
  isOpen: boolean;
  sectionName: string | null;
  onClose: () => void;
}

/**
 * Reusable EditModal component.
 * Traps keyboard focus, closes on Escape or backdrop click, and displays
 * the placeholder admin backend message without mutating data.
 */
export const EditModal: React.FC<EditModalProps> = ({ isOpen, sectionName, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const primaryCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      primaryCloseBtnRef.current?.focus({ preventScroll: true });
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = [closeButtonRef.current, primaryCloseBtnRef.current].filter(
          (el): el is HTMLButtonElement => Boolean(el)
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !sectionName) return null;

  return (
    <div
      id="dummy-edit-modal"
      className="dummy-edit-modal-backdrop print-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dummy-edit-modal-title"
      aria-describedby="dummy-edit-modal-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dummy-edit-modal-card">
        <div className="dummy-edit-modal-header">
          <h2 id="dummy-edit-modal-title" className="dummy-edit-modal-title">
            {formatEditModalTitle(sectionName)}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="dummy-edit-modal-icon-close"
            aria-label="Close edit dialog"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p id="dummy-edit-modal-body" className="dummy-edit-modal-text">
          {DUMMY_EDIT_MODAL_MESSAGE}
        </p>

        <div className="dummy-edit-modal-footer">
          <button
            ref={primaryCloseBtnRef}
            type="button"
            className="dummy-edit-modal-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
