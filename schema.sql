-- Pages metadata table
CREATE TABLE IF NOT EXISTS pages (
  path TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  risk TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'admin',
  expires_at INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'approved',
  views INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pages_updated ON pages(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_views ON pages(views DESC);
CREATE INDEX IF NOT EXISTS idx_pages_expires ON pages(expires_at);

-- Migration for existing databases:
-- ALTER TABLE pages ADD COLUMN description TEXT NOT NULL DEFAULT '';
-- ALTER TABLE pages ADD COLUMN cover TEXT NOT NULL DEFAULT '';
-- ALTER TABLE pages ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';
