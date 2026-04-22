import { useState, useEffect, useRef } from 'react';

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface GameStats {
  letterAttempts: number;
  letterCorrect: number;
  wordsSkipped: number;
  currentStreak: number;
  bestStreak: number;
  totalPlayMs: number;
}

interface ReviewEntry {
  intervalDays: number;
  nextReviewAt: number;
  lastResult: 'success' | 'skip' | 'fail';
}

interface DailyGoalState {
  date: string;
  goal: number;
  completedToday: number;
}

interface TelemetryEvent {
  type: string;
  at: number;
  payload: Record<string, unknown>;
}

interface PersistedStatePayload {
  progress: string[];
  skippedWords: string[];
  stats: GameStats;
  hintUsage: Record<string, number>;
  reviewSchedule: Record<string, ReviewEntry>;
  dailyGoal: DailyGoalState;
  badges: string[];
  settings: GameSettings;
}

const STORAGE_KEYS = {
  PROGRESS: 'bible_letters_progress',
  SKIPPED: 'bible_letters_skipped',
  STATS: 'bible_letters_stats',
  HINTS: 'bible_letters_hints',
  REVIEW: 'bible_letters_review',
  DAILY_GOAL: 'bible_letters_daily_goal',
  BADGES: 'bible_letters_badges',
  TELEMETRY: 'bible_letters_telemetry',
  DEVICE_ID: 'bible_letters_device_id',
  SOUND: 'bible_letters_sound',
  MUSIC: 'bible_letters_music',
} as const;

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
};

const DEFAULT_STATS: GameStats = {
  letterAttempts: 0,
  letterCorrect: 0,
  wordsSkipped: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalPlayMs: 0,
};

const DEFAULT_DAILY_GOAL: DailyGoalState = {
  date: new Date().toISOString().slice(0, 10),
  goal: 3,
  completedToday: 0,
};

