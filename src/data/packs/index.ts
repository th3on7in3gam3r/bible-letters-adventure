import type { BibleWord } from "../words";

export interface WordPack {
  id: string;
  title: string;
  wordKeys: string[];
}

export const WORD_PACKS: WordPack[] = [
  {
    id: "noah-story",
    title: "Noah's Story",
    wordKeys: ["Noah", "Ark", "Dove", "Flood", "Rainbow"],
  },
  {
    id: "christmas-story",
    title: "Christmas Story",
    wordKeys: ["Mary", "Manger", "Angel", "Wise Men", "Jesus"],
  },
  {
    id: "moses-exodus",
    title: "Moses & Exodus",
    wordKeys: ["Moses", "Aaron", "Promised Land", "Israel"],
  },
];

export function buildPackLookup(words: BibleWord[]) {
  const byWord = new Map(words.map((word) => [word.word, word]));
  return WORD_PACKS.map((pack) => ({
    ...pack,
    words: pack.wordKeys.map((key) => byWord.get(key)).filter(Boolean) as BibleWord[],
  }));
}

