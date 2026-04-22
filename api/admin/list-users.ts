import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Admin endpoint to list all users with subscriptions
// Usage: /api/admin/list-users?adminKey=bible-admin-2024
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { adminKey } = req.query;

  // Simple admin key check
  const ADMIN_KEY = process.env.ADMIN_KEY || 'bible-admin-2024';
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized - Invalid admin key' });
  }

  try {
    // Get all subscriptions with user info from profiles table
    const result = await turso.execute({
      sql: `
        SELECT 
          s.user_id,
          s.plan,
          s.status,
          s.expires_at,
          s.created_at,
          p.display_name,
          p.email
        FROM subscriptions s
        LEFT JOIN profiles p ON s.user_id = p.id
        WHERE s.status = 'active'
        ORDER BY s.created_at DESC
      `,
      args: [],
    });

    const users = result.rows.map(row => ({
      userId: row.user_id,
      email: row.email || 'N/A',
      displayName: row.display_name || 'N/A',
      plan: row.plan,
      status: row.status,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
    }));

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
