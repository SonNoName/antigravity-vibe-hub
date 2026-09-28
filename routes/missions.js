const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db/database');

// GET all missions
router.get('/', (req, res) => {
  try {
    const missions = queryAll('SELECT * FROM agent_missions ORDER BY created_at DESC');
    const parsed = missions.map(m => ({
      ...m,
      subagents: JSON.parse(m.subagents || '[]'),
      trace_steps: JSON.parse(m.trace_steps || '[]')
    }));
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single mission
router.get('/:code', (req, res) => {
  try {
    const mission = queryOne('SELECT * FROM agent_missions WHERE mission_code = ?', [req.params.code]);
    if (!mission) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }
    mission.subagents = JSON.parse(mission.subagents || '[]');
    mission.trace_steps = JSON.parse(mission.trace_steps || '[]');
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST simulate custom agent mission (REST response)
router.post('/simulate', (req, res) => {
  try {
    const { prompt, mode = 'standard' } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required for simulation.' });
    }

    const simulation = generateSimulationTrace(prompt, mode);

    // Save simulation trace into database
    const missionCode = 'RUN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    execute(`
      INSERT INTO agent_missions (mission_code, title, category, initial_prompt, subagents, trace_steps, final_artifact_title, final_artifact_content, total_duration_ms, run_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      missionCode,
      prompt.substring(0, 60) + '...',
      'Interactive Run',
      prompt,
      JSON.stringify(simulation.subagents),
      JSON.stringify(simulation.steps),
      simulation.artifactTitle,
      simulation.artifactContent,
      simulation.totalDuration
    ]);

    res.json({
      success: true,
      missionCode,
      ...simulation
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Server-Sent Events stream for live real-time simulation
router.get('/stream/live', (req, res) => {
  const prompt = req.query.prompt || 'Synthesize Antigravity architecture component';
  const mode = req.query.mode || 'standard';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const simulation = generateSimulationTrace(prompt, mode);
  let stepIndex = 0;

  // Send initial event
  res.write(`data: ${JSON.stringify({ type: 'START', mission: prompt, subagents: simulation.subagents })}\n\n`);

  const interval = setInterval(() => {
    if (stepIndex < simulation.steps.length) {
      const step = simulation.steps[stepIndex];
      res.write(`data: ${JSON.stringify({ type: 'STEP', step, index: stepIndex, total: simulation.steps.length })}\n\n`);
      stepIndex++;
    } else {
      res.write(`data: ${JSON.stringify({
        type: 'COMPLETE',
        artifactTitle: simulation.artifactTitle,
        artifactContent: simulation.artifactContent,
        codeSnippet: simulation.codeSnippet,
        mermaidDiagram: simulation.mermaidDiagram
      })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 450);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Helper to construct intelligent contextual agent traces
function generateSimulationTrace(prompt, mode) {
  const lower = prompt.toLowerCase();
  let subagents = ['Antigravity Lead', 'research-agent'];
  let steps = [];
  let artifactTitle = 'Mission Completion Blueprint';
  let artifactContent = '';
  let codeSnippet = '';
  let mermaidDiagram = '';

  if (lower.includes('auth') || lower.includes('security') || lower.includes('jwt')) {
    subagents = ['Antigravity Lead', 'sec-auditor', 'auth-scaffolder', 'test-runner'];
    steps = [
      { agent: 'Antigravity Lead', action: 'PLANNING', detail: 'Deconstructing auth architecture: JWT tokens, HTTP-only cookie storage, bcrypt password hashing.' },
      { agent: 'sec-auditor', action: 'SUBAGENT_INVOCATION', detail: 'invoke_subagent: Spawning sec-auditor with read-only permissions to scan token storage.' },
      { agent: 'sec-auditor', action: 'TOOL_CALL', detail: 'view_file: Scanning /middleware/auth.js and package.json dependencies.' },
      { agent: 'auth-scaffolder', action: 'CODE_GEN', detail: 'write_to_file: Implementing verifyJwtToken() with 15-minute expiration & refresh rotation.' },
      { agent: 'test-runner', action: 'TERMINAL_EXEC', detail: 'run_command: npm test -- tests/auth.spec.js (8/8 assertions passing in 184ms)' },
      { agent: 'Antigravity Lead', action: 'VERIFICATION', detail: 'Zero vulnerabilities found. Generating interactive security artifact.' }
    ];
    artifactTitle = 'Zero-Trust Authentication Engine';
    artifactContent = 'Implemented robust dual-token JWT authentication with rate limiting and salted bcrypt hashing.';
    codeSnippet = `const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: Zero gravity clearance required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token expired or invalid signature' });
  }
}`;
    mermaidDiagram = `sequenceDiagram
  Client->>Server: POST /api/auth/login
  Server->>Database: Verify Hashed Credentials
  Database-->>Server: User Profile Match
  Server->>Server: Sign Dual JWT Tokens
  Server-->>Client: 200 OK + HttpOnly Secure Cookie`;
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    subagents = ['Antigravity Lead', 'db-architect', 'query-optimizer', 'verifier'];
    steps = [
      { agent: 'Antigravity Lead', action: 'PLANNING', detail: 'Analyzing relational schema requirements and ACID consistency constraints.' },
      { agent: 'db-architect', action: 'TOOL_CALL', detail: 'write_to_file: db/schema.sql with WAL mode and composite B-tree indexes.' },
      { agent: 'query-optimizer', action: 'ANALYSIS', detail: 'Benchmarking index selectivity on foreign key relations.' },
      { agent: 'query-optimizer', action: 'TERMINAL_EXEC', detail: 'run_command: node -e "db.exec(\'EXPLAIN QUERY PLAN SELECT ...\')"' },
      { agent: 'verifier', action: 'VERIFICATION', detail: 'PRAGMA integrity_check completed: 0 errors detected.' },
      { agent: 'Antigravity Lead', action: 'SYNTHESIS', detail: 'Database engine initialized with zero-overhead synchronous execution.' }
    ];
    artifactTitle = 'Relational SQLite WAL High-Throughput Engine';
    artifactContent = 'Optimized relational schema created with Write-Ahead Logging (WAL) and indexed foreign keys.';
    codeSnippet = `-- High Performance SQLite Index Tuning
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA synchronous = NORMAL;

CREATE INDEX IF NOT EXISTS idx_vibe_composite 
ON curriculum_modules(track_id, module_order ASC);`;
    mermaidDiagram = `erDiagram
  TRACK ||--o{ MODULE : contains
  TRACK {
    int id PK
    string slug
    string title
  }
  MODULE {
    int id PK
    int track_id FK
    string title
  }`;
  } else {
    // General Vibe Coding Simulation
    subagents = ['Antigravity Planner', 'research-agent', 'coder-agent', 'shell-verifier'];
    steps = [
      { agent: 'Antigravity Planner', action: 'INTENT_PARSING', detail: `Deconstructing vibe intent: "${prompt.substring(0, 50)}..."` },
      { agent: 'research-agent', action: 'SUBAGENT_INVOCATION', detail: 'invoke_subagent: Inspecting project environment, package trees, and style tokens.' },
      { agent: 'research-agent', action: 'WORKSPACE_READ', detail: 'view_file: Reading configuration manifest and verifying port allocations.' },
      { agent: 'coder-agent', action: 'SURGICAL_EDIT', detail: 'replace_file_content: Injecting reactive state and fluid UI components.' },
      { agent: 'shell-verifier', action: 'TERMINAL_EXEC', detail: 'run_command: Executing test runner in persistent sandbox terminal.' },
      { agent: 'Antigravity Planner', action: 'ARTIFACT_GEN', detail: 'Synthesis complete: High-fidelity artifact compiled.' }
    ];
    artifactTitle = 'Vibe Synthesis: ' + (prompt.substring(0, 30) || 'Autonomous Module');
    artifactContent = `Successfully orchestrated task with Antigravity multi-agent swarm. All tests passing and zero regressions found.`;
    codeSnippet = `// Antigravity High-Velocity Output
export async function executeVibeWorkflow(intent) {
  const agent = await Antigravity.lease({ model: 'gemini-3.8-flash' });
  const plan = await agent.plan(intent);
  const result = await agent.executeWithVerification(plan);
  return result.artifact;
}`;
    mermaidDiagram = `flowchart LR
  HumanIntent["Human Vibe Intent"] --> Planner["Antigravity Planner"]
  Planner --> Research["Subagent: Research"]
  Planner --> Coder["Subagent: Coder"]
  Coder --> Sandbox["Persistent Sandbox Terminal"]
  Sandbox --> Verification["Autonomous Verification Loop"]
  Verification --> Artifact["Polished Production Artifact"]`;
  }

  return {
    subagents,
    steps,
    artifactTitle,
    artifactContent,
    codeSnippet,
    mermaidDiagram,
    totalDuration: steps.length * 450
  };
}

module.exports = router;
