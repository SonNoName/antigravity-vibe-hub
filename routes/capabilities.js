const express = require('express');
const router = express.Router();
const { queryAll } = require('../db/database');

// GET all capabilities grouped or flat
router.get('/', (req, res) => {
  try {
    const capabilities = queryAll('SELECT * FROM agent_capabilities ORDER BY id ASC');
    res.json({ success: true, data: capabilities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
