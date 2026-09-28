// Antigravity Static Fallback Data for GitHub Pages & Offline Deployment

window.ANTIGRAVITY_STATIC_DATA = {
  tracks: [
    {
      id: 1,
      slug: 'vibe-initiate',
      title: 'Track I: The Vibe Initiate',
      subtitle: 'Unshackle From Syntax — Think in Intent & Vision',
      level: 'Level 1: Novice',
      badge: '✨ Fluid Conjurer',
      accent_color: '#00f5ff',
      icon: 'sparkles',
      description: 'Learn the foundational philosophy of Vibe Coding with Google Antigravity. Discover how to craft holistic architectural prompts, establish conversational context, and partner with the agent to turn ideas into running code in minutes.',
      core_mindset: "Describe the 'what' and 'why'; allow Antigravity to architect the 'how', while you guide the creative vibe and UX.",
      estimated_hours: '3-4 Hours',
      modules: [
        {
          id: 1,
          title: '1.1 The Anatomy of Vibe Coding',
          duration: '45 mins',
          summary: 'Understanding the shift from autocomplete copilot to full-fledged autonomous agentic pair-programming.',
          deep_dive: 'Vibe coding represents the natural evolution of programming. For 70 years, humans translated mental models into rigid syntax. Antigravity changes the paradigm: you define high-level product intent, user journeys, aesthetic palettes, and business rules. Antigravity plans the file hierarchy, handles package dependencies, writes database schemas, and executes tests in a sandboxed shell.',
          antigravity_tools: ['write_to_file', 'view_file', 'chat_canvas'],
          prompt_recipe: 'Create a modern minimalist dashboard for a coffee subscription app. Use dark mode with warm amber accents (#ff9800), clean cards for monthly shipments, and simulated live delivery tracker.',
          code_example: `const vibeConfig = {\n  theme: 'deep-space',\n  accent: '#00f5ff',\n  mode: 'autonomous-pair-programming',\n  flowState: 'uninterrupted'\n};`,
          hands_on_challenge: 'Prompt Antigravity to scaffold a single-page portfolio with glassmorphism, responsive navigation, and a contact form with local state handling.',
          pro_tip: 'Focus your initial prompt on the user experience and visual aesthetic rather than specifying every CSS property. Let the agent propose the design.'
        },
        {
          id: 2,
          title: '1.2 Grounding Prompts with Real Context',
          duration: '50 mins',
          summary: 'How to avoid hallucinations by anchoring Antigravity to your actual project files and directories.',
          deep_dive: 'A vibe coder provides authentic grounding. Rather than saying "fix my database", an initiated vibe coder mentions the exact file or workspace context. Antigravity can inspect local files, verify packages in package.json, and check active ports directly in the terminal before touching a line of code.',
          antigravity_tools: ['view_file', 'run_command'],
          prompt_recipe: 'Inspect my package.json and server.js. Identify the current port and middleware stack, then add a rate-limiting middleware that permits 100 requests per 15 minutes.',
          code_example: `const rateLimit = require('express-rate-limit');\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});`,
          hands_on_challenge: 'Ask Antigravity to read a configuration file, explain any vulnerabilities or performance bottlenecks, and implement the safest patch.',
          pro_tip: 'Always let Antigravity inspect existing files before proposing major refactors.'
        },
        {
          id: 3,
          title: '1.3 Rapid Prototyping & Iteration Cycles',
          duration: '60 mins',
          summary: 'Mastering rapid feedback loops: prompting changes, reviewing live previews, and micro-tuning UI details.',
          deep_dive: 'The heart of vibe coding is the tight feedback loop. When Antigravity generates code, you test it immediately in your browser or terminal. Instead of rewriting components manually, you describe the delta: "Make the cards more compact, add a subtle hover glow, and smooth the entry transition to 300ms cubic-bezier."',
          antigravity_tools: ['replace_file_content', 'run_command'],
          prompt_recipe: 'Refactor the Hero section: replace the static background with an interactive HTML5 canvas particle field that responds to mouse velocity.',
          code_example: `.vibe-card {\n  background: rgba(18, 24, 38, 0.7);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n}`,
          hands_on_challenge: 'Iterate 3 times on a button component to give it a cyberpunk neon pulse animation and an active press spring effect.',
          pro_tip: 'Use descriptive perceptual adjectives: "tactile", "crisp", "fluid", "high-contrast".'
        }
      ]
    },
    {
      id: 2,
      slug: 'agent-commander',
      title: 'Track II: The Agent Commander',
      subtitle: 'Tactical Precision — Slash Commands, Tools & Workspaces',
      level: 'Level 2: Intermediate',
      badge: '⚡ Orbital Strategist',
      accent_color: '#a855f7',
      icon: 'terminal',
      description: 'Master Antigravity 2.0 interface surfaces: slash commands (/plan, /goal, /schedule, /boost), persistent background terminal execution, surgical file diffs, and context pinning with @ mentions.',
      core_mindset: 'Treat Antigravity as your elite staff engineer. Provide structured constraints, review diffs critically, and steer complex state changes.',
      estimated_hours: '6-8 Hours',
      modules: [
        {
          id: 4,
          title: '2.1 Slash Commands Arsenal (/plan, /goal, /boost)',
          duration: '60 mins',
          summary: 'Unleash structured workflows: deep thinking with /plan, multi-perspective synthesis with /boost, and long-horizon tasks with /goal.',
          deep_dive: 'Slash commands trigger dedicated behavioral pipelines within Antigravity. Typing /plan forces the agent to generate an architectural artifact before executing modifications, preventing cascading regressions. /boost activates multi-perspective reasoning for complex algorithmic problems. /goal engages continuous self-correction until all test assertions pass.',
          antigravity_tools: ['/plan', '/boost', '/goal', 'write_to_file'],
          prompt_recipe: '/plan We need to migrate our synchronous file storage to an S3-compatible object bucket with signed URLs and background compression.',
          code_example: `# Architectural Migration Plan\n1. [x] Audit current multer diskStorage pipeline\n2. [ ] Implement S3Client with connection pooling`,
          hands_on_challenge: 'Use /plan to map out a complete authentication flow with JWT tokens, refresh cookies, and bcrypt password hashing.',
          pro_tip: 'For complex tasks spanning 5+ files, always invoke /plan first to align on architecture.'
        },
        {
          id: 5,
          title: '2.2 Surgical Diff Management & replace_file_content',
          duration: '50 mins',
          summary: 'Controlling precise file edits without obliterating comments, existing logic, or formatting.',
          deep_dive: 'Unlike naive AI assistants that rewrite whole 2000-line files, Antigravity utilizes surgical replacement tools like replace_file_content. It targets exact line numbers, validates exact target strings, and preserves untouched code block integrity.',
          antigravity_tools: ['replace_file_content', 'view_file'],
          prompt_recipe: 'Locate the calculateInvoice function in billing.js and add support for tiered enterprise volume discounts over 10,000 units.',
          code_example: `function calculateInvoice(units, tier) {\n  const baseRate = getTierRate(tier);\n  const discount = units > 10000 ? 0.15 : 0.0;\n  return (units * baseRate) * (1 - discount);\n}`,
          hands_on_challenge: 'Execute a surgical fix on a route handler to catch unhandled promise rejections without altering the rest of the controller.',
          pro_tip: 'Antigravity maintains documentation integrity and keeps your docstrings intact automatically.'
        }
      ]
    },
    {
      id: 3,
      slug: 'orchestration-architect',
      title: 'Track III: The Orchestration Architect',
      subtitle: 'Parallel Agent Swarms & Custom Knowledge Skills',
      level: 'Level 3: Advanced',
      badge: '🔮 Swarm Conductor',
      accent_color: '#ec4899',
      icon: 'cpu',
      description: 'Harness the power of concurrent subagent swarms via invoke_subagent. Delegate read-only codebase research to researcher agents, run isolated git worktree branches, and author custom domain skills (SKILL.md) and hooks.',
      core_mindset: 'You are no longer writing single routines; you are commanding a coordinated ensemble of specialized autonomous agents.',
      estimated_hours: '10-12 Hours',
      modules: [
        {
          id: 6,
          title: '3.1 Subagent Swarms: invoke_subagent in Action',
          duration: '75 mins',
          summary: 'Dividing complex engineering problems across specialized subagent personas running in isolated branches.',
          deep_dive: 'When projects scale, a single conversational context gets overwhelmed. Antigravity solves this with subagents! You can spawn a read-only research subagent to explore thousands of lines of documentation or codebases, a coder subagent working in an isolated git worktree branch, and a QA subagent writing automated test suites.',
          antigravity_tools: ['invoke_subagent', 'send_message', 'manage_subagents'],
          prompt_recipe: 'Spawn a research subagent to analyze our GraphQL schema, and concurrently spawn a coder subagent to prepare the REST fallback routes.',
          code_example: `{\n  "Subagents": [\n    { "TypeName": "research", "Role": "Security Auditor" },\n    { "TypeName": "self", "Role": "Schema Refactorer", "Workspace": "branch" }\n  ]\n}`,
          hands_on_challenge: 'Invoke a research subagent to audit third-party dependency vulnerabilities and output a structured Markdown report.',
          pro_tip: 'Use Workspace: "branch" or "share" for subagents to test risky refactors.'
        }
      ]
    },
    {
      id: 4,
      slug: 'singularity-operator',
      title: 'Track IV: The Singularity Operator',
      subtitle: 'Zero-Gravity Engineering — Autonomous Self-Healing Systems',
      level: 'Level 4: Mastery',
      badge: '🌌 Zero-G Vanguard',
      accent_color: '#10b981',
      icon: 'zap',
      description: 'Achieve true Zero-Gravity developer flow. Orchestrate persistent background daemons, automated CI/CD verification sidecars, multi-modal synthesis, and headless programmatic agent leasing.',
      core_mindset: 'The friction of manual software maintenance evaporates. Software autonomously verifies, heals, and refactors against continuous human vision.',
      estimated_hours: '16+ Hours',
      modules: [
        {
          id: 7,
          title: '4.1 Autonomous Self-Healing Pipelines & /boost Verification',
          duration: '90 mins',
          summary: 'Architecting closed-loop workflows where Antigravity detects errors, diagnoses root causes, and validates fixes automatically.',
          deep_dive: 'In true Zero-Gravity engineering, humans don’t debug stack traces. You configure an autonomous self-healing loop: when a build fails or an integration test errors out, Antigravity reads the stderr trace, inspects the offending source line, generates a fix, rebuilds, and verifies until all checks glow green.',
          antigravity_tools: ['run_command', 'replace_file_content', '/boost'],
          prompt_recipe: 'Run our integration test suite. If any test fails, analyze the failure reason, patch the bug, re-run tests, and repeat until 100% pass.',
          code_example: `// Self-healing execution cycle\n1. Run tests -> FAILED\n2. Inspect stack trace\n3. Apply surgical patch\n4. Re-run tests -> SUCCESS`,
          hands_on_challenge: 'Build a script that injects a deliberate bug into a test file, then unleash Antigravity to detect, repair, and verify it autonomously.',
          pro_tip: 'Pair self-healing loops with strict git worktrees.'
        }
      ]
    }
  ],
  prompts: [
    {
      id: 1,
      title: 'Full-Stack Modern SQLite Dashboard with Glassmorphism',
      category: 'Fullstack',
      target_level: 'Novice',
      author_name: 'Antigravity Architect',
      author_avatar: '⚡',
      prompt_content: 'Create a responsive single-page web app for tracking IoT sensor nodes.\nTech stack: Express backend with built-in node:sqlite, and a sleek dark-mode glassmorphism frontend.\nRequirements: SQLite database with sensors table, REST API, live status cards, and simulated real-time updates.',
      tags: ['SQLite', 'Express', 'Glassmorphism', 'IoT', 'Fullstack'],
      upvotes: 345
    },
    {
      id: 2,
      title: 'Subagent Parallel Security & Performance Audit Swarm',
      category: 'Agent Swarm',
      target_level: 'Advanced',
      author_name: 'DeepMind Swarm Lead',
      author_avatar: '🌌',
      prompt_content: 'Deploy a 3-agent orchestration swarm to audit our codebase: SecAuditor for token scans, PerfProfiler for N+1 queries, and Synthesizer for remediation plan artifacts with Mermaid diagrams.',
      tags: ['Subagents', 'Security', 'Performance', 'Audit', 'Mermaid'],
      upvotes: 521
    },
    {
      id: 3,
      title: 'Zero-Downtime Database Migration & Schema Seeder',
      category: 'Database & API',
      target_level: 'Intermediate',
      author_name: 'Data Gravity Master',
      author_avatar: '💾',
      prompt_content: 'Write a resilient database migration script that converts user preferences from JSON blob storage into structured relational columns with default constraints and rollback safeguards.',
      tags: ['SQL', 'Migrations', 'SQLite', 'Transactions', 'Reliability'],
      upvotes: 292
    },
    {
      id: 4,
      title: 'Autonomous Self-Healing Test Suite Runner with /boost',
      category: 'Debugging & Refactoring',
      target_level: 'Mastery',
      author_name: 'Singularity Pilot',
      author_avatar: '🚀',
      prompt_content: 'Run the entire Jest integration test suite in our repository. If any test suite fails, capture failure diffs, use /boost multi-perspective reasoning to identify root causes, apply surgical replace_file_content patches, and verify assertion success.',
      tags: ['Self-Healing', 'Testing', '/boost', 'Refactoring', 'Automation'],
      upvotes: 628
    },
    {
      id: 5,
      title: 'Interactive 3D WebGL / Canvas Gravity Simulation',
      category: 'Frontend Magic',
      target_level: 'Novice',
      author_name: 'Vibe Creator',
      author_avatar: '🎨',
      prompt_content: 'Build an interactive canvas component where 150 glowing particles simulate zero-gravity physics with mouse orbit acceleration and an anti-gravity inversion shockwave blast on click.',
      tags: ['Canvas', 'Physics', 'Interactive', 'Visuals', 'Animation'],
      upvotes: 419
    }
  ],
  vibes: [
    {
      id: 1,
      author_name: 'Elena Rostova',
      handle: '@elena_dev',
      role: 'Principal Systems Architect',
      avatar_bg: 'linear-gradient(135deg, #00f5ff, #7928ca)',
      vibe_text: 'Vibe coding with Antigravity completely changed my brain chemistry. I sketched a multi-agent Kubernetes orchestrator during lunch, and had a running prototype with full test coverage before coffee was cold.',
      built_project: 'Autonomous K8s Mesh Operator',
      stars_count: 251
    },
    {
      id: 2,
      author_name: 'Marcus Chen',
      handle: '@marcus_vibe',
      role: 'Founder & Fullstack Hacker',
      avatar_bg: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      vibe_text: 'The difference between other copilots and Antigravity is GRAVITY. Antigravity doesn’t guess or drop broken snippets. It plans with /plan, edits surgically with replace_file_content, and tests in the persistent shell.',
      built_project: 'HyperSound Synthesizer SaaS',
      stars_count: 189
    },
    {
      id: 3,
      author_name: 'Aria Thorne',
      handle: '@ariathorne',
      role: 'AI Research Engineer',
      avatar_bg: 'linear-gradient(135deg, #10b981, #06b6d4)',
      vibe_text: 'Spawning subagents with invoke_subagent feels like having three senior DeepMind engineers sitting right next to you. One reads the docs, one writes the code, one runs the tests. Pure flow state.',
      built_project: 'Vector Graph Neural Navigator',
      stars_count: 314
    }
  ],
  tables: [
    { tableName: 'proficiency_tracks', rowCount: 4 },
    { tableName: 'curriculum_modules', rowCount: 12 },
    { tableName: 'agent_capabilities', rowCount: 6 },
    { tableName: 'vibe_prompts', rowCount: 7 },
    { tableName: 'agent_missions', rowCount: 3 },
    { tableName: 'user_assessments', rowCount: 1 },
    { tableName: 'community_vibes', rowCount: 3 }
  ]
};
