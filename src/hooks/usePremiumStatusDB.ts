import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

/**
 * Hook to check if user has premium access from database
 * Queries mindshiftplus database for subscription status
 */
export function usePremiumStatusDB() {
  const { user, isLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        // If not logged in, user is free tier
        if (!user) {
          setIsPremium(false);
          setIsLoading(false);
          return;
        }

        // Skip API call in local dev — but still allow override via env
        if (import.meta.env.DEV) {
          // In dev, treat as Pro if VITE_DEV_IS_PRO=true in .env
          setIsPremium(import.meta.env.VITE_DEV_IS_PRO === 'true');
          setIsLoading(false);
          return;
        }

        // Query the database for subscription status
        const response = await fetch(`/api/subscription?userId=${user.id}`);
        
        if (!response.ok) {
          console.warn('Failed to fetch subscription status');
          setIsPremium(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        
        // Check if user has active Pro or Family subscription
        const hasPremium = 
          data?.status === 'active' && 
          (data?.plan === 'pro' || data?.plan === 'family') &&
          new Date(data?.expires_at) > new Date();

        setIsPremium(hasPremium);
      } catch (error) {
        console.warn('Failed to check premium status:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      checkPremium();
    }
  }, [user, isLoaded]);

  return { isPremium, isLoading, isAuthenticated: !!user };
}
