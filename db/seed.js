const { db, execute, queryOne } = require('./database');

console.log('⚡ Initializing and seeding Antigravity database...');

// Clear existing data to allow clean re-seeding if run multiple times
db.exec(`
  DELETE FROM curriculum_modules;
  DELETE FROM proficiency_tracks;
  DELETE FROM agent_capabilities;
  DELETE FROM vibe_prompts;
  DELETE FROM agent_missions;
  DELETE FROM community_vibes;
`);

// 1. SEED PROFICIENCY TRACKS
const tracks = [
  {
    slug: 'vibe-initiate',
    title: 'Track I: The Vibe Initiate',
    subtitle: 'Unshackle From Syntax — Think in Intent & Vision',
    level: 'Level 1: Novice',
    badge: '✨ Fluid Conjurer',
    accent_color: '#00f5ff',
    icon: 'sparkles',
    target_audience: 'Creators, junior devs, or seasoned engineers switching from rigid line-by-line coding to high-frequency conversational synthesis.',
    description: 'Learn the foundational philosophy of Vibe Coding with Google Antigravity. Discover how to craft holistic architectural prompts, establish conversational context, and partner with the agent to turn ideas into running code in minutes.',
    core_mindset: "Describe the 'what' and 'why'; allow Antigravity to architect the 'how', while you guide the creative vibe and UX.",
    estimated_hours: '3-4 Hours'
  },
  {
    slug: 'agent-commander',
    title: 'Track II: The Agent Commander',
    subtitle: 'Tactical Precision — Slash Commands, Tools & Workspaces',
    level: 'Level 2: Intermediate',
    badge: '⚡ Orbital Strategist',
    accent_color: '#a855f7',
    icon: 'terminal',
    target_audience: 'Engineers managing multi-file features, running tests, refactoring legacy modules, and orchestrating persistent terminal loops.',
    description: 'Master Antigravity 2.0 interface surfaces: slash commands (/plan, /goal, /schedule, /boost), persistent background terminal execution, surgical file diffs, and context pinning with @ mentions.',
    core_mindset: 'Treat Antigravity as your elite staff engineer. Provide structured constraints, review diffs critically, and steer complex state changes.',
    estimated_hours: '6-8 Hours'
  },
  {
    slug: 'orchestration-architect',
    title: 'Track III: The Orchestration Architect',
    subtitle: 'Parallel Agent Swarms & Custom Knowledge Skills',
    level: 'Level 3: Advanced',
    badge: '🔮 Swarm Conductor',
    accent_color: '#ec4899',
    icon: 'cpu',
    target_audience: 'Tech leads, systems architects, and AI engineers designing automated pipelines, custom skills, and MCP integrations.',
    description: 'Harness the power of concurrent subagent swarms via invoke_subagent. Delegate read-only codebase research to researcher agents, run isolated git worktree branches, and author custom domain skills (SKILL.md) and hooks.',
    core_mindset: 'You are no longer writing single routines; you are commanding a coordinated ensemble of specialized autonomous agents.',
    estimated_hours: '10-12 Hours'
  },
  {
    slug: 'singularity-operator',
    title: 'Track IV: The Singularity Operator',
    subtitle: 'Zero-Gravity Engineering — Autonomous Self-Healing Systems',
    level: 'Level 4: Mastery',
    badge: '🌌 Zero-G Vanguard',
    accent_color: '#10b981',
    icon: 'zap',
    target_audience: 'Pioneering developers building self-evolving architectures, headless Antigravity Python SDK systems, and 24/7 autonomous crons.',
    description: 'Achieve true Zero-Gravity developer flow. Orchestrate persistent background daemons, automated CI/CD verification sidecars, multi-modal synthesis, and headless programmatic agent leasing.',
    core_mindset: 'The friction of manual software maintenance evaporates. Software autonomously verifies, heals, and refactors against continuous human vision.',
    estimated_hours: '16+ Hours'
  }
];

const insertTrackStmt = db.prepare(`
  INSERT INTO proficiency_tracks (slug, title, subtitle, level, badge, accent_color, icon, target_audience, description, core_mindset, estimated_hours)
  VALUES (@slug, @title, @subtitle, @level, @badge, @accent_color, @icon, @target_audience, @description, @core_mindset, @estimated_hours)
`);

const trackMap = {};
for (const track of tracks) {
  const info = insertTrackStmt.run(track);
  trackMap[track.slug] = info.lastInsertRowid;
}

