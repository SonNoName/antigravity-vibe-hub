# 🌌 Antigravity // The Vibe Coding Platform

> Built for the post-syntax era. Where human creative intent guides the vision, and **Google DeepMind's Antigravity** handles the physics.

A full-stack, zero-dependency modern web application engineered to demonstrate the pinnacle of **Vibe Coding** with Antigravity: from conversational ideation to autonomous multi-agent swarms, persistent sandboxed terminals, and ACID-compliant relational SQLite persistence.

---

## ⚡ Tech Stack & Architecture

- **Backend Runtime**: Node.js (v26+ with native `node:sqlite` WAL mode)
- **API Framework**: Express 5 (RESTful endpoints + Server-Sent Events SSE streaming)
- **Relational Database**: SQLite 3 (WAL mode, foreign key constraints, B-Tree indices)
- **Frontend Engine**: Pure HTML5, CSS3 Glassmorphism, Vanilla ES Modules
- **Physics Canvas**: Zero-Gravity Particle Engine with mouse gravitational singularity and shockwave blast
- **Audio Synthesis**: Procedural Cyber Acoustics via Web Audio API (zero audio files needed)
- **Diagrams**: Interactive Mermaid.js SVG architecture flowcharts

---

## 🚀 Quick Start

### 1. Install & Run
```bash
# Enter directory
cd antigravity-vibe-hub

# Install dependencies (Express, CORS, Morgan)
npm install

# (Optional) Re-seed the database
npm run seed

# Start server
npm start
```

### 2. Access the Application
- **Web Interface**: [http://localhost:3000](http://localhost:3000)
- **Health Diagnostics**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **System & SQL Stats**: [http://localhost:3000/api/system/stats](http://localhost:3000/api/system/stats)

---

## 🎓 Proficiency Curriculum Tracks

Divided into 4 progressive evolutionary tiers:

1. **Track I: The Vibe Initiate (Novice)**
   - *Theme*: Unshackle from syntax — think in intent and vision.
   - *Focus*: Conversational scaffolding, perceptual prompts, rapid iteration cycles.
2. **Track II: The Agent Commander (Intermediate)**
   - *Theme*: Tactical precision — slash commands (`/plan`, `/goal`, `/boost`), diff inspections.
   - *Focus*: Persistent background terminals, `@` mention anchoring, surgical `replace_file_content`.
3. **Track III: The Orchestration Architect (Advanced)**
   - *Theme*: Multi-agent swarms & institutional knowledge.
   - *Focus*: Spawning subagents (`invoke_subagent`), git worktree branching, `SKILL.md` authoring, MCP servers.
4. **Track IV: The Singularity Operator (Mastery)**
   - *Theme*: Zero-gravity autonomous engineering.
   - *Focus*: Self-healing loops, persistent background cron agents (`schedule`), headless Antigravity Python SDK.

---

## 🛠️ The Vibe Lab (Interactive Agent Simulator)

The built-in **Vibe Lab** simulates the internal execution loops of Antigravity:
- **Slash Commands**: Test `/plan`, `/goal`, `/boost`, and `/schedule` in real-time.
- **Autonomous Roster**: Dispatches `Antigravity Lead`, `research-agent`, `coder-agent`, and `shell-verifier`.
- **Live Terminal**: Streams step-by-step logs with timestamps and action badges over Server-Sent Events.
- **Living Artifacts**: Generates validated code snippets and dynamic Mermaid sequence diagrams.

---

## 💾 Relational SQLite Database Schema

The SQLite database (`data/antigravity.sqlite`) operates in **Write-Ahead Logging (WAL)** mode:

| Table | Purpose |
|---|---|
| `proficiency_tracks` | The 4 core learning tracks, badges, and time estimates |
| `curriculum_modules` | 12 structured modules with deep dives, challenges, and prompt recipes |
| `agent_capabilities` | DeepMind Antigravity architectural layers and tooling |
| `vibe_prompts` | Community prompt vault with search, tag filtering, and upvoting |
| `agent_missions` | Execution traces and synthesized artifacts |
| `user_assessments` | Graded proficiency quizzes and assigned developer credentials |
| `community_vibes` | Real-world developer testimonials and starred projects |

---

## 📡 Full-Stack REST & Streaming API Endpoints

- `GET /api/tracks` — Retrieve all proficiency tracks with module counts
- `GET /api/tracks/:slug` — Retrieve single track with complete curriculum modules
- `GET /api/prompts` — Search and filter prompts by category, level, or query
- `POST /api/prompts` — Submit a new prompt to SQLite
- `POST /api/prompts/:id/upvote` — Increment prompt upvote count
- `GET /api/missions/stream/live` — Server-Sent Events (SSE) live simulation stream
- `POST /api/assessment/submit` — Submit quiz, compute score, and issue Holographic Developer Pass
- `GET /api/system/stats` — Return runtime metrics, SQLite version, and active memory
- `POST /api/system/query` — Safe read-only SQL query explorer for live introspection

---

## 🎨 Visual Aesthetics & Audio Controls

- **Zero-G Field**: Click the `🪐 Zero-G Field` button in the navbar (or click the canvas) to invert gravity and send particles hurtling in a glowing neon shockwave.
- **Cyber SFX**: Click the `🔊 Cyber SFX` button to toggle procedural Web Audio sound feedback.
- **Holographic Dev Pass**: Complete the 4-question assessment to generate your personalized 3D holographic developer card with unique clearance token!

---

*Designed and engineered for Google DeepMind Antigravity.*
