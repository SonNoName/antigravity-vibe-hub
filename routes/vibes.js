const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db/database');

// GET all community vibes
router.get('/', (req, res) => {
  try {
    const vibes = queryAll('SELECT * FROM community_vibes ORDER BY stars_count DESC, id DESC');
    res.json({ success: true, data: vibes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST submit a new community vibe
router.post('/', (req, res) => {
  try {
    const { author_name, handle, role, vibe_text, built_project } = req.body;
    if (!author_name || !vibe_text) {
      return res.status(400).json({ success: false, error: 'Author name and vibe text are required.' });
    }

    const gradients = [
      'linear-gradient(135deg, #00f5ff, #7928ca)',
      'linear-gradient(135deg, #ec4899, #f59e0b)',
      'linear-gradient(135deg, #10b981, #06b6d4)',
      'linear-gradient(135deg, #8b5cf6, #ec4899)',
      'linear-gradient(135deg, #3b82f6, #10b981)'
    ];
    const randomBg = gradients[Math.floor(Math.random() * gradients.length)];

    const result = execute(`
      INSERT INTO community_vibes (author_name, handle, role, avatar_bg, vibe_text, built_project, stars_count)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      author_name,
      handle.startsWith('@') ? handle : `@${handle}`,
      role || 'Vibe Developer',
      randomBg,
      vibe_text,
      built_project || 'Antigravity Powered App'
    ]);

    const created = queryOne('SELECT * FROM community_vibes WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'Vibe shared with the universe!', data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST star a vibe
router.post('/:id/star', (req, res) => {
  try {
    const id = req.params.id;
    execute('UPDATE community_vibes SET stars_count = stars_count + 1 WHERE id = ?', [id]);
    const updated = queryOne('SELECT id, stars_count FROM community_vibes WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Vibe entry not found' });
    }
    res.json({ success: true, stars_count: updated.stars_count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
