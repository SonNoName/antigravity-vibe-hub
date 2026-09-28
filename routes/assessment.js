const express = require('express');
const router = express.Router();
const { execute, queryOne, queryAll } = require('../db/database');

// Predefined assessment questions to evaluate Vibe Coding proficiency
const questions = [
  {
    id: 1,
    question: 'When starting a brand-new complex full-stack feature with Antigravity, what is the most optimal initial step?',
    options: [
      { id: 'A', text: 'Ask the agent to immediately rewrite the entire frontend and backend simultaneously.' },
      { id: 'B', text: 'Use /plan to align on architectural decisions, file structure, and step-by-step verification checkpoints.', correct: true, points: 25 },
      { id: 'C', text: 'Write all the code manually first and ask the agent to fix syntax typos.' },
      { id: 'D', text: 'Run a sleep script in the background while waiting for ideas.' }
    ]
  },
  {
    id: 2,
    question: 'How does Antigravity prevent destructive context collisions when undertaking deep codebase exploration?',
    options: [
      { id: 'A', text: 'By clearing the entire conversation history after every message.' },
      { id: 'B', text: 'By disabling terminal execution entirely.' },
      { id: 'C', text: 'By spawning a dedicated read-only research subagent via invoke_subagent, leaving the main planner context clean.', correct: true, points: 25 },
      { id: 'D', text: 'By asking the user to manually copy and paste 50 files into chat.' }
    ]
  },
  {
    id: 3,
    question: 'Which tool does Antigravity leverage to make line-precise edits without risking truncations in huge files?',
    options: [
      { id: 'A', text: 'replace_file_content with exact StartLine, EndLine, and targetContent matching.', correct: true, points: 25 },
      { id: 'B', text: 'Blind string search and regex replace across the whole drive.' },
      { id: 'C', text: 'Full file overwrite using echo > file.' },
      { id: 'D', text: 'Manual screenshot OCR typing.' }
    ]
  },
  {
    id: 4,
    question: 'How do you configure recurring, autonomous background monitoring jobs without blocking interactive chat in Antigravity?',
    options: [
      { id: 'A', text: 'Run a while true; sleep 60; done script in a synchronous terminal.' },
      { id: 'B', text: 'Use the schedule tool with a 5-field cron expression, IsDaemon: true, and reactive wakeup.', correct: true, points: 25 },
      { id: 'C', text: 'Keep pressing Enter repeatedly in the chat box.' },
      { id: 'D', text: 'Restart the computer every hour.' }
    ]
  }
];

// GET questions
router.get('/questions', (req, res) => {
  // Strip correct answer flags before sending to client
  const clientQuestions = questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(o => ({ id: o.id, text: o.text }))
  }));
  res.json({ success: true, data: clientQuestions });
});

// POST submit assessment
router.post('/submit', (req, res) => {
  try {
    const { userName, answers, experienceLevel } = req.body;
    if (!userName || !answers) {
      return res.status(400).json({ success: false, error: 'User name and answers are required.' });
    }

    let score = 0;
    const maxScore = questions.length * 25;

    for (const q of questions) {
      const selectedOptionId = answers[q.id];
      const correctOpt = q.options.find(o => o.correct);
      if (correctOpt && correctOpt.id === selectedOptionId) {
        score += correctOpt.points;
      }
    }

    const percentage = Math.round((score / maxScore) * 100);

    let calculatedLevel = 'Novice Vibe Coder';
    let assignedBadge = '✨ Fluid Conjurer';
    let personalizedAdvice = 'Focus on conversational framing. Describe high-level product desires and let Antigravity manage the initial scaffolds.';

    if (percentage >= 100) {
      calculatedLevel = 'Singularity Operator';
      assignedBadge = '🌌 Zero-G Vanguard';
      personalizedAdvice = 'Master-class execution. You leverage parallel subagent swarms, persistent terminal daemons, and custom skills to build software at lightspeed.';
    } else if (percentage >= 75) {
      calculatedLevel = 'Orchestration Architect';
      assignedBadge = '🔮 Swarm Conductor';
      personalizedAdvice = 'Exceptional agentic proficiency. You seamlessly blend slash commands with surgical diffing and isolated subagent workspaces.';
    } else if (percentage >= 50) {
      calculatedLevel = 'Agent Commander';
      assignedBadge = '⚡ Orbital Strategist';
      personalizedAdvice = 'Solid foundation. Dive deeper into subagent swarms (invoke_subagent) and custom SKILL.md packages to unlock true autonomous power.';
    }

    // Save assessment result into SQLite
    const result = execute(`
      INSERT INTO user_assessments (user_name, experience_level, answers_json, calculated_level, score_percentage, assigned_badge, personalized_advice)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userName,
      experienceLevel || 'Intermediate',
      JSON.stringify(answers),
      calculatedLevel,
      percentage,
      assignedBadge,
      personalizedAdvice
    ]);

    const recordId = result.lastInsertRowid;

    res.json({
      success: true,
      data: {
        assessmentId: recordId,
        userName,
        scorePercentage: percentage,
        calculatedLevel,
        assignedBadge,
        personalizedAdvice,
        holographicCardId: `AGY-DEV-${String(recordId).padStart(4, '0')}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET recent assessments leaderboard / Hall of Fame
router.get('/hall-of-fame', (req, res) => {
  try {
    const list = queryAll(`
      SELECT id, user_name, calculated_level, score_percentage, assigned_badge, created_at
      FROM user_assessments
      ORDER BY score_percentage DESC, id DESC
      LIMIT 10
    `);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
