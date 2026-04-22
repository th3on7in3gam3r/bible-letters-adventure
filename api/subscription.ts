import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  try {
    // Query subscriptions table from mindshiftplus database
    const result = await turso.execute({
      sql: 'SELECT status, plan, expires_at FROM subscriptions WHERE user_id = ?',
      args: [userId],
    });

    if (result.rows.length === 0) {
      // No subscription found = free user
      return res.status(200).json({
        status: 'inactive',
        plan: 'free',
        expires_at: null,
      });
    }

    const subscription = result.rows[0];
    
    return res.status(200).json({
      status: subscription.status,
      plan: subscription.plan,
      expires_at: subscription.expires_at,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription' });
  }
}
