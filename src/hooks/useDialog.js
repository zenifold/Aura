import { useEffect, useCallback } from 'react';

export const useDialog = (isOpen, onClose) => {
  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling of the body when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  return {
    handleBackdropClick: (e) => {
      // Only close if clicking the backdrop itself, not its children
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
  };
};
