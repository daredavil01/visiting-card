// Theme-aware particle field on a 2D canvas, drawn from the same rAF loop that
// moves the card. Design doc section 7.5.
//
// The field is a plain class rather than a component: it is stepped every frame
// and must never cause a React render. `Particles` below is only the canvas element.

const REPEL_RADIUS_SQ = 80 * 80;

export class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.parts = [];
    this.dpr = 1;
  }

  // Called on mount, on resize, and whenever the theme or capability changes.
  reset(theme, { mobile, live, tier }) {
    const cv = this.canvas;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    // Mounting into a hidden or not-yet-laid-out container measures zero. Seeding
    // a field with no area would leave the canvas permanently blank, so remember
    // the arguments and let the next frame try again once layout has settled.
    this.pending = null;
    if (r.width < 1 || r.height < 1) {
      this.pending = [theme, { mobile, live, tier }];
      return;
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = r.width * dpr;
    cv.height = r.height * dpr;
    this.dpr = dpr;
    this.theme = theme;

    // Tier scaling on top of the theme's own count (doc section 8 budget table).
    const tierScale = tier === 'low' ? 0 : tier === 'medium' ? 0.6 : 1;
    const scale = (mobile ? 0.45 : 1) * tierScale;
    const n = live ? Math.round(theme.pCount * scale) : 0;

    this.parts = Array.from({ length: n }, () => ({
      x: Math.random() * r.width,
      y: Math.random() * r.height,
      vx: (Math.random() - 0.5) * theme.pSpeed,
      // Slight upward bias so fireflies and mist drift rather than mill about.
      vy: (Math.random() - 0.5) * theme.pSpeed - theme.pSpeed * 0.3,
      r: (0.5 + Math.random()) * theme.pSize,
      a: 0.2 + Math.random() * 0.7,
    }));
  }

  // Radial burst from the card's centre, on flip.
  burst() {
    const cv = this.canvas;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    for (const p of this.parts) {
      const dx = p.x - r.width / 2;
      const dy = p.y - r.height / 2;
      const l = Math.hypot(dx, dy) || 1;
      p.vx += (dx / l) * 3;
      p.vy += (dy / l) * 3;
    }
  }

  // Velocity-proportional scatter, on release of a toss.
  spread(v) {
    for (const p of this.parts) {
      p.vx += (Math.random() - 0.5) * v * 0.06;
      p.vy += (Math.random() - 0.5) * v * 0.06;
    }
  }

  draw(cursorX, cursorY) {
    const cv = this.canvas;
    if (!cv) return;
    if (this.pending) {
      const [theme, opts] = this.pending;
      this.reset(theme, opts);
      if (this.pending) return;
    }
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!this.parts.length) return;

    const th = this.theme;
    const dpr = this.dpr || 1;
    const w = cv.width / dpr;
    const h = cv.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = th.particle;
    if (th.pGlow) {
      ctx.shadowColor = th.particle;
      ctx.shadowBlur = 8;
    }

    for (const p of this.parts) {
      const dx = p.x - cursorX;
      const dy = p.y - cursorY;
      const d2 = dx * dx + dy * dy;
      // Gentle repulsion so the cursor pushes a clearing through the field.
      if (d2 < REPEL_RADIUS_SQ) {
        const d = Math.sqrt(d2) || 1;
        p.vx += (dx / d) * 0.28;
        p.vy += (dy / d) * 0.28;
      }
      p.vx *= 0.975;
      p.vy *= 0.975;
      p.x += p.vx || 0;
      p.y += p.vy || 0;

      // Wrap rather than respawn, so the field never visibly thins out.
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.globalAlpha = p.a * 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.284);
      ctx.fill();
    }

    ctx.restore();
  }
}

export default function Particles({ canvasRef }) {
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
