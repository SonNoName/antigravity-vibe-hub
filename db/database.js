const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'antigravity.sqlite');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new DatabaseSync(DB_PATH);

// Pragmas for performance and data integrity
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);

// Query helpers with proper error handling and clean data return
const queryAll = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (err) {
    console.error('SQL queryAll Error:', err.message, 'SQL:', sql, 'Params:', params);
    throw err;
  }
};

const queryOne = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  } catch (err) {
    console.error('SQL queryOne Error:', err.message, 'SQL:', sql, 'Params:', params);
    throw err;
  }
};

const execute = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  } catch (err) {
    console.error('SQL execute Error:', err.message, 'SQL:', sql, 'Params:', params);
    throw err;
  }
};

const getStats = () => {
  const counts = {
    proficiency_tracks: queryOne('SELECT COUNT(*) as count FROM proficiency_tracks').count,
    curriculum_modules: queryOne('SELECT COUNT(*) as count FROM curriculum_modules').count,
    agent_capabilities: queryOne('SELECT COUNT(*) as count FROM agent_capabilities').count,
    vibe_prompts: queryOne('SELECT COUNT(*) as count FROM vibe_prompts').count,
    agent_missions: queryOne('SELECT COUNT(*) as count FROM agent_missions').count,
    user_assessments: queryOne('SELECT COUNT(*) as count FROM user_assessments').count,
    community_vibes: queryOne('SELECT COUNT(*) as count FROM community_vibes').count,
  };
  return counts;
};

module.exports = {
  db,
  queryAll,
  queryOne,
  execute,
  getStats,
  DB_PATH
};
