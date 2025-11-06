import { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { getDb } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url, name, subject } = req.body;

    // Validate URL
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate name if provided
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    // Validate subject if provided
    if (subject && typeof subject !== "string") {
      return res.status(400).json({ error: "Subject must be a string" });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const sql = getDb();

    const params = new URL(url).searchParams;
    const dataValue = params.get("data");
    const urlToCompare = `%data=${dataValue}%`;

    // Check if URL already exists
    const existing = await sql`
      SELECT short_code, original_url, name, created_at
      FROM urls
      WHERE original_url LIKE ${urlToCompare}
      LIMIT 1
    `;

    const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

    // If URL exists, return existing short code
    if (existing.length > 0) {
      const existingUrl = existing[0];
      return res.status(200).json({
        success: true,
        shortCode: existingUrl.short_code,
        shortUrl: `${baseUrl}/api/re/${existingUrl.short_code}`,
        originalUrl: existingUrl.original_url,
        name: existingUrl.name,
        existing: true,
        subject: existingUrl.subject,
      });
    }

    // Generate short code
    const shortCode = nanoid(7);

    // Insert into database
    await sql`
      INSERT INTO urls (short_code, original_url, name, status, subject)
      VALUES (${shortCode}, ${url}, ${name || null}, 0, ${subject || "science"})
    `;

    return res.status(201).json({
      success: true,
      shortCode,
      shortUrl: `${baseUrl}/api/re/${shortCode}`,
      originalUrl: url,
      name: name || null,
      existing: false,
      subject,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
