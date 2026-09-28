const express = require('express');
const router = express.Router();
const { queryAll, queryOne } = require('../db/database');

// GET all tracks with module counts
router.get('/', (req, res) => {
  try {
    const tracks = queryAll(`
      SELECT t.*, COUNT(m.id) as module_count
      FROM proficiency_tracks t
      LEFT JOIN curriculum_modules m ON t.id = m.track_id
      GROUP BY t.id
      ORDER BY t.id ASC
    `);
    res.json({ success: true, data: tracks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single track with all modules
router.get('/:slug', (req, res) => {
  try {
    const track = queryOne('SELECT * FROM proficiency_tracks WHERE slug = ?', [req.params.slug]);
    if (!track) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }
    const modules = queryAll(
      'SELECT * FROM curriculum_modules WHERE track_id = ? ORDER BY module_order ASC',
      [track.id]
    );

    // Parse tools JSON
    const parsedModules = modules.map(m => ({
      ...m,
      antigravity_tools: JSON.parse(m.antigravity_tools || '[]')
    }));

    res.json({
      success: true,
      data: {
        ...track,
        modules: parsedModules
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
