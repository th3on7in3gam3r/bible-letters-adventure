import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, BookOpen, Heart, X } from "lucide-react";

export type AgeGroup = "3-6" | "7-9" | "10-12";

interface OnboardingProps {
  onComplete: (age: AgeGroup) => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: "welcome",
    emoji: "✝️",
    title: "Welcome to Bible Letters Adventure!",
    body: "Spell 52 amazing Bible words and hide God's Word in your heart!",
    verse: '"I have hidden your word in my heart." — Psalm 119:11',
    bg: "from-blue-500 to-indigo-600",
  },
  {
    id: "gameplay",
    emoji: "🔤",
    title: "How to Play",
    body: "Drag letters into the slots — or type — to spell each Bible word. Earn stars for every word you master!",
    verse: null,
    bg: "from-yellow-400 to-orange-500",
  },
  {
    id: "stars",
    emoji: "⭐",
    title: "Stars, Reviews & Streaks",
    body: "Earn up to 3 stars per word. Words come back for review so you never forget them. Build your streak every day!",
    verse: null,
    bg: "from-green-500 to-emerald-600",
  },
  {
    id: "age",
    emoji: "🎯",
    title: "How old are you?",
    body: "Pick your age so we can make the game just right for you!",
    verse: null,
    bg: "from-purple-500 to-pink-500",
  },
];

// Animated cross for step 0
function AnimatedCross() {
  return (
    <motion.div
      animate={{ rotate: [0, -3, 3, -2, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="text-7xl mb-2"
    >
      ✝️
    </motion.div>
  );
}

// Mini letter demo for step 1
function LetterDemo() {
  const letters = ["A", "R", "K"];
  const [placed, setPlaced] = useState<string[]>([]);

  const handlePlace = (l: string) => {
    if (placed.length < 3) setPlaced((p) => [...p, l]);
    if (placed.length === 2) setTimeout(() => setPlaced([]), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-4 my-2">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={placed[i] ? { scale: [1, 1.15, 1], backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"] } : {}}
            className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center font-black text-xl text-green-700"
          >
            {placed[i] ?? "?"}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        {letters.filter((l) => !placed.includes(l) || placed.filter((p) => p === l).length < letters.filter((x) => x === l).length).map((l, i) => (
          <motion.button
            key={`${l}-${i}`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handlePlace(l)}
            className="w-12 h-12 rounded-xl bg-white border-2 border-yellow-300 font-black text-xl text-blue-700 shadow"
          >
            {l}
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-white/80 font-bold">Tap the letters to spell ARK!</p>
    </div>
  );
}

const AGE_OPTIONS: { value: AgeGroup; label: string; emoji: string; desc: string }[] = [
  { value: "3-6", label: "Ages 3–6", emoji: "🐣", desc: "Big letters, lots of hints!" },
  { value: "7-9", label: "Ages 7–9", emoji: "🌱", desc: "Medium challenge, fun!" },
  { value: "10-12", label: "Ages 10–12", emoji: "🚀", desc: "Full challenge mode!" },
];

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>("7-9");
  const isLast = step === STEPS.length - 1;
  const s = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      onComplete(selectedAge);
    } else {
      setStep((p) => p + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tutorial"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onSkip} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative w-full max-w-sm overflow-hidden rounded-[36px] shadow-2xl"
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${s.bg} p-8 text-white text-center`}>
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
            aria-label="Skip tutorial"
          >
            <X size={16} />
          </button>

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mb-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>

          {step === 0 && <AnimatedCross />}
          {step === 1 && <LetterDemo />}
          {step === 2 && (
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ delay: s * 0.15, duration: 1.5, repeat: Infinity }}
                >
                  <Star size={40} className="text-yellow-300 fill-yellow-300 drop-shadow" />
                </motion.div>
              ))}
            </div>
          )}
          {step === 3 && (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-2"
            >
              🎯
            </motion.div>
          )}

          <h2 className="text-xl font-black leading-tight mt-3">{s.title}</h2>
        </div>

        {/* White body */}
        <div className="bg-white p-6">
          <p className="text-gray-700 font-semibold text-base leading-relaxed mb-4">{s.body}</p>

          {s.verse && (
            <div className="bg-blue-50 rounded-2xl p-3 mb-4 border border-blue-100">
              <p className="text-blue-700 font-bold italic text-sm text-center">{s.verse}</p>
            </div>
          )}

          {/* Age selector on last step */}
          {isLast && (
            <div className="space-y-2 mb-4">
              {AGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedAge(opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all font-bold text-left ${
                    selectedAge === opt.value
                      ? "border-purple-400 bg-purple-50 text-purple-800"
                      : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
                  }`}
                  aria-pressed={selectedAge === opt.value}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <div className="font-black text-sm">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                  </div>
                  {selectedAge === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((p) => p - 1)}
                className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-gray-200"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 bg-gradient-to-r ${s.bg} shadow-lg hover:opacity-90 transition-opacity`}
            >
              {isLast ? (
                <>
                  <BookOpen size={16} /> Start Playing!
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <button
            onClick={onSkip}
            className="w-full mt-3 text-center text-xs text-gray-400 font-bold hover:text-gray-600"
          >
            Skip tutorial
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
