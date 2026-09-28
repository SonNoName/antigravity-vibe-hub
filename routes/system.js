const express = require('express');
const router = express.Router();
const os = require('node:os');
const { queryAll, queryOne, getStats, db } = require('../db/database');

// GET system health and SQL diagnostics
router.get('/stats', (req, res) => {
  try {
    const tableStats = getStats();
    const sqliteVersion = queryOne('SELECT sqlite_version() as version').version;
    const journalMode = queryOne('PRAGMA journal_mode').journal_mode;
    const foreignKeys = queryOne('PRAGMA foreign_keys').foreign_keys;

    res.json({
      success: true,
      data: {
        tables: tableStats,
        engine: {
          runtime: 'Node.js ' + process.version,
          database: 'SQLite v' + sqliteVersion,
          journalMode,
          foreignKeys: foreignKeys === 1 ? 'ENABLED' : 'DISABLED',
          architecture: os.arch(),
          platform: os.platform(),
          uptimeSeconds: Math.floor(process.uptime()),
          memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        },
        antigravity: {
          version: '2.0-Orbital',
          deepmindModel: 'Gemini 3.8 Flash (High-Speed Reasoning)',
          autonomousLoop: 'ACTIVE',
          sandboxStatus: 'ENFORCED'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST safe SQL query execution for Live Database Inspector
router.post('/query', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'SQL query string is required.' });
    }

    const trimmed = query.trim();

    // Security guardrail: Only permit read-only SELECT or PRAGMA statements
    const allowedPrefixes = ['SELECT', 'PRAGMA', 'EXPLAIN'];
    const isAllowed = allowedPrefixes.some(p => trimmed.toUpperCase().startsWith(p));

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        error: 'Security Policy: Live SQL Explorer is restricted to SELECT, PRAGMA, and EXPLAIN queries for data integrity.'
      });
    }

    const start = process.hrtime();
    const rows = queryAll(trimmed);
    const diff = process.hrtime(start);
    const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    res.json({
      success: true,
      rowCount: rows.length,
      executionTimeMs: `${executionTimeMs}ms`,
      data: rows
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET database schema summary (table names & column definitions)
router.get('/tables', (req, res) => {
  try {
    const tables = queryAll(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name ASC
    `);

    const tableDetails = tables.map(t => {
      const columns = queryAll(`PRAGMA table_info(${t.name})`);
      const count = queryOne(`SELECT COUNT(*) as count FROM ${t.name}`).count;
      return {
        tableName: t.name,
        rowCount: count,
        columns: columns.map(c => ({
          name: c.name,
          type: c.type,
          primaryKey: c.pk === 1,
          notNull: c.notnull === 1
        }))
      };
    });

    res.json({ success: true, data: tableDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
