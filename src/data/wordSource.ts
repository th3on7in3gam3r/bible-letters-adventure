import { turso } from "../../lib/db";
import { BIBLE_WORDS, type BibleWord } from "./words";

export type WordDataSource = "turso" | "fallback";

type TursoRow = {
  word: unknown;
  definition: unknown;
  sentence: unknown;
  reference: unknown;
  category?: unknown;
};

const hasClientEnv = () =>
  Boolean(import.meta.env.VITE_TURSO_URL) && Boolean(import.meta.env.VITE_TURSO_AUTH_TOKEN);

const normalizeRow = (row: TursoRow): BibleWord | null => {
  if (
    typeof row.word !== "string" ||
    typeof row.definition !== "string" ||
    typeof row.sentence !== "string" ||
    typeof row.reference !== "string"
  ) {
    return null;
  }

  return {
    word: row.word,
    definition: row.definition,
    sentence: row.sentence,
    reference: row.reference,
    category: typeof row.category === "string" && row.category.trim().length > 0 ? row.category : undefined,
  };
};

export async function loadBibleWords(): Promise<{ words: BibleWord[]; source: WordDataSource }> {
  if (!hasClientEnv()) return { words: BIBLE_WORDS, source: "fallback" };

  try {
    const result = await turso.execute(`
      SELECT word, definition, sentence, reference, category
      FROM bible_words
      ORDER BY word ASC
    `);

    const words = result.rows
      .map((row) => normalizeRow(row as unknown as TursoRow))
      .filter((entry): entry is BibleWord => Boolean(entry));

    if (words.length > 0) {
      return { words, source: "turso" };
    }
    return { words: BIBLE_WORDS, source: "fallback" };
  } catch (error) {
    console.warn("Falling back to local word list (Turso unavailable):", error);
    return { words: BIBLE_WORDS, source: "fallback" };
  }
}
