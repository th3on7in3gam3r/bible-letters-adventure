import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BibleWord } from "../data/words";
import { Volume2, RefreshCw, Eye, SkipForward, Keyboard, Contrast, Timer, Delete, Eraser } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "../services/soundService";
import { speechService } from "../services/speechService";
import { ANIMATION_CONFIG } from "../constants";

interface GameProps {
  wordData: BibleWord;
  soundEnabled: boolean;
  ageGroup?: "3-6" | "7-9" | "10-12";
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

export default function Game({ wordData, soundEnabled, ageGroup = "7-9", onWin, onSkip, onAttempt, onHintUse }: GameProps) {
  const word = wordData.word.toUpperCase();
  const letters = useMemo(() => word.replace(/\s/g, "").split(""), [word]);
  const isYoungKid = ageGroup === "3-6";
  const [difficulty, setDifficulty] = useState<Difficulty>(isYoungKid ? "easy" : "easy");
  const [ageMode, setAgeMode] = useState<AgeMode>(ageGroup);
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
  const typingMode = isYoungKid ? false : difficulty !== "easy";
  const ageClasses = AGE_CONFIG[ageMode];
  const toastTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const focusInput = () => {
    if (!typingMode) return;
    inputRef.current?.focus();
    // Helps iOS bring focused input into view.
    window.setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  useEffect(() => {
    restartRound();
    return () => speechService.stopRepeating();
  }, [word]); // only restart when the word changes, not on difficulty/age switch

  useEffect(() => {
    focusInput();
  }, [typingMode]);

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

  const appendTypedChar = (char: string) => {
    const next = `${typedAnswer}${char}`;
    setTypedAnswer(next);
    checkTyped(next);
    focusInput();
  };

  const backspaceTyped = () => {
    setTypedAnswer((prev) => prev.slice(0, -1));
    focusInput();
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
    <div
      className={`game-container w-full max-w-3xl mx-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] ${highContrast ? "bg-white text-black" : ""}`}
      onClick={focusInput}
    >
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

      {/* Difficulty & age controls — hidden for ages 3-6 */}
      {!isYoungKid && (
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
      )}

      {showHint && difficulty !== "hard" && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center font-semibold text-yellow-900 mb-4">
          Bible hint: {wordData.definition}
        </div>
      )}

      {difficulty === "hard" && <p className="text-center font-black text-red-600 mb-3">Time Left: {hardRemaining}s</p>}

      {!typingMode ? (
        <>
          {/* Letter tiles — 3D style for ages 3-6, standard for others */}
          <div className={`grid gap-3 mb-5 ${isYoungKid ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
            {tiles.map((tile) => (
              <motion.button
                key={tile.id}
                whileTap={{ scale: 0.92, y: 4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => putLetterInSlot(tile.char)}
                className={`
                  font-black text-center select-none
                  ${isYoungKid
                    ? `rounded-3xl bg-gradient-to-b from-yellow-300 to-yellow-400 text-blue-800
                       border-b-[6px] border-yellow-600 border-x-2 border-t-2 border-yellow-500
                       shadow-[0_6px_0_#92400e,0_8px_16px_rgba(0,0,0,0.15)]
                       active:shadow-[0_2px_0_#92400e] active:translate-y-1
                       py-6 min-h-20 text-5xl sm:text-6xl`
                    : `rounded-2xl border-4 border-yellow-300 bg-white py-4 min-h-14 ${ageClasses.tile} shadow-sm`
                  }
                `}
                aria-label={`Place letter ${tile.char}`}
              >
                {tile.char}
              </motion.button>
            ))}
          </div>

          {/* Answer slots */}
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {letters.map((_, index) => {
              const value = placed[index] ?? (difficulty === "easy" && index === 0 ? firstHint : "_");
              const correct = placed[index] === letters[index];
              return (
                <motion.div
                  key={index}
                  animate={correct ? { scale: [1, 1.15, 1], backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"] } : {}}
                  transition={{ duration: 0.35 }}
                  className={`
                    flex items-center justify-center font-black rounded-xl border-2
                    ${isYoungKid ? "w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl" : `w-12 h-12 sm:w-14 sm:h-14 ${ageClasses.tile}`}
                    ${correct
                      ? "border-green-400 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-300 text-gray-400 bg-white"}
                  `}
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
            ref={inputRef}
            animate={shakeInput ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            value={typedAnswer}
            onChange={(e) => {
              const next = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
              setTypedAnswer(next);
              checkTyped(next);
            }}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={difficulty === "medium" ? `${firstHint}${"_".repeat(Math.max(letters.length - 1, 0))}` : "Type the word"}
            className={`w-full rounded-2xl border-4 border-blue-200 p-4 text-center tracking-[0.4em] font-black ${ageClasses.input} uppercase`}
            aria-label="Type the correct spelling"
          />
          <div className="mt-3 p-3 rounded-2xl bg-blue-50 border border-blue-100 sticky bottom-2">
            <p className="text-xs uppercase font-bold text-blue-700 mb-2 flex items-center gap-1"><Keyboard size={14} /> Letter Bank</p>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {letters.map((char, idx) => (
                <button
                  key={`${char}-${idx}`}
                  onClick={() => appendTypedChar(char)}
                  className="h-12 rounded-lg border bg-white font-black text-blue-700"
                  aria-label={`Add letter ${char}`}
                >
                  {char}
                </button>
              ))}
              <button
                onClick={backspaceTyped}
                className="h-12 rounded-lg border bg-orange-100 text-orange-700 flex items-center justify-center"
                aria-label="Backspace letter"
              >
                <Delete size={18} />
              </button>
              <button
                onClick={() => {
                  setTypedAnswer("");
                  focusInput();
                }}
                className="h-12 rounded-lg border bg-red-100 text-red-700 flex items-center justify-center"
                aria-label="Clear typed letters"
              >
                <Eraser size={18} />
              </button>
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
