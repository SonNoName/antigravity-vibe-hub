const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db/database');

// GET all prompts with optional filters
router.get('/', (req, res) => {
  try {
    const { category, level, search } = req.query;
    let sql = 'SELECT * FROM vibe_prompts WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (level && level !== 'All') {
      sql += ' AND target_level = ?';
      params.push(level);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR prompt_content LIKE ? OR tags LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY featured DESC, upvotes DESC, created_at DESC';

    const prompts = queryAll(sql, params);
    const parsed = prompts.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]')
    }));

    res.json({ success: true, count: parsed.length, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET categories & levels
router.get('/meta/categories', (req, res) => {
  try {
    const categories = queryAll('SELECT DISTINCT category FROM vibe_prompts ORDER BY category ASC');
    const levels = queryAll('SELECT DISTINCT target_level FROM vibe_prompts ORDER BY target_level ASC');
    res.json({
      success: true,
      categories: categories.map(c => c.category),
      levels: levels.map(l => l.target_level)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST submit a new prompt to SQL database
router.post('/', (req, res) => {
  try {
    const { title, category, target_level, author_name, prompt_content, system_context, tags } = req.body;

    if (!title || !prompt_content) {
      return res.status(400).json({ success: false, error: 'Title and prompt content are required.' });
    }

    const formattedTags = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify(
      (tags || 'Vibe,Antigravity').split(',').map(t => t.trim()).filter(Boolean)
    );

    const result = execute(`
      INSERT INTO vibe_prompts (title, category, target_level, author_name, prompt_content, system_context, tags, upvotes, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)
    `, [
      title,
      category || 'Fullstack',
      target_level || 'Novice',
      author_name || 'Anonymous Vibe Coder',
      prompt_content,
      system_context || 'Standard Antigravity environment',
      formattedTags
    ]);

    const created = queryOne('SELECT * FROM vibe_prompts WHERE id = ?', [result.lastInsertRowid]);
    created.tags = JSON.parse(created.tags || '[]');

    res.status(201).json({ success: true, message: 'Vibe prompt saved to SQL database!', data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST upvote a prompt
router.post('/:id/upvote', (req, res) => {
  try {
    const id = req.params.id;
    execute('UPDATE vibe_prompts SET upvotes = upvotes + 1 WHERE id = ?', [id]);
    const updated = queryOne('SELECT id, upvotes FROM vibe_prompts WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    res.json({ success: true, upvotes: updated.upvotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
