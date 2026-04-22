import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Trophy, Bird, Leaf, Sparkles, BarChart3, LogIn } from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";

interface HomeProps {
  onStart: () => void;
  onOpenStats: () => void;
  progressCount: number;
  totalCount: number;
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

interface HomeProps {
  onStart: () => void;
  onOpenStats: () => void;
  progressCount: number;
  totalCount: number;
  key?: string;
}

export default function Home({ onStart, onOpenStats, progressCount, totalCount }: HomeProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { user } = useUser();
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonWidth = Math.min(screenWidth * 0.8, 400);
  const titleFontSize = screenWidth < 500 ? "text-5xl" : "text-7xl";
  const subtitleFontSize = screenWidth < 500 ? "text-3xl" : "text-5xl";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="game-container flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-2xl mx-auto overflow-y-auto custom-scrollbar"
    >
      {/* Sign In Button - Top Left */}
      {!user && (
        <div className="absolute top-4 left-4 z-10">
          <SignInButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <LogIn size={16} />
              Sign In
            </motion.button>
          </SignInButton>
        </div>
      )}

      {/* User Info - Top Left */}
      {user && (
        <div className="absolute top-4 left-4 z-10 bg-green-100 px-4 py-2 rounded-full border-2 border-green-300">
          <span className="text-green-700 font-bold text-sm">
            👋 {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}
          </span>
        </div>
      )}

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none hidden xs:block overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] text-blue-200"
        >
          <Bird className="w-8 h-8 sm:w-16 sm:h-16" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[5%] text-green-200"
        >
          <Leaf className="w-8 h-8 sm:w-14 sm:h-14" />
        </motion.div>
      </div>

      <motion.div
        animate={{ 
          rotate: [0, -3, 3, -3, 0],
          scale: [1, 1.05, 0.98, 1.05, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-40 h-40 sm:w-64 sm:h-64 bg-yellow-100 rounded-[48px] sm:rounded-[72px] flex items-center justify-center mb-10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] border-4 sm:border-8 border-white relative shrink-0"
      >
        <ChristianCross className="w-24 h-24 sm:w-40 sm:h-40 text-yellow-500 drop-shadow-xl" />
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
      </div>

      <div className="space-y-6 sm:space-y-10 flex flex-col items-center w-full">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          style={{ width: buttonWidth }}
          className="btn-playful bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-3 sm:gap-6 py-6 sm:py-8 shadow-[0_12px_0_rgb(37,99,235)] active:shadow-none active:translate-y-[12px] group"
        >
          <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:rotate-12 transition-transform">
            <Play fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10" />
          </div>
          <span className="text-2xl sm:text-4xl font-black tracking-widest uppercase">PLAY NOW</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenStats}
          style={{ width: buttonWidth }}
          className="btn-playful bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-3 py-4 sm:py-5 shadow-[0_10px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[10px]"
        >
          <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7" />
          <span className="text-lg sm:text-2xl font-black uppercase tracking-wider">MY STATS</span>
        </motion.button>

        <div className="bg-white p-5 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-lg border-4 border-yellow-50 flex items-center justify-between w-full max-w-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-2xl">
              <Trophy className="text-yellow-500" size={24} fill="currentColor" />
            </div>
            <span className="font-black text-xl text-gray-700 tracking-tight">STARS EARNED</span>
          </div>
          <span className="font-display font-black text-4xl text-blue-500">
            {progressCount} <span className="text-xl text-gray-300">/</span> {totalCount}
          </span>
        </div>
      </div>

      <p className="mt-16 text-gray-400 font-bold text-sm bg-gray-50 px-6 py-2 rounded-full uppercase tracking-widest">
        Fun Bible Learning for Kids!
      </p>
    </motion.div>
  );
}
