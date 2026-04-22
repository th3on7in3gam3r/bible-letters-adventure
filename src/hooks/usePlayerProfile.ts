/**
 * usePlayerProfile — stores kid's name and parent/teacher mode toggle
 * Separate from useGameState to keep concerns clean.
 */
import { useState, useEffect } from 'react';

const KEYS = {
  NAME: 'bible_letters_player_name',
  PARENT_MODE: 'bible_letters_parent_mode',
  WORD_DATES: 'bible_letters_word_dates', // Record<word, ISO date string>
} as const;

export function usePlayerProfile() {
  const [playerName, setPlayerNameState] = useState('');
  const [parentMode, setParentModeState] = useState(false);
  const [wordDates, setWordDatesState] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const n = localStorage.getItem(KEYS.NAME);
      if (n) setPlayerNameState(n);
      const pm = localStorage.getItem(KEYS.PARENT_MODE);
      if (pm) setParentModeState(pm === 'true');
      const wd = localStorage.getItem(KEYS.WORD_DATES);
      if (wd) setWordDatesState(JSON.parse(wd));
    } catch {}
  }, []);

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
    try { localStorage.setItem(KEYS.NAME, name); } catch {}
  };

  const setParentMode = (enabled: boolean) => {
    setParentModeState(enabled);
    try { localStorage.setItem(KEYS.PARENT_MODE, String(enabled)); } catch {}
  };

  const recordWordDate = (word: string) => {
    setWordDatesState(prev => {
      if (prev[word]) return prev; // already recorded
      const updated = { ...prev, [word]: new Date().toISOString().slice(0, 10) };
      try { localStorage.setItem(KEYS.WORD_DATES, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  return { playerName, setPlayerName, parentMode, setParentMode, wordDates, recordWordDate };
}
