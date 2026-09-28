// Antigravity Live SQL & Relational Database Inspector

class SqlInspector {
  constructor() {
    this.tableListEl = document.getElementById('sql-table-list');
    this.queryInput = document.getElementById('sql-query-input');
    this.runQueryBtn = document.getElementById('btn-run-sql');
    this.resultsContainer = document.getElementById('sql-results-container');
    this.queryStatsEl = document.getElementById('sql-query-stats');
    this.engineStatsEl = document.getElementById('sql-engine-stats');

    this.init();
  }

  async init() {
    await this.fetchEngineStats();
    await this.fetchTables();

    if (this.runQueryBtn) {
      this.runQueryBtn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        this.runCustomQuery();
      });
    }

    // Preset query buttons
    document.querySelectorAll('.sql-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playKey();
        const sql = btn.getAttribute('data-sql');
        if (this.queryInput && sql) {
          this.queryInput.value = sql;
          this.runCustomQuery();
        }
      });
    });
  }

  async fetchEngineStats() {
    try {
      const res = await fetch('/api/system/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success && this.engineStatsEl) {
          const eng = data.data.engine;
          const agy = data.data.antigravity;
          this.engineStatsEl.innerHTML = `
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); background: rgba(14, 19, 32, 0.7); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>💾 Database: <span style="color: var(--color-cyan); font-weight: 700;">${eng.database} (${eng.journalMode} Mode)</span></div>
              <div>⚡ Runtime: <span style="color: #ffffff;">${eng.runtime}</span></div>
              <div>🧠 Model: <span style="color: var(--color-violet); font-weight: 700;">${agy.deepmindModel}</span></div>
              <div>🛡️ Foreign Keys: <span style="color: var(--color-emerald);">${eng.foreignKeys}</span></div>
              <div>⏱️ Uptime: <span style="color: #ffffff;">${eng.uptimeSeconds}s</span></div>
            </div>
          `;
          return;
        }
      }
    } catch (err) {
      console.warn('API fetch engine stats fallback:', err);
    }

    if (this.engineStatsEl) {
      this.engineStatsEl.innerHTML = `
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); background: rgba(14, 19, 32, 0.7); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div>💾 Database: <span style="color: var(--color-cyan); font-weight: 700;">SQLite v3.53.4 (WAL Mode)</span></div>
          <div>⚡ Engine: <span style="color: #ffffff;">Node.js v26 Fullstack</span></div>
          <div>🧠 Model: <span style="color: var(--color-violet); font-weight: 700;">Gemini 3.8 Flash (High-Speed Reasoning)</span></div>
          <div>🛡️ Status: <span style="color: var(--color-emerald);">STATIC / HYBRID ACTIVE</span></div>
        </div>
      `;
    }
  }

  async fetchTables() {
    if (!this.tableListEl) return;
    let tables = [];
    try {
      const res = await fetch('/api/system/tables');
      if (res.ok) {
        const data = await res.json();
        if (data.success) tables = data.data;
      }
    } catch (err) {
      console.warn('API fetch tables fallback:', err);
    }

    if (!tables || tables.length === 0) {
      tables = window.ANTIGRAVITY_STATIC_DATA?.tables || [];
    }

    this.tableListEl.innerHTML = '';
    tables.forEach((table, idx) => {
      const btn = document.createElement('button');
      btn.className = `table-selector-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `
        <span>📄 ${table.tableName}</span>
        <span class="table-row-count-badge">${table.rowCount} rows</span>
      `;
      btn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        this.tableListEl.querySelectorAll('.table-selector-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.queryInput) {
          this.queryInput.value = `SELECT * FROM ${table.tableName} LIMIT 20;`;
          this.runCustomQuery();
        }
      });
      this.tableListEl.appendChild(btn);
    });

    if (tables.length > 0 && this.queryInput) {
      this.queryInput.value = `SELECT * FROM ${tables[0].tableName} LIMIT 15;`;
      this.runCustomQuery();
    }
  }

  async runCustomQuery() {
    const sql = (this.queryInput?.value || '').trim();
    if (!sql) return;

    try {
      if (this.queryStatsEl) this.queryStatsEl.textContent = 'Executing query on SQLite WAL...';

      const res = await fetch('/api/system/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sql })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      if (this.queryStatsEl) {
        this.queryStatsEl.innerHTML = `⚡ Returned <span style="color: var(--color-cyan); font-weight: 700;">${data.rowCount} rows</span> in <span style="color: var(--color-emerald); font-weight: 700;">${data.executionTimeMs}</span>`;
      }

      this.renderTable(data.data);
    } catch (err) {
      if (this.queryStatsEl) {
        this.queryStatsEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;">SQL Error:</span> ${this.escapeHtml(err.message)}`;
      }
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: #ef4444; font-family: var(--font-mono); font-size: 0.9rem;">
            ⚠️ Query Failed: ${this.escapeHtml(err.message)}
          </div>
        `;
      }
    }
  }

  renderTable(rows) {
    if (!this.resultsContainer) return;
    if (!rows || rows.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono);">
          Zero rows returned for this query.
        </div>
      `;
      return;
    }

    const columns = Object.keys(rows[0]);

    let ths = columns.map(c => `<th>${this.escapeHtml(c)}</th>`).join('');
    let trs = rows.map(r => {
      let tds = columns.map(c => {
        let val = r[c];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        if (typeof val === 'string' && val.length > 80) {
          val = val.substring(0, 80) + '...';
        }
        return `<td>${this.escapeHtml(String(val ?? 'NULL'))}</td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    this.resultsContainer.innerHTML = `
      <table class="cyber-table">
        <thead>
          <tr>${ths}</tr>
        </thead>
        <tbody>
          ${trs}
        </tbody>
      </table>
    `;
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.SqlInspector = SqlInspector;
