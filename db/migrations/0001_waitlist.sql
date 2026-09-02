-- Waitlist signups captured from the MING landing page.
CREATE TABLE waitlist_signups (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'declined')),
  source VARCHAR(60) NOT NULL DEFAULT 'landing',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX waitlist_signups_email_normalized_key
  ON waitlist_signups (email_normalized);

CREATE INDEX waitlist_signups_created_at_idx
  ON waitlist_signups (created_at DESC);
