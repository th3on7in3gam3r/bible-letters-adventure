/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Settings, ArrowLeft } from "lucide-react";
import { BIBLE_WORDS, BibleWord } from "./data/words";
import { useGameState } from "./hooks/useGameState";
import { soundManager } from "./services/soundService";
import { speechService } from "./services/speechService";
import { PLACEHOLDER_MUSIC_URL } from "./constants";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./components/Home";
import WordList from "./components/WordList";
import Game from "./components/Game";
import SentenceGame from "./components/SentenceGame";
import Reward from "./components/Reward";
import SettingsScreen from "./components/Settings";
import { TutorialOverlay } from "./components/TutorialOverlay";
import StatsDashboard from "./components/StatsDashboard";
import { buildPackLookup } from "./data/packs";

export type Screen = "HOME" | "WORDS" | "GAME" | "SENTENCE" | "REWARD" | "SETTINGS" | "STATS";

type Milestone = {
  count: number;
  total: number;
  label: string;
  message: string;
  confettiMultiplier: number;
};

function getMilestone(progressCount: number, totalCount: number): Milestone | null {
  const milestones = [5, 10, 25, totalCount];
  if (!milestones.includes(progressCount)) return null;

  if (progressCount === totalCount) {
    return {
      count: progressCount,
      total: totalCount,
      label: "YOU DID IT!",
      message: `All ${totalCount} words complete! You’re a Bible Letters champion!`,
      confettiMultiplier: 2.2,
    };
  }

  return {
    count: progressCount,
    total: totalCount,
    label: "MILESTONE!",
    message: `${progressCount} words mastered! Keep going!`,
    confettiMultiplier: progressCount >= 25 ? 1.8 : progressCount >= 10 ? 1.5 : 1.25,
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("HOME");
  const [selectedWord, setSelectedWord] = useState<BibleWord | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<0 | 1 | 2>(0);
  const [activeWordStartMs, setActiveWordStartMs] = useState<number | null>(null);
  const [sessionHintCount, setSessionHintCount] = useState(0);
  const {
    progress,
    skippedWords,
    stats,
    hintUsage,
    dailyGoal,
    badges,
    settings,
    saveProgress,
    markWordSkipped,
    recordLetterAttempt,
    recordPlaySession,
    recordHintUse,
    getAccuracyRate,
    getNeedsPracticeCount,
    getTotalPlayMinutes,
    getHintPenaltyMultiplier,
    getWordsDueForReview,
    earnBadge,
    resetProgress,
    updateSettings,
  } = useGameState();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync services with settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    speechService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // One-time tutorial gate
  useEffect(() => {
    try {
      const seen = localStorage.getItem("bible_letters_tutorial_seen");
      setTutorialSeen(seen === "true");
    } catch {
      setTutorialSeen(false);
    }
  }, []);

  useEffect(() => {
    if (tutorialSeen) return;
    if (currentScreen !== "GAME") return;
    setTutorialOpen(true);
    setTutorialStep(0);
  }, [currentScreen, tutorialSeen]);

  // Background Music Controller
  useEffect(() => {
    if (settings.musicEnabled) {
      audioRef.current?.play().catch(() => {
        // Browser might block auto-play until first interaction
      });
    } else {
      audioRef.current?.pause();
    }
  }, [settings.musicEnabled]);

  // Handle first interaction to start music if enabled
  useEffect(() => {
    const startMusic = () => {
      if (settings.musicEnabled) audioRef.current?.play().catch(() => {});
      window.removeEventListener('click', startMusic);
    };
    window.addEventListener('click', startMusic);
    return () => window.removeEventListener('click', startMusic);
  }, [settings.musicEnabled]);

  const navigateTo = (screen: Screen, word: BibleWord | null = null) => {
    if ((currentScreen === "GAME" || currentScreen === "SENTENCE") && screen !== "GAME" && screen !== "SENTENCE") {
      finishWordSessionTime();
    }
    soundManager.play('click');
    if (word) setSelectedWord(word);
    if (screen !== "REWARD") setMilestone(null);
    setCurrentScreen(screen);
  };

  const startWordSession = (word: BibleWord) => {
    setSelectedWord(word);
    setActiveWordStartMs(Date.now());
    setSessionHintCount(0);
    navigateTo("GAME");
  };

  const finishWordSessionTime = () => {
    if (!activeWordStartMs) return;
    recordPlaySession(Date.now() - activeWordStartMs);
    setActiveWordStartMs(null);
  };

  const orderedWords = useMemo(() => {
    const due = new Set(getWordsDueForReview());
    const needsPractice = new Set(skippedWords.filter((word) => !progress.includes(word)));
    return [...BIBLE_WORDS].sort((a, b) => {
      const aNeeds = needsPractice.has(a.word) ? 1 : 0;
      const bNeeds = needsPractice.has(b.word) ? 1 : 0;
      if (aNeeds !== bNeeds) return bNeeds - aNeeds;
      const aDue = due.has(a.word) ? 1 : 0;
      const bDue = due.has(b.word) ? 1 : 0;
      if (aDue !== bDue) return bDue - aDue;
      return a.word.localeCompare(b.word);
    });
  }, [progress, skippedWords, getWordsDueForReview]);

  const dueReviewWords = useMemo(() => {
    const dueSet = new Set(getWordsDueForReview());
    return BIBLE_WORDS.filter((word) => dueSet.has(word.word));
  }, [getWordsDueForReview]);

  useEffect(() => {
    if (progress.length >= 5) earnBadge("Word Starter (5)");
    if (progress.length >= 10) earnBadge("Faith Builder (10)");
    if (stats.bestStreak >= 5) earnBadge("Streak Hero (5)");
    if (stats.bestStreak >= 10) earnBadge("Streak Champion (10)");
    if (progress.length === BIBLE_WORDS.length) earnBadge("All Words Complete");

    const packs = buildPackLookup(BIBLE_WORDS);
    for (const pack of packs) {
      if (pack.words.length > 0 && pack.words.every((w) => progress.includes(w.word))) {
        earnBadge(`${pack.title} Complete`);
      }
    }
  }, [progress, stats.bestStreak, earnBadge]);

  const getBackScreen = (): Screen => {
    switch (currentScreen) {
      case "SETTINGS": return "HOME";
      case "STATS": return "HOME";
      case "GAME": return "WORDS";
      case "SENTENCE": return "WORDS";
      case "WORDS": return "HOME";
      default: return "HOME";
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-[#FDFBF2] bg-pattern flex flex-col items-center justify-start relative overflow-auto font-sans" style={{ minHeight: '100vh', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
        <TutorialOverlay
          open={tutorialOpen}
          step={tutorialStep}
          onSkip={() => {
            setTutorialOpen(false);
            setTutorialSeen(true);
            try {
              localStorage.setItem("bible_letters_tutorial_seen", "true");
            } catch {}
          }}
          onNext={() => {
            if (tutorialStep >= 2) {
              setTutorialOpen(false);
              setTutorialSeen(true);
              try {
                localStorage.setItem("bible_letters_tutorial_seen", "true");
              } catch {}
              return;
            }
            setTutorialStep((s) => (s + 1) as 0 | 1 | 2);
          }}
        />

        {/* HUD / Header */}
        {currentScreen !== "HOME" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6 z-50 flex items-center gap-4"
          >
            <button 
              onClick={() => navigateTo(getBackScreen())}
              className="p-3 bg-white rounded-full shadow-md hover:bg-yellow-50 text-yellow-600 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
          </motion.div>
        )}

        {/* Global Settings Trigger */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            if (currentScreen !== "SETTINGS") navigateTo("SETTINGS");
          }}
          className={`absolute top-6 right-6 p-4 backdrop-blur-sm rounded-full transition-all shadow-sm z-50 ${
            currentScreen === "SETTINGS"
              ? "bg-blue-500 text-white cursor-default"
              : "bg-white/50 text-gray-400 hover:text-blue-500 hover:bg-white"
          }`}
          aria-label="Open settings"
        >
          <Settings size={28} />
        </motion.button>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentScreen === "HOME" && (
            <Home 
              key="home" 
              onStart={() => navigateTo("WORDS")} 
              onOpenStats={() => navigateTo("STATS")}
              progressCount={progress.length}
              totalCount={BIBLE_WORDS.length}
            />
          )}
          {currentScreen === "STATS" && (
            <StatsDashboard
              key="stats"
              completedCount={progress.length}
              totalCount={BIBLE_WORDS.length}
              accuracyRate={getAccuracyRate()}
              currentStreak={stats.currentStreak}
              bestStreak={stats.bestStreak}
              needsPracticeCount={getNeedsPracticeCount()}
              totalPlayMinutes={getTotalPlayMinutes()}
              badges={badges}
              dailyGoal={dailyGoal}
            />
          )}
          {currentScreen === "WORDS" && (
            <WordList 
              key="words" 
              words={orderedWords} 
              completedWords={progress}
              skippedWords={skippedWords}
              dueReviewWords={dueReviewWords}
              onSelectWord={startWordSession} 
            />
          )}
          {currentScreen === "GAME" && selectedWord && (
            <Game 
              key="game" 
              wordData={selectedWord} 
              soundEnabled={settings.soundEnabled}
              onAttempt={recordLetterAttempt}
              onHintUse={() => {
                recordHintUse(selectedWord.word);
                setSessionHintCount((prev) => prev + 1);
              }}
              onSkip={() => {
                markWordSkipped(selectedWord.word);
                finishWordSessionTime();
                navigateTo("WORDS");
              }}
              onWin={() => navigateTo("SENTENCE")}
            />
          )}
          {currentScreen === "SENTENCE" && selectedWord && (
            <SentenceGame
              key="sentence"
              wordData={selectedWord}
              soundEnabled={settings.soundEnabled}
              onAttempt={recordLetterAttempt}
              onHintUse={() => {
                recordHintUse(selectedWord.word);
                setSessionHintCount((prev) => prev + 1);
              }}
              onSkip={() => {
                markWordSkipped(selectedWord.word);
                finishWordSessionTime();
                navigateTo("WORDS");
              }}
              onWin={() => {
                const updatedProgress = saveProgress(selectedWord.word);
                setMilestone(getMilestone(updatedProgress.length, BIBLE_WORDS.length));
                finishWordSessionTime();
                navigateTo("REWARD");
              }}
            />
          )}
          {currentScreen === "REWARD" && selectedWord && (
            <Reward 
              key="reward" 
              wordData={selectedWord} 
              soundEnabled={settings.soundEnabled}
              milestone={milestone}
              rewardMultiplier={getHintPenaltyMultiplier(selectedWord.word)}
              hintCount={sessionHintCount}
              dailyGoal={dailyGoal}
              onNext={() => navigateTo("WORDS")}
            />
          )}
          {currentScreen === "SETTINGS" && (
            <SettingsScreen
              key="settings"
              soundEnabled={settings.soundEnabled}
              musicEnabled={settings.musicEnabled}
              onToggleSound={(enabled) => updateSettings({ soundEnabled: enabled })}
              onToggleMusic={(enabled) => updateSettings({ musicEnabled: enabled })}
              onResetProgress={resetProgress}
              completedWords={progress}
              skippedWords={skippedWords.filter((word) => !progress.includes(word))}
              totalPlayMinutes={getTotalPlayMinutes()}
              accuracyRate={getAccuracyRate()}
              badges={badges}
              hintUsage={hintUsage}
            />
          )}
        </AnimatePresence>

        {/* Hidden Music Player */}
        <audio 
          ref={audioRef}
          src={PLACEHOLDER_MUSIC_URL}
          loop
          preload="auto"
          aria-hidden="true"
        />

        {/* Bottom accent */}
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 right-4 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <Book size={120} />
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
