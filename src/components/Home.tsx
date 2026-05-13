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

// Floating letters — arranged in a fun cluster with glow
const LETTERS_DATA = [
  { char: "A", color: "#3B82F6", x: 15, y: 12, size: 52, delay: 0 },
  { char: "R", color: "#F59E0B", x: 55, y: 8, size: 44, delay: 0.4 },
  { char: "K", color: "#10B981", x: 80, y: 20, size: 38, delay: 0.8 },
  { char: "J", color: "#8B5CF6", x: 10, y: 50, size: 46, delay: 1.2 },
  { char: "O", color: "#EC4899", x: 42, y: 42, size: 56, delay: 0.6 },
  { char: "Y", color: "#06B6D4", x: 72, y: 55, size: 42, delay: 1.0 },
  { char: "G", color: "#F97316", x: 25, y: 78, size: 40, delay: 1.4 },
  { char: "D", color: "#EF4444", x: 60, y: 75, size: 48, delay: 0.2 },
];

function FloatingLetters() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative w-full h-full">
      {LETTERS_DATA.map((l, i) => (
        <motion.div
          key={l.char}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: reducedMotion ? 0 : [0, -10, 0, 6, 0],
            rotate: reducedMotion ? 0 : [0, -6, 4, -2, 0],
          }}
          transition={{
            opacity: { delay: l.delay, duration: 0.5 },
            scale: { delay: l.delay, duration: 0.5, type: "spring" },
            y: { delay: l.delay + 0.5, duration: 3.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay: l.delay + 0.5, duration: 4 + i * 0.2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            left: `${l.x}%`,
            top: `${l.y}%`,
            fontSize: l.size,
            color: l.color,
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            filter: `drop-shadow(0 4px 8px ${l.color}50)`,
            textShadow: `0 0 20px ${l.color}30`,
          }}
        >
          {l.char}
        </motion.div>
      ))}
      {/* Soft glow orbs behind letters */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-purple-200/25 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
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
      className="w-full min-h-[100dvh] flex flex-col"
      style={{
        background: "linear-gradient(160deg, #EFF6FF 0%, #FFFFFF 40%, #FFFBEB 100%)",
        backgroundImage: "radial-gradient(circle, #c7d2fe18 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* ── Nav ──────────────────────────── */}
      <nav className="w-full flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 shrink-0">
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
          <button onClick={onOpenSettings} className="bg-white border border-gray-200 text-gray-500 p-2 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────── */}
      <main className={`flex-1 flex ${isDesktop ? "flex-row items-center" : "flex-col items-center"} justify-center gap-10 lg:gap-20 px-5 sm:px-10 lg:px-16 py-6`}>
        
        {/* Left: Logo + Title + Actions */}
        <div className={`flex flex-col ${isDesktop ? "items-start max-w-lg" : "items-center text-center w-full max-w-sm"}`}>
          {/* Logo */}
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`${isDesktop ? "w-32 h-32" : "w-20 h-20"} bg-gradient-to-br from-yellow-200 via-yellow-100 to-amber-50 rounded-[28px] flex items-center justify-center border-4 border-white shadow-xl shadow-yellow-300/30 relative mb-5`}
          >
            <ChristianCross className={`${isDesktop ? "w-18 h-18" : "w-11 h-11"} text-yellow-500 drop-shadow`} />
            <motion.div
              animate={reducedMotion ? undefined : { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1.5 -right-1.5"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <h1 className={`${isDesktop ? "text-[3.5rem] lg:text-6xl" : "text-[2.5rem]"} font-display font-black text-blue-700 leading-[0.9] tracking-tight`}>
            Bible Letters
          </h1>
          <p className={`${isDesktop ? "text-[2.2rem] lg:text-4xl" : "text-[1.6rem]"} font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-400 mt-1`}>
            Adventure
          </p>

          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`${isDesktop ? "text-base" : "text-sm"} text-blue-500/80 font-semibold mt-3 mb-7`}
            >
              {TAGLINES[taglineIdx]}
            </motion.p>
          </AnimatePresence>

          {/* Buttons */}
          <div className={`flex flex-col gap-3.5 ${isDesktop ? "w-[340px]" : "w-full"}`}>
            {reviewDueCount > 0 && (
              <button
                onClick={onStart}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl px-4 py-2.5 shadow-md shadow-indigo-200/50 font-bold text-xs hover:shadow-lg transition-shadow"
              >
                <Calendar size={14} />
                <span>{reviewDueCount} word{reviewDueCount !== 1 ? "s" : ""} ready for review! 📖</span>
              </button>
            )}

            {/* PLAY NOW — big, prominent, with shine */}
            <AnimatedButton
              hoverScale={1.03}
              tapScale={0.97}
              onClick={onStart}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center gap-3 py-6 rounded-2xl shadow-[0_10px_0_rgb(30,64,175),0_12px_30px_rgba(59,130,246,0.35)] active:shadow-[0_3px_0_rgb(30,64,175)] active:translate-y-[7px] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 animate-[shimmer_2.5s_infinite]" />
              <Play fill="currentColor" className="w-8 h-8 relative z-10 drop-shadow" />
              <span className="text-2xl font-black tracking-widest uppercase relative z-10">PLAY NOW</span>
            </AnimatedButton>

            {/* MY STATS / Sign In */}
            {user ? (
              <AnimatedButton
                hoverScale={1.02}
                tapScale={0.98}
                onClick={onOpenStats}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center gap-2.5 py-4 rounded-2xl shadow-[0_7px_0_rgb(107,33,168),0_8px_20px_rgba(139,92,246,0.25)] active:shadow-[0_2px_0_rgb(107,33,168)] active:translate-y-[5px] transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-lg font-black uppercase tracking-wider">MY STATS</span>
              </AnimatedButton>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white flex items-center justify-center gap-2.5 py-4 rounded-2xl shadow-[0_7px_0_rgb(126,34,206),0_8px_20px_rgba(139,92,246,0.2)] active:shadow-[0_2px_0_rgb(126,34,206)] active:translate-y-[5px] transition-all font-black text-lg uppercase tracking-wider">
                  <LogIn className="w-5 h-5" />
                  Sign In for Stats
                </button>
              </SignInButton>
            )}
          </div>

          {/* Stars progress */}
          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-blue-100/60 mt-5 w-full" style={{ maxWidth: isDesktop ? 340 : "100%" }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-yellow-100 to-amber-50 p-2 rounded-xl border border-yellow-200/50">
                  <Trophy className="text-yellow-500" size={16} fill="currentColor" />
                </div>
                <span className="font-black text-xs text-gray-500 uppercase tracking-wider">Stars Earned</span>
              </div>
              <span className="font-display font-black text-2xl text-blue-600">{progressCount}<span className="text-gray-300 text-lg">/{totalCount}</span></span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < filledStars && !reducedMotion ? { scale: [1, 1.3, 1] } : undefined}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Star
                    size={18}
                    className={i < filledStars ? "text-yellow-400 drop-shadow-[0_1px_3px_rgba(250,204,21,0.5)]" : "text-gray-200"}
                    fill={i < filledStars ? "currentColor" : "none"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Floating letters (desktop only) */}
        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="w-[360px] lg:w-[420px] h-[360px] lg:h-[420px] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-purple-50/50 rounded-[48px] border-2 border-white/80 shadow-inner backdrop-blur-[2px]" />
            <FloatingLetters />
          </motion.div>
        )}
      </main>

      {/* ── Footer ───────────────────────── */}
      <footer className="w-full px-5 sm:px-10 lg:px-16 pb-6 mt-auto">
        <CrossPromo />
        <p className="mt-3 text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] text-center">
          Fun Bible Learning for Kids!
        </p>
      </footer>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </motion.div>
  );
}
