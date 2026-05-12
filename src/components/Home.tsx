import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Trophy, Bird, Leaf, Sparkles, BarChart3, Settings, Star, Calendar, LogIn } from "lucide-react";
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

function ChristianCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="38" y="0" width="24" height="130" rx="6" />
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
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    }
    localStorage.setItem("bible_letters_home_progress_seen", String(progressCount));
    confettiTriggered.current = true;
  }, [progressCount]);

  const buttonWidth = Math.min(screenWidth * 0.85, 360);
  const isSmall = screenWidth < 500;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={reducedMotion ? { duration: 0.01 } : undefined}
      className="flex flex-col items-center text-center w-full max-w-lg mx-auto min-h-screen px-4 pb-6"
    >
      {/* ── Top nav ─────────────────────────────── */}
      <div className="w-full flex items-center justify-between py-3 shrink-0">
        <a
          href="https://biblefunland.com"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-wider"
          aria-label="Back to BibleFunLand"
        >
          ← BibleFunLand
        </a>
        <div className="flex items-center gap-2">
          <UserBar isPremium={isPremium} />
          <button
            onClick={onOpenSettings}
            className="bg-gray-100 hover:bg-gray-200 text-gray-500 p-2 rounded-full"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Hero — compact cross + title ─────────── */}
      <div className="flex flex-col items-center mt-2 mb-4 sm:mb-6 shrink-0">
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -6, 0], rotate: [0, -2, 2, 0], scale: [1, 1.02, 1] }}
          transition={reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`${isSmall ? "w-24 h-24" : "w-36 h-36"} bg-yellow-100 rounded-[32px] flex items-center justify-center border-4 border-white relative shadow-inner`}
        >
          <ChristianCross className={`${isSmall ? "w-14 h-14" : "w-20 h-20"} text-yellow-500`} />
          <Sparkles className="absolute top-2 right-3 w-3 h-3 text-yellow-300" />
          <Sparkles className="absolute bottom-3 left-3 w-2.5 h-2.5 text-yellow-400" />
          <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full text-white border-2 border-white">
            <Sparkles className="w-3 h-3" fill="currentColor" />
          </div>
        </motion.div>

        <h1 className={`${isSmall ? "text-4xl" : "text-5xl"} font-display font-black text-blue-600 mt-3 leading-none tracking-tighter`}>
          Bible Letters
        </h1>
        <p className={`${isSmall ? "text-2xl" : "text-3xl"} font-display font-bold text-yellow-500 -mt-1`}>
          Adventure
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={reducedMotion ? { duration: 0.01 } : { duration: 0.4 }}
            className="mt-2 text-sm text-blue-700 font-bold"
            aria-live="polite"
          >
            {MOTIVATIONAL_TAGLINES[taglineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Action buttons ───────────────────────── */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Review nudge */}
        {reviewDueCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onStart}
            style={{ width: buttonWidth }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl px-4 py-2.5 shadow font-black text-xs"
            aria-label={`${reviewDueCount} words due for review`}
          >
            <Calendar size={16} className="shrink-0" />
            <span>{reviewDueCount} word{reviewDueCount !== 1 ? "s" : ""} ready for review! 📖</span>
          </motion.button>
        )}

        {/* PLAY NOW */}
        <AnimatedButton
          hoverScale={1.04}
          tapScale={0.96}
          hoverRotate={1}
          onClick={onStart}
          style={{ width: buttonWidth }}
          className="btn-playful bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-3 py-5 shadow-[0_8px_0_rgb(37,99,235)] active:shadow-none active:translate-y-[8px] group"
        >
          <div className="bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform">
            <Play fill="currentColor" className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-widest uppercase">PLAY NOW</span>
        </AnimatedButton>

        {/* MY STATS — sign-in gated */}
        {user ? (
          <AnimatedButton
            hoverScale={1.03}
            tapScale={0.97}
            onClick={onOpenStats}
            style={{ width: buttonWidth }}
            className="btn-playful bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-3 py-4 shadow-[0_6px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[6px]"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-lg font-black uppercase tracking-wider">MY STATS</span>
          </AnimatedButton>
        ) : (
          <SignInButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ width: buttonWidth }}
              className="btn-playful bg-purple-400 text-white flex items-center justify-center gap-3 py-4 shadow-[0_6px_0_rgb(147,51,234)] active:shadow-none active:translate-y-[6px]"
              aria-label="Sign in to view your stats"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-lg font-black uppercase tracking-wider">Sign In for Stats</span>
            </motion.button>
          </SignInButton>
        )}

        {/* Stars progress card — compact */}
        <div className="bg-white p-4 rounded-3xl shadow border-2 border-yellow-50 w-full" style={{ maxWidth: buttonWidth }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={18} fill="currentColor" />
              <span className="font-black text-sm text-gray-700">STARS</span>
            </div>
            <span className="font-display font-black text-xl text-blue-500">
              {progressCount}/{totalCount}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1" aria-label={`${progressCount} of ${totalCount} stars`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < filledStars ? "text-yellow-400" : "text-gray-200"}
                fill={i < filledStars ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Cross promo — bottom ─────────────────── */}
      <div className="mt-6 w-full">
        <CrossPromo />
      </div>

      <p className="mt-4 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
        Fun Bible Learning for Kids!
      </p>
    </motion.div>
  );
}
