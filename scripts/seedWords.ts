import { createClient } from "@libsql/client";
import { BIBLE_WORDS } from "../src/data/words.ts";

const url = process.env.TURSO_DATABASE_URL ?? process.env.VITE_TURSO_URL;
const authToken = process.env.TURSO_AUTH_TOKEN ?? process.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Missing TURSO_DATABASE_URL/TURSO_AUTH_TOKEN (or VITE_* equivalents).");
}

const db = createClient({ url, authToken });

async function seedWords() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bible_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL UNIQUE,
      definition TEXT NOT NULL,
      sentence TEXT NOT NULL,
      reference TEXT NOT NULL,
      category TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await db.execute("DELETE FROM bible_words");

  for (const entry of BIBLE_WORDS) {
    await db.execute({
      sql: `
        INSERT INTO bible_words (word, definition, sentence, reference, category)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        entry.word,
        entry.definition,
        entry.sentence,
        entry.reference,
        entry.category ?? null,
      ],
    });
  }

  console.log(`Seed complete: inserted ${BIBLE_WORDS.length} words.`);
}

seedWords()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    db.close();
  });
