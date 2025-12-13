-- Revenue tracking table
CREATE TABLE IF NOT EXISTS revenue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tier_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'usd',
  created_at TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX idx_revenue_user ON revenue(user_id);
CREATE INDEX idx_revenue_created ON revenue(created_at);
