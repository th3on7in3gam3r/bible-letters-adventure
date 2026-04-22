import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Trophy, Bird, Leaf, Sparkles, BarChart3, Settings, Star, Calendar, Crown, LogIn } from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import AnimatedButton from "./AnimatedButton";
import CrossPromo from "./CrossPromo";
import UserBar from "./UserBar";

interface HomeProps {
  onStart: () => void;
  onOpenStats: () => void;
  onToggleSound: (enabled: boolean) => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  progressCount: number;
  totalCount: number;
  reviewDueCount: number;
  isPremium: boolean;
  key?: string;
}

// Proper Christian cross SVG — longer vertical arm
function ChristianCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Vertical beam */}
      <rect x="38" y="0" width="24" height="130" rx="6" />
      {/* Horizontal beam — positioned at ~30% from top */}
      <rect x="0" y="30" width="100" height="24" rx="6" />
    </svg>
  );
}

const MOTIVATIONAL_TAGLINES = [
  "Spell God's Word and hide it in your heart! ✨",
  "52 Bible words. Endless joy!",
  "Little letters, big faith adventures!",
];

export default function Home({
  onStart,
  onOpenStats,
  onToggleSound,
  onOpenHowToPlay,
  onOpenSettings,
  soundEnabled,
  progressCount,
  totalCount,
  reviewDueCount,
  isPremium,
}: HomeProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const { user } = useUser();
  const reducedMotion = useReducedMotion();
  const filledStars = useMemo(() => Math.round((progressCount / Math.max(totalCount, 1)) * 10), [progressCount, totalCount]);
  const confettiTriggered = useRef(false);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % MOTIVATIONAL_TAGLINES.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (confettiTriggered.current) return;
    const stored = Number(localStorage.getItem("bible_letters_home_progress_seen") ?? "0");
    if (!reducedMotion && progressCount > stored) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.55 },
      });
    }
    localStorage.setItem("bible_letters_home_progress_seen", String(progressCount));
    confettiTriggered.current = true;
  }, [progressCount]);

  const buttonWidth = Math.min(screenWidth * 0.8, 400);
  const titleFontSize = screenWidth < 500 ? "text-5xl" : "text-7xl";
  const subtitleFontSize = screenWidth < 500 ? "text-3xl" : "text-5xl";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={reducedMotion ? { duration: 0.01 } : undefined}
      className="game-container flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-2xl mx-auto overflow-y-auto custom-scrollbar"
    >
      {/* ── Top navigation bar ─────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100/60">
        {/* Left: back to main site */}
        <a
          href="https://biblefunland.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors group"
          aria-label="Back to BibleFunLand website"
        >
          <span className="text-base group-hover:-translate-x-0.5 transition-transform">←</span>
          <span className="uppercase tracking-wider">BibleFunLand</span>
        </a>

        {/* Right: UserBar + Settings */}
        <div className="flex items-center gap-2">
          <UserBar isPremium={isPremium} />
          <button
            onClick={onOpenSettings}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all hover:scale-105 active:scale-95"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none hidden xs:block overflow-hidden mt-14">
        <motion.div 
          animate={reducedMotion ? undefined : { y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={reducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] text-blue-200"
        >
          <Bird className="w-8 h-8 sm:w-16 sm:h-16" />
        </motion.div>
        <motion.div 
          animate={reducedMotion ? undefined : { y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={reducedMotion ? undefined : { duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[5%] text-green-200"
        >
          <Leaf className="w-8 h-8 sm:w-14 sm:h-14" />
        </motion.div>
      </div>

      <motion.div
        animate={reducedMotion ? undefined : {
          y: [0, -10, 0, 6, 0],
          rotate: [0, -2, 2, -2, 0],
          scale: [1, 1.03, 1, 1.02, 1],
        }}
        transition={reducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-40 h-40 sm:w-64 sm:h-64 bg-yellow-100 rounded-[48px] sm:rounded-[72px] flex items-center justify-center mt-16 mb-10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] border-4 sm:border-8 border-white relative shrink-0"
      >
        <ChristianCross className="w-24 h-24 sm:w-40 sm:h-40 text-yellow-500 drop-shadow-xl" />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={reducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={reducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="absolute top-8 right-10 w-5 h-5 text-yellow-300" />
          <Sparkles className="absolute bottom-8 left-8 w-4 h-4 text-yellow-400" />
          <Sparkles className="absolute top-1/2 right-6 w-3 h-3 text-yellow-300" />
        </motion.div>
        <div className="absolute -bottom-1 -right-2 sm:-bottom-4 sm:-right-4 bg-blue-500 p-2 sm:p-5 rounded-full text-white shadow-lg border-2 sm:border-4 border-white">
          <Sparkles className="w-5 h-5 sm:w-8 sm:h-8" fill="currentColor" />
        </div>
      </motion.div>

      <div className="mb-10 sm:mb-14">
        <h1 className={`${titleFontSize} font-display font-black text-blue-600 mb-0 drop-shadow-sm tracking-tighter leading-none`}>
          Bible Letters
        </h1>
        <p className={`${subtitleFontSize} font-display font-bold text-yellow-500 tracking-tight mt-[-4px]`}>
          Adventure
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={reducedMotion ? { duration: 0.01 } : { duration: 0.45 }}
            className="mt-4 text-base sm:text-lg text-blue-700 font-bold min-h-[28px]"
            aria-live="polite"
          >
            {MOTIVATIONAL_TAGLINES[taglineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="space-y-6 sm:space-y-10 flex flex-col items-center w-full">
        {/* Daily nudge / review banner */}
        {reviewDueCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onStart}
            style={{ width: buttonWidth }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl px-5 py-3 shadow-lg font-black text-sm"
            aria-label={`${reviewDueCount} words due for review`}
          >
            <Calendar size={20} className="shrink-0" />
            <span>{reviewDueCount} word{reviewDueCount !== 1 ? "s" : ""} ready for review! 📖</span>
          </motion.button>
        )}
        {reviewDueCount === 0 && progressCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ width: buttonWidth }}
            className="text-center text-blue-600 font-bold text-sm bg-blue-50 rounded-2xl px-4 py-2"
          >
            Ready for today's Bible words? 🌟
          </motion.div>
        )}
        <AnimatedButton
          hoverScale={1.05}
          tapScale={0.95}
          hoverRotate={2}
          onClick={onStart}
          style={{ width: buttonWidth }}
          className="btn-playful bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-3 sm:gap-6 py-6 sm:py-8 shadow-[0_12px_0_rgb(37,99,235)] active:shadow-none active:translate-y-[12px] group"
        >
          <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:rotate-12 transition-transform">
            <Play fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10" />
          </div>
          <span className="text-2xl sm:text-4xl font-black tracking-widest uppercase">PLAY NOW</span>
        </AnimatedButton>

        {/* MY STATS — sign-in gated */}
        {user ? (
          <AnimatedButton
            hoverScale={1.04}
            tapScale={0.96}
            onClick={onOpenStats}
            style={{ width: buttonWidth }}
            className="btn-playful bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-3 py-4 sm:py-5 shadow-[0_10px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[10px]"
          >
            <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="text-lg sm:text-2xl font-black uppercase tracking-wider">MY STATS</span>
          </AnimatedButton>
        ) : (
          <SignInButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ width: buttonWidth }}
              className="btn-playful bg-purple-400 text-white flex items-center justify-center gap-3 py-4 sm:py-5 shadow-[0_10px_0_rgb(147,51,234)] active:shadow-none active:translate-y-[10px]"
              aria-label="Sign in to view your stats"
            >
              <LogIn className="w-5 h-5 sm:w-7 sm:h-7" />
              <span className="text-lg sm:text-2xl font-black uppercase tracking-wider">
                Sign In for Stats
              </span>
            </motion.button>
          </SignInButton>
        )}

        {/* Go Pro CTA — shown to signed-in free users */}
        {user && !isPremium && (
          <motion.a
            href="https://biblefunland.com/premium?source=bible-letters"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: buttonWidth }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-sm shadow-lg hover:opacity-90 transition-opacity"
            aria-label="Upgrade to Pro on BibleFunLand"
          >
            <Crown size={16} /> Unlock All 52 Words — Go Pro ✨
          </motion.a>
        )}

        <div className="bg-white p-5 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-lg border-4 border-yellow-50 w-full max-w-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="p-2 bg-yellow-100 rounded-2xl">
              <Trophy className="text-yellow-500" size={24} fill="currentColor" />
            </div>
            <span className="font-black text-lg sm:text-xl text-gray-700 tracking-tight">STARS EARNED</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-blue-500">
              {progressCount}/{totalCount}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2" aria-label={`Progress stars ${progressCount} out of ${totalCount}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Star
                key={i}
                size={24}
                className={i < filledStars ? "text-yellow-400" : "text-gray-200"}
                fill={i < filledStars ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-16 text-gray-400 font-bold text-sm bg-gray-50 px-6 py-2 rounded-full uppercase tracking-widest">
        Fun Bible Learning for Kids!
      </p>

      <CrossPromo />
    </motion.div>
  );
}
