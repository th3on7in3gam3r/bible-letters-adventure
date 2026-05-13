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

// Floating letters for the desktop preview
const FLOATING_LETTERS = ["A", "B", "C", "J", "G", "F", "L", "N"];
const LETTER_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316", "#EC4899"];

function FloatingLetters() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative w-full h-full min-h-[280px]">
      {FLOATING_LETTERS.map((letter, i) => {
        const x = 20 + (i % 4) * 22;
        const y = 10 + Math.floor(i / 4) * 45;
        const delay = i * 0.3;
        const size = 36 + (i % 3) * 12;
        return (
          <motion.div
            key={letter}
            animate={reducedMotion ? undefined : {
              y: [0, -12, 0, 8, 0],
              rotate: [0, -8, 5, -3, 0],
              scale: [1, 1.05, 0.97, 1.02, 1],
            }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: size,
              color: LETTER_COLORS[i],
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              textShadow: `0 4px 12px ${LETTER_COLORS[i]}40`,
            }}
          >
            {letter}
          </motion.div>
        );
      })}
    </div>
  );
}

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

  const isDesktop = screenWidth >= 900;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-[100dvh] flex flex-col bg-gradient-to-b from-blue-50 via-white to-yellow-50/30"
      style={{ backgroundImage: "radial-gradient(circle, #e0e7ff22 1px, transparent 1px)", backgroundSize: "24px 24px" }}
    >
      {/* ── Nav ──────────────────────────── */}
      <nav className="w-full flex items-center justify-between px-5 sm:px-10 py-4 shrink-0">
        <a
          href="https://biblefunland.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-black text-blue-500 hover:text-blue-700 uppercase tracking-wider transition-colors"
        >
          ← BibleFunLand
        </a>
        <div className="flex items-center gap-2.5">
          <UserBar isPremium={isPremium} />
          <button onClick={onOpenSettings} className="bg-white/80 border border-gray-200 text-gray-500 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────── */}
      <main className={`flex-1 flex ${isDesktop ? "flex-row items-center" : "flex-col items-center"} justify-center gap-8 lg:gap-16 px-5 sm:px-10 lg:px-20 py-6`}>
        
        {/* Left: Logo + Title + Actions */}
        <div className={`flex flex-col ${isDesktop ? "items-start max-w-lg" : "items-center text-center w-full max-w-sm"}`}>
          {/* Logo */}
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`${isDesktop ? "w-28 h-28" : "w-20 h-20"} bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-lg shadow-yellow-200/50 relative mb-5`}
          >
            <ChristianCross className={`${isDesktop ? "w-16 h-16" : "w-11 h-11"} text-yellow-500 drop-shadow-sm`} />
            <motion.div
              animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <h1 className={`${isDesktop ? "text-5xl lg:text-6xl" : "text-4xl"} font-display font-black text-blue-700 leading-[0.95] tracking-tight`}>
            Bible Letters
          </h1>
          <p className={`${isDesktop ? "text-3xl lg:text-4xl" : "text-2xl"} font-display font-bold text-yellow-500 mt-0.5`}>
            Adventure
          </p>

          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`${isDesktop ? "text-base" : "text-sm"} text-blue-500 font-semibold mt-3 mb-6`}
            >
              {TAGLINES[taglineIdx]}
            </motion.p>
          </AnimatePresence>

          {/* Buttons */}
          <div className={`flex flex-col gap-3 ${isDesktop ? "w-80" : "w-full"}`}>
            {reviewDueCount > 0 && (
              <button
                onClick={onStart}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl px-4 py-2.5 shadow-md font-bold text-xs"
              >
                <Calendar size={14} />
                <span>{reviewDueCount} word{reviewDueCount !== 1 ? "s" : ""} ready for review! 📖</span>
              </button>
            )}

            <AnimatedButton
              hoverScale={1.03}
              tapScale={0.97}
              onClick={onStart}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center gap-3 py-5 rounded-2xl shadow-[0_8px_0_rgb(30,64,175)] active:shadow-[0_2px_0_rgb(30,64,175)] active:translate-y-[6px] transition-all"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]" />
              <Play fill="currentColor" className="w-7 h-7 relative z-10" />
              <span className="text-xl font-black tracking-widest uppercase relative z-10">PLAY NOW</span>
            </AnimatedButton>

            {user ? (
              <AnimatedButton
                hoverScale={1.02}
                tapScale={0.98}
                onClick={onOpenStats}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center gap-2 py-4 rounded-2xl shadow-[0_6px_0_rgb(107,33,168)] active:shadow-[0_2px_0_rgb(107,33,168)] active:translate-y-[4px] transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-lg font-black uppercase tracking-wider">MY STATS</span>
              </AnimatedButton>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white flex items-center justify-center gap-2 py-4 rounded-2xl shadow-[0_6px_0_rgb(126,34,206)] active:shadow-[0_2px_0_rgb(126,34,206)] active:translate-y-[4px] transition-all font-black text-lg uppercase tracking-wider">
                  <LogIn className="w-5 h-5" />
                  Sign In for Stats
                </button>
              </SignInButton>
            )}
          </div>

          {/* Stars progress */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-blue-100/50 mt-4 w-full" style={{ maxWidth: isDesktop ? 320 : "100%" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 p-1.5 rounded-lg">
                  <Trophy className="text-yellow-500" size={14} fill="currentColor" />
                </div>
                <span className="font-black text-xs text-gray-600 uppercase tracking-wider">Stars Earned</span>
              </div>
              <span className="font-display font-black text-xl text-blue-600">{progressCount}/{totalCount}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < filledStars && !reducedMotion ? { scale: [1, 1.2, 1] } : undefined}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Star
                    size={16}
                    className={i < filledStars ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"}
                    fill={i < filledStars ? "currentColor" : "none"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Floating letters preview (desktop only) */}
        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-80 lg:w-96 h-80 lg:h-96 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-[40px] border border-white/60 shadow-inner" />
            <FloatingLetters />
          </motion.div>
        )}
      </main>

      {/* ── Footer: Cross promo ──────────── */}
      <footer className="w-full px-5 sm:px-10 lg:px-20 pb-6">
        <CrossPromo />
        <p className="mt-3 text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] text-center">
          Fun Bible Learning for Kids!
        </p>
      </footer>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </motion.div>
  );
}
