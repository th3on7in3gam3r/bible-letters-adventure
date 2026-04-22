import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BarChart3, Target, Trophy, Flame, Clock3, Star, BookOpen,
  Download, Copy, Printer, Award, Calendar, ChevronDown, ChevronUp,
} from "lucide-react";
import { BIBLE_WORDS } from "../data/words";

interface StatsDashboardProps {
  completedCount: number;
  totalCount: number;
  accuracyRate: number;
  currentStreak: number;
  bestStreak: number;
  needsPracticeCount: number;
  totalPlayMinutes: number;
  badges: string[];
  dailyGoal: { goal: number; completedToday: number };
  completedWords: string[];
  wordDates: Record<string, string>;
  playerName: string;
  onSetPlayerName: (name: string) => void;
  reviewDueCount: number;
  parentMode: boolean;
  hintUsage: Record<string, number>;
}

// SVG progress ring
function ProgressRing({ pct, size = 160, stroke = 14 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFF6FF" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Certificate modal
function CertificateModal({
  playerName, completedWords, onClose, onSetName,
}: {
  playerName: string;
  completedWords: string[];
  onClose: () => void;
  onSetName: (n: string) => void;
}) {
  const [name, setName] = useState(playerName);
  const certRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => {
    if (name.trim()) onSetName(name.trim());
    window.print();
  };

  const handleCopy = async () => {
    const text = [
      "🏆 BIBLE LETTERS ADVENTURE CERTIFICATE 🏆",
      `Awarded to: ${name || "Bible Champion"}`,
      `Date: ${today}`,
      `Words mastered: ${completedWords.length}`,
      completedWords.join(", "),
      "",
      '"I have hidden your word in my heart." — Psalm 119:11',
      "BibleFunLand.com",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Certificate copied to clipboard!");
    } catch {
      alert(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Certificate body */}
        <div
          ref={certRef}
          className="certificate-print p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #FFFBEB 0%, #EFF6FF 100%)",
            border: "8px solid #F59E0B",
            borderRadius: "24px",
            margin: "16px",
          }}
        >
          <div className="text-5xl mb-2">🏆</div>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-yellow-600 mb-1">Certificate of Achievement</div>
          <h2 className="text-2xl font-black text-blue-700 mb-1">Bible Letters Adventure</h2>
          <p className="text-gray-500 text-sm mb-4">This certifies that</p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-2xl font-black text-center text-blue-800 border-b-2 border-blue-300 bg-transparent w-full mb-4 focus:outline-none focus:border-blue-500"
            aria-label="Your name for the certificate"
          />

          <p className="text-gray-600 font-semibold mb-3">
            has mastered <span className="text-blue-700 font-black">{completedWords.length} Bible words</span>!
          </p>

          {completedWords.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mb-4 max-h-24 overflow-y-auto">
              {completedWords.map((w) => (
                <span key={w} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {w}
                </span>
              ))}
            </div>
          )}

          <p className="text-yellow-700 font-bold italic text-sm mb-2">
            "I have hidden your word in my heart." — Psalm 119:11
          </p>
          <p className="text-gray-400 text-xs">{today} · BibleFunLand.com</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-colors"
            aria-label="Print certificate"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500 text-white rounded-2xl font-black text-sm hover:bg-yellow-600 transition-colors"
            aria-label="Copy certificate to clipboard"
          >
            <Copy size={16} /> Copy
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-colors"
            aria-label="Close certificate"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StatsDashboard({
  completedCount,
  totalCount,
  accuracyRate,
  currentStreak,
  bestStreak,
  needsPracticeCount,
  totalPlayMinutes,
  badges,
  dailyGoal,
  completedWords,
  wordDates,
  playerName,
  onSetPlayerName,
  reviewDueCount,
  parentMode,
  hintUsage,
}: StatsDashboardProps) {
  const completionPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const totalStars = completedWords.reduce((sum, w) => {
    const raw = localStorage.getItem("bible_letters_word_stars");
    const parsed = raw ? JSON.parse(raw) : {};
    return sum + (parsed[w] ?? 1);
  }, 0);

  const [showCert, setShowCert] = useState(false);
  const [showWordHistory, setShowWordHistory] = useState(false);

  // Milestone celebration on mount if thresholds hit
  const milestoneHit = [10, 25, totalCount].includes(completedCount) && completedCount > 0;
  if (milestoneHit) {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  }

  // Recent words (last 10, sorted by date desc)
  const recentWords = [...completedWords]
    .sort((a, b) => {
      const da = wordDates[a] ?? "0";
      const db = wordDates[b] ?? "0";
      return db.localeCompare(da);
    })
    .slice(0, 10);

  const wordStars = (() => {
    try {
      const raw = localStorage.getItem("bible_letters_word_stars");
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch { return {}; }
  })();

  const exportReport = async () => {
    const lines = [
      "Bible Letters Adventure — Progress Report",
      `Player: ${playerName || "Anonymous"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Words mastered: ${completedCount}/${totalCount} (${completionPct}%)`,
      `Total stars: ${totalStars}`,
      `Accuracy: ${accuracyRate}%`,
      `Current streak: ${currentStreak} | Best: ${bestStreak}`,
      `Play time: ${totalPlayMinutes} minutes`,
      `Reviews due: ${reviewDueCount}`,
      "",
      "Mastered words:",
      completedWords.join(", "),
      "",
      "Badges: " + (badges.length ? badges.join(", ") : "None yet"),
    ];
    if (parentMode && Object.keys(hintUsage).length) {
      lines.push("", "Hints used per word:");
      Object.entries(hintUsage)
        .sort((a, b) => b[1] - a[1])
        .forEach(([w, c]) => lines.push(`  ${w}: ${c} hint${c !== 1 ? "s" : ""}`));
    }
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Progress report copied to clipboard!");
    } catch { alert(text); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        className="game-container w-full max-w-2xl px-4 sm:px-6 pb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-black text-blue-600 mb-6 text-center uppercase tracking-tight pt-4">
          My Progress
        </h2>

        {/* Progress ring + summary */}
        <div className="bg-white rounded-[32px] border-4 border-blue-50 p-5 sm:p-7 mb-5 shadow-md flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <ProgressRing pct={completionPct} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-black text-blue-700">{completedCount}</span>
              <span className="text-xs font-black text-gray-400 uppercase">of {totalCount}</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 font-black text-gray-700 mb-1">
              <BarChart3 size={18} className="text-blue-500" />
              <span>{completionPct}% complete</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {completedCount === totalCount
                ? "🎉 All Bible words mastered!"
                : `${totalCount - completedCount} words left to discover`}
            </p>
            {/* Stars total */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3].map((s) => (
                <Star key={s} size={18} className={totalStars >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
              ))}
              <span className="text-sm font-black text-yellow-600 ml-1">{totalStars} total stars</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-2 text-orange-600 font-black text-sm">
              <Flame size={16} />
              {currentStreak > 0
                ? `${currentStreak}-word streak! Keep going! 🔥`
                : "Start a streak — spell a word today!"}
            </div>
          </div>
        </div>

        {/* Milestone banners */}
        {[10, 25, totalCount].map((m) =>
          completedCount >= m ? (
            <motion.div
              key={m}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 p-4 flex items-center gap-3 shadow"
            >
              <Award size={28} className="text-white shrink-0" />
              <div>
                <p className="font-black text-white text-sm">
                  {m === totalCount ? "🏆 ALL WORDS COMPLETE!" : `🌟 ${m} WORDS MILESTONE!`}
                </p>
                <p className="text-yellow-100 text-xs font-semibold">
                  {m === totalCount
                    ? "You're a Bible Letters Champion!"
                    : `Amazing! You've hidden ${m} Bible words in your heart!`}
                </p>
              </div>
            </motion.div>
          ) : null
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-3xl border-2 border-yellow-100 p-4" role="region" aria-label="Accuracy stat">
            <div className="flex items-center gap-2 text-yellow-600 font-black text-sm uppercase tracking-wider">
              <Target size={16} /> Accuracy
            </div>
            <div className="text-3xl font-display font-black text-gray-800 mt-1">{accuracyRate}%</div>
          </div>
          <div className="bg-white rounded-3xl border-2 border-orange-100 p-4" role="region" aria-label="Streak stat">
            <div className="flex items-center gap-2 text-orange-600 font-black text-sm uppercase tracking-wider">
              <Flame size={16} /> Streak
            </div>
            <div className="text-3xl font-display font-black text-gray-800 mt-1">{currentStreak}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-blue-100 p-3 text-center">
            <Trophy className="mx-auto text-blue-500 mb-1" size={16} aria-hidden="true" />
            <div className="text-xs font-black uppercase text-gray-400">Best streak</div>
            <div className="text-xl font-display font-black text-gray-700">{bestStreak}</div>
          </div>
          <div className="bg-white rounded-2xl border border-orange-100 p-3 text-center">
            <Target className="mx-auto text-orange-500 mb-1" size={16} aria-hidden="true" />
            <div className="text-xs font-black uppercase text-gray-400">Need practice</div>
            <div className="text-xl font-display font-black text-gray-700">{needsPracticeCount}</div>
          </div>
          <div className="bg-white rounded-2xl border border-purple-100 p-3 text-center">
            <Clock3 className="mx-auto text-purple-500 mb-1" size={16} aria-hidden="true" />
            <div className="text-xs font-black uppercase text-gray-400">Play time</div>
            <div className="text-xl font-display font-black text-gray-700">{totalPlayMinutes}m</div>
          </div>
        </div>

        {/* Daily goal */}
        <div className="mb-4 bg-white rounded-3xl border-2 border-green-100 p-4">
          <div className="text-xs font-black uppercase text-green-600 mb-1 tracking-wider">Daily Goal</div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-700">
              {dailyGoal.completedToday}/{dailyGoal.goal} words today
            </span>
            {dailyGoal.completedToday >= dailyGoal.goal && (
              <span className="text-green-600 font-black text-sm">✅ Done!</span>
            )}
          </div>
          <div className="h-3 rounded-full bg-green-50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (dailyGoal.completedToday / dailyGoal.goal) * 100)}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Review due nudge */}
        {reviewDueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4 flex items-center gap-3 shadow"
            role="alert"
          >
            <Calendar size={24} className="text-white shrink-0" />
            <div>
              <p className="font-black text-white text-sm">{reviewDueCount} Review{reviewDueCount !== 1 ? "s" : ""} Due!</p>
              <p className="text-blue-100 text-xs">Go to the word list and review them now 📖</p>
            </div>
          </motion.div>
        )}

        {/* Recent words */}
        {recentWords.length > 0 && (
          <div className="mb-4 bg-white rounded-3xl border-2 border-blue-100 p-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowWordHistory((v) => !v)}
              aria-expanded={showWordHistory}
              aria-controls="word-history"
            >
              <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider">
                <BookOpen size={16} /> Recently Mastered
              </div>
              {showWordHistory ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <AnimatePresence>
              {showWordHistory && (
                <motion.div
                  id="word-history"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {recentWords.map((w) => {
                      const wordData = BIBLE_WORDS.find((b) => b.word === w);
                      const stars = wordStars[w] ?? 1;
                      return (
                        <div key={w} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                          <div>
                            <span className="font-black text-gray-800 text-sm">{w}</span>
                            {parentMode && wordData && (
                              <p className="text-xs text-gray-400">{wordData.reference} — {wordData.definition}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3].map((s) => (
                                <Star key={s} size={12} className={stars >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                              ))}
                            </div>
                            {wordDates[w] && (
                              <span className="text-xs text-gray-400">{wordDates[w]}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Parent mode: accuracy per word */}
        {parentMode && Object.keys(hintUsage).length > 0 && (
          <div className="mb-4 bg-amber-50 rounded-3xl border-2 border-amber-100 p-4">
            <div className="text-xs font-black uppercase text-amber-700 mb-2 tracking-wider">
              👨‍👩‍👧 Hints Used Per Word
            </div>
            <div className="space-y-1">
              {Object.entries(hintUsage)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([word, count]) => (
                  <div key={word} className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">{word}</span>
                    <span className="text-amber-600 font-black">{count} hint{count !== 1 ? "s" : ""}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-4 bg-white rounded-3xl border-2 border-purple-100 p-4">
            <div className="text-xs font-black uppercase text-purple-600 mb-2 tracking-wider">Badges</div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black">
                  🏅 {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowCert(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl font-black text-sm shadow hover:opacity-90 transition-opacity min-w-[140px]"
            aria-label="Open printable certificate"
          >
            <Award size={18} /> Certificate
          </button>
          <button
            onClick={exportReport}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow hover:bg-blue-700 transition-colors min-w-[140px]"
            aria-label="Export progress report to clipboard"
          >
            <Download size={18} /> Export Report
          </button>
        </div>

        {/* Streak verse */}
        {currentStreak >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100"
          >
            <p className="text-blue-700 font-bold italic text-sm">
              "I have hidden your word in my heart." — Psalm 119:11
            </p>
            <p className="text-blue-500 text-xs mt-1 font-black">
              🔥 You've been learning for {currentStreak} words in a row!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Certificate modal */}
      <AnimatePresence>
        {showCert && (
          <CertificateModal
            playerName={playerName}
            completedWords={completedWords}
            onClose={() => setShowCert(false)}
            onSetName={onSetPlayerName}
          />
        )}
      </AnimatePresence>

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(.certificate-print) { display: none !important; }
          .certificate-print { display: block !important; margin: 0; padding: 40px; }
        }
      `}</style>
    </>
  );
}
