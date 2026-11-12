import React from 'react';

export interface EditButtonProps {
  sectionName: string;
  onEditClick: (sectionName: string, triggerEl: HTMLButtonElement) => void;
  isAdminMode?: boolean;
  className?: string;
}

/**
 * Reusable EditButton component.
 * Renders an accessible 44x44px icon button that triggers the placeholder EditModal
 * for the specified section.
 */
export const EditButton: React.FC<EditButtonProps> = ({
  sectionName,
  onEditClick,
  isAdminMode = true,
  className = '',
}) => {
  if (!isAdminMode) return null;

  return (
    <button
      type="button"
      className={`dummy-edit-btn print-hidden ${className}`.trim()}
      data-edit-section={sectionName}
      aria-label={`Edit ${sectionName}`}
      title={`Edit ${sectionName}`}
      onClick={(e) => onEditClick(sectionName, e.currentTarget)}
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
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
  );
};