// 2. SEED CURRICULUM MODULES
const modules = [
  // TRACK 1 MODULES
  {
    track_id: trackMap['vibe-initiate'],
    module_order: 1,
    title: '1.1 The Anatomy of Vibe Coding',
    duration: '45 mins',
    summary: 'Understanding the shift from autocomplete copilot to full-fledged autonomous agentic pair-programming.',
    deep_dive: 'Vibe coding represents the natural evolution of programming. For 70 years, humans translated mental models into rigid syntax. Antigravity changes the paradigm: you define high-level product intent, user journeys, aesthetic palettes, and business rules. Antigravity plans the file hierarchy, handles package dependencies, writes database schemas, and executes tests in a sandboxed shell.',
    antigravity_tools: JSON.stringify(['write_to_file', 'view_file', 'chat_canvas']),
    prompt_recipe: 'Create a modern minimalist dashboard for a coffee subscription app. Use dark mode with warm amber accents (#ff9800), clean cards for monthly shipments, and simulated live delivery tracker.',
    code_example: `// Antigravity creates structured files with zero cognitive drag
const vibeConfig = {
  theme: 'deep-space',
  accent: '#00f5ff',
  mode: 'autonomous-pair-programming',
  flowState: 'uninterrupted'
};`,
    hands_on_challenge: 'Prompt Antigravity to scaffold a single-page portfolio with glassmorphism, responsive navigation, and a contact form with local state handling.',
    pro_tip: 'Focus your initial prompt on the user experience and visual aesthetic rather than specifying every CSS property. Let the agent propose the design.'
  },
  {
    track_id: trackMap['vibe-initiate'],
    module_order: 2,
    title: '1.2 Grounding Prompts with Real Context',
    duration: '50 mins',
    summary: 'How to avoid hallucinations by anchoring Antigravity to your actual project files and directories.',
    deep_dive: 'A vibe coder provides authentic grounding. Rather than saying "fix my database", an initiated vibe coder mentions the exact file or workspace context. Antigravity can inspect local files, verify packages in package.json, and check active ports directly in the terminal before touching a line of code.',
    antigravity_tools: JSON.stringify(['view_file', 'run_command']),
    prompt_recipe: 'Inspect my package.json and server.js. Identify the current port and middleware stack, then add a rate-limiting middleware that permits 100 requests per 15 minutes.',
    code_example: `// Accurate grounding ensures seamless integration
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, slow down the vibe!' }
});`,
    hands_on_challenge: 'Ask Antigravity to read a configuration file, explain any vulnerabilities or performance bottlenecks, and implement the safest patch.',
    pro_tip: 'Always let Antigravity inspect existing files before proposing major refactors. This guarantees seamless compatibility.'
  },
  {
    track_id: trackMap['vibe-initiate'],
    module_order: 3,
    title: '1.3 Rapid Prototyping & Iteration Cycles',
    duration: '60 mins',
    summary: 'Mastering rapid feedback loops: prompting changes, reviewing live previews, and micro-tuning UI details.',
    deep_dive: 'The heart of vibe coding is the tight feedback loop. When Antigravity generates code, you test it immediately in your browser or terminal. Instead of rewriting components manually, you describe the delta: "Make the cards more compact, add a subtle hover glow, and smooth the entry transition to 300ms cubic-bezier."',
    antigravity_tools: JSON.stringify(['replace_file_content', 'run_command']),
    prompt_recipe: 'Refactor the Hero section: replace the static background with an interactive HTML5 canvas particle field that responds to mouse velocity.',
    code_example: `.vibe-card {
  background: rgba(18, 24, 38, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.vibe-card:hover {
  border-color: var(--color-cyan);
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.25);
}`,
    hands_on_challenge: 'Iterate 3 times on a button component to give it a cyberpunk neon pulse animation and an active press spring effect.',
    pro_tip: 'Use descriptive perceptual adjectives: "tactile", "crisp", "fluid", "high-contrast", "subtle glow". Antigravity understands nuanced visual semantics.'
  },

  // TRACK 2 MODULES
  {
    track_id: trackMap['agent-commander'],
    module_order: 1,
    title: '2.1 Slash Commands Arsenal (/plan, /goal, /boost)',
    duration: '60 mins',
    summary: 'Unleash structured workflows: deep thinking with /plan, multi-perspective synthesis with /boost, and long-horizon tasks with /goal.',
    deep_dive: 'Slash commands trigger dedicated behavioral pipelines within Antigravity. Typing /plan forces the agent to generate an architectural artifact before executing modifications, preventing cascading regressions. /boost activates multi-perspective reasoning for complex algorithmic problems. /goal engages continuous self-correction until all test assertions pass.',
    antigravity_tools: JSON.stringify(['/plan', '/boost', '/goal', 'write_to_file']),
    prompt_recipe: '/plan We need to migrate our synchronous file storage to an S3-compatible object bucket with signed URLs and background compression.',
    code_example: `<!-- Antigravity Plan Artifact Preview -->
# Architectural Migration Plan
1. [x] Audit current multer diskStorage pipeline
2. [x] Create storage adapter interface
3. [ ] Implement S3Client with connection pooling
4. [ ] Add Sharp WebP streaming compression
5. [ ] Write unit & integration tests`,
    hands_on_challenge: 'Use /plan to map out a complete authentication flow with JWT tokens, refresh cookies, and bcrypt password hashing.',
    pro_tip: 'For complex tasks spanning 5+ files, always invoke /plan first to align on architecture before code execution begins.'
  },
  {
    track_id: trackMap['agent-commander'],
    module_order: 2,
    title: '2.2 Surgical Diff Management & replace_file_content',
    duration: '50 mins',
    summary: 'Controlling precise file edits without obliterating comments, existing logic, or formatting.',
    deep_dive: 'Unlike naive AI assistants that rewrite whole 2000-line files (losing critical comments and introducing syntax truncations), Antigravity utilizes surgical replacement tools like replace_file_content. It targets exact line numbers, validates exact target strings, and preserves untouched code block integrity.',
    antigravity_tools: JSON.stringify(['replace_file_content', 'view_file']),
    prompt_recipe: 'Locate the calculateInvoice function in billing.js and add support for tiered enterprise volume discounts over 10,000 units.',
    code_example: `// Antigravity surgically edits ONLY the target function
function calculateInvoice(units, tier) {
  const baseRate = getTierRate(tier);
  // NEW: Enterprise volume discount injection
  const discount = units > 10000 ? 0.15 : 0.0;
  return (units * baseRate) * (1 - discount);
}`,
    hands_on_challenge: 'Execute a surgical fix on a route handler to catch unhandled promise rejections without altering the rest of the controller.',
    pro_tip: 'Antigravity maintains documentation integrity and keeps your docstrings intact automatically.'
  },
  {
    track_id: trackMap['agent-commander'],
    module_order: 3,
    title: '2.3 Persistent Shells & Sandboxed Terminal Mastery',
    duration: '55 mins',
    summary: 'Managing background services, running test suites, and handling daemon tasks without blocking the main workflow.',
    deep_dive: 'Antigravity possesses a persistent terminal sandbox. Commands can run synchronously or be dispatched as background tasks with manage_task. It can start an Express dev server, verify curl responses in a second terminal, tail logs, and react when tests finish.',
    antigravity_tools: JSON.stringify(['run_command', 'manage_task']),
    prompt_recipe: 'Start the test runner in watch mode in the background. If any test in tests/auth.spec.js fails, notify me with the stack trace.',
    code_example: `$ agy run "npm test" --background
[Task task-9481 started in background]
Antigravity monitoring terminal output...
✓ 18 tests passed in 412ms`,
    hands_on_challenge: 'Spawn a background mock API server and query it with an HTTP client tool to verify JSON serialization.',
    pro_tip: 'Never run arbitrary sleep loops; use Antigravity schedule or background task management for clean, non-blocking asynchronous execution.'
  },

  // TRACK 3 MODULES
  {
    track_id: trackMap['orchestration-architect'],
    module_order: 1,
    title: '3.1 Subagent Swarms: invoke_subagent in Action',
    duration: '75 mins',
    summary: 'Dividing complex engineering problems across specialized subagent personas running in isolated branches.',
    deep_dive: 'When projects scale, a single conversational context gets overwhelmed. Antigravity solves this with subagents! You can spawn a read-only research subagent to explore thousands of lines of documentation or codebases, a coder subagent working in an isolated git worktree branch, and a QA subagent writing automated test suites.',
    antigravity_tools: JSON.stringify(['invoke_subagent', 'send_message', 'manage_subagents']),
    prompt_recipe: 'Spawn a research subagent to analyze our GraphQL schema, and concurrently spawn a coder subagent to prepare the REST fallback routes.',
    code_example: `// Multi-agent orchestration definition
{
  "Subagents": [
    {
      "TypeName": "research",
      "Role": "Security Auditor",
      "Prompt": "Audit all Express routes in /routes for missing auth middleware"
    },
    {
      "TypeName": "self",
      "Role": "Schema Refactorer",
      "Workspace": "branch",
      "Prompt": "Refactor database migrations to add UUID v4 primary keys"
    }
  ]
}`,
    hands_on_challenge: 'Invoke a research subagent to audit third-party dependency vulnerabilities and output a structured Markdown report.',
    pro_tip: 'Use Workspace: "branch" or "share" for subagents to test risky refactors without polluting your main branch.'
  },
  {
    track_id: trackMap['orchestration-architect'],
    module_order: 2,
    title: '3.2 Authoring Custom Skills (SKILL.md) & Rules',
    duration: '70 mins',
    summary: 'Codifying your engineering standards into reusable, auto-activated domain intelligence packages.',
    deep_dive: 'Skills allow you to impart permanent institutional knowledge into Antigravity. A skill contains a SKILL.md with YAML frontmatter, execution instructions, custom helper scripts, and offline reference guides. Whenever a relevant task arises, Antigravity loads the skill automatically into its active working memory.',
    antigravity_tools: JSON.stringify(['write_to_file', 'view_file', 'skills_engine']),
    prompt_recipe: 'Create an internal skill named "postgres-optimizer" that teaches Antigravity our indexing conventions, EXPLAIN ANALYZE rules, and query guidelines.',
    code_example: `---
name: postgres-optimizer
description: Guides schema design, EXPLAIN ANALYZE interpretation, and index tuning.
---
# PostgreSQL Optimization Guide
When optimizing queries:
1. Always verify index hit rates using pg_stat_user_indexes.
2. Recommend composite B-Tree indexes for multi-column equality queries.`,
    hands_on_challenge: 'Create a custom skill for your team coding style guide, including ESLint rules and PR checklist templates.',
    pro_tip: 'Organize skills with references/ and scripts/ directories for complex domain workflows.'
  },
  {
    track_id: trackMap['orchestration-architect'],
    module_order: 3,
    title: '3.3 Model Context Protocol (MCP) Server Integration',
    duration: '80 mins',
    summary: 'Connecting Antigravity to external databases, internal APIs, GitHub, Slack, and cloud infrastructure.',
    deep_dive: 'Model Context Protocol (MCP) turns Antigravity into an omni-connected system hub. By declaring MCP servers in your settings.json, Antigravity can query production read-replicas, inspect cloud Kubernetes clusters, post Slack deployment updates, and pull live Figma design tokens directly into UI code.',
    antigravity_tools: JSON.stringify(['mcp_client', 'define_subagent']),
    prompt_recipe: 'Query our local PostgreSQL MCP server for the latest 10 failed payments and generate a diagnostic report.',
    code_example: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/prod_db"]
    }
  }
}`,
    hands_on_challenge: 'Configure a filesystem or database MCP server and prompt Antigravity to perform a live cross-system sync.',
    pro_tip: 'MCP servers expose specialized tools directly to Antigravity without requiring custom code modification.'
  },

  // TRACK 4 MODULES
  {
    track_id: trackMap['singularity-operator'],
    module_order: 1,
    title: '4.1 Autonomous Self-Healing Pipelines & /boost Verification',
    duration: '90 mins',
    summary: 'Architecting closed-loop workflows where Antigravity detects errors, diagnoses root causes, and validates fixes automatically.',
    deep_dive: 'In true Zero-Gravity engineering, humans don’t debug stack traces. You configure an autonomous self-healing loop: when a build fails or an integration test errors out, Antigravity reads the stderr trace, inspects the offending source line, generates a fix, rebuilds, and verifies until all checks glow green.',
    antigravity_tools: JSON.stringify(['run_command', 'replace_file_content', '/boost']),
    prompt_recipe: 'Run our integration test suite. If any test fails, analyze the failure reason, patch the bug, re-run tests, and repeat until 100% pass.',
    code_example: `// Self-healing execution cycle
