// Antigravity Master Web Controller & View Router

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Zero-G Canvas
  const canvas = new window.AntigravityCanvas('gravity-canvas');

  // 2. Audio Toggle Setup
  const audioBtn = document.getElementById('btn-toggle-audio');
  if (audioBtn) {
    const updateAudioIcon = () => {
      const isMuted = window.cyberAudio.isMuted();
      audioBtn.innerHTML = isMuted ? '🔇 Audio Off' : '🔊 Cyber SFX';
    };
    updateAudioIcon();

    audioBtn.addEventListener('click', () => {
      const muted = window.cyberAudio.toggleMute();
      updateAudioIcon();
      if (!muted) window.cyberAudio.playSuccess();
    });
  }

  // 3. Gravity Inversion Button
  const gravityBtn = document.getElementById('btn-toggle-gravity');
  if (gravityBtn && canvas) {
    gravityBtn.addEventListener('click', () => {
      const isInverted = canvas.toggleGravityInversion();
      window.cyberAudio?.playWhoosh();
      gravityBtn.innerHTML = isInverted ? '🌌 Inverted G' : '🪐 Zero-G Field';
      gravityBtn.style.borderColor = isInverted ? 'var(--color-pink)' : 'var(--border-subtle)';
    });
  }

  // 4. View Switching Navigation Router
  const navButtons = document.querySelectorAll('.nav-btn');
  const viewSections = document.querySelectorAll('.view-section');

  const switchView = (targetViewId) => {
    window.cyberAudio?.playClick();

    navButtons.forEach(btn => {
      if (btn.getAttribute('data-view') === targetViewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    viewSections.forEach(sec => {
      if (sec.id === targetViewId) {
        sec.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        sec.classList.remove('active');
      }
    });
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-view');
      if (target) switchView(target);
    });
  });

  // Global links to switch views (e.g. from hero CTA buttons)
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-route');
      if (target) switchView(target);
    });
  });

  // 5. Initialize Proficiency Tracks & Curriculum
  await initTracks();

  // 6. Initialize Vibe Prompts Hub
  await initPrompts();

  // 7. Initialize Community Vibes Wall
  await initVibes();

  // 8. Initialize Sub-Engines
  new window.VibeSimulator();
  new window.ProficiencyAssessment();
  new window.SqlInspector();

  // 9. Architecture Nodes Interactive Selector
  initArchVisualizer();
});

// ── PROFICIENCY TRACKS MODULE ──
async function initTracks() {
  const container = document.getElementById('tracks-content-container');
  const navContainer = document.getElementById('tracks-pills-row');
  if (!container || !navContainer) return;

  let tracks = [];
  try {
    const res = await fetch('/api/tracks');
    if (res.ok) {
      const data = await res.json();
      if (data.success) tracks = data.data;
    }
  } catch (err) {
    console.warn('Backend API unavailable, utilizing static curriculum data:', err);
  }

  if (!tracks || tracks.length === 0) {
    tracks = window.ANTIGRAVITY_STATIC_DATA?.tracks || [];
  }

  // Render Track Switcher Pills
  navContainer.innerHTML = tracks.map((t, idx) => `
    <button class="track-select-pill ${idx === 0 ? 'active' : ''}" data-slug="${t.slug}">
      <span>${t.badge}</span>
      <span>${t.title.split(':')[0]}</span>
    </button>
  `).join('');

  // Load first track by default
  if (tracks.length > 0) {
    loadTrackDetail(tracks[0].slug);
  }

  // Attach click handlers
  navContainer.querySelectorAll('.track-select-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      window.cyberAudio?.playClick();
      navContainer.querySelectorAll('.track-select-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const slug = btn.getAttribute('data-slug');
      loadTrackDetail(slug);
    });
  });
}

