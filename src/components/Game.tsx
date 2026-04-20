import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BibleWord } from "../data/words";
import { Volume2, RefreshCw, Eye, SkipForward } from "lucide-react";
import confetti from "canvas-confetti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { soundManager } from "../services/soundService";
import { speechService } from "../services/speechService";
import { getResponsiveConfig, getScatteringBounds } from "../utils/responsive";
import { GAME_CONFIG, ANIMATION_CONFIG } from "../constants";

interface GameProps {
  wordData: BibleWord;
  soundEnabled: boolean;
  onWin: () => void;
  onSkip: () => void;
  onAttempt: (isCorrect: boolean) => void;
  onHintUse: () => void;
  key?: string;
}

interface LetterTile {
  id: string;
  char: string;
  x: number;
  y: number;
}

export default function Game({ wordData, soundEnabled, onWin, onSkip, onAttempt, onHintUse }: GameProps) {
  const word = wordData.word.toUpperCase();
  const letters = word.split("");
  const [placed, setPlaced] = useState<(string | null)[]>(new Array(letters.length).fill(null));
  const [shuffledLetters, setShuffledLetters] = useState<LetterTile[]>([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [peekIndex, setPeekIndex] = useState<number | null>(null);
  const [peekCoolingDown, setPeekCoolingDown] = useState(false);
  const [assistIndex, setAssistIndex] = useState<number | null>(null);
  const [failedAttemptsInRow, setFailedAttemptsInRow] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const peekTimeoutRef = useRef<number | null>(null);
  const peekCooldownTimeoutRef = useRef<number | null>(null);

  const config = getResponsiveConfig(windowSize.width, windowSize.height);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Speech helper
  const speak = (text: string) => {
    if (!soundEnabled) return;
    speechService.speak(text);
  };

  const initGame = () => {
    speechService.stopRepeating();
    
    const areaWidth = containerRef.current?.clientWidth || windowSize.width;
    const bounds = getScatteringBounds(areaWidth, windowSize.height, config.tileSize);
    
    const newShuffled = letters.map((char, index) => {
      const randomX = (Math.random() * bounds.maxX * 2) - bounds.maxX;
      const randomY = (Math.random() * bounds.maxY * 2) - bounds.maxY;
      
      return {
        id: `${char}-${index}-${Math.random()}`,
        char,
        x: randomX,
        y: randomY,
      };
    });
    
    const shuffled = [...newShuffled].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setPlaced(new Array(letters.length).fill(null));
    setPeekIndex(null);
    setPeekCoolingDown(false);
    setAssistIndex(null);
    setFailedAttemptsInRow(0);
    
    speechService.speakWordWithClip(word);
  };

  useEffect(() => {
    initGame();
    return () => speechService.stopRepeating();
  }, [word, windowSize.width]);

  useEffect(() => {
    return () => {
      if (peekTimeoutRef.current) window.clearTimeout(peekTimeoutRef.current);
      if (peekCooldownTimeoutRef.current) window.clearTimeout(peekCooldownTimeoutRef.current);
    };
  }, []);

  const triggerPeek = () => {
    if (peekCoolingDown) return;

    const nextEmpty = placed.findIndex((p) => !p);
    if (nextEmpty === -1) return;

    soundManager.play('click');
    onHintUse();
    setPeekIndex(nextEmpty);
    setPeekCoolingDown(true);

    if (peekTimeoutRef.current) window.clearTimeout(peekTimeoutRef.current);
    if (peekCooldownTimeoutRef.current) window.clearTimeout(peekCooldownTimeoutRef.current);

    peekTimeoutRef.current = window.setTimeout(() => {
      setPeekIndex(null);
    }, GAME_CONFIG.PEEK_DURATION_MS);

    peekCooldownTimeoutRef.current = window.setTimeout(() => {
      setPeekCoolingDown(false);
    }, GAME_CONFIG.PEEK_COOLDOWN_MS);
  };

  const handleDragEnd = (event: any, info: any, tile: LetterTile) => {
    speechService.stopRepeating();
    
    // Find nearest slot
    const slots = document.querySelectorAll(".slot");
    let nearestIndex = -1;
    let minDistance = GAME_CONFIG.DRAG_THRESHOLD;

    slots.forEach((slot, index) => {
      if (placed[index]) return;
      
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(info.point.x - centerX, 2) + 
        Math.pow(info.point.y - centerY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== -1) {
      if (letters[nearestIndex] === tile.char) {
        onAttempt(true);
        // Correct!
        soundManager.play('correct');
        setFailedAttemptsInRow(0);
        setAssistIndex(null);
        const newPlaced = [...placed];
        newPlaced[nearestIndex] = tile.char;
        setPlaced(newPlaced);
          if (peekIndex === nearestIndex) setPeekIndex(null);
        
        // Remove from shuffled
        setShuffledLetters((prev) => prev.filter((t) => t.id !== tile.id));
        
        speechService.speak(tile.char);

        // Check win
        if (newPlaced.every((p, i) => p === letters[i])) {
          setTimeout(() => {
            soundManager.play('win');
            confetti({
              ...ANIMATION_CONFIG.CONFETTI,
              colors: ANIMATION_CONFIG.CONFETTI.colors
            });
            speechService.speak(`Great job! ${word}`);
            setTimeout(onWin, GAME_CONFIG.REWARD_TRANSITION_DELAY);
          }, GAME_CONFIG.WIN_CELEBRATION_DELAY);
        }
      } else {
        onAttempt(false);
        // Incorrect placement
        soundManager.play('incorrect');
        const nextFailures = failedAttemptsInRow + 1;
        setFailedAttemptsInRow(nextFailures);
        if (nextFailures >= 2) {
          const nextEmpty = placed.findIndex((p) => !p);
          if (nextEmpty !== -1) {
            setAssistIndex(nextEmpty);
            window.setTimeout(() => setAssistIndex(null), 900);
          }
          setFailedAttemptsInRow(0);
        }
        
        if (containerRef.current) {
          const scatteringArea = containerRef.current.querySelector(".scattering-area");
          if (scatteringArea) {
            const rect = scatteringArea.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const newX = info.point.x - centerX;
            const newY = info.point.y - centerY;

            setShuffledLetters((prev) => prev.map((t) => 
              t.id === tile.id ? { ...t, x: newX, y: newY } : t
            ));
          }
        }
      }
    } else {
      // Dropped outside any slot
      if (containerRef.current) {
        const scatteringArea = containerRef.current.querySelector(".scattering-area");
        if (scatteringArea) {
          const rect = scatteringArea.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const newX = info.point.x - centerX;
          const newY = info.point.y - centerY;

          setShuffledLetters((prev) => prev.map((t) => 
            t.id === tile.id ? { ...t, x: newX, y: newY } : t
          ));
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="game-container w-full select-none touch-none relative">
      {/* Friendly character at the top */}
      <div className="absolute top-4 right-4 sm:right-12 w-32 h-32 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DotLottieReact
            src="/animations/dove.json"
            autoplay
            loop
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* Title Area */}
      <div className="text-center relative py-4 z-10 w-full max-w-[90%] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`${config.titleFontSize} font-display font-black text-gray-800 tracking-tight leading-tight`}>
            Can you spell <br className="sm:hidden" />
            <span className="text-amber-500 px-3 py-1 bg-yellow-50 rounded-xl border-4 border-yellow-200 inline-block mt-2 sm:mt-0 shadow-sm transform -rotate-1">
              {word}
            </span>?
          </h2>
        </motion.div>
        
        <div className="flex justify-center gap-4 mt-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundManager.play('click');
              speechService.speakWordInfo(word, wordData.definition);
            }}
            className="p-4 bg-white text-blue-600 rounded-full shadow-lg border-4 border-blue-50 hover:bg-blue-50 transition-colors"
            aria-label="Hear word and definition"
          >
            <Volume2 size={32} />
          </motion.button>

          <motion.button
            whileHover={{ scale: peekCoolingDown ? 1 : 1.1 }}
            whileTap={{ scale: peekCoolingDown ? 1 : 0.9 }}
            onClick={triggerPeek}
            disabled={peekCoolingDown}
            className={`p-4 bg-white rounded-full shadow-lg border-4 transition-colors ${
              peekCoolingDown
                ? "text-gray-300 border-gray-50"
                : "text-purple-600 border-purple-50 hover:bg-purple-50"
            }`}
            aria-label="Peek at the next letter"
          >
            <Eye size={28} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundManager.play('click');
              initGame();
            }}
            className="p-4 bg-white text-gray-400 rounded-full shadow-lg border-4 border-gray-50 hover:bg-gray-50 transition-colors"
            aria-label="Shuffle letters"
          >
            <RefreshCw size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.play('click');
              onSkip();
            }}
            className="px-4 py-3 bg-orange-500 text-white rounded-full shadow-lg border-4 border-orange-400 hover:bg-orange-600 transition-colors flex items-center gap-2 font-black uppercase text-xs tracking-wider"
            aria-label="Skip this word and practice later"
          >
            <SkipForward size={18} />
            Skip
          </motion.button>
        </div>
      </div>

      {/* Scattering Area */}
      <div className="scattering-area relative flex-1 w-full flex items-center justify-center overflow-visible my-4 rounded-3xl" style={{ minHeight: Math.max(windowSize.height * 0.3, 200) }}>
        <AnimatePresence>
          {shuffledLetters.map((tile) => (
            <motion.div
              key={tile.id}
              drag
              dragSnapToOrigin={false}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
              onDragEnd={(e, info) => handleDragEnd(e, info, tile)}
              onDragStart={() => speechService.startRepeating(tile.char)}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{ 
                x: tile.x, 
                y: tile.y, 
                scale: 1, 
                rotate: (Math.random() - 0.5) * 30 
              }}
              exit={{ scale: 0, filter: "brightness(2)" }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              whileDrag={{ 
                scale: 1.25, 
                zIndex: 100, 
                rotate: 0, 
                boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
                filter: "brightness(1.05)"
              }}
              style={{ width: config.tileSize, height: config.tileSize }}
              className="absolute bg-white rounded-3xl shadow-[0_8px_0_#FACC15,0_15px_30px_rgba(0,0,0,0.1)] border-4 border-yellow-400 flex items-center justify-center font-display font-black text-blue-600 cursor-grab active:cursor-grabbing transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-[inherit] -z-10" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_-6px_0_rgba(0,0,0,0.05)] -z-10" />
              <span className="text-4xl sm:text-6xl">{tile.char}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Target Slots */}
      <div className="bg-white/40 backdrop-blur-sm p-4 sm:p-6 rounded-[32px] border-4 border-white/60 shadow-inner mb-4 w-full max-w-[95%] mx-auto overflow-x-auto no-scrollbar">
        <div className="flex justify-center gap-2 sm:gap-3 min-w-max px-2">
          {letters.map((char, index) => {
            const isFilled = !!placed[index];
            const isPeek = !isFilled && peekIndex === index;
            const isAssist = !isFilled && assistIndex === index;
            return (
              <motion.div
                key={index}
                animate={isFilled ? { 
                  scale: [1, 1.1, 1], 
                  backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"],
                  borderColor: ["#e5e7eb", "#4ade80", "#4ade80"]
                } : {}}
                transition={{ duration: 0.4, type: "tween", ease: "easeOut" }}
                style={{ width: config.slotSize, height: config.slotSize }}
                className={`
                  slot rounded-2xl border-4 border-dashed transition-all flex items-center justify-center relative
                  ${isFilled 
                    ? "border-green-400 bg-white shadow-md" 
                    : "bg-gray-100/50 border-gray-300 shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"}
                  ${isAssist ? "ring-4 ring-amber-300 border-amber-400" : ""}
                `}
              >
                {!isFilled && (
                  <div className="absolute inset-4 rounded-2xl border-2 border-gray-200/50 flex items-center justify-center text-gray-300 font-black text-xs uppercase tracking-widest opacity-30">
                    ?
                  </div>
                )}

                <AnimatePresence>
                  {isPeek && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="text-4xl sm:text-6xl font-display font-black text-purple-500 drop-shadow-sm"
                    >
                      {letters[index]}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {isFilled && (
                    <motion.span
                      initial={{ scale: 0, rotate: -30, y: 20 }}
                      animate={{ 
                        scale: 1, 
                        rotate: 0,
                        y: 0 
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                      className="text-4xl sm:text-6xl font-display font-black text-green-600 drop-shadow-sm"
                    >
                      {placed[index]}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Snap effect glow */}
                {isFilled && (
                  <motion.div 
                    initial={{ opacity: 1, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2 }}
                    className="absolute inset-0 bg-green-400 rounded-3xl -z-10"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] opacity-40 text-center pb-4">
        Drag the letters to spell the word
      </p>
    </div>
  );
}
