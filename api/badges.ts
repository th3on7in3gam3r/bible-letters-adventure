import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Ensure the bible_letters_badges table exists
async function ensureTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS bible_letters_badges (
      id        TEXT PRIMARY KEY,
      user_id   TEXT NOT NULL,
      badge_id  TEXT NOT NULL,
      earned_at TEXT NOT NULL,
      UNIQUE(user_id, badge_id)
    )
  `);
}

// GET  /api/badges?userId=xxx  — fetch all badges for a user
// POST /api/badges              — body: { userId, badgeId }  — award a badge
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureTable();

    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Missing userId' });
      }
      const result = await turso.execute({
        sql: 'SELECT badge_id, earned_at FROM bible_letters_badges WHERE user_id = ? ORDER BY earned_at ASC',
        args: [userId],
      });
      return res.status(200).json({
        badges: result.rows.map(r => ({ badgeId: r.badge_id, earnedAt: r.earned_at })),
      });
    }

    if (req.method === 'POST') {
      const { userId, badgeId } = req.body as { userId?: string; badgeId?: string };
      if (!userId || !badgeId) {
        return res.status(400).json({ error: 'Missing userId or badgeId' });
      }
      const id = `${userId}_${badgeId}_${Date.now()}`;
      const earnedAt = new Date().toISOString();
      await turso.execute({
        sql: `INSERT OR IGNORE INTO bible_letters_badges (id, user_id, badge_id, earned_at)
              VALUES (?, ?, ?, ?)`,
        args: [id, userId, badgeId, earnedAt],
      });
      return res.status(200).json({ ok: true, badgeId, earnedAt });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[badges]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