1. [System] Execute 'npm run test:e2e' -> FAILED (HTTP 401 on /api/user)
2. [Antigravity] View file 'middleware/auth.js' -> Found expired token verification bug
3. [Antigravity] replace_file_content with clock tolerance parameter
4. [System] Re-execute 'npm run test:e2e' -> SUCCESS (24/24 passing)`,
    hands_on_challenge: 'Build a script that injects a deliberate bug into a test file, then unleash Antigravity to detect, repair, and verify it autonomously.',
    pro_tip: 'Pair self-healing loops with strict git worktrees so you can inspect the full change delta before merging.'
  },
  {
    track_id: trackMap['singularity-operator'],
    module_order: 2,
    title: '4.2 Continuous Cron Agents & Asynchronous Reactive Wakeups',
    duration: '85 mins',
    summary: 'Deploying continuous agent sidecars that monitor logs, optimize performance, and alert you only when necessary.',
    deep_dive: 'Antigravity includes a native schedule engine supporting one-shot timers and recurring 5-field cron jobs. Instead of running a polling loop that burns compute, Antigravity sleeps until the cron triggers or a high-priority system event arrives. The agent wakes up, executes the audit, and writes a persistent artifact.',
    antigravity_tools: JSON.stringify(['schedule', 'manage_task']),
    prompt_recipe: 'Set a recurring cron job every 4 hours to inspect server error logs, group recurring anomalies, and update the incident summary markdown.',
    code_example: `// Schedule recurring autonomous agent
