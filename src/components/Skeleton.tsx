import { motion } from 'motion/react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

/**
 * Skeleton loader component for better perceived performance
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  count = 1 
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <>
      {items.map((i) => (
        <motion.div
          key={i}
          className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
          style={{ width, height }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Skeleton card for loading states
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ${className}`}>
      <Skeleton width="60%" height="1.5rem" className="mb-4" />
      <Skeleton height="1rem" className="mb-3" />
      <Skeleton height="1rem" width="80%" />
    </div>
  );
}

/**
 * Skeleton grid for multiple cards
 */
export function SkeletonGrid({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for a circular avatar
 */
export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      className="rounded-full bg-gray-200 dark:bg-gray-700"
      style={{ width: size, height: size }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      aria-hidden="true"
    />
  );
}
