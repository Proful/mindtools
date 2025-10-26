import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shortCode } = req.query;

    if (!shortCode || typeof shortCode !== 'string') {
      return res.status(400).json({ error: 'Short code is required' });
    }

    const sql = getDb();

    // Get the original URL and increment click count
    const result = await sql`
      UPDATE urls 
      SET clicks = clicks + 1 
      WHERE short_code = ${shortCode}
      RETURNING original_url
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Redirect to the original URL
    return res.redirect(302, result[0].original_url);

  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
