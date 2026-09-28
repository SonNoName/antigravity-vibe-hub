-- Antigravity Vibe Coding Platform SQL Schema
-- Relational SQLite Database for Learning Tracks, Capabilities, Missions & Vibe Prompts

CREATE TABLE IF NOT EXISTS proficiency_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  level TEXT NOT NULL,
  badge TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  icon TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  description TEXT NOT NULL,
  core_mindset TEXT NOT NULL,
  estimated_hours TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS curriculum_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id INTEGER NOT NULL,
  module_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  summary TEXT NOT NULL,
  deep_dive TEXT NOT NULL,
  antigravity_tools TEXT NOT NULL, -- JSON array of tools
  prompt_recipe TEXT NOT NULL,
  code_example TEXT NOT NULL,
  hands_on_challenge TEXT NOT NULL,
  pro_tip TEXT NOT NULL,
  FOREIGN KEY (track_id) REFERENCES proficiency_tracks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_capabilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  tagline TEXT NOT NULL,
  deep_explanation TEXT NOT NULL,
  architecture_layer TEXT NOT NULL,
  live_example TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vibe_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_level TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Antigravity Architect',
  author_avatar TEXT DEFAULT '⚡',
  prompt_content TEXT NOT NULL,
  system_context TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON array string
  upvotes INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mission_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  initial_prompt TEXT NOT NULL,
  subagents TEXT NOT NULL, -- JSON array
  trace_steps TEXT NOT NULL, -- JSON array of steps
  final_artifact_title TEXT NOT NULL,
  final_artifact_content TEXT NOT NULL,
  total_duration_ms INTEGER NOT NULL,
  run_count INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  calculated_level TEXT NOT NULL,
  score_percentage INTEGER NOT NULL,
  assigned_badge TEXT NOT NULL,
  personalized_advice TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_vibes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  handle TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_bg TEXT NOT NULL,
  vibe_text TEXT NOT NULL,
  built_project TEXT NOT NULL,
  stars_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast filtering & search
CREATE INDEX IF NOT EXISTS idx_modules_track ON curriculum_modules(track_id, module_order);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON vibe_prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_level ON vibe_prompts(target_level);
CREATE INDEX IF NOT EXISTS idx_prompts_upvotes ON vibe_prompts(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_missions_code ON agent_missions(mission_code);
CREATE INDEX IF NOT EXISTS idx_vibes_stars ON community_vibes(stars_count DESC);
