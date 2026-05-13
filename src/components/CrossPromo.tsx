import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PROMO_CARDS = [
  {
    emoji: "🏃",
    title: "Scripture Runner",
    desc: "Run through Bible verses!",
    url: "https://biblefunland.com/play/scripture-runner",
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-200/50",
  },
  {
    emoji: "🎯",
    title: "Bible Trivia",
    desc: "Test your Bible knowledge!",
    url: "https://biblefunland.com/play/trivia",
    gradient: "from-purple-500 to-pink-400",
    shadow: "shadow-purple-200/50",
  },
  {
    emoji: "🙏",
    title: "Daily Devotional",
    desc: "A verse and prayer for today",
    url: "https://biblefunland.com/devotional",
    gradient: "from-emerald-500 to-green-400",
    shadow: "shadow-emerald-200/50",
  },
  {
    emoji: "🖨️",
    title: "Activity Sheets",
    desc: "Free printable Bible activities",
    url: "https://biblefunland.com/activity-sheets",
    gradient: "from-orange-500 to-yellow-400",
    shadow: "shadow-orange-200/50",
  },
];

export default function CrossPromo() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 px-2">
          More on BibleFunLand
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {PROMO_CARDS.map((card, i) => (
          <motion.a
            key={card.title}
            href={card.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`w-[140px] sm:w-[160px] rounded-2xl bg-gradient-to-br ${card.gradient} p-4 text-white shadow-lg ${card.shadow} border border-white/20`}
            aria-label={`Open ${card.title} on BibleFunLand`}
          >
            <div className="text-3xl mb-2 drop-shadow-sm">{card.emoji}</div>
            <div className="font-black text-sm leading-tight">{card.title}</div>
            <div className="text-white/75 text-[11px] mt-1 leading-snug font-medium">{card.desc}</div>
            <div className="flex items-center gap-1 mt-2.5 text-white/60 text-[10px] font-bold uppercase tracking-wider">
              <ExternalLink size={9} /> Visit
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
