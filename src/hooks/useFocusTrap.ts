import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to implement focus trap in modals/dialogs
 * Keeps focus within the modal and enables ESC key to close
 */
export function useFocusTrap(isOpen: boolean, onClose: () => void, containerRef?: React.RefObject<HTMLDivElement>) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element so we can restore it later
    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close on ESC
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      // Focus trap: keep focus within modal
      if (event.key !== 'Tab') return;

      const container = containerRef?.current;
      if (!container) return;

      // Get all focusable elements within the modal
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // If Shift+Tab, move to previous element
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab, move to next element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first interactive element in modal
    if (containerRef?.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusable) {
        // Use setTimeout to ensure focus happens after render
        const timer = setTimeout(() => firstFocusable.focus(), 0);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, containerRef]);
}
