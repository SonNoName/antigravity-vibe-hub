// Antigravity Zero-G Physics Particle Canvas Engine

class AntigravityCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 110;
    this.mouse = { x: -1000, y: -1000, active: false };
    this.gravityInverted = false;
    this.shockwaves = [];
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse & Touch Tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    // Click triggers anti-gravity shockwave
    this.canvas.addEventListener('click', (e) => {
      this.triggerShockwave(e.clientX, e.clientY);
      window.cyberAudio?.playWhoosh();
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    this.particles = [];
    const colors = [
      'rgba(0, 245, 255, ',    // Cyan
      'rgba(168, 85, 247, ',   // Violet
      'rgba(236, 72, 153, ',   // Pink
      'rgba(16, 185, 129, '    // Emerald
    ];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.2 + 1,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }
  }

  toggleGravityInversion() {
    this.gravityInverted = !this.gravityInverted;
    if (this.mouse.active) {
      this.triggerShockwave(this.mouse.x, this.mouse.y);
    } else {
      this.triggerShockwave(this.width / 2, this.height / 2);
    }
    return this.gravityInverted;
  }

  triggerShockwave(x, y) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 350,
      opacity: 0.9,
      speed: 12
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render & expand shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity -= 0.025;

      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 245, 255, ${Math.max(0, sw.opacity)})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural Brownian Zero-G drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse Gravitational Field
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 280 && dist > 15) {
          const force = (1 - dist / 280) * 0.08;
          const factor = this.gravityInverted ? -2.2 : 1.0;

          // Tangential orbital acceleration + radial pull
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * factor;
          p.vy += Math.sin(angle) * force * factor;

          // Subtle orbital spin
          if (!this.gravityInverted) {
            p.vx += -Math.sin(angle) * force * 0.4;
            p.vy += Math.cos(angle) * force * 0.4;
          }
        }
      }

      // Check shockwave influence
      for (const sw of this.shockwaves) {
        const sdx = p.x - sw.x;
        const sdy = p.y - sw.y;
        const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
        if (Math.abs(sDist - sw.radius) < 30) {
          const blastAngle = Math.atan2(sdy, sdx);
          p.vx += Math.cos(blastAngle) * 5;
          p.vy += Math.sin(blastAngle) * 5;
        }
      }

      // Atmospheric friction damping
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Draw particle glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.baseColor}${p.alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `${p.baseColor}0.8)`;
      this.ctx.fill();

      // Connect close particles with neural constellation lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cDist < 85) {
          const lineAlpha = (1 - cDist / 85) * 0.18;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 245, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

window.AntigravityCanvas = AntigravityCanvas;
