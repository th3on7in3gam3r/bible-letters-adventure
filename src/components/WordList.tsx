import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BibleWord, getWordDifficulty } from "../data/words";
import UpgradeModal from "./UpgradeModal";
import { 
  Trophy, 
  Users, 
  Leaf, 
  Sparkles, 
  Ship, 
  Droplets, 
  BookOpen, 
  Wheat, 
  Crown, 
  Globe, 
  Plus, 
  Cat, 
  Bird, 
  Heart, 
  CloudRain, 
  HeartHandshake, 
  Sun, 
  Sword, 
  Gift, 
  Cloud, 
  Sunrise, 
  Flag, 
  Fish, 
  Shirt, 
  Smile, 
  Castle, 
  PawPrint, 
  Lightbulb, 
  Baby, 
  Waves, 
  Home,
  Wand2,
  ThumbsUp, 
  Hand, 
  Map as MapIcon, 
  Rainbow, 
  UserRound, 
  XCircle, 
  Church, 
  Star, 
  Music, 
  TreePalm,
  Layers,
  Lock
} from "lucide-react";

const FREE_WORD_LIMIT = 5; // Users can play 5 words for free

interface WordListProps {
  words: BibleWord[];
  completedWords: string[];
  skippedWords: string[];
  dueReviewWords: BibleWord[];
  onSelectWord: (word: BibleWord) => void;
  key?: string;
}

const getWordIcon = (word: string) => {
  const w = word.toLowerCase();
  switch (w) {
    case "aaron": return <Wand2 size={24} className="text-blue-400" />;
    case "abraham": return <Home size={24} className="text-amber-600" />;
    case "disciple": return <Users size={24} className="text-blue-400" />;
    case "adam":
    case "eve": return <Leaf size={24} className="text-green-400" />;
    case "angel":
    case "holy": return <Sparkles size={24} className="text-yellow-400" />;
    case "ark":
    case "noah": return <Ship size={24} className="text-amber-600" />;
    case "baptism": return <Droplets size={24} className="text-blue-400" />;
    case "bible": return <BookOpen size={24} className="text-red-500" />;
    case "bread": return <Wheat size={24} className="text-yellow-600" />;
    case "christ":
    case "jesus":
    case "king": return <Crown size={24} className="text-yellow-500" />;
    case "creation": return <Globe size={24} className="text-blue-500" />;
    case "cross": return <Plus size={24} className="text-gray-400" strokeWidth={4} />;
    case "daniel": return <Cat size={24} className="text-orange-400" />;
    case "dove":
    case "peace": return <Bird size={24} className="text-blue-300" />;
    case "faith":
    case "love":
    case "savior":
    case "thankful": return <Heart size={24} className="text-red-400" fill="currentColor" />;
    case "flood": return <CloudRain size={24} className="text-blue-500" />;
    case "forgive": return <HeartHandshake size={24} className="text-pink-400" />;
    case "god":
    case "resurrection": return <Sun size={24} className="text-yellow-400" fill="currentColor" />;
    case "goliath": return <Sword size={24} className="text-gray-500" />;
    case "grace": return <Gift size={24} className="text-purple-400" />;
    case "heaven": return <Cloud size={24} className="text-blue-100" fill="currentColor" />;
    case "hope": return <Sunrise size={24} className="text-orange-400" />;
    case "israel": return <Flag size={24} className="text-blue-600" />;
    case "jonah": return <Fish size={24} className="text-blue-400" />;
    case "joseph": return <Shirt size={24} className="text-pink-400" />;
    case "joy": return <Smile size={24} className="text-yellow-400" />;
    case "kingdom": return <Castle size={24} className="text-amber-500" />;
    case "lamb": return <PawPrint size={24} className="text-gray-400" />;
    case "light": return <Lightbulb size={24} className="text-yellow-300" />;
    case "mary": return <Baby size={24} className="text-pink-300" />;
    case "moses": return <Waves size={24} className="text-blue-600" />;
    case "manger": return <Home size={24} className="text-amber-700" />;
    case "obey": return <ThumbsUp size={24} className="text-green-500" />;
    case "pray": return <Hand size={24} className="text-amber-200" />;
    case "promised land": return <MapIcon size={24} className="text-green-600" />;
    case "rainbow": return <Rainbow size={24} className="text-pink-400" />;
    case "shepherd": return <UserRound size={24} className="text-gray-600" />;
    case "sin": return <XCircle size={24} className="text-red-600" />;
    case "temple": return <Church size={24} className="text-amber-400" />;
    case "wise men": return <Star size={24} className="text-yellow-400" fill="currentColor" />;
    case "worship": return <Music size={24} className="text-purple-500" />;
    case "zacchaeus": return <TreePalm size={24} className="text-green-500" />;
    default: return <Star size={24} className="text-blue-400" />;
  }
};

