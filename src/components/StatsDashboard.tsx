import { motion } from "motion/react";
import { BarChart3, Target, Trophy, Flame, Clock3 } from "lucide-react";

interface StatsDashboardProps {
  completedCount: number;
  totalCount: number;
  accuracyRate: number;
  currentStreak: number;
  bestStreak: number;
  needsPracticeCount: number;
  totalPlayMinutes: number;
  badges: string[];
  dailyGoal: {
    goal: number;
    completedToday: number;
  };
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
}: StatsDashboardProps) {
  const completionPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="game-container w-full max-w-2xl px-4 sm:px-6"
    >
      <h2 className="text-3xl sm:text-4xl font-display font-black text-blue-600 mb-6 text-center uppercase tracking-tight pt-4">
        My Progress
      </h2>

      <div className="bg-white rounded-[32px] border-4 border-blue-50 p-5 sm:p-7 mb-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-black text-gray-700">
            <BarChart3 size={20} className="text-blue-500" />
            Words learned
          </div>
          <div className="font-display font-black text-2xl text-blue-600">
            {completedCount}/{totalCount}
          </div>
        </div>
        <div className="h-4 rounded-full bg-blue-50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-3xl border-2 border-yellow-100 p-4">
          <div className="flex items-center gap-2 text-yellow-600 font-black text-sm uppercase tracking-wider">
            <Target size={16} />
            Accuracy
          </div>
          <div className="text-3xl font-display font-black text-gray-800 mt-1">{accuracyRate}%</div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-orange-100 p-4">
          <div className="flex items-center gap-2 text-orange-600 font-black text-sm uppercase tracking-wider">
            <Flame size={16} />
            Streak
          </div>
          <div className="text-3xl font-display font-black text-gray-800 mt-1">{currentStreak}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-blue-100 p-3 text-center">
          <Trophy className="mx-auto text-blue-500 mb-1" size={16} />
          <div className="text-xs font-black uppercase text-gray-400">Best streak</div>
          <div className="text-xl font-display font-black text-gray-700">{bestStreak}</div>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 p-3 text-center">
          <Target className="mx-auto text-orange-500 mb-1" size={16} />
          <div className="text-xs font-black uppercase text-gray-400">Need practice</div>
          <div className="text-xl font-display font-black text-gray-700">{needsPracticeCount}</div>
        </div>
        <div className="bg-white rounded-2xl border border-purple-100 p-3 text-center">
          <Clock3 className="mx-auto text-purple-500 mb-1" size={16} />
          <div className="text-xs font-black uppercase text-gray-400">Play time</div>
          <div className="text-xl font-display font-black text-gray-700">{totalPlayMinutes}m</div>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-3xl border-2 border-green-100 p-4">
        <div className="text-xs font-black uppercase text-green-600 mb-1 tracking-wider">Daily Goal</div>
        <div className="text-lg font-bold text-gray-700">
          {dailyGoal.completedToday}/{dailyGoal.goal} words today
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-5 bg-white rounded-3xl border-2 border-purple-100 p-4">
          <div className="text-xs font-black uppercase text-purple-600 mb-2 tracking-wider">Badges</div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