schedule({
  CronExpression: "0 */4 * * *",
  Prompt: "Inspect /logs/app.log for status >= 500. Summarize incident clusters.",
  IsDaemon: true
});`,
    hands_on_challenge: 'Set a 30-minute recurring audit job that checks git branch freshness and cleans up merged feature branches.',
    pro_tip: 'Use IsDaemon: true when you want a background cron to persist even after your primary conversational session ends.'
  },
  {
    track_id: trackMap['singularity-operator'],
    module_order: 3,
    title: '4.3 Headless Antigravity Python SDK & Enterprise Swarms',
    duration: '100 mins',
    summary: 'Programmatically leasing, spawning, and orchestrating Antigravity agents from custom backend services.',
    deep_dive: 'The Antigravity Python SDK enables programmatic agent deployment. You can build internal developer platforms where every pull request automatically leases an Antigravity agent instance, runs comprehensive security reviews, suggests refactors, and posts interactive PR comments.',
    antigravity_tools: JSON.stringify(['sdk_orchestration', 'agent_leasing']),
    prompt_recipe: 'Generate a Python script using antigravity-sdk to instantiate an agent session, send a repository URL, and stream back the refactoring plan.',
    code_example: `from antigravity_sdk import AgentSession, Workspace

async def review_pull_request(repo_path: str, pr_diff: str):
    async with AgentSession(model="gemini-3.8-flash") as session:
        await session.mount_workspace(Workspace(path=repo_path))
        result = await session.execute(
            prompt=f"Perform deep architectural review on this diff:\\n{pr_diff}",
            tools=["view_file", "run_command"]
        )
        return result.artifact_markdown`,
    hands_on_challenge: 'Create an automated webhook listener that triggers an Antigravity agent whenever a new issue is labeled "agent-fix".',
    pro_tip: 'Leverage the Python SDK for serverless agent workers running in Google Cloud Run or Kubernetes.'
  }
];

const insertModuleStmt = db.prepare(`
  INSERT INTO curriculum_modules (track_id, module_order, title, duration, summary, deep_dive, antigravity_tools, prompt_recipe, code_example, hands_on_challenge, pro_tip)
  VALUES (@track_id, @module_order, @title, @duration, @summary, @deep_dive, @antigravity_tools, @prompt_recipe, @code_example, @hands_on_challenge, @pro_tip)
