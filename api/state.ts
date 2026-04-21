import { createClient } from "@libsql/client";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const getClient = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  }
  return createClient({ url, authToken });
};

const ensureSchema = async () => {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS player_state (
      player_id TEXT PRIMARY KEY,
      state_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const db = getClient();

    if (req.method === "GET") {
      const playerId = req.query.playerId as string | undefined;
      if (!playerId) return res.status(400).json({ error: "playerId is required" });

      const result = await db.execute({
        sql: `SELECT state_json, updated_at FROM player_state WHERE player_id = ?`,
        args: [playerId],
      });

      if (!result.rows.length) {
        return res.status(200).json({ state: null, updatedAt: null });
      }

      const row = result.rows[0] as unknown as Record<string, unknown>;
      const stateJson = typeof row.state_json === "string" ? row.state_json : "{}";
      const updatedAt = typeof row.updated_at === "number" ? row.updated_at : null;
      return res.status(200).json({
        state: JSON.parse(stateJson),
        updatedAt,
      });
    }

    if (req.method === "POST") {
      const { playerId, state } = req.body as { playerId?: string; state?: unknown };
      if (!playerId || !state) return res.status(400).json({ error: "playerId and state are required" });

      const now = Date.now();
      await db.execute({
        sql: `
          INSERT INTO player_state (player_id, state_json, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(player_id) DO UPDATE SET
            state_json = excluded.state_json,
            updated_at = excluded.updated_at
        `,
        args: [playerId, JSON.stringify(state), now],
      });

      return res.status(200).json({ ok: true, updatedAt: now });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Turso state API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


