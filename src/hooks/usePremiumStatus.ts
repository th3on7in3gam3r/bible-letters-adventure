import { useState, useEffect } from 'react';

/**
 * Hook to check if user has premium access
 * Checks localStorage for biblefunland.com user data
 */
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremium = () => {
      try {
        // Check for biblefunland.com user data in localStorage
        const userStr = localStorage.getItem('bfl_user');
        if (!userStr) {
          setIsPremium(false);
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        
        // Check if user has Pro or Family subscription
        const hasPremium = 
          user?.subscription?.plan === 'pro' || 
          user?.subscription?.plan === 'family' ||
          user?.subscription?.status === 'active';

        setIsPremium(hasPremium);
      } catch (error) {
        console.warn('Failed to check premium status:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremium();

    // Listen for storage changes (when user logs in/out on biblefunland.com)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bfl_user') {
        checkPremium();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isPremium, isLoading };
}
