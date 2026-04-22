import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { BibleWord } from "../data/words";
import { ArrowRight, Star, Heart, Sun, CloudRain, Medal } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { speechService } from "../services/speechService";
import { GAME_CONFIG } from "../constants";
import confetti from "canvas-confetti";

interface RewardProps {
  wordData: BibleWord;
  soundEnabled: boolean;
  milestone: {
    count: number;
    total: number;
    label: string;
    message: string;
    confettiMultiplier: number;
  } | null;
  rewardMultiplier: number;
  hintCount: number;
  dailyGoal: {
    goal: number;
    completedToday: number;
  };
  onNext: () => void;
  key?: string;
}

export default function Reward({ wordData, soundEnabled, milestone, rewardMultiplier, hintCount, dailyGoal, onNext }: RewardProps) {
  // Automatic celebration speech
  useEffect(() => {
    if (!wordData || !soundEnabled) return;
    
    const timer = setTimeout(() => {
      speechService.speakCelebration(wordData.word, `${wordData.definition} ${wordData.sentence}`);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      speechService.stopRepeating();
    };
  }, [wordData, soundEnabled]);

  const milestoneConfetti = useMemo(() => {
    if (!milestone) return null;
    const particles = Math.round(160 * milestone.confettiMultiplier);
    return { particleCount: particles, spread: 85, origin: { y: 0.55 } };
  }, [milestone]);

  useEffect(() => {
    if (!milestone) return;
    // Fire a bigger celebration burst for milestones.
    const timer = window.setTimeout(() => {
      confetti(milestoneConfetti ?? { particleCount: 200, spread: 85, origin: { y: 0.55 } });
      window.setTimeout(() => {
        confetti({ particleCount: Math.round(90 * (milestone.confettiMultiplier ?? 1.4)), spread: 120, origin: { y: 0.5 } });
      }, 220);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [milestone, milestoneConfetti]);

  if (!wordData) return null;

  // Select a lottie animation based on the word
  const getLottieSrc = () => {
    const w = wordData.word.toLowerCase();
    // Use existing animations or valid local placeholders
    if (w.includes("dove") || w.includes("peace")) return "/animations/dove.json";
    
    /* 
       Placeholder comments for intended local assets:
       if (w.includes("noah") || w.includes("ark")) return "/animations/ark.json";
       if (w.includes("rainbow")) return "/animations/rainbow.json";
       if (w.includes("manger") || w.includes("jesus")) return "/animations/manger.json";
       if (w.includes("baptism")) return "/animations/water_sparkle.json";
    */
    
    return "/animations/celebrate.json";
  };

  // Select a fun icon based on the word if possible, otherwise default to Star
  const getIcon = () => {
    const w = wordData.word.toLowerCase();
    if (w.includes("love") || w.includes("forgive")) return <Heart size={80} className="text-red-400" fill="currentColor" />;
    if (w.includes("light") || w.includes("creation") || w.includes("god")) return <Sun size={80} className="text-yellow-400" fill="currentColor" />;
    if (w.includes("flood") || w.includes("rain") || w.includes("baptism")) return <CloudRain size={80} className="text-blue-400" />;
    return <Star size={80} className="text-yellow-400" fill="currentColor" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="game-container z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 w-full max-w-2xl mx-auto overflow-y-auto custom-scrollbar"
    >
      {milestone && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 shadow-xl border-4 border-white/60"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Medal className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <div className="text-left">
              <div className="font-display font-black text-2xl sm:text-3xl tracking-tight">
                {milestone.label} ({milestone.count}/{milestone.total})
              </div>
              <div className="font-bold text-sm sm:text-base opacity-95">
                {milestone.message}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Celebration Lottie */}
      <div className="w-40 h-40 sm:w-56 sm:h-56 relative mb-2 sm:mb-4 shrink-0">
        <DotLottieReact
          src={getLottieSrc()}
          autoplay
          loop
          className="w-full h-full opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white p-4 sm:p-6 rounded-full shadow-lg border-2 sm:border-4 border-yellow-400"
          >
            <div className="scale-75 sm:scale-100">
              {getIcon()}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 sm:mb-6 shrink-0"
      >
        <h2 className="text-4xl sm:text-6xl font-display font-black text-blue-600 mb-1 sm:mb-2 uppercase tracking-tighter drop-shadow-sm">
          {wordData.word}
        </h2>
        <div className="inline-block px-4 sm:px-6 py-1 sm:py-2 bg-yellow-400 text-white rounded-full font-black text-sm sm:text-lg shadow-md transform -rotate-1">
          AMAZING! YOU FINISHED!
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-xl border-4 border-white mb-6 sm:mb-8 w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-blue-400" />
        
        <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed mb-4 sm:mb-6">
          {wordData.definition}
        </p>
        
        <div className="bg-blue-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-blue-100/50 mb-4 sm:mb-6 italic">
          <p className="text-lg sm:text-xl text-blue-800 font-medium leading-relaxed">
            "{wordData.sentence}"
          </p>
        </div>

        <div className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 bg-yellow-100 rounded-full text-yellow-700 font-bold text-[10px] sm:text-sm uppercase tracking-widest border border-yellow-200">
          Source: {wordData.reference}
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="btn-playful bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 sm:gap-4 px-10 sm:px-16 py-4 sm:py-6 shadow-[0_8px_0_rgb(22,163,74)] sm:shadow-[0_12px_0_rgb(22,163,74)] active:translate-y-[8px] sm:active:translate-y-[12px] active:shadow-none text-xl sm:text-2xl font-black shrink-0"
      >
        NEXT WORD
        <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </motion.button>

      <div className="mt-4 text-xs sm:text-sm font-bold text-green-700 bg-green-50 rounded-full px-4 py-2 border border-green-100">
        Daily goal: {dailyGoal.completedToday}/{dailyGoal.goal} words today {dailyGoal.completedToday >= dailyGoal.goal ? "✅" : "🎯"}
      </div>
      {hintCount === 0 && (
        <div className="mt-2 text-xs font-bold text-yellow-700 bg-yellow-50 rounded-full px-4 py-2 border border-yellow-100">
          ⭐ No hints used — perfect spelling!
        </div>
      )}
    </motion.div>
  );
}
