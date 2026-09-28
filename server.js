const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('node:path');
const { getStats } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Register API Routes
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/capabilities', require('./routes/capabilities'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/vibes', require('./routes/vibes'));
app.use('/api/system', require('./routes/system'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const stats = getStats();
  res.json({
    status: 'ONLINE',
    system: 'Google DeepMind Antigravity Portal',
    timestamp: new Date().toISOString(),
    databaseStats: stats
  });
});

// Single Page Application Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server with automatic port retry if occupied
const server = app.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════════════════════
  🌌 ANTIGRAVITY VIBE CODING PLATFORM RUNNING
  ═══════════════════════════════════════════════════════════════════
  📡 Local Web Interface : http://localhost:${PORT}
  ⚡ Full-Stack REST API  : http://localhost:${PORT}/api/system/stats
  💾 Relational Database  : SQLite WAL Active
  🧠 AI Engine Identity  : Google DeepMind Antigravity
  ═══════════════════════════════════════════════════════════════════
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is occupied, switching to port ${nextPort}...`);
    app.listen(nextPort, () => {
      console.log(`🌌 Server now listening on http://localhost:${nextPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