async function loadTrackDetail(slug) {
  const container = document.getElementById('tracks-content-container');
  if (!container) return;

  let track = null;
  try {
    const res = await fetch(`/api/tracks/${slug}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) track = json.data;
    }
  } catch (err) {
    console.warn('API fetch track detail fallback:', err);
  }

  if (!track) {
    const staticTracks = window.ANTIGRAVITY_STATIC_DATA?.tracks || [];
    track = staticTracks.find(t => t.slug === slug) || staticTracks[0];
  }

  if (!track) return;

    container.innerHTML = `
      <div class="track-banner">
        <div>
          <span class="track-badge" style="background: rgba(0, 245, 255, 0.1); color: ${track.accent_color}; border: 1px solid ${track.accent_color}55;">
            ${track.badge} • ${track.level}
          </span>
          <h2 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; color: #ffffff;">${track.title}</h2>
          <p style="font-size: 1.15rem; color: var(--color-cyan); margin-bottom: 1rem; font-family: var(--font-mono);">${track.subtitle}</p>
          <p style="font-size: 1rem; color: var(--text-secondary); max-width: 800px; line-height: 1.6; margin-bottom: 1rem;">${track.description}</p>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); background: rgba(10, 14, 24, 0.6); padding: 0.6rem 1rem; border-radius: var(--radius-md); border-left: 3px solid ${track.accent_color};">
            🎯 <strong>Core Mindset:</strong> "${track.core_mindset}"
          </div>
        </div>
        <div style="text-align: right; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
          <div>EST. DURATION</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: ${track.accent_color};">${track.estimated_hours}</div>
        </div>
      </div>

      <div class="modules-list">
        ${track.modules.map(mod => `
          <div class="module-card">
            <div class="module-header">
              <h3 class="module-title">${mod.title}</h3>
              <div class="module-meta-pills">
                <span class="tool-badge" style="color: var(--color-violet); border-color: rgba(168, 85, 247, 0.3);">⏱️ ${mod.duration}</span>
                ${mod.antigravity_tools.map(tool => `<span class="tool-badge">🛠️ ${tool}</span>`).join('')}
              </div>
            </div>

            <p class="module-deepdive">${mod.deep_dive}</p>

            <div class="code-box-wrapper">
              <div class="code-box-header">
                <span>Prompt Recipe / Code Template</span>
                <button class="btn-copy-snippet" data-copy="${escapeAttr(mod.prompt_recipe)}" style="background: transparent; border: none; color: var(--color-cyan); cursor: pointer; font-family: var(--font-mono); font-size: 0.78rem;">
                  📋 Copy Prompt
                </button>
              </div>
              <div class="code-box-body"><strong>Prompt:</strong> ${escapeHtml(mod.prompt_recipe)}

${escapeHtml(mod.code_example)}</div>
            </div>

            <div class="module-footer-challenge">
              <strong style="color: var(--color-violet);">💡 Hands-On Challenge:</strong> ${escapeHtml(mod.hands_on_challenge)}
              <div style="margin-top: 0.35rem; color: var(--text-muted); font-size: 0.82rem;">⚡ <strong>Pro Tip:</strong> ${escapeHtml(mod.pro_tip)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Copy Prompt Event Listeners
    container.querySelectorAll('.btn-copy-snippet').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
          window.cyberAudio?.playClick();
          btn.textContent = '✓ Copied!';
          setTimeout(() => { btn.textContent = '📋 Copy Prompt'; }, 2000);
        });
      });
    });

  } catch (err) {
    console.error('Failed to load track details:', err);
  }
}

// ── VIBE PROMPTS HUB MODULE ──
async function initPrompts() {
  const container = document.getElementById('prompts-feed-grid');
  const searchInput = document.getElementById('prompts-search-input');
  const categoryFilters = document.getElementById('prompt-category-filters');
  const submitModal = document.getElementById('submit-prompt-modal');
  const openModalBtn = document.getElementById('btn-open-submit-prompt');
  const closeModalBtn = document.getElementById('btn-close-prompt-modal');
  const submitForm = document.getElementById('submit-prompt-form');

  let currentCategory = 'All';
  let searchQuery = '';

  const fetchAndRender = async () => {
    let promptList = [];
    try {
      const url = `/api/prompts?category=${encodeURIComponent(currentCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) promptList = json.data;
      }
    } catch (err) {
      console.warn('API fetch prompts fallback:', err);
    }

    if (!promptList || promptList.length === 0) {
      let staticList = window.ANTIGRAVITY_STATIC_DATA?.prompts || [];
      if (currentCategory && currentCategory !== 'All') {
        staticList = staticList.filter(p => p.category === currentCategory);
      }
      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        staticList = staticList.filter(p => p.title.toLowerCase().includes(s) || p.prompt_content.toLowerCase().includes(s));
      }
      promptList = staticList;
    }

    if (!container) return;

    if (promptList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono);">
          No prompts found matching current filter. Be the first to share one!
        </div>
      `;
      return;
    }

    container.innerHTML = promptList.map(p => `
        <div class="prompt-card">
          <div>
            <div class="prompt-card-header">
              <span class="prompt-category-tag">${p.category}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${p.target_level}</span>
            </div>
            <h4 class="prompt-card-title">${escapeHtml(p.title)}</h4>
            <div class="prompt-card-content">${escapeHtml(p.prompt_content)}</div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
              ${p.tags.map(t => `<span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); background: rgba(255, 255, 255, 0.05); padding: 0.15rem 0.45rem; border-radius: 4px;">#${t}</span>`).join('')}
            </div>
          </div>
          <div class="prompt-card-footer">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">
              <span>${p.author_avatar}</span>
              <span>${escapeHtml(p.author_name)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="btn-upvote" data-id="${p.id}">
                ❤️ <span>${p.upvotes}</span>
              </button>
              <button class="action-pill-btn btn-run-in-lab" data-prompt="${escapeAttr(p.prompt_content)}" title="Load into Simulator">
                ⚡ Lab
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Upvote buttons
      container.querySelectorAll('.btn-upvote').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const res = await fetch(`/api/prompts/${id}/upvote`, { method: 'POST' });
          const uData = await res.json();
          if (uData.success) {
            window.cyberAudio?.playClick();
            btn.querySelector('span').textContent = uData.upvotes;
            btn.style.color = 'var(--color-pink)';
            btn.style.borderColor = 'var(--color-pink)';
          }
        });
      });

      // Run in Lab button
      container.querySelectorAll('.btn-run-in-lab').forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          const simInput = document.getElementById('sim-prompt-input');
          if (simInput && prompt) {
            simInput.value = prompt;
            const simNav = document.querySelector('[data-view="view-simulator"]');
            if (simNav) simNav.click();
          }
        });
      });

    } catch (err) {
      console.error('Failed to load prompts:', err);
    }
  };

  await fetchAndRender();

  // Search input handler
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchQuery = e.target.value.trim();
        fetchAndRender();
      }, 250);
    });
  }

  // Category filter clicks
  if (categoryFilters) {
    categoryFilters.querySelectorAll('.preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        categoryFilters.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-cat') || 'All';
        fetchAndRender();
      });
    });
  }

  // Modal handlers
  if (openModalBtn && submitModal) {
    openModalBtn.addEventListener('click', () => {
      window.cyberAudio?.playClick();
      submitModal.classList.add('active');
    });
  }

  if (closeModalBtn && submitModal) {
    closeModalBtn.addEventListener('click', () => {
      submitModal.classList.remove('active');
    });
  }

  if (submitForm) {
    submitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('form-prompt-title')?.value;
      const category = document.getElementById('form-prompt-category')?.value;
      const target_level = document.getElementById('form-prompt-level')?.value;
      const author_name = document.getElementById('form-prompt-author')?.value;
      const prompt_content = document.getElementById('form-prompt-content')?.value;
      const tags = document.getElementById('form-prompt-tags')?.value;

      try {
        const res = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            category,
            target_level,
            author_name,
            prompt_content,
            tags
          })
        });

        const data = await res.json();
        if (data.success) {
          window.cyberAudio?.playSuccess();
          submitModal.classList.remove('active');
          submitForm.reset();
          fetchAndRender();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Failed to submit prompt: ' + err.message);
      }
    });
  }
}

