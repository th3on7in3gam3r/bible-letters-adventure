import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PROMO_CARDS = [
  {
    emoji: "🏃",
    title: "Scripture Runner",
    desc: "Run through Bible verses!",
    url: "https://biblefunland.com/play/scripture-runner",
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-300/40",
    bg: "bg-blue-50",
  },
  {
    emoji: "🎯",
    title: "Bible Trivia",
    desc: "Test your Bible knowledge!",
    url: "https://biblefunland.com/play/trivia",
    gradient: "from-purple-500 to-pink-400",
    shadow: "shadow-purple-300/40",
    bg: "bg-purple-50",
  },
  {
    emoji: "🙏",
    title: "Daily Devotional",
    desc: "A verse and prayer for today",
    url: "https://biblefunland.com/devotional",
    gradient: "from-emerald-500 to-green-400",
    shadow: "shadow-emerald-300/40",
    bg: "bg-emerald-50",
  },
  {
    emoji: "🖨️",
    title: "Activity Sheets",
    desc: "Free printable Bible activities",
    url: "https://biblefunland.com/activity-sheets",
    gradient: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-300/40",
    bg: "bg-orange-50",
  },
];

export default function CrossPromo() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 px-3 whitespace-nowrap">
          More on BibleFunLand
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {PROMO_CARDS.map((card, i) => (
          <motion.a
            key={card.title}
            href={card.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg ${card.shadow} border border-white/20 flex flex-col justify-between min-h-[160px]`}
            aria-label={`Open ${card.title} on BibleFunLand`}
          >
            <div>
              <div className="text-3xl mb-3 drop-shadow">{card.emoji}</div>
              <div className="font-black text-sm leading-tight">{card.title}</div>
              <div className="text-white/70 text-[11px] mt-1.5 leading-snug font-medium">{card.desc}</div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-white/50 text-[10px] font-bold uppercase tracking-wider">
              <ExternalLink size={9} /> Visit
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
