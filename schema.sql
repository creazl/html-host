-- Pages metadata table
CREATE TABLE IF NOT EXISTS pages (
  path TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  risk TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pages_updated ON pages(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_views ON pages(views DESC);
