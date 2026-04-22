import type { BibleWord } from "../words";

export interface WordPack {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;       // Tailwind bg class
  borderColor: string; // Tailwind border class
  textColor: string;
  wordKeys: string[];
}

export const WORD_PACKS: WordPack[] = [
  {
    id: "creation",
    title: "Creation & Noah",
    emoji: "🌈",
    description: "In the beginning, God made everything!",
    color: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    wordKeys: ["Adam", "Eve", "Creation", "God", "Noah", "Ark", "Dove", "Flood", "Rainbow"],
  },
  {
    id: "heroes-faith",
    title: "Heroes of Faith",
    emoji: "⚔️",
    description: "Brave people who trusted God!",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    wordKeys: ["Abraham", "Moses", "Aaron", "Daniel", "Jonah", "Joseph", "Goliath", "Israel", "Promised Land", "Zacchaeus"],
  },
  {
    id: "jesus-miracles",
    title: "Jesus & Miracles",
    emoji: "✝️",
    description: "The life and love of Jesus!",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    wordKeys: ["Jesus", "Christ", "Savior", "Disciple", "Cross", "Resurrection", "Baptism", "Shepherd", "Temple", "King"],
  },
  {
    id: "christmas",
    title: "Christmas Story",
    emoji: "⭐",
    description: "The night Jesus was born!",
    color: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    wordKeys: ["Mary", "Manger", "Angel", "Wise Men", "Shepherd", "Light", "Hope"],
  },
  {
    id: "everyday-faith",
    title: "Everyday Faith",
    emoji: "🙏",
    description: "Words to live by every day!",
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    wordKeys: ["Bible", "Pray", "Worship", "Faith", "Love", "Grace", "Peace", "Joy", "Hope", "Forgive", "Obey", "Thankful", "Holy"],
  },
  {
    id: "kingdom",
    title: "God's Kingdom",
    emoji: "👑",
    description: "Heaven, glory, and God's promises!",
    color: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    wordKeys: ["Heaven", "Kingdom", "Glory", "Bread", "Lamb", "Sin", "Resurrection", "Grace", "Light"],
  },
];

export function buildPackLookup(words: BibleWord[]) {
  const byWord = new Map(words.map((word) => [word.word, word]));
  return WORD_PACKS.map((pack) => ({
    ...pack,
    words: pack.wordKeys.map((key) => byWord.get(key)).filter(Boolean) as BibleWord[],
  }));
}
