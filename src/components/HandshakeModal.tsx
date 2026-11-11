import React, { useEffect, useRef } from 'react';
import { POPUP_AUTO_CLOSE_MS } from '../utils/portfolioLogic';

interface HandshakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandshakeModal: React.FC<HandshakeModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens so keyboard users can immediately interact
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 50);

    // Automatically close after 4 seconds (4000ms)
    const autoCloseTimer = window.setTimeout(() => {
      onClose();
    }, POPUP_AUTO_CLOSE_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(autoCloseTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="handshake-modal-backdrop print-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handshake-modal-title"
      aria-describedby="handshake-modal-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="handshake-modal-card">
        <button
          ref={closeButtonRef}
          type="button"
          className="handshake-modal-close"
          onClick={onClose}
          aria-label="Close thank you popup"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Animated Inline SVG Handshake Illustration (300-1200ms sequence) */}
        <div className="handshake-svg-container" aria-hidden="true">
          <svg
            className="handshake-svg"
            viewBox="0 0 200 130"
            width="160"
            height="104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Subtle circular framing backdrop */}
            <circle cx="100" cy="66" r="48" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* clasp group that performs the gentle vertical handshake motion once hands meet */}
            <g className="handshake-clasp-group">
              {/* Left Arm & Hand moving gently right toward center */}
              <g className="handshake-hand-left">
                {/* Left suit cuff */}
                <path
                  d="M16 54L46 54L52 84L16 84Z"
                  fill="#12345A"
                  stroke="#12345A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M46 55L52 83" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                {/* Left palm & thumb extending to clasp */}
                <path
                  d="M51 58C62 56 76 50 88 50C95 50 100 54 103 58C105 61 102 65 97 65C91 65 86 62 82 63L116 66C121 67 123 72 119 76L106 86C98 91 84 91 74 87L52 80Z"
                  fill="#E2E8F0"
                  stroke="#12345A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Right Arm & Hand moving gently left toward center */}
              <g className="handshake-hand-right">
                {/* Right suit cuff */}
                <path
                  d="M184 54L154 54L148 84L184 84Z"
                  fill="#1E456F"
                  stroke="#12345A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M154 55L148 83" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                {/* Right palm & clasping fingers */}
                <path
                  d="M149 58C138 56 124 50 112 50C104 50 97 54 93 59C90 62 93 66 99 66C105 66 110 63 115 64L85 72C80 74 81 80 86 82L101 87C111 90 124 89 133 85L148 80Z"
                  fill="#F8FAFC"
                  stroke="#12345A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Subtle finger ridge lines at center clasp */}
                <path
                  d="M92 73L108 77M95 79L110 83M99 85L111 88"
                  stroke="#12345A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Subtle professional accent lines above clasp */}
            <g className="handshake-accent-lines">
              <line x1="100" y1="22" x2="100" y2="30" stroke="#1E456F" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="28" x2="83" y2="34" stroke="#1E456F" strokeWidth="2" strokeLinecap="round" />
              <line x1="122" y1="28" x2="117" y2="34" stroke="#1E456F" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Heading (600-1400ms reveal) */}
        <h2 id="handshake-modal-title" className="handshake-modal-heading">
          Thank You!
        </h2>

        {/* Messages (1200-2000ms reveal) */}
        <div id="handshake-modal-desc" className="handshake-modal-messages">
          <p className="handshake-modal-primary-msg">
            Thank you for your interest in my professional profile.
          </p>
          <p className="handshake-modal-secondary-msg">
            I appreciate you taking the time to explore my CV.
          </p>
        </div>
      </div>
    </div>
  );
};
