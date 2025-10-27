import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();

    // Get query parameters for pagination
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // Validate limit
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Limit must be between 1 and 100' });
    }

    // Get all URLs ordered by creation date (latest first)
    const urls = await sql`
      SELECT 
        id,
        short_code,
        original_url,
        name,
        clicks,
        created_at
      FROM urls 
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM urls
    `;
    const total = parseInt(countResult[0].total);

    // Get base URL for constructing short URLs
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;

    // Format response with short URLs
    const formattedUrls = urls.map(url => ({
      id: url.id,
      shortCode: url.short_code,
      shortUrl: `${baseUrl}/api/re/${url.short_code}`,
      originalUrl: url.original_url,
      name: url.name,
      clicks: url.clicks,
      createdAt: url.created_at
    }));

    return res.status(200).json({
      success: true,
      data: formattedUrls,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