`);

for (const mod of modules) {
  insertModuleStmt.run(mod);
}

// 3. SEED AGENT CAPABILITIES
const capabilities = [
  {
    category: 'Core Engine',
    name: 'Gemini DeepMind Reasoning Core',
    icon: 'brain',
    tagline: 'High-order planning, deep semantic code comprehension, and long-horizon vision.',
    deep_explanation: 'Powered by Google DeepMind’s latest multimodal frontier models (e.g. Gemini 3.8 Flash & Pro), Antigravity reasons across hundreds of thousands of lines of context, preserving architectural coherence throughout complex software mutations.',
    architecture_layer: 'Cerebral Cortex (Planner & Reasoning Engine)',
    live_example: 'Can analyze an entire multi-package monorepo and map data flow between frontend React components, REST endpoints, and PostgreSQL schemas.'
  },
  {
    category: 'Orchestration',
    name: 'Subagent Swarm Dispatcher',
    icon: 'users',
    tagline: 'Spawn parallel autonomous agents with dedicated roles, models, and isolated worktrees.',
    deep_explanation: 'Antigravity breaks down monolithic tasks into specialized subagents. A research subagent can read hundreds of documentation pages while a coder subagent implements features in an isolated branch workspace without context cross-contamination.',
    architecture_layer: 'Nervous System (Swarm Coordinator)',
    live_example: 'invoke_subagent([{ TypeName: "research", Role: "Docs Researcher" }, { TypeName: "self", Role: "Backend Builder" }])'
  },
  {
    category: 'Tooling',
    name: 'Surgical Diff & File Engine',
    icon: 'scissors',
    tagline: 'Line-precise code editing with absolute zero truncation and comment preservation.',
    deep_explanation: 'Unlike naive LLMs that rewrite entire files from scratch (risking data loss and syntax breakage), Antigravity uses replace_file_content to swap exact slices of code, verifying line numbers and context matches beforehand.',
    architecture_layer: 'Motor Cortex (Hands & Precision Manipulators)',
    live_example: 'Edits 4 lines in a 3,000 line database controller with 100% precision and zero side-effects.'
  },
  {
    category: 'Execution',
    name: 'Sandboxed Persistent Terminal',
    icon: 'terminal',
    tagline: 'Real bash environment with background tasks, persistent variables, and reactive wakeup.',
    deep_explanation: 'Antigravity runs real shell commands in a managed sandbox. It can start servers, execute migrations, monitor test suites, and receive asynchronous completion notifications without needing polling loops.',
    architecture_layer: 'Kinetic System (Shell Execution & Environment)',
    live_example: 'Runs npm test in background, alerts you immediately when tests complete, and pulls error logs automatically.'
  },
  {
    category: 'Living Output',
    name: 'Interactive Artifact Engine',
    icon: 'file-text',
    tagline: 'Dynamic Markdown, Mermaid diagrams, interactive plans, and visual carousels.',
    deep_explanation: 'Antigravity doesn’t just dump raw text into chat. It produces rich artifacts—architectural plans, sequence diagrams, and before/after diff carousels—saved persistently to your project’s brain storage.',
    architecture_layer: 'Display Matrix (Visual Perception & Artifacts)',
    live_example: 'Renders full Mermaid flowcharts and interactive UI prototypes directly in the sidebar canvas.'
  },
  {
    category: 'Customization',
    name: 'Skills, Rules & MCP Protocol',
    icon: 'sliders',
    tagline: 'Extensible domain intelligence, procedural scripts, and external system connectors.',
    deep_explanation: 'Equip Antigravity with custom SKILL.md packages, project-specific rules, pre-commit hooks, and Model Context Protocol (MCP) servers that connect to local databases, GitHub, or internal company services.',
    architecture_layer: 'Immunological & Adaptation Layer (Custom Skills)',
    live_example: 'Loads a company-specific kubernetes-deployment skill whenever K8s manifests are mentioned.'
  }
];

const insertCapStmt = db.prepare(`
  INSERT INTO agent_capabilities (category, name, icon, tagline, deep_explanation, architecture_layer, live_example)
  VALUES (@category, @name, @icon, @tagline, @deep_explanation, @architecture_layer, @live_example)
