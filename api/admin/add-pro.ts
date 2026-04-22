import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Simple admin endpoint to add Pro subscription
// Usage: /api/admin/add-pro?userId=user_xxx&plan=pro
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST or GET for simplicity
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, plan = 'pro', adminKey } = req.query;

  // Simple admin key check (you can set this in Vercel env vars)
  const ADMIN_KEY = process.env.ADMIN_KEY || 'bible-admin-2024';
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized - Invalid admin key' });
  }

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  if (plan !== 'pro' && plan !== 'family') {
    return res.status(400).json({ error: 'Plan must be "pro" or "family"' });
  }

  try {
    // Set expiration to 1 year from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    const expiresAtStr = expiresAt.toISOString();

    // Check if subscription already exists
    const existing = await turso.execute({
      sql: 'SELECT id FROM subscriptions WHERE user_id = ?',
      args: [userId],
    });

    if (existing.rows.length > 0) {
      // Update existing subscription
      await turso.execute({
        sql: `UPDATE subscriptions 
              SET status = 'active', plan = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
              WHERE user_id = ?`,
        args: [plan, expiresAtStr, userId],
      });

      return res.status(200).json({
        success: true,
        message: 'Subscription updated',
        userId,
        plan,
        expiresAt: expiresAtStr,
      });
    } else {
      // Create new subscription
      const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await turso.execute({
        sql: `INSERT INTO subscriptions (id, user_id, status, plan, expires_at, created_at, updated_at)
              VALUES (?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [id, userId, plan, expiresAtStr],
      });

      return res.status(200).json({
        success: true,
        message: 'Subscription created',
        userId,
        plan,
        expiresAt: expiresAtStr,
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Failed to add subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
