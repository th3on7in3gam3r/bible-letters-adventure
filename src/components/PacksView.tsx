import { motion } from "framer-motion";
import { Star, ChevronRight, Trophy } from "lucide-react";
import { BibleWord } from "../data/words";
import { WordPack } from "../data/packs";

interface PacksViewProps {
  packs: Array<WordPack & { words: BibleWord[] }>;
  completedWords: string[];
  onSelectPack: (pack: WordPack & { words: BibleWord[] }) => void;
}

function PackProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs font-black mb-1">
        <span className="text-gray-500">{completed}/{total} words</span>
        <span className="text-gray-400">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-green-400"
        />
      </div>
    </div>
  );
}

function StarRating({ completed, words }: { completed: string[]; words: BibleWord[] }) {
  const wordStars = (() => {
    try {
      const raw = localStorage.getItem("bible_letters_word_stars");
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch { return {}; }
  })();

  const totalStars = words.reduce((sum, w) => sum + (wordStars[w.word] ?? 0), 0);
  const maxStars = words.length * 3;
  const avg = words.length === 0 ? 0 : Math.round((totalStars / maxStars) * 3 * 10) / 10;

  if (totalStars === 0) return null;
  return (
    <div className="flex items-center gap-1 mt-1">
      <Star size={12} className="text-yellow-400 fill-yellow-400" />
      <span className="text-xs font-black text-yellow-600">{avg.toFixed(1)} avg</span>
    </div>
  );
}

export default function PacksView({ packs, completedWords, onSelectPack }: PacksViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {packs.map((pack, i) => {
        const completedInPack = pack.words.filter((w) => completedWords.includes(w.word)).length;
        const isComplete = completedInPack === pack.words.length && pack.words.length > 0;

        return (
          <motion.button
            key={pack.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 22 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectPack(pack)}
            className={`text-left p-5 rounded-3xl border-2 ${pack.color} ${pack.borderColor} shadow-sm relative overflow-hidden`}
            aria-label={`Open ${pack.title} pack`}
          >
            {isComplete && (
              <div className="absolute top-3 right-3">
                <div className="bg-green-500 text-white rounded-full p-1">
                  <Trophy size={12} />
                </div>
              </div>
            )}

            <div className="text-4xl mb-2" aria-hidden="true">{pack.emoji}</div>
            <h3 className={`font-black text-lg leading-tight ${pack.textColor}`}>{pack.title}</h3>
            <p className="text-gray-500 text-xs font-semibold mt-0.5 mb-2 leading-snug">{pack.description}</p>

            <PackProgressBar completed={completedInPack} total={pack.words.length} />
            <StarRating completed={completedWords} words={pack.words} />

            <div className={`flex items-center gap-1 mt-2 text-xs font-black ${pack.textColor} opacity-70`}>
              <span>Explore</span>
              <ChevronRight size={12} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
