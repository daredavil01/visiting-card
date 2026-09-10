import { Component, createRef } from 'react';
import Card from './components/Card.jsx';
import Particles, { ParticleField } from './components/Particles.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ViewFilter from './components/ViewFilter.jsx';
import MagneticCursor from './components/MagneticCursor.jsx';
import A11yOverlay from './components/A11yOverlay.jsx';
import SharePanel from './components/SharePanel.jsx';
import BackgroundToggle from './components/BackgroundToggle.jsx';
import { useCardStore } from './hooks/useCardStore.js';
import { useTheme } from './hooks/useTheme.js';
import { useView } from './hooks/useView.js';
import { useUrlSync } from './hooks/useUrlSync.js';
import { useDeviceTier } from './hooks/useDeviceTier.js';
import { useMediaQuery, MOBILE_QUERY, PORTRAIT_QUERY } from './hooks/useMediaQuery.js';
import { useCardScale } from './hooks/useCardScale.js';
import { useBackground } from './hooks/useBackground.js';
import { metricsFor } from './utils/metrics.js';
import { createGyro } from './utils/gyro.js';
import { analytics } from './utils/analytics.js';
import { SAFE_TOP } from './utils/safeArea.js';
import { VIEWS } from './content/index.js';

const MAX_TILT = 15; // degrees, design doc section 7.1
const MAGNET_PAD = 100; // px of bounding-box padding where the card starts to pull
const HINT_MS = 6000;
const AUTOFLIP_MS = 3000;
const RESTITUTION = 0.5; // bounce energy kept on a viewport-edge hit (doc 7.4)
const HINT_SEEN_KEY = 'card:hint-seen';
const STEP_MS = 1000 / 60; // the rate every spring constant is tuned against
const MAX_STEPS = 5; // per frame, so a slow frame cannot spiral
const MAX_CATCHUP_MS = 100;

// "Tap to flip" is a first-visit hint (doc 7.3), not a permanent fixture.
function firstVisit() {
  try {
    return !localStorage.getItem(HINT_SEEN_KEY);
  } catch {
    return true;
  }
}

