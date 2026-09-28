// Antigravity Proficiency Assessment & Holographic Developer ID Card Engine

class ProficiencyAssessment {
  constructor() {
    this.questionsContainer = document.getElementById('quiz-questions-container');
    this.submitBtn = document.getElementById('quiz-submit-btn');
    this.resultContainer = document.getElementById('quiz-result-container');
    this.nameInput = document.getElementById('quiz-user-name');
    this.expSelect = document.getElementById('quiz-exp-level');
    this.hallOfFameContainer = document.getElementById('hall-of-fame-list');

    this.questions = [];
    this.userAnswers = {};

    this.init();
  }

  async init() {
    await this.fetchQuestions();
    await this.fetchHallOfFame();

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        this.submitQuiz();
      });
    }

    const copyBtn = document.getElementById('btn-copy-card');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyDevCard());
    }
  }

  async fetchQuestions() {
    try {
      const res = await fetch('/api/assessment/questions');
      const data = await res.json();
      if (data.success) {
        this.questions = data.data;
        this.renderQuestions();
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  }

  renderQuestions() {
    if (!this.questionsContainer) return;
    this.questionsContainer.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';

      const optionsHtml = q.options.map(opt => `
        <button type="button" class="quiz-option-btn" data-qid="${q.id}" data-opt="${opt.id}">
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-cyan); min-width: 24px;">${opt.id}.</span>
          <span>${this.escapeHtml(opt.text)}</span>
        </button>
      `).join('');

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <span class="section-tag" style="margin-bottom: 0;">Question 0${idx + 1} / 0${this.questions.length}</span>
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; color: #ffffff;">${this.escapeHtml(q.question)}</h3>
        <div class="quiz-options-wrapper" id="q-options-${q.id}">
          ${optionsHtml}
        </div>
      `;

      this.questionsContainer.appendChild(card);
    });

    // Attach click events to option buttons
    this.questionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playKey();
        const qid = btn.getAttribute('data-qid');
        const opt = btn.getAttribute('data-opt');

        this.userAnswers[qid] = opt;

        const parent = document.getElementById(`q-options-${qid}`);
        parent.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  async submitQuiz() {
    const userName = (this.nameInput?.value || '').trim();
    if (!userName) {
      alert('Please enter your developer callsign / name.');
      this.nameInput?.focus();
      return;
    }

    if (Object.keys(this.userAnswers).length < this.questions.length) {
      alert('Please complete all 4 questions before requesting evaluation.');
      return;
    }

    const expLevel = this.expSelect?.value || 'Intermediate';

    try {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = 'Calculating Agentic Gravity...';

      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          experienceLevel: expLevel,
          answers: this.userAnswers
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      window.cyberAudio?.playSuccess();
      this.displayHologramCard(json.data);
      this.fetchHallOfFame();
    } catch (err) {
      alert('Submission failed: ' + err.message);
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = '⚡ Synthesize Proficiency Card';
    }
  }

  displayHologramCard(data) {
    if (!this.resultContainer) return;
    this.resultContainer.style.display = 'block';

    document.getElementById('holo-name').textContent = data.userName;
    document.getElementById('holo-level').textContent = `${data.assignedBadge} ${data.calculatedLevel}`;
    document.getElementById('holo-serial').textContent = data.holographicCardId;
    document.getElementById('holo-score-text').textContent = `${data.scorePercentage}%`;
    document.getElementById('holo-advice').textContent = data.personalizedAdvice;

    const fillBar = document.getElementById('holo-score-fill');
    if (fillBar) {
      fillBar.style.width = '0%';
      setTimeout(() => {
        fillBar.style.width = `${data.scorePercentage}%`;
      }, 100);
    }

    this.resultContainer.scrollIntoView({ behavior: 'smooth' });
  }

  async fetchHallOfFame() {
    if (!this.hallOfFameContainer) return;
    try {
      const res = await fetch('/api/assessment/hall-of-fame');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        this.hallOfFameContainer.innerHTML = data.data.map(item => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="color: var(--color-cyan); font-weight: 700;">${item.user_name}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${item.assigned_badge}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: var(--color-emerald); font-weight: 700;">${item.score_percentage}%</span>
              <span style="color: var(--text-muted); font-size: 0.75rem;">${new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load hall of fame:', err);
    }
  }

  copyDevCard() {
    const name = document.getElementById('holo-name')?.textContent;
    const level = document.getElementById('holo-level')?.textContent;
    const serial = document.getElementById('holo-serial')?.textContent;
    const score = document.getElementById('holo-score-text')?.textContent;

    const text = `🌌 ANTIGRAVITY CERTIFIED VIBE CODER\nOperator: ${name}\nSerial: ${serial}\nRank: ${level}\nScore: ${score}\nVerified by Google DeepMind Antigravity Protocol`;

    navigator.clipboard.writeText(text).then(() => {
      window.cyberAudio?.playClick();
      alert('Holographic Developer Clearance copied to clipboard!');
    });
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.ProficiencyAssessment = ProficiencyAssessment;
