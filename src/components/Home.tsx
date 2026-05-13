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

  const isDesktop = screenWidth >= 768;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-[100dvh] flex flex-col"
    >
      {/* ── Nav bar (full width) ──────────── */}
      <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100 shrink-0">
        <a
          href="https://biblefunland.com"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] sm:text-xs font-black text-blue-600 uppercase tracking-wider hover:text-blue-800"
        >
          ← BibleFunLand
        </a>
        <div className="flex items-center gap-2">
          <UserBar isPremium={isPremium} />
          <button onClick={onOpenSettings} className="bg-gray-100 text-gray-500 p-2 rounded-full hover:bg-gray-200" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Main content ──────────────────── */}
      <div className={`flex-1 flex ${isDesktop ? "flex-row items-center justify-center gap-16 px-12" : "flex-col items-center px-4"} py-6`}>
        
        {/* Left side (or top on mobile): Hero */}
        <div className={`flex flex-col ${isDesktop ? "items-start text-left" : "items-center text-center"}`}>
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -6, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={`${isDesktop ? "w-40 h-40" : "w-20 h-20"} bg-yellow-100 rounded-[32px] flex items-center justify-center border-4 border-white relative shadow-inner mb-4`}
          >
            <ChristianCross className={`${isDesktop ? "w-24 h-24" : "w-11 h-11"} text-yellow-500`} />
            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-300" />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full text-white border-2 border-white">
              <Sparkles className="w-2.5 h-2.5" fill="currentColor" />
            </div>
          </motion.div>

          <h1 className={`${isDesktop ? "text-6xl" : "text-4xl"} font-display font-black text-blue-600 leading-none tracking-tighter`}>
            Bible Letters
          </h1>
          <p className={`${isDesktop ? "text-4xl" : "text-2xl"} font-display font-bold text-yellow-500 -mt-1`}>
            Adventure
          </p>

          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${isDesktop ? "text-base" : "text-xs"} text-blue-600 font-bold mt-2 h-5`}
            >
              {TAGLINES[taglineIdx]}
            </motion.p>
          </AnimatePresence>

          {/* Desktop: stars card inline */}
          {isDesktop && (
            <div className="bg-white p-4 rounded-2xl shadow border border-yellow-50 mt-6 w-72">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={16} fill="currentColor" />
                  <span className="font-black text-sm text-gray-600">STARS</span>
                </div>
                <span className="font-display font-black text-xl text-blue-500">{progressCount}/{totalCount}</span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Star key={i} size={16} className={i < filledStars ? "text-yellow-400" : "text-gray-200"} fill={i < filledStars ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side (or bottom on mobile): Actions */}
        <div className={`flex flex-col items-center gap-3 ${isDesktop ? "w-96" : "w-full mt-5"}`}>
          {/* Review nudge */}
          {reviewDueCount > 0 && (
            <button
              onClick={onStart}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl px-4 py-2.5 shadow font-black text-xs"
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
            className="w-full btn-playful bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-3 py-5 shadow-[0_8px_0_rgb(37,99,235)] active:shadow-none active:translate-y-[8px]"
          >
            <Play fill="currentColor" className="w-6 h-6" />
            <span className="text-xl font-black tracking-widest uppercase">PLAY NOW</span>
          </AnimatedButton>

          {/* MY STATS */}
          {user ? (
            <AnimatedButton
              hoverScale={1.03}
              tapScale={0.97}
              onClick={onOpenStats}
              className="w-full btn-playful bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2 py-4 shadow-[0_6px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[6px]"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-lg font-black uppercase tracking-wider">MY STATS</span>
            </AnimatedButton>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full btn-playful bg-purple-400 text-white flex items-center justify-center gap-2 py-4 shadow-[0_6px_0_rgb(147,51,234)] active:shadow-none active:translate-y-[6px]">
                <LogIn className="w-5 h-5" />
                <span className="text-lg font-black uppercase tracking-wider">Sign In for Stats</span>
              </button>
            </SignInButton>
          )}

          {/* Mobile: stars card */}
          {!isDesktop && (
            <div className="bg-white p-3 rounded-2xl shadow border border-yellow-50 w-full">
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
          )}
        </div>
      </div>

      {/* ── Footer / Cross promo (full width) ── */}
      <div className="w-full px-4 sm:px-8 pb-4 mt-auto">
        <CrossPromo />
        <p className="mt-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest text-center">
          Fun Bible Learning for Kids!
        </p>
      </div>
    </motion.div>
  );
}