// The card scene. A class component on purpose: the animation loop writes
// transforms straight onto refs every frame and must never trigger a render.
// React state here is only for things that genuinely change the DOM — the
// typewriter text, the counting stats, the hint, the mid-swap persona.
class Scene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagline: '',
      typing: true,
      stats: [],
      hint: firstVisit(),
      copied: false,
      // The persona currently painted on the card. Lags props.view by half a
      // flip so the swap happens while the content is edge-on (doc section 4).
      displayView: props.view,
      swapping: false,
    };

    this.stageRef = createRef();
    this.canvasRef = createRef();
    this.cardRef = createRef();
    this.shadowRef = createRef();
    this.frontLayerRef = createRef();
    this.dotRef = createRef();
    this.ringRef = createRef();

    this.frontRefs = {
      pattern: createRef(),
      foil: createRef(),
      sheen: createRef(),
      rim: createRef(),
    };
    this.backRefs = { pattern: createRef(), foil: createRef(), rim: createRef() };

    // All motion state. Deliberately a plain mutable object — it is read and
    // written 60 times a second.
    this.mo = {
      rx: 0, ry: 0, // current tilt
      trx: 0, try_: 0, // target tilt
      f: 0, fv: 0, // flip angle and its velocity
      x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, // position, velocity, target
      spin: 0, sv: 0, // toss spin
      drag: false, moved: false,
      px: 0, py: 0, lx: 0, ly: 0, // pointer grab offsets
      foilX: null, foilY: null,
      near: 0,
      swap: 0, // 0 idle, 1 turning away, 2 turning back
    };
    this.cur = { x: -100, y: -100, rx: -100, ry: -100 };
    this.field = null;
  }

  // --- lifecycle -----------------------------------------------------------

  componentDidMount() {
    this.field = new ParticleField(this.canvasRef.current);

    const st = this.stageRef.current;
    st.addEventListener('pointermove', this.onMove);
    st.addEventListener('pointerleave', this.onLeave);
    st.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('resize', this.resetField);

    this.runIntro();
    this.resetField();
    this.raf = requestAnimationFrame(this.loop);

    if (this.state.hint) {
      this.hintT = setTimeout(() => this.setState({ hint: false }), HINT_MS);
    }

    if (this.props.autoflip) {
      this.autoflipT = setTimeout(() => {
        this.props.flip();
        this.dismissHint();
      }, AUTOFLIP_MS);
    }

    analytics.load(this.props.theme, this.props.view, {
      embed: this.props.embed,
      tier: this.props.deviceTier,
    });

    // Tilt from the device sensor, where there is one. Started on the first
    // touch because iOS only grants the permission inside a user gesture.
    this.gyro = createGyro((x, y) => {
      if (!this.live() || this.mo.drag) return;
      this.mo.trx = x * MAX_TILT;
      this.mo.try_ = y * MAX_TILT;
      this.mo.foilX = 50 + y * 45;
      this.mo.foilY = 50 + x * 45;
    });
  }

  componentDidUpdate(prev) {
    // A new persona turns the card edge-on, swaps, and turns back.
    if (prev.view !== this.props.view) {
      this.startViewSwap();
      analytics.view(this.props.view, prev.view);
    }

    if (prev.theme !== this.props.theme) {
      analytics.theme(this.props.theme, prev.theme);
      this.field?.crossfade(this.props.t, this.fieldOpts());
    }

    if (
      prev.mobile !== this.props.mobile ||
      prev.reducedMotion !== this.props.reducedMotion ||
      prev.deviceTier !== this.props.deviceTier
    ) {
      this.resetField();
      if (prev.reducedMotion !== this.props.reducedMotion) this.runIntro();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.hintT);
    clearTimeout(this.autoflipT);
    clearTimeout(this.copyT);
    clearInterval(this.typeT);
    clearInterval(this.countT);
    const st = this.stageRef.current;
    if (st) {
      st.removeEventListener('pointermove', this.onMove);
      st.removeEventListener('pointerleave', this.onLeave);
      st.removeEventListener('pointerdown', this.onDown);
    }
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('resize', this.resetField);
    this.gyro?.stop();
  }

  // True when the visitor wants (and the device can afford) motion. Gates tilt,
  // drag, particles, the typewriter and the flip animation in one place.
  live() {
    return !this.props.reducedMotion && this.props.deviceTier !== 'low';
  }

  view() {
    return VIEWS[this.state.displayView];
  }

  // --- view transition (doc section 4) -------------------------------------

  startViewSwap() {
    // Reduced motion gets the content swap without the choreography.
    if (!this.live()) {
      this.setState({ displayView: this.props.view }, this.runIntro);
      return;
    }
    this.field?.converge();
    this.mo.swap = 1;
    this.setState({ swapping: true });
  }

  // Called from the loop at the edge-on moment, when the content is invisible.
  commitViewSwap() {
    this.mo.swap = 2;
    this.setState({ displayView: this.props.view, swapping: false }, this.runIntro);
    // The re-scatter half of the particle move.
    this.field?.spread(18);
  }

  // --- intro animation -----------------------------------------------------

  runIntro = () => {
    clearInterval(this.typeT);
    clearInterval(this.countT);
    const v = this.view();
    const full = v.tagline;

    if (!this.live()) {
      this.setState({ tagline: full, typing: false, stats: v.stats.map((s) => s.num) });
      return;
    }

    let i = 0;
    this.setState({ tagline: '', typing: true, stats: v.stats.map((s) => this.seed(s.num)) });
    this.typeT = setInterval(() => {
      i += 2;
      if (i >= full.length) {
        clearInterval(this.typeT);
        this.setState({ tagline: full, typing: false });
      } else {
        this.setState({ tagline: full.slice(0, i) });
      }
    }, 34);

    let step = 0;
    this.countT = setInterval(() => {
      step++;
      const k = Math.min(1, step / 26);
      const eased = 1 - Math.pow(1 - k, 3);
      this.setState({ stats: v.stats.map((s) => this.tween(s.num, eased)) });
      if (k >= 1) clearInterval(this.countT);
    }, 34);
  };

  // "43+" starts at "00+"; "RHCSA" has no digits, so it just appears.
  seed(num) {
    return /\d/.test(num) ? num.replace(/\d/g, '0') : num;
  }

  tween(num, e) {
    const match = String(num).match(/[\d.]+/);
    if (!match) return num;
    const target = parseFloat(match[0]);
    const cur = target * e;
    const shown = match[0].includes('.') ? cur.toFixed(1) : String(Math.round(cur));
    return String(num).replace(match[0], shown);
  }

  // --- interaction ---------------------------------------------------------

  dismissHint = () => {
    if (!this.state.hint) return;
    this.setState({ hint: false });
    try {
      localStorage.setItem(HINT_SEEN_KEY, '1');
    } catch {
      // Private mode; the hint simply shows again next time.
    }
  };

  onFlip = () => {
    // A drag that ended over the card should not also count as a click.
    if (this.mo.moved) {
      this.mo.moved = false;
      return;
    }
    this.props.flip();
    this.dismissHint();
    analytics.flip(
      this.props.side === 'front' ? 'back' : 'front',
      this.props.theme,
      this.props.view,
    );
    if (this.live()) this.field?.burst();
  };

  onKey = (e) => {
    const { cycleTheme, cycleView } = this.props;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.onFlip();
        break;
      case 'ArrowRight':
        e.preventDefault();
        cycleView(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        cycleView(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        cycleTheme(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        cycleTheme(-1);
        break;
      default:
    }
  };

  onMove = (e) => {
    this.cur.x = e.clientX;
    this.cur.y = e.clientY;

    const c = this.cardRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);

    if (this.live()) {
      this.mo.try_ = Math.max(-1, Math.min(1, dx)) * MAX_TILT;
      this.mo.trx = Math.max(-1, Math.min(1, -dy)) * MAX_TILT;

      // Magnetic pull: inside the padded bounding box the card leans toward the
      // cursor; outside it, it returns to centre.
      const inside =
        Math.abs(e.clientX - cx) < r.width / 2 + MAGNET_PAD &&
        Math.abs(e.clientY - cy) < r.height / 2 + MAGNET_PAD;
      this.mo.near = inside ? 1 : 0;
      if (!this.mo.drag) {
        // Pointer deltas are screen pixels; the card's own translate lives inside
        // a scaled wrapper, so divide through or the card lags the cursor on any
        // viewport small enough to shrink it.
        const s = this.props.scale || 1;
        this.mo.tx = inside ? ((e.clientX - cx) * 0.12) / s : 0;
        this.mo.ty = inside ? ((e.clientY - cy) * 0.12) / s : 0;
      }

      this.mo.foilX = 50 + dx * 45;
      this.mo.foilY = 50 + dy * 45;
    }

    if (this.mo.drag) {
      const s = this.props.scale || 1;
      this.mo.tx = (e.clientX - this.mo.px) / s;
      this.mo.ty = (e.clientY - this.mo.py) / s;
      if (Math.abs(this.mo.tx) > 6 || Math.abs(this.mo.ty) > 6) this.mo.moved = true;
    }
  };

  onLeave = () => {
    this.mo.trx = 0;
    this.mo.try_ = 0;
    this.mo.tx = 0;
    this.mo.ty = 0;
    this.cur.x = -100;
    this.cur.y = -100;
  };

  onDown = (e) => {
    // First touch is the user gesture iOS needs before it will hand over the
    // orientation sensor. Harmless everywhere else.
    if (!this.gyroTried && e.pointerType !== 'mouse') {
      this.gyroTried = true;
      this.gyro?.start();
    }
    if (!this.live()) return;
    const c = this.cardRef.current;
    if (!c || !c.contains(e.target)) return;

    this.mo.drag = true;
    this.mo.moved = false;
    const s = this.props.scale || 1;
    this.mo.px = e.clientX - this.mo.x * s;
    this.mo.py = e.clientY - this.mo.y * s;
    this.mo.lx = e.clientX;
    this.mo.ly = e.clientY;
    navigator.vibrate?.(10);
  };

  onUp = (e) => {
    if (!this.mo.drag) return;
    this.mo.drag = false;

    // Horizontal release velocity becomes spin; a hard flick guarantees a full
    // rotation before it settles.
    const vx = e.clientX - this.mo.lx;
    this.mo.sv = Math.max(-14, Math.min(14, vx * 0.5));
    if (Math.abs(vx) > 26) this.mo.sv = Math.sign(vx) * 16;
    this.mo.tx = 0;
    this.mo.ty = 0;
    this.field?.spread(Math.abs(vx));
  };

  onCopied = (ok) => {
    if (!ok) return;
    analytics.copy(this.props.view);
    clearTimeout(this.copyT);
    this.setState({ copied: true });
    this.copyT = setTimeout(() => this.setState({ copied: false }), 1800);
  };

  onLink = (key) => analytics.link(key, this.props.view);

  // --- frame loop ----------------------------------------------------------

  fieldOpts() {
    return {
      mobile: this.props.mobile,
      live: this.live(),
      tier: this.props.deviceTier,
    };
  }

  resetField = () => {
    this.field?.reset(this.props.t, this.fieldOpts());
  };

  // Keep the card inside the viewport, bouncing off the edges (doc 7.4).
  // Works in card space, so the limits are divided by the display scale.
  clampToViewport(mo) {
    const c = this.cardRef.current;
    if (!c) return;
    const s = this.props.scale || 1;
    const halfW = (c.offsetWidth * s) / 2;
    const halfH = (c.offsetHeight * s) / 2;
    const limitX = Math.max(0, (window.innerWidth / 2 - halfW) / s);
    const limitY = Math.max(0, (window.innerHeight / 2 - halfH) / s);

    if (mo.x > limitX) {
      mo.x = limitX;
      mo.vx = -Math.abs(mo.vx) * RESTITUTION;
    } else if (mo.x < -limitX) {
      mo.x = -limitX;
      mo.vx = Math.abs(mo.vx) * RESTITUTION;
    }
    if (mo.y > limitY) {
      mo.y = limitY;
      mo.vy = -Math.abs(mo.vy) * RESTITUTION;
    } else if (mo.y < -limitY) {
      mo.y = -limitY;
      mo.vy = Math.abs(mo.vy) * RESTITUTION;
    }
  }

  // One physics tick, always worth exactly STEP_MS of motion.
  //
  // The springs are tuned as per-frame constants, which silently made every
  // animation twice as fast on a 120Hz display and half-speed on a struggling
  // one — and the design doc specifies durations in seconds. Stepping on a fixed
  // accumulator keeps the tuning honest on any refresh rate.
  step() {
    const mo = this.mo;

    // Tilt eases toward its target; the flip is a real spring so it overshoots
    // and settles rather than stopping dead at 180.
    mo.rx += (mo.trx - mo.rx) * 0.12;
    mo.ry += (mo.try_ - mo.ry) * 0.12;

    const resting = this.props.side === 'back' ? 180 : 0;
    // Mid-swap the card is driven to the edge-on quarter turn instead.
    const flipTarget = mo.swap === 1 ? resting + 90 : resting;

    if (this.live()) {
      // A flip is a snappy overshoot; the view swap is a deliberate quarter turn
      // on a softer spring, so the whole gesture lands near the doc's ~0.6s.
      const stiffness = mo.swap ? 0.022 : 0.16;
      const damping = mo.swap ? 0.9 : 0.74;
      mo.fv += (flipTarget - mo.f) * stiffness;
      mo.fv *= damping;
      mo.f += mo.fv;
      // Content is invisible within a few degrees of edge-on: swap there.
      if (mo.swap === 1 && Math.abs(mo.f - flipTarget) < 6) this.commitViewSwap();
      else if (mo.swap === 2 && Math.abs(mo.f - resting) < 2) mo.swap = 0;
    } else {
      mo.f = resting;
    }

    const k = mo.drag ? 0.35 : 0.14;
    mo.vx += (mo.tx - mo.x) * k;
    mo.vx *= mo.drag ? 0.6 : 0.78;
    mo.x += mo.vx;
    mo.vy += (mo.ty - mo.y) * k;
    mo.vy *= mo.drag ? 0.6 : 0.78;
    mo.y += mo.vy;
    this.clampToViewport(mo);

    mo.spin += mo.sv;
    mo.sv *= 0.93;
    if (Math.abs(mo.sv) < 0.05) {
      mo.sv = 0;
      mo.spin *= 0.9;
      if (Math.abs(mo.spin) < 0.2) mo.spin = 0;
    }

    // Cursor ring trails the dot.
    this.cur.rx += (this.cur.x - this.cur.rx) * 0.18;
    this.cur.ry += (this.cur.y - this.cur.ry) * 0.18;
  }

  loop = (now = performance.now()) => {
    const mo = this.mo;
    const c = this.cardRef.current;

    // Catch up on elapsed time in fixed steps, capped so a backgrounded tab does
    // not come back and simulate a thousand frames at once.
    const elapsed = Math.min(MAX_CATCHUP_MS, now - (this.lastT ?? now));
    this.lastT = now;
    this.acc = (this.acc || 0) + elapsed;
    let steps = 0;
    while (this.acc >= STEP_MS && steps < MAX_STEPS) {
      this.step();
      this.acc -= STEP_MS;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;

    if (c) {
      // Lift toward the viewer while dragging, and at the edge-on moment of a
      // flip — that is where the foil catches the most light.
      const lift = mo.drag ? 40 : Math.abs(Math.sin((mo.f * Math.PI) / 180)) * 24;

      c.style.transform =
        `translate3d(${mo.x.toFixed(2)}px,${mo.y.toFixed(2)}px,${lift.toFixed(1)}px) ` +
        `rotateX(${mo.rx.toFixed(2)}deg) rotateY(${(mo.ry + mo.f + mo.spin).toFixed(2)}deg)`;

      // Shadow falls opposite the cursor and softens as the card lifts.
      const sh = this.shadowRef.current;
      if (sh) {
        sh.style.transform =
          `translate(${(mo.x - mo.ry * 1.6).toFixed(1)}px,${(mo.y + mo.rx * 1.6 + 18).toFixed(
            1,
          )}px) scale(${(1 + lift / 220).toFixed(3)})`;
        sh.style.opacity = Math.max(0, 0.75 - lift / 150).toFixed(2);
      }

      if (mo.foilX != null) {
        const pos = `${mo.foilX}% ${mo.foilY}%`;
        // Topographic contours and grid lines drift against the tilt, so the
        // surface reads as etched into the card rather than printed on it.
        const patternPos = `${(50 + (mo.ry / MAX_TILT) * 6).toFixed(1)}% ${(
          50 -
          (mo.rx / MAX_TILT) * 6
        ).toFixed(1)}%`;

        for (const refs of [this.frontRefs, this.backRefs]) {
          if (refs.foil.current) refs.foil.current.style.backgroundPosition = pos;
          if (refs.pattern.current) refs.pattern.current.style.backgroundPosition = patternPos;
        }
        // Sheen tracks opposite the foil so the highlight reads as a light
        // source the card is moving under, not a decal stuck to it.
        const sheen = this.frontRefs.sheen.current;
        if (sheen) sheen.style.backgroundPosition = `${100 - mo.foilX}% ${100 - mo.foilY}%`;
      }

      // Fresnel: the rim lights up as the card turns away from the viewer.
      const steep = Math.min(1, (Math.abs(mo.rx) + Math.abs(mo.ry)) / (MAX_TILT * 1.6));
      const rimOpacity = (steep * 0.85).toFixed(3);
      for (const refs of [this.frontRefs, this.backRefs]) {
        if (refs.rim.current) refs.rim.current.style.opacity = rimOpacity;
      }

      // Content sits forward of the surface and shifts against the tilt.
      const fl = this.frontLayerRef.current;
      if (fl) {
        fl.style.transform = `translate3d(${(mo.ry * 0.22).toFixed(2)}px,${(-mo.rx * 0.22).toFixed(
          2,
        )}px,26px)`;
      }
    }

    const d = this.dotRef.current;
    const rg = this.ringRef.current;
    if (d) d.style.transform = `translate(${this.cur.x}px,${this.cur.y}px)`;
    if (rg) {
      rg.style.transform =
        `translate(${this.cur.rx.toFixed(1)}px,${this.cur.ry.toFixed(1)}px) ` +
        `scale(${this.mo.near ? 1.9 : 1})`;
    }

    this.field?.draw(this.cur.x, this.cur.y);
    this.raf = requestAnimationFrame(this.loop);
  };

  // --- render --------------------------------------------------------------

  render() {
    const { t, m, mobile, portrait, embed, side, theme, view, setTheme, setView, urlHint,
      scale, bg, toggleBg } = this.props;
    const s = this.state;
    const v = this.view();
    const live = this.live();

    // Until the count-up has produced a value for every stat, show the finals —
    // this keeps a mid-flight view switch from rendering a ragged row.
    const statNums = s.stats.length === v.stats.length ? s.stats : v.stats.map((x) => x.num);

    return (
      <div
        ref={this.stageRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          overflow: 'hidden',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          background: embed ? 'transparent' : bg.env,
          transition: 'background 600ms ease',
        }}
      >
        <Particles canvasRef={this.canvasRef} />

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: embed ? 'none' : bg.envOverlay,
            transition: 'background 600ms ease',
          }}
        />

        {!embed && (
          <>
            <ThemeToggle t={t} active={theme} onPick={setTheme} compact={mobile} />
            <ViewFilter t={t} active={view} onPick={setView} urlHint={urlHint} compact={mobile} />
            <SharePanel t={t} view={view} theme={theme} compact={mobile} />
            {bg.canToggle && (
              <div
                style={{
                  position: 'absolute',
                  top: mobile ? SAFE_TOP : 26,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 6,
                }}
              >
                <BackgroundToggle t={t} mode={bg.mode} onToggle={toggleBg} compact={mobile} />
              </div>
            )}
          </>
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: mobile ? 20 : 40,
          }}
        >
          <div
            style={{
              position: 'relative',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <Card
              t={t}
              v={v}
              m={m}
              portrait={portrait}
              side={side}
              swapping={s.swapping}
              cardRef={this.cardRef}
              shadowRef={this.shadowRef}
              frontRefs={this.frontRefs}
              backRefs={this.backRefs}
              frontLayerRef={this.frontLayerRef}
              onFlip={this.onFlip}
              onKeyDown={this.onKey}
              tagline={s.tagline || v.tagline}
              caret={s.typing ? (t.key === 'terminal' ? '_' : '|') : ''}
              statNums={statNums}
              comboTag={`${t.label} × ${v.label}`.toUpperCase()}
              cursor={live ? 'grab' : 'pointer'}
              onCopied={this.onCopied}
              onLink={this.onLink}
            />

            {s.hint && !embed && (
              <div
                style={{
                  position: 'absolute',
                  bottom: m.hintBottom,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  font: "400 11px/1 'JetBrains Mono',monospace",
                  letterSpacing: '.1em',
                  color: t.dim,
                  animation: 'hintbob 2.4s ease-in-out infinite',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>☝</span>
                {mobile ? 'TAP TO FLIP' : 'CLICK TO FLIP · DRAG TO TOSS'}
              </div>
            )}
          </div>
        </div>

        {s.copied && (
          <div
            role="status"
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 8,
              padding: '9px 14px',
              borderRadius: 8,
              border: `1px solid ${t.line2}`,
              background: 'rgba(8,8,15,.82)',
              backdropFilter: 'blur(8px)',
              font: "400 11px/1 'JetBrains Mono',monospace",
              letterSpacing: '.08em',
              color: t.accent,
            }}
          >
            CONTACT COPIED
          </div>
        )}

        <MagneticCursor
          t={t}
          dotRef={this.dotRef}
          ringRef={this.ringRef}
          hidden={mobile || !live}
        />

        <A11yOverlay v={v} />
      </div>
    );
  }
}