// ── COMMUNITY VIBES MODULE ──
async function initVibes() {
  const container = document.getElementById('community-vibes-grid');
  if (!container) return;

  let vibeList = [];
  try {
    const res = await fetch('/api/vibes');
    if (res.ok) {
      const json = await res.json();
      if (json.success) vibeList = json.data;
    }
  } catch (err) {
    console.warn('API fetch vibes fallback:', err);
  }

  if (!vibeList || vibeList.length === 0) {
    vibeList = window.ANTIGRAVITY_STATIC_DATA?.vibes || [];
  }

  container.innerHTML = vibeList.map(v => `
      <div class="pillar-card">
        <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: ${v.avatar_bg}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #ffffff;">
            ${v.author_name.charAt(0)}
          </div>
          <div>
            <div style="font-weight: 700; color: #ffffff;">${escapeHtml(v.author_name)}</div>
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--color-cyan);">${escapeHtml(v.handle)} • ${escapeHtml(v.role)}</div>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
          "${escapeHtml(v.vibe_text)}"
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <span>🚀 ${escapeHtml(v.built_project)}</span>
          <button class="btn-star-vibe" data-id="${v.id}" style="background: transparent; border: none; color: var(--color-amber); cursor: pointer; font-size: 0.85rem;">
            ⭐ <span>${v.stars_count}</span>
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-star-vibe').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const res = await fetch(`/api/vibes/${id}/star`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          window.cyberAudio?.playClick();
          btn.querySelector('span').textContent = data.stars_count;
        }
      });
    });
  } catch (err) {
    console.error('Failed to load vibes:', err);
  }
}

// ── ARCHITECTURE VISUALIZER ──
function initArchVisualizer() {
  const nodes = document.querySelectorAll('.arch-node');
  const titleEl = document.getElementById('arch-display-title');
  const descEl = document.getElementById('arch-display-desc');
  const codeEl = document.getElementById('arch-display-code');

  const layers = {
    cortex: {
      title: '1. Cerebral Cortex (Gemini High-Order Reasoning)',
      desc: 'Powered by Google DeepMind frontier Gemini models. Parses complex natural language instructions, formulates holistic multi-file execution plans, and resolves ambiguous requirements with smart proactive inquiries.',
      code: `// DeepMind High-Order Planning Engine
const plan = await Antigravity.plan({
  goal: "Refactor auth middleware to zero-trust stateless JWT",
  constraints: ["zero breaking changes", "enforce clock tolerance"]
});`
    },
    swarms: {
      title: '2. Nervous System (Autonomous Subagent Swarms)',
      desc: 'Orchestrates concurrent worker personas. Spawns read-only research subagents to read thousands of lines of documentation while branch-isolated coder subagents write code in parallel worktrees.',
      code: `invoke_subagent([
  { "TypeName": "research", "Role": "Security Auditor", "Prompt": "Scan routes for CSRF" },
  { "TypeName": "self", "Role": "Backend Builder", "Workspace": "branch" }
]);`
    },
    hands: {
      title: '3. Motor Cortex (Surgical Code Diff & Precision Manipulation)',
      desc: 'Executes line-precise code replacements with replace_file_content. Preserves comments, prevents code truncation, and eliminates the risks of naive full-file rewriting.',
      code: `replace_file_content({
  TargetFile: "/server/routes/auth.js",
  StartLine: 42,
  EndLine: 48,
  TargetContent: "const token = req.query.token;",
  ReplacementContent: "const token = req.cookies.jwtToken;"
});`
    },
    shell: {
      title: '4. Kinetic System (Sandboxed Persistent Shell & Terminals)',
      desc: 'Runs live bash commands, monitors test suites, manages background daemons, and wakes up reactively upon task completion without wasting compute in polling loops.',
      code: `$ agy run "npm test -- --watch" --background
[Task task-1204 backgrounded]
Antigravity reactive wakeup listening for test runner completion...`
    },
    custom: {
      title: '5. Customization Layer (Skills, Rules & Model Context Protocol)',
      desc: 'Loads custom domain knowledge via SKILL.md files, project-level coding rules, and bridges to external databases, APIs, and cloud services via MCP.',
      code: `---
name: production-postgresql
description: Enforces indexing standards, WAL configurations, and SQL performance.
---
# Always verify index coverage before deploying migration!`
    }
  };

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      window.cyberAudio?.playClick();
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const layerKey = node.getAttribute('data-layer');
      const data = layers[layerKey];
      if (data && titleEl && descEl && codeEl) {
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        codeEl.textContent = data.code;
      }
    });
  });
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return (str || '')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
