-- Run this SQL in your Neon dashboard to create the table

CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);

-- If table already exists, run this to add the name column:
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS name VARCHAR(255);