`);

for (const cap of capabilities) {
  insertCapStmt.run(cap);
}

// 4. SEED VIBE PROMPTS
const prompts = [
  {
    title: 'Full-Stack Modern SQLite Dashboard with Glassmorphism',
    category: 'Fullstack',
    target_level: 'Novice',
    author_name: 'Antigravity Architect',
    author_avatar: '⚡',
    prompt_content: `Create a responsive single-page web app for tracking IoT sensor nodes.
Tech stack: Express backend with built-in node:sqlite, and a sleek dark-mode glassmorphism frontend.
Requirements:
1. SQLite database with sensors (id, name, location, battery, temp, status, last_ping)
2. REST API endpoints: GET /api/sensors, POST /api/sensors, POST /api/sensors/:id/ping
3. Frontend with live status cards, filter by location, simulated real-time updates every 3 seconds, and a sleek neon gauge for temperature.`,
    system_context: 'Focus on zero external dependencies where possible. Ensure smooth CSS animations with backdrop-filter.',
    tags: JSON.stringify(['SQLite', 'Express', 'Glassmorphism', 'IoT', 'Fullstack']),
    upvotes: 342,
    featured: 1
  },
  {
    title: 'Subagent Parallel Security & Performance Audit Swarm',
    category: 'Agent Swarm',
    target_level: 'Advanced',
    author_name: 'DeepMind Swarm Lead',
    author_avatar: '🌌',
    prompt_content: `Deploy a 3-agent orchestration swarm to audit our codebase:
1. Agent 'SecAuditor' (research): Scan all API route handlers for missing JWT authorization, unescaped user inputs, and CORS misconfigurations.
2. Agent 'PerfProfiler' (research): Inspect database query routines for N+1 queries, unindexed WHERE clauses, and memory leaks.
3. Agent 'Synthesizer' (self): Collate findings from both subagents and generate an actionable remediation plan artifact with Mermaid sequence diagrams.`,
    system_context: 'Subagents must operate concurrently in read-only mode to prevent side-effects during audit.',
    tags: JSON.stringify(['Subagents', 'Security', 'Performance', 'Audit', 'Mermaid']),
    upvotes: 518,
    featured: 1
  },
  {
    title: 'Zero-Downtime Database Migration & Schema Seeder',
    category: 'Database & API',
    target_level: 'Intermediate',
    author_name: 'Data Gravity Master',
    author_avatar: '💾',
    prompt_content: `Write a resilient database migration script that converts our user_preferences table from JSON blob storage into structured relational columns with default constraints.