// Hook shell: everything reactive lives here, the scene below stays imperative.
export default function App() {
  useUrlSync();
  useDeviceTier();

  const t = useTheme();
  const v = useView();
  const mobile = useMediaQuery(MOBILE_QUERY);
  // A phone held upright gets the upright card, not a shrunken landscape one.
  const portrait = useMediaQuery(PORTRAIT_QUERY);

  const theme = useCardStore((s) => s.theme);
  const view = useCardStore((s) => s.view);
  const side = useCardStore((s) => s.side);
  const embed = useCardStore((s) => s.embed);
  const autoflip = useCardStore((s) => s.autoflip);
  const deviceTier = useCardStore((s) => s.deviceTier);
  const reducedMotion = useCardStore((s) => s.reducedMotion);
  const setTheme = useCardStore((s) => s.setTheme);
  const setView = useCardStore((s) => s.setView);
  const cycleTheme = useCardStore((s) => s.cycleTheme);
  const cycleView = useCardStore((s) => s.cycleView);
  const flip = useCardStore((s) => s.flip);

  const scale = useCardScale(mobile, embed, portrait);
  const bg = useBackground(t);
  const toggleBg = useCardStore((s) => s.toggleBg);

  const urlHint = `?theme=${theme}&view=${view}${embed ? '&embed=true' : ''}`;

  return (
    <Scene
      t={t}
      v={v}
      m={metricsFor(portrait)}
      scale={scale}
      mobile={mobile}
      portrait={portrait}
      theme={theme}
      view={view}
      side={side}
      embed={embed}
      autoflip={autoflip}
      deviceTier={deviceTier}
      reducedMotion={reducedMotion}
      setTheme={setTheme}
      setView={setView}
      cycleTheme={cycleTheme}
      cycleView={cycleView}
      flip={flip}
      urlHint={urlHint}
      bg={bg}
      toggleBg={toggleBg}
    />
  );
}
