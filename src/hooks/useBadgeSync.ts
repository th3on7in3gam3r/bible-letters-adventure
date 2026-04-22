/**
 * useBadgeSync — syncs earned Bible Letters badges to the shared Turso DB
 * so they appear on the user's biblefunland.com profile.
 *
 * Badge mapping:
 *   10 words  → "letter-learner"
 *   25 words  → "word-warrior"
 *   52 words  → "scripture-speller"
 *   streak 5  → "streak-hero"
 *   streak 10 → "streak-champion"
 */
import { useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';

export const PLATFORM_BADGES: Record<string, { label: string; emoji: string; desc: string; proOnly: boolean }> = {
  'letter-learner':    { label: 'Letter Learner',    emoji: '📖', desc: '10 Bible words mastered',       proOnly: false },
  'word-warrior':      { label: 'Word Warrior',       emoji: '⚔️', desc: '25 Bible words mastered',       proOnly: false },
  'scripture-speller': { label: 'Scripture Speller',  emoji: '🏆', desc: 'All 52 words complete!',        proOnly: false },
  'streak-hero':       { label: 'Streak Hero',        emoji: '🔥', desc: '5-word streak achieved',        proOnly: false },
  'streak-champion':   { label: 'Streak Champion',    emoji: '👑', desc: '10-word streak achieved',       proOnly: false },
  'pro-scholar':       { label: 'Pro Scholar',        emoji: '🎓', desc: 'Exclusive Pro badge',           proOnly: true  },
  'family-champion':   { label: 'Family Champion',    emoji: '👨‍👩‍👧', desc: 'Family plan exclusive badge', proOnly: true  },
};

/** Map local badge strings → platform badge IDs */
export function localBadgeToPlatformId(localBadge: string): string | null {
  const lower = localBadge.toLowerCase();
  if (lower.includes('word starter') || lower.includes('faith builder') || lower.includes('10')) return 'letter-learner';
  if (lower.includes('25')) return 'word-warrior';
  if (lower.includes('all words') || lower.includes('52')) return 'scripture-speller';
  if (lower.includes('streak hero')) return 'streak-hero';
  if (lower.includes('streak champion')) return 'streak-champion';
  return null;
}

export function useBadgeSync() {
  const { user } = useUser();

  const syncBadge = useCallback(async (badgeId: string) => {
    if (!user) return; // guest — no sync
    try {
      await fetch('/api/badges', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId: user.id, badgeId }),
      });
    } catch {
      // silent — badge is still stored locally
    }
  }, [user]);

  const syncAllBadges = useCallback(async (localBadges: string[]) => {
    if (!user) return;
    for (const local of localBadges) {
      const platformId = localBadgeToPlatformId(local);
      if (platformId) await syncBadge(platformId);
    }
  }, [user, syncBadge]);

  return { syncBadge, syncAllBadges };
}
