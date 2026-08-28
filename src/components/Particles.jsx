// Theme-aware particle field on a 2D canvas, drawn from the same rAF loop that
// moves the card. Design doc section 7.5.
//
// The field is a plain class rather than a component: it is stepped every frame
// and must never cause a React render. `Particles` below is only the canvas element.

const REPEL_RADIUS_SQ = 80 * 80;
const FADE_PER_FRAME = 0.045; // ~0.6s for a full cross-dissolve at 60fps

export class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.parts = [];
    this.dpr = 1;
    this.alpha = 1; // global fade, drives the theme cross-dissolve
    this.fadeTo = 1;
    this.next = null; // theme queued behind a fade-out
    this.converging = 0; // frames left of the view-switch implosion
  }

  // Called on mount, on resize, and whenever the theme or capability changes.
  reset(theme, { mobile, live, tier }) {
    const cv = this.canvas;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    // Mounting into a hidden or not-yet-laid-out container measures zero. Seeding
    // a field with no area would leave the canvas permanently blank, so remember
    // the arguments and let the next frame try again once layout has settled.
    this.pending = null;
    if (r.width < 1 || r.height < 1) {
      this.pending = [theme, { mobile, live, tier }];
      return;
    }
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

  // Theme switch: fade the old field out, re-seed, fade the new one in
  // (doc 7.5, "cross-dissolve: old fade 0.6s, new fade-in 0.6s").
  crossfade(theme, opts) {
    if (!this.theme || !this.parts.length) {
      this.reset(theme, opts);
      this.alpha = 1;
      this.fadeTo = 1;
      return;
    }
    this.next = [theme, opts];
    this.fadeTo = 0;
  }

  // View switch: "particles briefly converge to card centre, then re-scatter".
  converge() {
    this.converging = 26;
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

    // Advance the cross-dissolve, swapping fields at the darkest point.
    if (this.alpha !== this.fadeTo) {
      const dir = Math.sign(this.fadeTo - this.alpha);
      this.alpha = Math.max(0, Math.min(1, this.alpha + dir * FADE_PER_FRAME));
      if (this.alpha === 0 && this.next) {
        const [theme, opts] = this.next;
        this.next = null;
        this.reset(theme, opts);
        this.fadeTo = 1;
      }
    }

    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!this.parts.length || this.alpha <= 0) return;

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

    // While converging, everything is pulled toward the card; the pull eases off
    // over the window and the residual inward velocity becomes the re-scatter.
    const pull = this.converging > 0 ? (this.converging / 26) * 0.9 : 0;
    if (this.converging > 0) this.converging--;

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

      if (pull > 0) {
        const cx = p.x - w / 2;
        const cy = p.y - h / 2;
        const l = Math.hypot(cx, cy) || 1;
        p.vx -= (cx / l) * pull;
        p.vy -= (cy / l) * pull;
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

      ctx.globalAlpha = p.a * 0.8 * this.alpha;
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
