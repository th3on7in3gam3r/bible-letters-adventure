import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BibleWord } from "../data/words";
import { Volume2, RefreshCw, Eye, SkipForward, Keyboard, Contrast, Timer } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "../services/soundService";
import { speechService } from "../services/speechService";
import { ANIMATION_CONFIG } from "../constants";

interface GameProps {
  wordData: BibleWord;
  soundEnabled: boolean;
  onWin: (result: { starsEarned: number; attempts: number; hintsUsed: number; elapsedMs: number }) => void;
  onSkip: () => void;
  onAttempt: (isCorrect: boolean) => void;
  onHintUse: () => void;
  key?: string;
}

interface LetterTile {
  id: string;
  char: string;
}

type Difficulty = "easy" | "medium" | "hard";
type AgeMode = "3-6" | "7-9" | "10-12";

const AGE_CONFIG: Record<AgeMode, { tile: string; input: string }> = {
  "3-6": { tile: "text-4xl sm:text-5xl", input: "text-4xl sm:text-5xl" },
  "7-9": { tile: "text-3xl sm:text-4xl", input: "text-3xl sm:text-4xl" },
  "10-12": { tile: "text-2xl sm:text-3xl", input: "text-2xl sm:text-3xl" },
};

const getEmoji = (word: string) => {
  const lower = word.toLowerCase();
  if (lower.includes("ark")) return "🛶";
  if (lower.includes("noah")) return "🌈";
  if (lower.includes("jesus")) return "👑";
  if (lower.includes("cross")) return "✝️";
  if (lower.includes("love")) return "❤️";
  return "✨";
}

