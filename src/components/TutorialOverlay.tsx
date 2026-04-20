import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Hand, Volume2, Eye, X } from "lucide-react";

type Step = 0 | 1 | 2;

const STEPS: Array<{
  title: string;
  body: string;
  icon: ReactNode;
}> = [
  {
    title: "Drag the letters",
    body: "Drag each letter into the ? slots to spell the word.",
    icon: <Hand className="w-9 h-9 sm:w-10 sm:h-10" />,
  },
  {
    title: "Need help? Peek!",
    body: "Tap the eye for a quick peek at the next correct slot.",
    icon: <Eye className="w-9 h-9 sm:w-10 sm:h-10" />,
  },
  {
    title: "Tap to hear it",
    body: "Tap the speaker to hear the word and its meaning.",
    icon: <Volume2 className="w-9 h-9 sm:w-10 sm:h-10" />,
  },
];

export function TutorialOverlay({
  open,
  step,
  onNext,
  onSkip,
}: {
  open: boolean;
  step: Step;
  onNext: () => void;
  onSkip: () => void;
}) {
  const s = STEPS[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onSkip} />

          <motion.div
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-md bg-white rounded-[36px] shadow-2xl border-8 border-blue-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500" />

            <button
              onClick={onSkip}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
              aria-label="Close tutorial"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8 pt-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="p-4 rounded-3xl bg-blue-600 text-white shadow-lg"
                >
                  {s.icon}
                </motion.div>
                <div className="text-left">
                  <div className="font-display font-black text-2xl sm:text-3xl text-gray-800 tracking-tight">
                    {s.title}
                  </div>
                  <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-400">
                    Step {step + 1} / {STEPS.length}
                  </div>
                </div>
              </div>

              <p className="text-lg sm:text-xl font-bold text-gray-700 leading-relaxed">
                {s.body}
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onSkip}
                  className="flex-1 py-3 rounded-2xl font-black uppercase tracking-wider text-sm sm:text-base bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Skip
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 py-3 rounded-2xl font-black uppercase tracking-wider text-sm sm:text-base bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  {step === STEPS.length - 1 ? "Let’s Play!" : "Next"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