const DifficultyStars = ({ level }: { level: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-0.5" aria-label={`Difficulty ${level} of 3`}>
    {[1, 2, 3].map((s) => (
      <Star
        key={s}
        size={12}
        className={s <= level ? "text-yellow-400" : "text-gray-200"}
        fill={s <= level ? "currentColor" : "none"}
      />
    ))}
  </div>
);

export default function WordList({ words, completedWords, skippedWords, dueReviewWords, onSelectWord }: WordListProps) {
  const [viewMode, setViewMode] = useState<"A_TO_Z" | "PACKS">("A_TO_Z");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Check if user has reached free limit
  const isPremium = false; // TODO: Connect to actual premium status from biblefunland.com
  const canPlayMore = isPremium || completedWords.length < FREE_WORD_LIMIT;

  const handleWordClick = (word: BibleWord) => {
    const isCompleted = completedWords.includes(word.word);
    
    // Allow replaying completed words
    if (isCompleted) {
      onSelectWord(word);
      return;
    }

    // Check if user can play more words
    if (!canPlayMore) {
      setShowUpgradeModal(true);
      return;
    }

    onSelectWord(word);
  };

  const wordsByCategory = useMemo(() => {
    const grouped = new Map<string, BibleWord[]>();
    for (const w of words) {
      const cat = (w.category && w.category.trim()) ? w.category.trim() : "Other Words";
      const arr = grouped.get(cat) ?? [];
      arr.push(w);
      grouped.set(cat, arr);
    }
    for (const [cat, arr] of grouped.entries()) {
      arr.sort((a, b) => a.word.localeCompare(b.word));
      grouped.set(cat, arr);
    }
    const categories = Array.from(grouped.keys()).sort((a, b) => {
      if (a === "Other Words") return 1;
      if (b === "Other Words") return -1;
      return a.localeCompare(b);
    });
    return { grouped, categories };
  }, [words]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="game-container w-full max-w-2xl px-4 sm:px-6 overflow-hidden flex flex-col"
    >
      <h2 className="text-3xl sm:text-4xl font-display font-black text-blue-600 mb-6 sm:mb-8 text-center uppercase tracking-tight pt-4">
        Pick a Word
      </h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            if (dueReviewWords.length > 0) onSelectWord(dueReviewWords[0]);
          }}
          disabled={dueReviewWords.length === 0}
          className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-black uppercase tracking-wider border-2 shadow-sm transition-colors ${
            dueReviewWords.length > 0
              ? "bg-orange-500 text-white border-orange-400 hover:bg-orange-600"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
          aria-label="Start review queue"
        >
          Review Queue: {dueReviewWords.length} due now
        </button>
      </div>

      <div className="flex justify-center mb-5 sm:mb-6">
        <div className="bg-white rounded-full p-1.5 shadow-md border-2 border-blue-50 flex gap-1">
          <button
            onClick={() => setViewMode("A_TO_Z")}
            className={`px-4 sm:px-6 py-2 rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-colors ${
              viewMode === "A_TO_Z" ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-blue-50"
            }`}
          >
            A–Z
          </button>
          <button
            onClick={() => setViewMode("PACKS")}
            className={`px-4 sm:px-6 py-2 rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-colors flex items-center gap-2 ${
              viewMode === "PACKS" ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-purple-50"
            }`}
          >
            <Layers size={16} />
            Packs
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar pb-4">
        {viewMode === "A_TO_Z" ? (
          alphabet.map((letter) => {
            const letterWords = words.filter(w => w.word.toUpperCase().startsWith(letter));
            if (letterWords.length === 0) return null;

            return (
              <div key={letter} className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-md">
                    {letter}
                  </div>
                  <div className="h-0.5 flex-1 bg-blue-100 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {letterWords.map((wordData) => {
                    const isCompleted = completedWords.includes(wordData.word);
                    const needsPractice = skippedWords.includes(wordData.word) && !isCompleted;
                    const difficulty = getWordDifficulty(wordData.word);
                    const isLocked = !isPremium && !isCompleted && completedWords.length >= FREE_WORD_LIMIT;
                    
                    return (
                      <motion.button
                        key={wordData.word}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordClick(wordData)}
                        className={`
                          p-5 rounded-3xl flex items-center gap-4 transition-all shadow-sm border-2 relative
                          ${isCompleted 
                            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                            : isLocked
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-white text-gray-700 hover:border-blue-100 hover:bg-blue-50/30"}
                        `}
                      >
                        {isLocked && (
                          <div className="absolute inset-0 bg-gray-900/10 rounded-3xl flex items-center justify-center backdrop-blur-[1px]">
                            <Lock size={32} className="text-gray-400" />
                          </div>
                        )}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: 0.1 + (words.indexOf(wordData) % 10) * 0.05 
                          }}
                          className={`p-3 rounded-2xl ${isCompleted ? 'bg-white' : isLocked ? 'bg-gray-200' : 'bg-gray-50'}`}
                        >
                          {getWordIcon(wordData.word)}
                        </motion.div>
                        <div className="flex flex-col items-start">
                          <span className="font-black text-xl tracking-tight leading-none mb-1">{wordData.word}</span>
                          <div className="flex items-center gap-2">
                            <DifficultyStars level={difficulty} />
                            {isCompleted && (
                              <div className="flex items-center gap-1.5 bg-yellow-400 text-white px-2 py-0.5 rounded-full shadow-sm scale-90">
                                <Trophy size={10} className="fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">SOLVED!</span>
                              </div>
                            )}
                            {needsPractice && (
                              <div className="flex items-center gap-1 bg-orange-400 text-white px-2 py-0.5 rounded-full shadow-sm scale-90">
                                <span className="text-[10px] font-black uppercase tracking-tighter">NEEDS PRACTICE</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          wordsByCategory.categories.map((category) => {
            const categoryWords = wordsByCategory.grouped.get(category) ?? [];
            if (categoryWords.length === 0) return null;

            return (
              <div key={category} className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-4 py-2 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-display font-black text-lg shadow-md">
                    {category}
                  </div>
                  <div className="h-0.5 flex-1 bg-purple-100 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryWords.map((wordData) => {
                    const isCompleted = completedWords.includes(wordData.word);
                    const needsPractice = skippedWords.includes(wordData.word) && !isCompleted;
                    const difficulty = getWordDifficulty(wordData.word);
                    const isLocked = !isPremium && !isCompleted && completedWords.length >= FREE_WORD_LIMIT;
                    
                    return (
                      <motion.button
                        key={wordData.word}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordClick(wordData)}
                        className={`
                          p-5 rounded-3xl flex items-center gap-4 transition-all shadow-sm border-2 relative
                          ${isCompleted 
                            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                            : isLocked
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-white text-gray-700 hover:border-purple-100 hover:bg-purple-50/30"}
                        `}
                      >
                        {isLocked && (
                          <div className="absolute inset-0 bg-gray-900/10 rounded-3xl flex items-center justify-center backdrop-blur-[1px]">
                            <Lock size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-white' : isLocked ? 'bg-gray-200' : 'bg-gray-50'}`}>
                          {getWordIcon(wordData.word)}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-black text-xl tracking-tight leading-none mb-1">{wordData.word}</span>
                          <div className="flex items-center gap-2">
                            <DifficultyStars level={difficulty} />
                            {isCompleted && (
                              <div className="flex items-center gap-1.5 bg-yellow-400 text-white px-2 py-0.5 rounded-full shadow-sm scale-90">
                                <Trophy size={10} className="fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">SOLVED!</span>
                              </div>
                            )}
                            {needsPractice && (
                              <div className="flex items-center gap-1 bg-orange-400 text-white px-2 py-0.5 rounded-full shadow-sm scale-90">
                                <span className="text-[10px] font-black uppercase tracking-tighter">NEEDS PRACTICE</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        wordsCompleted={completedWords.length}
        freeLimit={FREE_WORD_LIMIT}
      />
    </motion.div>
  );
}