export default function Game({ wordData, soundEnabled, onWin, onSkip, onAttempt, onHintUse }: GameProps) {
  const word = wordData.word.toUpperCase();
  const letters = useMemo(() => word.replace(/\s/g, "").split(""), [word]);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [ageMode, setAgeMode] = useState<AgeMode>("7-9");
  const [showHint, setShowHint] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [placed, setPlaced] = useState<(string | null)[]>([]);
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [toast, setToast] = useState("");
  const [showVersePopup, setShowVersePopup] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startMs, setStartMs] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [hardRemaining, setHardRemaining] = useState(45);
  const firstHint = word[0];
  const typingMode = difficulty !== "easy";
  const ageClasses = AGE_CONFIG[ageMode];
  const toastTimerRef = useRef<number | null>(null);

  const restartRound = () => {
    const mapped = letters.map((char, index) => ({ id: `${char}-${index}-${Math.random()}`, char }));
    setTiles(mapped.sort(() => Math.random() - 0.5));
    setPlaced(new Array(letters.length).fill(null));
    setTypedAnswer("");
    setAttempts(0);
    setHintsUsed(0);
    setCompleted(false);
    setShowVersePopup(false);
    setHardRemaining(45);
    setStartMs(Date.now());
  };

  useEffect(() => {
    restartRound();
    return () => speechService.stopRepeating();
  }, [word, difficulty, ageMode]);

  useEffect(() => {
    if (difficulty !== "hard" || completed) return;
    const timer = window.setInterval(() => {
      setHardRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setToast("Time is up. Try again — God gives new chances! ❤️");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [difficulty, completed]);

  useEffect(() => {
    if (!toast) return;
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 1800);
  }, [toast]);

  const speakWord = () => {
    if (!soundEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordData.word);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const starsFromPerformance = (elapsedMs: number) => {
    if (attempts <= 2 && hintsUsed === 0 && elapsedMs < 20000) return 3;
    if (attempts <= 5 && hintsUsed <= 1) return 2;
    return 1;
  };

  const completeWord = () => {
    if (completed) return;
    setCompleted(true);
    const elapsedMs = Date.now() - startMs;
    const starsEarned = starsFromPerformance(elapsedMs);
    const starKey = "bible_letters_word_stars";
    const raw = localStorage.getItem(starKey);
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    parsed[wordData.word] = Math.max(parsed[wordData.word] ?? 0, starsEarned);
    localStorage.setItem(starKey, JSON.stringify(parsed));
    confetti({ ...ANIMATION_CONFIG.CONFETTI, particleCount: 180, spread: 95 });
    setShowVersePopup(true);
    soundManager.play("win");
    speechService.speak(`Wonderful! ${wordData.word} is correct!`);
    onWin({ starsEarned, attempts, hintsUsed, elapsedMs });
  };

  const checkTyped = (value: string) => {
    const normalized = value.toUpperCase().replace(/\s/g, "");
    const target = letters.join("");
    if (normalized.length < target.length) return;
    setAttempts((prev) => prev + 1);
    const correct = normalized === target;
    onAttempt(correct);
    if (correct) {
      soundManager.play("correct");
      completeWord();
    } else {
      soundManager.play("incorrect");
      setToast("Almost! God gives us new chances! ❤️");
      setShakeInput(true);
      window.setTimeout(() => setShakeInput(false), 350);
    }
  };

  const putLetterInSlot = (char: string) => {
    const targetIndex = placed.findIndex((entry) => entry === null);
    if (targetIndex === -1) return;
    setAttempts((prev) => prev + 1);
    const correct = letters[targetIndex] === char;
    onAttempt(correct);
    if (!correct) {
      soundManager.play("incorrect");
      setToast("Almost! God gives us new chances! ❤️");
      return;
    }
    soundManager.play("correct");
    const next = [...placed];
    next[targetIndex] = char;
    setPlaced(next);
    setTiles((prev) => {
      const idx = prev.findIndex((t) => t.char === char);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
    if (next.every((entry, i) => entry === letters[i])) {
      completeWord();
    }
  };

  return (
    <div className={`game-container w-full max-w-3xl mx-auto px-4 ${highContrast ? "bg-white text-black" : ""}`}>
      <div className="text-center mb-5">
        <div className="text-6xl mb-2" aria-hidden="true">{getEmoji(wordData.word)}</div>
        <h2 className="font-display font-black text-blue-700 text-4xl sm:text-6xl">{word}</h2>
        <div className="flex justify-center gap-2 mt-3">
          <button onClick={speakWord} className="rounded-full bg-blue-500 text-white px-4 py-3 min-h-12 min-w-12 font-black flex items-center gap-2" aria-label="Listen to word pronunciation">
            <Volume2 size={20} /> Listen
          </button>
          <button
            onClick={() => {
              setShowHint((v) => {
                const next = !v;
                if (next) {
                  setHintsUsed((count) => count + 1);
                  onHintUse();
                }
                return next;
              });
            }}
            className="rounded-full bg-purple-100 text-purple-700 px-4 py-3 min-h-12 min-w-12 font-black"
            aria-label="Toggle bible hint"
          >
            <Eye size={18} />
          </button>
          <button onClick={restartRound} className="rounded-full bg-gray-100 text-gray-700 px-4 py-3 min-h-12 min-w-12 font-black" aria-label="Restart round">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setHighContrast((v) => !v)} className="rounded-full bg-yellow-100 text-yellow-800 px-4 py-3 min-h-12 min-w-12 font-black" aria-label="Toggle high contrast mode">
            <Contrast size={18} />
          </button>
          <button onClick={onSkip} className="rounded-full bg-orange-500 text-white px-4 py-3 min-h-12 min-w-12 font-black flex items-center gap-2" aria-label="Skip this word and return to list">
            <SkipForward size={18} /> Skip
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 rounded-full font-black uppercase ${difficulty === d ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`} aria-label={`Set ${d} difficulty`}>
            {d === "hard" ? <span className="inline-flex items-center gap-1"><Timer size={14} />{d}</span> : d}
          </button>
        ))}
        {(["3-6", "7-9", "10-12"] as AgeMode[]).map((mode) => (
          <button key={mode} onClick={() => setAgeMode(mode)} className={`px-4 py-2 rounded-full font-black ${ageMode === mode ? "bg-green-600 text-white" : "bg-white border text-gray-700"}`} aria-label={`Set age mode ${mode}`}>
            {mode}
          </button>
        ))}
      </div>

      {showHint && difficulty !== "hard" && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center font-semibold text-yellow-900 mb-4">
          Bible hint: {wordData.definition}
        </div>
      )}

      {difficulty === "hard" && <p className="text-center font-black text-red-600 mb-3">Time Left: {hardRemaining}s</p>}

      {!typingMode ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {tiles.map((tile) => (
              <motion.button
                key={tile.id}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => putLetterInSlot(tile.char)}
                className={`rounded-2xl border-4 border-yellow-300 bg-white py-4 min-h-12 ${ageClasses.tile} font-black text-blue-700 shadow-sm`}
                aria-label={`Place letter ${tile.char}`}
              >
                {tile.char}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {letters.map((_, index) => {
              const value = placed[index] ?? (difficulty === "easy" && index === 0 ? firstHint : "_");
              const correct = placed[index] === letters[index];
              return (
                <motion.div
                  key={index}
                  animate={correct ? { scale: [1, 1.08, 1], backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"] } : {}}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-black ${ageClasses.tile} ${correct ? "border-green-400 text-green-700" : "border-gray-300 text-gray-500"}`}
                >
                  {value}
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <motion.input
            animate={shakeInput ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            value={typedAnswer}
            onChange={(e) => {
              const next = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
              setTypedAnswer(next);
              checkTyped(next);
            }}
            placeholder={difficulty === "medium" ? `${firstHint}${"_".repeat(Math.max(letters.length - 1, 0))}` : "Type the word"}
            className={`w-full rounded-2xl border-4 border-blue-200 p-4 text-center tracking-[0.4em] font-black ${ageClasses.input} uppercase`}
            aria-label="Type the correct spelling"
          />
          <div className="mt-3 p-3 rounded-2xl bg-blue-50 border border-blue-100">
            <p className="text-xs uppercase font-bold text-blue-700 mb-2 flex items-center gap-1"><Keyboard size={14} /> Letter Bank</p>
            <div className="flex flex-wrap gap-1">
              {letters.map((char, idx) => (
                <button
                  key={`${char}-${idx}`}
                  onClick={() => {
                    const next = `${typedAnswer}${char}`;
                    setTypedAnswer(next);
                    checkTyped(next);
                  }}
                  className="w-10 h-10 rounded-lg border bg-white font-black text-blue-700"
                  aria-label={`Add letter ${char}`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-200 text-pink-700 px-4 py-2 rounded-full shadow-lg font-bold z-50" role="status">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVersePopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/35 z-40 flex items-center justify-center px-4">
            <motion.div initial={{ y: 16, scale: 0.97 }} animate={{ y: 0, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-yellow-100">
              <h3 className="text-2xl font-display font-black text-blue-700 mb-2">Wonderful!</h3>
              <p className="font-semibold text-gray-700 mb-3">Like {wordData.word} in God's Word. Hide it in your heart (Psalm 119:11).</p>
              <p className="text-sm font-bold text-yellow-700 bg-yellow-50 rounded-xl p-3">Verse reference: {wordData.reference}</p>
              <button className="mt-4 w-full rounded-xl bg-blue-600 text-white font-black py-3" onClick={() => setShowVersePopup(false)}>
                Keep Going
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