Include:
1. Transactional rollback if any record fails validation.
2. Automated backup snapshot before applying alterations.
3. Comprehensive seed routine with 50 realistic test profiles.
4. CLI verification command that runs in the persistent terminal.`,
    system_context: 'Enforce PRAGMA foreign_keys = ON and WAL mode for maximum concurrent read performance.',
    tags: JSON.stringify(['SQL', 'Migrations', 'SQLite', 'Transactions', 'Reliability']),
    upvotes: 289,
    featured: 0
  },
  {
    title: 'Autonomous Self-Healing Test Suite Runner with /boost',
    category: 'Debugging & Refactoring',
    target_level: 'Mastery',
    author_name: 'Singularity Pilot',
    author_avatar: '🚀',
    prompt_content: `Run the entire Jest integration test suite in our repository.
If any test suite fails:
1. Capture the failure diff and stack trace.
2. Use /boost multi-perspective reasoning to identify the root cause without touching test assertions.
3. Apply surgical replace_file_content patches to the source implementation.
4. Re-run tests until all 42 tests pass with 100% assertion success.
5. Create an artifact summarizing what caused the regressions and how they were resolved.`,
    system_context: 'Preserve all existing comment blocks and API backward compatibility.',
    tags: JSON.stringify(['Self-Healing', 'Testing', '/boost', 'Refactoring', 'Automation']),
    upvotes: 624,
    featured: 1
  },
  {
    title: 'Interactive 3D WebGL / Canvas Gravity Simulation',
    category: 'Frontend Magic',
    target_level: 'Novice',
    author_name: 'Vibe Creator',
    author_avatar: '🎨',
    prompt_content: `Build an interactive canvas component where 150 glowing particles simulate zero-gravity physics.
Features:
- Particles float with Brownian motion and subtle momentum.
- Mouse movement creates a localized gravitational well (particles orbit the cursor).
- Clicking the screen triggers an "Anti-Gravity Inversion" blast, repelling particles with shockwave ripple.
- Neon color palette: Cyan (#00f5ff) and Purple (#a855f7) with additive blending.`,
    system_context: 'Must run at 60 FPS using requestAnimationFrame and minimal CPU footprint.',
    tags: JSON.stringify(['Canvas', 'Physics', 'Interactive', 'Visuals', 'Animation']),
    upvotes: 412,
    featured: 1
  },
  {
    title: 'Enterprise Model Context Protocol (MCP) Bridge',
    category: 'Agent Swarm',
    target_level: 'Advanced',
    author_name: 'Protocol Architect',
    author_avatar: '🔌',
    prompt_content: `Configure an MCP server bridge that allows Antigravity to interact with our private Jira and GitHub Enterprise instances.
Requirements:
1. Define tool schemas for searching tickets, creating pull requests, and inspecting branch CI logs.
2. Implement token authentication with automatic credential rotation.
3. Demonstrate a sample prompt where Antigravity reads a ticket and drafts a corresponding pull request.`,
    system_context: 'Adhere to official Model Context Protocol 2024 spec with JSON-RPC transport.',
    tags: JSON.stringify(['MCP', 'Enterprise', 'GitHub', 'Automation', 'Integration']),
    upvotes: 375,
    featured: 0
  }
];

const insertPromptStmt = db.prepare(`
  INSERT INTO vibe_prompts (title, category, target_level, author_name, author_avatar, prompt_content, system_context, tags, upvotes, featured)
  VALUES (@title, @category, @target_level, @author_name, @author_avatar, @prompt_content, @system_context, @tags, @upvotes, @featured)
`);

for (const p of prompts) {
  insertPromptStmt.run(p);
}

