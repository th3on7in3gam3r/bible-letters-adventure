import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BibleWord } from "../data/words";
import { Volume2, RefreshCw, Sparkles, Eye, SkipForward } from "lucide-react";
import confetti from "canvas-confetti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { soundManager } from "../services/soundService";
import { speechService } from "../services/speechService";
import { getResponsiveConfig, getScatteringBounds } from "../utils/responsive";
import { GAME_CONFIG, ANIMATION_CONFIG } from "../constants";

interface SentenceGameProps {
  wordData: BibleWord;
  soundEnabled: boolean;
  onWin: () => void;
  onSkip: () => void;
  onAttempt: (isCorrect: boolean) => void;
  onHintUse: () => void;
  key?: string;
}

interface WordTile {
  id: string;
  word: string;
  x: number;
  y: number;
}

export default function SentenceGame({ wordData, soundEnabled, onWin, onSkip, onAttempt, onHintUse }: SentenceGameProps) {
  // Clean sentence: remove punctuation and split into words
  const rawSentence = wordData.sentence;
  const sentenceWords = rawSentence.replace(/[.,!?;:]/g, "").split(" ");
  
  const [placed, setPlaced] = useState<(string | null)[]>(new Array(sentenceWords.length).fill(null));
  const [shuffledWords, setShuffledWords] = useState<WordTile[]>([]);
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
    const bounds = getScatteringBounds(areaWidth, windowSize.height, config.wordTileWidth);
    
    const newShuffled = sentenceWords.map((word, index) => {
      const randomX = (Math.random() * bounds.maxX * 2) - bounds.maxX;
      const randomY = (Math.random() * bounds.maxY * 2) - bounds.maxY;
      
      return {
        id: `${word}-${index}-${Math.random()}`,
        word,
        x: randomX,
        y: randomY,
      };
    });
    
    const shuffled = [...newShuffled].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setPlaced(new Array(sentenceWords.length).fill(null));
    setPeekIndex(null);
    setPeekCoolingDown(false);
    setAssistIndex(null);
    setFailedAttemptsInRow(0);
    
    speechService.speak("Sentence Time! Let's build the sentence");
  };

  useEffect(() => {
    initGame();
  }, [wordData, windowSize.width]);

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

  const handleDragEnd = (event: any, info: any, tile: WordTile) => {
    // Find nearest slot
    const slots = document.querySelectorAll(".sentence-slot");
    let nearestIndex = -1;
    let minDistance = GAME_CONFIG.LARGE_DRAG_THRESHOLD;

    slots.forEach((slot, index) => {
      if (placed[index]) return; // Already filled
      
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
      // Check if this is the correct word for this position in the sentence
      if (sentenceWords[nearestIndex].toLowerCase() === tile.word.toLowerCase()) {
        onAttempt(true);
        // Correct!
        soundManager.play('correct');
        setFailedAttemptsInRow(0);
        setAssistIndex(null);
        const newPlaced = [...placed];
        newPlaced[nearestIndex] = tile.word;
        setPlaced(newPlaced);
        
        // Remove from shuffled
        setShuffledWords((prev) => prev.filter((t) => t.id !== tile.id));
        
        speechService.speak(tile.word);

        // Check win
        if (newPlaced.every((p, i) => p === sentenceWords[i])) {
          setTimeout(() => {
            soundManager.play('win');
            confetti({
              ...ANIMATION_CONFIG.CONFETTI,
              colors: ANIMATION_CONFIG.CONFETTI.colors
            });
            speechService.speak(rawSentence);
            setTimeout(onWin, GAME_CONFIG.SENTENCE_REWARD_DELAY);
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

            setShuffledWords((prev) => prev.map((t) => 
              t.id === tile.id ? { ...t, x: newX, y: newY } : t
            ));
          }
        }
      }
    } else {
      // Dropped outside
      if (containerRef.current) {
        const scatteringArea = containerRef.current.querySelector(".scattering-area");
        if (scatteringArea) {
          const rect = scatteringArea.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const newX = info.point.x - centerX;
          const newY = info.point.y - centerY;

          setShuffledWords((prev) => prev.map((t) => 
            t.id === tile.id ? { ...t, x: newX, y: newY } : t
          ));
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="game-container w-full select-none touch-none relative overflow-hidden">
      {/* Decorative Atmosphere */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-40">
         <DotLottieReact
            src="/animations/dove.json"
            autoplay
            loop
            className="w-full h-full"
          />
      </div>

      {/* Header */}
      <div className="text-center z-10 py-4">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-500 font-display font-black text-2xl uppercase tracking-widest">
            <Sparkles size={24} fill="currentColor" />
            Sentence Time!
            <Sparkles size={24} fill="currentColor" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-800 leading-tight">
             Can you build this story?
          </h2>
        </motion.div>
        
        <div className="flex justify-center gap-4 mt-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => speechService.speak(rawSentence)}
            className="p-4 bg-white text-blue-600 rounded-full shadow-lg border-4 border-blue-50 hover:bg-blue-50 transition-colors"
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
          aria-label="Peek at the next word"
        >
          <Eye size={28} />
        </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={initGame}
            className="p-4 bg-white text-gray-400 rounded-full shadow-lg border-4 border-gray-50 hover:bg-gray-50 transition-colors"
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

      {/* Scattering Area for Word Tiles */}
      <div className="scattering-area relative flex-1 w-full flex items-center justify-center overflow-visible my-4 rounded-3xl" style={{ minHeight: Math.max(windowSize.height * 0.3, 200) }}>
        <AnimatePresence>
          {shuffledWords.map((tile) => (
            <motion.div
              key={tile.id}
              drag
              dragSnapToOrigin={false}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(e, info, tile)}
              onDragStart={() => speechService.speak(tile.word)}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{ 
                x: tile.x, 
                y: tile.y, 
                scale: 1,
                rotate: (Math.random() - 0.5) * 15 // Small random rotation for fun scattered look
              }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              whileDrag={{ 
                scale: 1.2, 
                zIndex: 100,
                rotate: 0,
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
              }}
              style={{ 
                width: config.wordTileWidth,
                height: config.wordTileHeight
              }}
              className={`absolute bg-white rounded-2xl shadow-[0_6px_0_#FACC15,0_10px_20px_rgba(0,0,0,0.1)] border-4 border-yellow-400 flex items-center justify-center font-display font-black text-blue-600 cursor-grab active:cursor-grabbing whitespace-nowrap transform-gpu ${config.tileFontSize}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-[inherit] -z-10" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_-4px_0_rgba(0,0,0,0.05)] -z-10" />
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Target Slots for Sentence */}
      <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-[32px] border-4 border-white/80 shadow-inner w-full max-w-[98%] mx-auto overflow-x-auto no-scrollbar mb-4">
        <div className="flex justify-center gap-2 sm:gap-3 min-w-max px-4">
          {sentenceWords.map((w, index) => {
            const isFilled = !!placed[index];
            const isPeek = !isFilled && peekIndex === index;
            const isAssist = !isFilled && assistIndex === index;
            const slotWidth = Math.min((windowSize.width / sentenceWords.length) * 0.9, 140);
            return (
              <motion.div
                key={index}
                animate={isFilled ? { 
                  scale: [1, 1.05, 1], 
                  backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"],
                } : {}}
                transition={{ duration: 0.4, type: "tween", ease: "easeOut" }}
                style={{ width: isFilled ? 'auto' : slotWidth, minWidth: slotWidth }}
                className={`
                  sentence-slot px-4 h-14 sm:h-20 rounded-2xl border-4 border-dashed flex items-center justify-center relative
                  ${isFilled 
                    ? "border-green-400 bg-white shadow-md text-green-600" 
                    : "bg-gray-100/30 border-gray-300 shadow-inner"}
                  ${isAssist ? "ring-4 ring-amber-300 border-amber-400" : ""}
                `}
              >
                <AnimatePresence>
                  {isPeek && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.18 }}
                      className={`${config.tileFontSize} font-display font-black text-purple-500`}
                    >
                      {sentenceWords[index]}
                    </motion.span>
                  )}
                </AnimatePresence>

                <span className={`${config.tileFontSize} font-display font-black transition-opacity ${isFilled ? "opacity-100" : "opacity-0"}`}>
                  {placed[index]}
                </span>

                {!isFilled && !isPeek && (
                  <span className="text-gray-200 font-display font-black text-4xl">?</span>
                )}

                {/* Success Sparkle */}
                {isFilled && (
                  <motion.div 
                    initial={{ opacity: 1, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    className="absolute inset-0 bg-green-200 rounded-2xl -z-10"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] opacity-40 text-center pb-4">
        Drag the words in order to tell the story!
      </p>
    </div>
  );
}
