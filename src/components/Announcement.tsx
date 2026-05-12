import { useEffect, useRef } from 'react';

interface AnnouncementProps {
  message: string;
  type?: 'polite' | 'assertive';
  isVisible?: boolean;
}

/**
 * Accessible announcement component for screen readers
 * Uses aria-live to announce messages to assistive technologies
 */
export function Announcement({ message, type = 'polite', isVisible = true }: AnnouncementProps) {
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force screen reader to announce by clearing and re-setting content
    if (isVisible && message && ariaLiveRef.current) {
      ariaLiveRef.current.textContent = '';
      // Use setTimeout to ensure screen reader detects the change
      const timer = setTimeout(() => {
        if (ariaLiveRef.current) {
          ariaLiveRef.current.textContent = message;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [message, isVisible]);

  return (
    <div
      ref={ariaLiveRef}
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}

/**
 * Announcement region for game events
 * Announces tile placements, game progress, etc.
 */
export function GameAnnouncement({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <Announcement 
      message={message} 
      type="assertive" 
      isVisible={isVisible}
    />
  );
}
