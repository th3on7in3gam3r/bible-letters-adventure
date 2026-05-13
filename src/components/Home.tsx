import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Trophy, Sparkles, BarChart3, Settings, Star, Calendar, LogIn } from "lucide-react";
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

const TAGLINES = [
  "Spell God's Word and hide it in your heart! ✨",
  "52 Bible words. Endless joy!",
  "Little letters, big faith adventures!",
];

export default function Home({
  onStart,
  onOpenStats,
  onOpenSettings,
  progressCount,
  totalCount,
  reviewDueCount,
  isPremium,
}: HomeProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const { user } = useUser();
  const reducedMotion = useReducedMotion();
  const filledStars = useMemo(() => Math.round((progressCount / Math.max(totalCount, 1)) * 10), [progressCount, totalCount]);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    const h = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setTaglineIdx((p) => (p + 1) % TAGLINES.length), 3500);
    return () => clearInterval(t);
  }, [reducedMotion]);

  useEffect(() => {
    if (confettiTriggered.current) return;
    const stored = Number(localStorage.getItem("bible_letters_home_progress_seen") ?? "0");
    if (!reducedMotion && progressCount > stored) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
    }
    localStorage.setItem("bible_letters_home_progress_seen", String(progressCount));
    confettiTriggered.current = true;
  }, [progressCount]);

  const bw = Math.min(screenWidth * 0.88, screenWidth >= 768 ? 420 : 340);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto min-h-[100dvh] px-4 sm:px-8 pb-4"
    >
      {/* ── Nav bar ──────────────────────── */}
      <div className="w-full flex items-center justify-between py-2.5 shrink-0">
        <a
          href="https://biblefunland.com"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-black text-blue-600 uppercase tracking-wider"
        >
          ← BibleFunLand
        </a>
        <div className="flex items-center gap-1.5">
          <UserBar isPremium={isPremium} />
          <button onClick={onOpenSettings} className="bg-gray-100 text-gray-500 p-1.5 rounded-full" aria-label="Settings">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* ── Cross + Title (compact on mobile, larger on desktop) ──────── */}
      <div className="flex items-center gap-3 sm:gap-5 mt-2 sm:mt-6 mb-3 sm:mb-6">
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -4, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-yellow-100 rounded-2xl sm:rounded-[32px] flex items-center justify-center border-2 sm:border-4 border-white relative shadow-inner shrink-0"
        >
          <ChristianCross className="w-9 h-9 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-yellow-500" />
          <Sparkles className="absolute top-1 right-1.5 sm:top-2 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 text-yellow-300" />
        </motion.div>
        <div className="text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-blue-600 leading-none tracking-tighter">
            Bible Letters
          </h1>
          <p className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-yellow-500 -mt-0.5">Adventure</p>
        </div>
      </div>

      {/* Tagline */}
      <AnimatePresence mode="wait">
        <motion.p
          key={taglineIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs sm:text-sm lg:text-base text-blue-600 font-bold mb-4 h-4 sm:h-5"
        >
          {TAGLINES[taglineIdx]}
        </motion.p>
      </AnimatePresence>

      {/* ── Buttons ──────────────────────── */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Review nudge */}
        {reviewDueCount > 0 && (
          <button
            onClick={onStart}
            style={{ width: bw }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl px-3 py-2 shadow font-black text-xs"
          >
            <Calendar size={14} />
            <span>{reviewDueCount} word{reviewDueCount !== 1 ? "s" : ""} ready for review! 📖</span>
          </button>
        )}

        {/* PLAY NOW */}
        <AnimatedButton
          hoverScale={1.03}
          tapScale={0.97}
          onClick={onStart}
          style={{ width: bw }}
          className="btn-playful bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-3 py-4 sm:py-5 lg:py-6 shadow-[0_6px_0_rgb(37,99,235)] active:shadow-none active:translate-y-[6px] group"
        >
          <Play fill="currentColor" className="w-5 h-5 sm:w-7 sm:h-7" />
          <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-widest uppercase">PLAY NOW</span>
        </AnimatedButton>

        {/* MY STATS */}
        {user ? (
          <AnimatedButton
            hoverScale={1.03}
            tapScale={0.97}
            onClick={onOpenStats}
            style={{ width: bw }}
            className="btn-playful bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2 py-3 shadow-[0_5px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[5px]"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-base font-black uppercase tracking-wider">MY STATS</span>
          </AnimatedButton>
        ) : (
          <SignInButton mode="modal">
            <button
              style={{ width: bw }}
              className="btn-playful bg-purple-400 text-white flex items-center justify-center gap-2 py-3 shadow-[0_5px_0_rgb(147,51,234)] active:shadow-none active:translate-y-[5px]"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-base font-black uppercase tracking-wider">Sign In for Stats</span>
            </button>
          </SignInButton>
        )}

        {/* Stars card */}
        <div className="bg-white p-3 rounded-2xl shadow border border-yellow-50 w-full" style={{ maxWidth: bw }}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Trophy className="text-yellow-500" size={14} fill="currentColor" />
              <span className="font-black text-xs text-gray-600">STARS</span>
            </div>
            <span className="font-display font-black text-lg text-blue-500">{progressCount}/{totalCount}</span>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Star key={i} size={14} className={i < filledStars ? "text-yellow-400" : "text-gray-200"} fill={i < filledStars ? "currentColor" : "none"} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Cross promo ──────────────────── */}
      <div className="mt-auto pt-4 w-full">
        <CrossPromo />
        <p className="mt-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest text-center">
          Fun Bible Learning for Kids!
        </p>
      </div>
    </motion.div>
  );
}
