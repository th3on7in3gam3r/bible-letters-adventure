import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PROMO_CARDS = [
  {
    emoji: "🏃",
    title: "Scripture Runner",
    desc: "Run through Bible verses!",
    url: "https://biblefunland.com/play/scripture-runner",
    color: "from-blue-400 to-cyan-500",
  },
  {
    emoji: "🎯",
    title: "Bible Trivia",
    desc: "Test your Bible knowledge!",
    url: "https://biblefunland.com/play/trivia",
    color: "from-purple-400 to-pink-500",
  },
  {
    emoji: "🙏",
    title: "Daily Devotional",
    desc: "A verse and prayer for today",
    url: "https://biblefunland.com/devotional",
    color: "from-green-400 to-emerald-500",
  },
  {
    emoji: "🖨️",
    title: "Activity Sheets",
    desc: "Free printable Bible activities",
    url: "https://biblefunland.com/activity-sheets",
    color: "from-yellow-400 to-orange-500",
  },
];

export default function CrossPromo() {
  return (
    <div className="mt-6 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">
          More on BibleFunLand
        </span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {PROMO_CARDS.map((card, i) => (
          <motion.a
            key={card.title}
            href={card.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`shrink-0 w-36 rounded-2xl bg-gradient-to-br ${card.color} p-4 text-white shadow-md`}
            aria-label={`Open ${card.title} on BibleFunLand`}
          >
            <div className="text-3xl mb-1">{card.emoji}</div>
            <div className="font-black text-sm leading-tight">{card.title}</div>
            <div className="text-white/80 text-xs mt-0.5 leading-snug">{card.desc}</div>
            <div className="flex items-center gap-1 mt-2 text-white/70 text-xs font-bold">
              <ExternalLink size={10} /> Visit
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
