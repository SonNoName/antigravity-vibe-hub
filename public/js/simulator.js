// Antigravity Vibe Lab & Autonomous Agent Simulator

class VibeSimulator {
  constructor() {
    this.promptInput = document.getElementById('sim-prompt-input');
    this.runBtn = document.getElementById('sim-run-btn');
    this.terminalViewport = document.getElementById('sim-terminal-screen');
    this.statusPill = document.getElementById('sim-status-pill');
    this.swarmRoster = document.getElementById('sim-swarm-roster');
    this.artifactContainer = document.getElementById('sim-artifact-container');
    this.codeSnippetEl = document.getElementById('sim-code-snippet');
    this.mermaidEl = document.getElementById('sim-mermaid-display');
    this.eventSource = null;
    this.isRunning = false;

    this.init();
  }

  init() {
    if (!this.runBtn) return;

    this.runBtn.addEventListener('click', () => {
      window.cyberAudio?.playClick();
      this.runSimulation();
    });

    // Preset Buttons
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        const prompt = btn.getAttribute('data-prompt');
        if (prompt && this.promptInput) {
          this.promptInput.value = prompt;
          this.runSimulation();
        }
      });
    });

    // Slash Command Shortcuts
    document.querySelectorAll('.slash-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playKey();
        const cmd = btn.getAttribute('data-cmd');
        if (this.promptInput) {
          this.promptInput.value = cmd + ' ' + (this.promptInput.value || '').replace(/^\/\w+\s*/, '');
          this.promptInput.focus();
        }
      });
    });
  }

  setRunning(running) {
    this.isRunning = running;
    if (this.runBtn) {
      this.runBtn.disabled = running;
      this.runBtn.innerHTML = running
        ? `<span class="status-dot"></span> Orchestrating Swarm...`
        : `⚡ Engage Antigravity`;
    }
    if (this.statusPill) {
      this.statusPill.textContent = running ? 'AGENT SWARM ENGAGED' : 'IDLE / READY';
      this.statusPill.style.color = running ? 'var(--color-cyan)' : 'var(--color-emerald)';
    }
  }

  clearTerminal() {
    if (this.terminalViewport) {
      this.terminalViewport.innerHTML = '';
    }
  }

  appendLog(agent, action, detail, timeStr = '') {
    if (!this.terminalViewport) return;

    const row = document.createElement('div');
    row.className = 'terminal-log-row';

    const timestamp = timeStr || new Date().toLocaleTimeString().split(' ')[0];

    row.innerHTML = `
      <span class="log-time">[${timestamp}]</span>
      <span class="tag-subagent">${agent}</span>
      <span class="log-action action-${action}">${action}</span>
      <span class="log-detail">${this.escapeHtml(detail)}</span>
    `;

    this.terminalViewport.appendChild(row);
    this.terminalViewport.scrollTop = this.terminalViewport.scrollHeight;

    if (action === 'SUBAGENT_INVOCATION') {
      window.cyberAudio?.playSubagentSpawn();
    } else {
      window.cyberAudio?.playKey();
    }
  }

  updateRoster(subagents) {
    if (!this.swarmRoster) return;
    this.swarmRoster.innerHTML = '';
    subagents.forEach(agent => {
      const pill = document.createElement('span');
      pill.className = 'agent-roster-pill';
      pill.innerHTML = `🤖 ${agent}`;
      this.swarmRoster.appendChild(pill);
    });
  }

  async runSimulation() {
    const prompt = (this.promptInput?.value || '').trim();
    if (!prompt) {
      alert('Please enter or select a prompt to simulate.');
      return;
    }

    if (this.isRunning) return;
    this.setRunning(true);
    this.clearTerminal();

    if (this.artifactContainer) {
      this.artifactContainer.style.display = 'none';
    }

    this.appendLog('Antigravity Core', 'INITIALIZE', `Acquiring execution lock for intent: "${prompt}"`);

    // Check if EventSource SSE is supported
    if (window.EventSource) {
      this.runStream(prompt);
    } else {
      this.runRestFallback(prompt);
    }
  }

  runStream(prompt) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const url = `/api/missions/stream/live?prompt=${encodeURIComponent(prompt)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'START') {
          this.updateRoster(data.subagents);
          this.appendLog('Swarm Coordinator', 'PLANNING', `Spawned ${data.subagents.length} specialized subagents.`);
        } else if (data.type === 'STEP') {
          this.appendLog(data.step.agent, data.step.action, data.step.detail);
        } else if (data.type === 'COMPLETE') {
          this.eventSource.close();
          this.setRunning(false);
          this.appendLog('Antigravity Lead', 'SYNTHESIS', 'Mission fulfilled with zero regressions. Artifact rendered below.');
          window.cyberAudio?.playSuccess();
          this.displayArtifact(data);
        }
      } catch (err) {
        console.error('SSE Parse Error:', err);
      }
    };

    this.eventSource.onerror = (err) => {
      console.warn('SSE disconnected or failed, falling back to REST simulation', err);
      if (this.eventSource) this.eventSource.close();
      this.runRestFallback(prompt);
    };
  }

  async runRestFallback(prompt) {
    try {
      const res = await fetch('/api/missions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      this.updateRoster(data.subagents);

      for (const step of data.steps) {
        await new Promise(r => setTimeout(r, 400));
        this.appendLog(step.agent, step.action, step.detail);
      }

      this.setRunning(false);
      this.appendLog('Antigravity Lead', 'SYNTHESIS', 'Mission fulfilled with zero regressions. Artifact rendered below.');
      window.cyberAudio?.playSuccess();
      this.displayArtifact(data);
    } catch (err) {
      this.setRunning(false);
      this.appendLog('Antigravity Error', 'ERROR', err.message);
    }
  }

  displayArtifact(data) {
    if (!this.artifactContainer) return;
    this.artifactContainer.style.display = 'block';

    const titleEl = document.getElementById('sim-artifact-title');
    const descEl = document.getElementById('sim-artifact-desc');

    if (titleEl) titleEl.textContent = data.artifactTitle;
    if (descEl) descEl.textContent = data.artifactContent;

    if (this.codeSnippetEl && data.codeSnippet) {
      this.codeSnippetEl.textContent = data.codeSnippet;
    }

    if (this.mermaidEl && data.mermaidDiagram) {
      this.mermaidEl.style.display = 'block';
      if (window.mermaid) {
        try {
          window.mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
          const id = 'mermaid-svg-' + Date.now();
          window.mermaid.render(id, data.mermaidDiagram).then(({ svg }) => {
            this.mermaidEl.innerHTML = svg;
          }).catch(err => {
            console.warn('Mermaid render error:', err);
            this.mermaidEl.textContent = data.mermaidDiagram;
          });
        } catch (e) {
          this.mermaidEl.textContent = data.mermaidDiagram;
        }
      } else {
        this.mermaidEl.textContent = data.mermaidDiagram;
      }
    } else if (this.mermaidEl) {
      this.mermaidEl.style.display = 'none';
    }

    this.artifactContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.VibeSimulator = VibeSimulator;