export function useGameState() {
  const [progress, setProgress] = useState<string[]>([]);
  const [skippedWords, setSkippedWords] = useState<string[]>([]);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [hintUsage, setHintUsage] = useState<Record<string, number>>({});
  const [reviewSchedule, setReviewSchedule] = useState<Record<string, ReviewEntry>>({});
  const [dailyGoal, setDailyGoal] = useState<DailyGoalState>(DEFAULT_DAILY_GOAL);
  const [badges, setBadges] = useState<string[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasBootstrappedRemoteRef = useRef(false);
  const skipNextSyncRef = useRef(false);
  const syncTimeoutRef = useRef<number | null>(null);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      const savedSkippedWords = localStorage.getItem(STORAGE_KEYS.SKIPPED);
      if (savedSkippedWords) {
        setSkippedWords(JSON.parse(savedSkippedWords));
      }

      const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (savedStats) {
        setStats({ ...DEFAULT_STATS, ...JSON.parse(savedStats) });
      }

      const savedHints = localStorage.getItem(STORAGE_KEYS.HINTS);
      if (savedHints) setHintUsage(JSON.parse(savedHints));

      const savedReview = localStorage.getItem(STORAGE_KEYS.REVIEW);
      if (savedReview) setReviewSchedule(JSON.parse(savedReview));

      const savedGoal = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      if (savedGoal) {
        const parsed = JSON.parse(savedGoal) as DailyGoalState;
        const today = new Date().toISOString().slice(0, 10);
        if (parsed.date === today) setDailyGoal(parsed);
      }

      const savedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (savedBadges) setBadges(JSON.parse(savedBadges));

      const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
      const savedMusic = localStorage.getItem(STORAGE_KEYS.MUSIC);
      
      setSettings({
        soundEnabled: savedSound ? savedSound === 'true' : DEFAULT_SETTINGS.soundEnabled,
        musicEnabled: savedMusic ? savedMusic === 'true' : DEFAULT_SETTINGS.musicEnabled,
      });
    } catch (error) {
      console.warn('Failed to load game state from localStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const getDeviceId = () => {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      if (existing) return existing;
      const created = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, created);
      return created;
    } catch {
      return 'device_fallback';
    }
  };

  const hasLocalData = () =>
    progress.length > 0 ||
    skippedWords.length > 0 ||
    stats.letterAttempts > 0 ||
    stats.wordsSkipped > 0 ||
    Object.keys(hintUsage).length > 0 ||
    Object.keys(reviewSchedule).length > 0 ||
    badges.length > 0;

  const snapshotState = (): PersistedStatePayload => ({
    progress,
    skippedWords,
    stats,
    hintUsage,
    reviewSchedule,
    dailyGoal,
    badges,
    settings,
  });

  const applySnapshot = (snap: PersistedStatePayload) => {
    setProgress(snap.progress ?? []);
    setSkippedWords(snap.skippedWords ?? []);
    setStats({ ...DEFAULT_STATS, ...(snap.stats ?? DEFAULT_STATS) });
    setHintUsage(snap.hintUsage ?? {});
    setReviewSchedule(snap.reviewSchedule ?? {});
    setDailyGoal(snap.dailyGoal ?? DEFAULT_DAILY_GOAL);
    setBadges(snap.badges ?? []);
    setSettings({ ...DEFAULT_SETTINGS, ...(snap.settings ?? DEFAULT_SETTINGS) });

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(snap.progress ?? []));
    localStorage.setItem(STORAGE_KEYS.SKIPPED, JSON.stringify(snap.skippedWords ?? []));
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({ ...DEFAULT_STATS, ...(snap.stats ?? DEFAULT_STATS) }));
    localStorage.setItem(STORAGE_KEYS.HINTS, JSON.stringify(snap.hintUsage ?? {}));
    localStorage.setItem(STORAGE_KEYS.REVIEW, JSON.stringify(snap.reviewSchedule ?? {}));
    localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, JSON.stringify(snap.dailyGoal ?? DEFAULT_DAILY_GOAL));
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(snap.badges ?? []));
    localStorage.setItem(STORAGE_KEYS.SOUND, String((snap.settings ?? DEFAULT_SETTINGS).soundEnabled));
    localStorage.setItem(STORAGE_KEYS.MUSIC, String((snap.settings ?? DEFAULT_SETTINGS).musicEnabled));
  };

  const pushRemote = async (snap: PersistedStatePayload) => {
    try {
      const playerId = getDeviceId();
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ playerId, state: snap }),
      });
      if (!res.ok) {
        // Silently fail in dev - API only available on Vercel
      }
    } catch {
      // Silently fail - game works fine with localStorage only
    }
  };

  const pullRemote = async (): Promise<PersistedStatePayload | null> => {
    try {
      const playerId = getDeviceId();
      const res = await fetch(`/api/state?playerId=${encodeURIComponent(playerId)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return (data?.state as PersistedStatePayload | undefined) ?? null;
    } catch {
      // Silently fail - game works fine with localStorage only
      return null;
    }
  };

  useEffect(() => {
    if (!isHydrated || hasBootstrappedRemoteRef.current) return;
    hasBootstrappedRemoteRef.current = true;

    (async () => {
      try {
        const remote = await pullRemote();
        if (remote) {
          if (!hasLocalData()) {
            skipNextSyncRef.current = true;
            applySnapshot(remote);
          } else {
            await pushRemote(snapshotState());
          }
        } else if (hasLocalData()) {
          await pushRemote(snapshotState());
        }
      } catch {
        // Silent fallback to localStorage-only mode.
      }
    })();
    // Intentionally run once after hydrate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || !hasBootstrappedRemoteRef.current) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(() => {
      pushRemote(snapshotState()).catch(() => {
        // Silent fallback to localStorage-only mode.
      });
    }, 700);

    return () => {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, [isHydrated, progress, skippedWords, stats, hintUsage, reviewSchedule, dailyGoal, badges, settings]);

  const appendTelemetry = (event: Omit<TelemetryEvent, 'at'>) => {
    try {
      const prevRaw = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
      const prev = prevRaw ? (JSON.parse(prevRaw) as TelemetryEvent[]) : [];
      const next = [...prev, { ...event, at: Date.now() }].slice(-400);
      localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(next));
    } catch {
      // Swallow storage failures.
    }
  };

  const saveProgress = (word: string) => {
    let newProgress = progress;
    if (!progress.includes(word)) {
      newProgress = [...progress, word];
      setProgress(newProgress);
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
    }

    if (skippedWords.includes(word)) {
      const newSkipped = skippedWords.filter((w) => w !== word);
      setSkippedWords(newSkipped);
      localStorage.setItem(STORAGE_KEYS.SKIPPED, JSON.stringify(newSkipped));
    }

    setStats((prev) => {
      const updatedStats: GameStats = {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      return updatedStats;
    });

    const today = new Date().toISOString().slice(0, 10);
    setDailyGoal((prev) => {
      const base = prev.date === today ? prev : { ...DEFAULT_DAILY_GOAL, date: today };
      const updated = { ...base, completedToday: base.completedToday + 1 };
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, JSON.stringify(updated));
      return updated;
    });

    setReviewSchedule((prev) => {
      const current = prev[word];
      const nextInterval = Math.max(1, Math.min(14, Math.round((current?.intervalDays ?? 1) * 1.8)));
      const next: ReviewEntry = {
        intervalDays: nextInterval,
        nextReviewAt: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
        lastResult: 'success',
      };
      const updated = { ...prev, [word]: next };
      localStorage.setItem(STORAGE_KEYS.REVIEW, JSON.stringify(updated));
      return updated;
    });

    appendTelemetry({ type: 'word_completed', payload: { word } });
    return newProgress;
  };

  const markWordSkipped = (word: string) => {
    if (!skippedWords.includes(word) && !progress.includes(word)) {
      const newSkipped = [...skippedWords, word];
      setSkippedWords(newSkipped);
      localStorage.setItem(STORAGE_KEYS.SKIPPED, JSON.stringify(newSkipped));
    }

    setStats((prev) => {
      const updatedStats: GameStats = {
        ...prev,
        wordsSkipped: prev.wordsSkipped + 1,
        currentStreak: 0,
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      return updatedStats;
    });

    setReviewSchedule((prev) => {
      const next: ReviewEntry = {
        intervalDays: 1,
        nextReviewAt: Date.now(),
        lastResult: 'skip',
      };
      const updated = { ...prev, [word]: next };
      localStorage.setItem(STORAGE_KEYS.REVIEW, JSON.stringify(updated));
      return updated;
    });
    appendTelemetry({ type: 'word_skipped', payload: { word } });
  };

  const recordLetterAttempt = (isCorrect: boolean) => {
    setStats((prev) => {
      const updatedStats: GameStats = {
        ...prev,
        letterAttempts: prev.letterAttempts + 1,
        letterCorrect: prev.letterCorrect + (isCorrect ? 1 : 0),
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      return updatedStats;
    });
    if (!isCorrect) appendTelemetry({ type: 'drop_incorrect', payload: {} });
  };

  const recordPlaySession = (sessionMs: number) => {
    if (!Number.isFinite(sessionMs) || sessionMs <= 0) return;
    setStats((prev) => {
      const updatedStats: GameStats = {
        ...prev,
        totalPlayMs: prev.totalPlayMs + sessionMs,
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      return updatedStats;
    });
  };

  const getAccuracyRate = () => {
    if (stats.letterAttempts === 0) return 0;
    return Math.round((stats.letterCorrect / stats.letterAttempts) * 100);
  };

  const getCompletedCount = () => progress.length;

  const getNeedsPracticeCount = () => skippedWords.filter((w) => !progress.includes(w)).length;

  const getTotalPlayMinutes = () => Math.round((stats.totalPlayMs / 1000 / 60) * 10) / 10;

  const recordHintUse = (word: string) => {
    setHintUsage((prev) => {
      const updated = { ...prev, [word]: (prev[word] ?? 0) + 1 };
      localStorage.setItem(STORAGE_KEYS.HINTS, JSON.stringify(updated));
      return updated;
    });
    appendTelemetry({ type: 'hint_used', payload: { word } });
  };

  const getHintPenaltyMultiplier = (word: string) => {
    const hints = hintUsage[word] ?? 0;
    return Math.max(0.6, 1 - hints * 0.1);
  };

  const getWordsDueForReview = () =>
    Object.entries(reviewSchedule)
      .filter(([, review]) => review.nextReviewAt <= Date.now())
      .map(([word]) => word);

  const earnBadge = (badge: string) => {
    if (badges.includes(badge)) return;
    const updated = [...badges, badge];
    setBadges(updated);
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(updated));
  };

  const resetProgress = () => {
    setProgress([]);
    setSkippedWords([]);
    setStats(DEFAULT_STATS);
    setHintUsage({});
    setReviewSchedule({});
    setDailyGoal(DEFAULT_DAILY_GOAL);
    setBadges([]);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.SKIPPED);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.HINTS);
    localStorage.removeItem(STORAGE_KEYS.REVIEW);
    localStorage.removeItem(STORAGE_KEYS.DAILY_GOAL);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
    localStorage.removeItem(STORAGE_KEYS.TELEMETRY);
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save individual settings to localStorage
    if ('soundEnabled' in newSettings) {
      localStorage.setItem(STORAGE_KEYS.SOUND, newSettings.soundEnabled!.toString());
    }
    if ('musicEnabled' in newSettings) {
      localStorage.setItem(STORAGE_KEYS.MUSIC, newSettings.musicEnabled!.toString());
    }
  };

  return {
    progress,
    skippedWords,
    stats,
    hintUsage,
    reviewSchedule,
    dailyGoal,
    badges,
    settings,
    saveProgress,
    markWordSkipped,
    recordLetterAttempt,
    recordPlaySession,
    getAccuracyRate,
    getCompletedCount,
    getNeedsPracticeCount,
    getTotalPlayMinutes,
    recordHintUse,
    getHintPenaltyMultiplier,
    getWordsDueForReview,
    earnBadge,
    resetProgress,
    updateSettings,
  };
}