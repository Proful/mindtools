import { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { getDb } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url, name } = req.body;

    // Validate URL
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate name if provided
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const sql = getDb();

    // Generate short code
    const shortCode = nanoid(7);

    // Insert into database
    await sql`
      INSERT INTO urls (short_code, original_url, name)
      VALUES (${shortCode}, ${url}, ${name || null})
    `;

    // Get the base URL from the request
    const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

    return res.status(201).json({
      success: true,
      shortCode,
      shortUrl: `${baseUrl}/api/re/${shortCode}`,
      originalUrl: url,
      name: name || null,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
