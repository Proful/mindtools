import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shortCode } = req.query;

    if (!shortCode || typeof shortCode !== 'string') {
      return res.status(400).json({ error: 'Short code is required' });
    }

    const sql = getDb();

    // Delete the URL
    const result = await sql`
      DELETE FROM urls 
      WHERE short_code = ${shortCode}
      RETURNING short_code, original_url, name
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
      deleted: {
        shortCode: result[0].short_code,
        originalUrl: result[0].original_url,
        name: result[0].name
      }
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