// 5. SEED AGENT MISSIONS (Real Trace Simulations)
const missions = [
  {
    mission_code: 'MISSION-ZERO-G',
    title: 'Architecting a Real-Time Distributed Cache with SQLite & Redis',
    category: 'Systems Architecture',
    initial_prompt: 'Create a hybrid cache layer that stores hot keys in memory and writes cold keys to SQLite WAL storage with automatic LRU eviction.',
    subagents: JSON.stringify(['Lead Planner', 'research-cache', 'coder-sqlite', 'verifier-qa']),
    trace_steps: JSON.stringify([
      { time: '0.0s', step: 'PLANNER', detail: 'Deconstructing problem: Dual-tier caching, LRU eviction algorithm, and SQLite WAL sync.' },
      { time: '0.4s', step: 'SUBAGENT_SPAWN', detail: 'Dispatched subagent research-cache to benchmark Node memory structures.' },
      { time: '0.9s', step: 'TOOL_CALL', detail: 'run_command: npm list redis ioredis --depth=0' },
      { time: '1.5s', step: 'CODE_GEN', detail: 'Created cache/lruStorage.js with doubly-linked list & hashmap mapping.' },
      { time: '2.1s', step: 'TOOL_CALL', detail: 'write_to_file: cache/sqliteAdapter.js with WAL PRAGMA tuning.' },
      { time: '2.8s', step: 'VERIFICATION', detail: 'Ran 10,000 synthetic operations: 0.12ms p99 read latency achieved.' }
    ]),
    final_artifact_title: 'Zero-Gravity Cache Architecture Blueprint',
    final_artifact_content: 'Dual-tier caching architecture successfully deployed. 100% hit rate on hot cache, zero memory leaks, and seamless SQLite persistence.',
    total_duration_ms: 2800,
    run_count: 142
  },
  {
    mission_code: 'MISSION-NEURAL-WEB',
    title: 'Building a Cyberpunk Audio Synthesizer with Web Audio API',
    category: 'Creative Engineering',
    initial_prompt: 'Synthesize procedural retro-futuristic sound effects (beeps, whooshes, chimes, ambient drone) using pure Web Audio API without audio files.',
    subagents: JSON.stringify(['Lead Planner', 'audio-engineer', 'ux-designer']),
    trace_steps: JSON.stringify([
      { time: '0.0s', step: 'PLANNER', detail: 'Initializing AudioContext graph: Oscillators, GainNodes, BiquadFilter, and Convolver.' },
      { time: '0.5s', step: 'CODE_GEN', detail: 'Crafted AudioEngine class with procedural pulse, laser whoosh, and atmospheric chord pad.' },
      { time: '1.2s', step: 'TOOL_CALL', detail: 'write_to_file: public/js/audio.js with zero external MP3 dependencies.' },
      { time: '1.8s', step: 'VERIFICATION', detail: 'Tested audio envelope decay curves; latency verified under 5ms.' }
    ]),
    final_artifact_title: 'Cyberpunk Procedural Audio Module',
    final_artifact_content: 'Zero-dependency procedural sound system online. Generates high-fidelity cyberpunk cyber acoustics on demand.',
    total_duration_ms: 1800,
    run_count: 98
  }
];

const insertMissionStmt = db.prepare(`
  INSERT INTO agent_missions (mission_code, title, category, initial_prompt, subagents, trace_steps, final_artifact_title, final_artifact_content, total_duration_ms, run_count)
  VALUES (@mission_code, @title, @category, @initial_prompt, @subagents, @trace_steps, @final_artifact_title, @final_artifact_content, @total_duration_ms, @run_count)
`);

for (const m of missions) {
  insertMissionStmt.run(m);
}

// 6. SEED COMMUNITY VIBES
const vibes = [
  {
    author_name: 'Elena Rostova',
    handle: '@elena_dev',
    role: 'Principal Systems Architect',
    avatar_bg: 'linear-gradient(135deg, #00f5ff, #7928ca)',
    vibe_text: 'Vibe coding with Antigravity completely changed my brain chemistry. I sketched a multi-agent Kubernetes orchestrator during lunch, and had a running prototype with full test coverage before coffee was cold.',
    built_project: 'Autonomous K8s Mesh Operator',
    stars_count: 249
  },
  {
    author_name: 'Marcus Chen',
    handle: '@marcus_vibe',
    role: 'Founder & Fullstack Hacker',
    avatar_bg: 'linear-gradient(135deg, #ec4899, #f59e0b)',
    vibe_text: 'The difference between other copilots and Antigravity is GRAVITY. Antigravity doesn’t guess or drop broken snippets. It plans with /plan, edits surgically with replace_file_content, and tests in the persistent shell.',
    built_project: 'HyperSound Synthesizer SaaS',
    stars_count: 187
  },
  {
    author_name: 'Aria Thorne',
    handle: '@ariathorne',
    role: 'AI Research Engineer',
    avatar_bg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    vibe_text: 'Spawning subagents with invoke_subagent feels like having three senior DeepMind engineers sitting right next to you. One reads the docs, one writes the code, one runs the tests. Pure flow state.',
    built_project: 'Vector Graph Neural Navigator',
    stars_count: 312
  }
];

const insertVibeStmt = db.prepare(`
  INSERT INTO community_vibes (author_name, handle, role, avatar_bg, vibe_text, built_project, stars_count)
  VALUES (@author_name, @handle, @role, @avatar_bg, @vibe_text, @built_project, @stars_count)
`);

for (const v of vibes) {
  insertVibeStmt.run(v);
}

console.log('✅ Database seeded successfully!');
console.log('Stats:', {
  tracks: queryOne('SELECT COUNT(*) as c FROM proficiency_tracks').c,
  modules: queryOne('SELECT COUNT(*) as c FROM curriculum_modules').c,
  capabilities: queryOne('SELECT COUNT(*) as c FROM agent_capabilities').c,
  prompts: queryOne('SELECT COUNT(*) as c FROM vibe_prompts').c,
  missions: queryOne('SELECT COUNT(*) as c FROM agent_missions').c,
  vibes: queryOne('SELECT COUNT(*) as c FROM community_vibes').c
});
