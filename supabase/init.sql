-- ClawDash Supabase Init
-- Run this SQL in Supabase SQL Editor to create all tables

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id serial PRIMARY KEY,
  date text,
  time text,
  task text,
  status text,
  emoji text,
  created_at timestamptz DEFAULT now()
);

-- Agent chat table
CREATE TABLE IF NOT EXISTS agent_chat (
  id serial PRIMARY KEY,
  time text,
  from_agent text,
  to_agent text,
  text text,
  created_at timestamptz DEFAULT now()
);

-- Chatlog table
CREATE TABLE IF NOT EXISTS chatlog (
  id serial PRIMARY KEY,
  time text,
  from_name text,
  text text,
  created_at timestamptz DEFAULT now()
);

-- Docs table
CREATE TABLE IF NOT EXISTS docs (
  id serial PRIMARY KEY,
  title text,
  path text,
  date text,
  emoji text,
  created_at timestamptz DEFAULT now()
);

-- Disable RLS on all tables (anon key access)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE agent_chat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON agent_chat FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE chatlog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON chatlog FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON docs FOR ALL USING (true) WITH CHECK (true);

-- Autoresearch table
CREATE TABLE IF NOT EXISTS autoresearch (
  id serial PRIMARY KEY,
  skill_name text UNIQUE NOT NULL,
  status text DEFAULT 'running',
  baseline_score numeric DEFAULT 0,
  best_score numeric DEFAULT 0,
  experiments jsonb DEFAULT '[]'::jsonb,
  eval_breakdown jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE autoresearch ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON autoresearch FOR ALL USING (true) WITH CHECK (true);
