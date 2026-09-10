# Development Status — 3D Interactive Visiting Card

A single-URL, physics-aware interactive visiting card with two independent axes:
**5 themes** (how it looks) × **5 views** (what it says).

| | |
|---|---|
| **Design doc** | [`docs/3d-visiting-card-design-doc-v2.md`](docs/3d-visiting-card-design-doc-v2.md) — source of truth |
| **Design prototype** | [Claude Design artifact `a31e7d3a`](https://claude.ai/code/artifact/a31e7d3a-6b12-47c8-ab73-2bd9bd764115) |
| **Target URL** | `card.sankettambare.in` (Cloudflare Pages) |
| **Owner** | Sanket Tambare |
| **Last updated** | 2026-09-10 |

---

## Current status

**Phase 4 in progress — feature-complete port, not yet deployed.**

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

What runs today: all 5 themes × all 5 views, tilt, flip, drag-and-toss, particles,
magnetic cursor, typewriter tagline, count-up stats, URL params, embed mode,
vCard download, keyboard control, reduced-motion and low-tier fallbacks.

---

## Stack decision

Built as **React 18 + Vite with CSS 3D transforms and a 2D-canvas particle layer** —
a direct port of the design prototype, *not* the React Three Fiber stack sketched in
design doc §8.

**Why:** the prototype already delivers the full spec (tilt, flip, drag physics, foil,
particles, all themes and views) with no WebGL dependency. It ships now, stays tiny,
works on every device including the ones that would have needed the doc's no-WebGL
fallback anyway, and prints cleanly. R3F is kept as an optional upgrade layer (Phase 5)
rather than a prerequisite.

**Dependencies, deliberately minimal:**

| Package | Why |
|---|---|
| `react`, `react-dom` | UI |
| `zustand` | theme / view / side store (doc §8) |
| `vite`, `@vitejs/plugin-react` | build |
| `qrcode` (dev) | `scripts/check-qr.mjs` verifies the hand-rolled QR encoder in `src/utils/qr.js` |

Not installed: `framer-motion`, `gsap`, `@react-three/*`, `@react-three/rapier`, `leva`.
The rAF loop and CSS transitions cover what they would have done.

---

## Phases

### Phase 0 — Scaffold
- [x] Vite + React 18 project, minimal dependency set
- [x] `index.html` with meta, OG tags, Google Fonts
- [x] `.gitignore`, `status.md`
- [x] First commit on `main`

### Phase 1 — Core card
- [x] Stage, card mesh, front/back faces with `preserve-3d`
- [x] Mouse tilt tracking (±15°) with spring easing
- [x] Click / tap to flip with overshoot and edge-on lift
- [x] Wanderer theme
- [x] General view content on both faces
- [x] Typewriter tagline + count-up stats on intro

### Phase 2 — Physics, particles, views
- [x] Drag-and-toss with velocity spin and spring return
- [x] Canvas particle system, theme-aware (count, speed, size, glow)
- [x] Cursor repulsion, flip burst, toss spread
- [x] All four views with content switching
- [x] View segmented control
- [x] Magnetic cursor (dot + trailing ring, scales near card)
- [x] Mobile gyroscope with iOS `requestPermission()` gate

### Phase 3 — Theme system
- [x] All 5 themes: surface, pattern, edge, shadow, sheen, fonts, particles
- [x] Holographic foil layer (pointer-driven `color-dodge` gradient)
- [x] Terminal scanlines + flicker + block caret
- [x] Blueprint grid + dashed cut line + dimension label
- [x] Sahyadri paper grain + gold foil sweep
- [x] Theme toggle with swatches, 600 ms environment cross-fade

### Phase 4 — Distribution, a11y, polish
- [x] URL params: `theme`, `view`, `side`, `embed`, `autoflip`, `lowfx`
- [x] Address bar stays in sync (`history.replaceState`)
- [x] Embed mode — chrome hidden, transparent background
- [x] vCard generation, view-aware
- [x] Copy-to-clipboard, real links on every back-face row
- [x] Responsive layout — landscape 620 x 391, upright 372 x 590, each scaled to fit
- [x] Keyboard: Enter/Space flip, ←/→ view, ↑/↓ theme, visible focus ring
- [x] Screen-reader overlay with all contact info
- [x] `prefers-reduced-motion` respected
- [x] Device tiering — particle count scales, effects gate on low tier
- [ ] OG images per theme (5 PNGs) — **not generated**
- [ ] Deploy to Cloudflare Pages — **needs account access**
- [ ] QR code for the physical card
- [ ] Analytics events (theme / view / flip / link CTR)

### Phase 5 — Deferred (optional upgrade)
- [ ] R3F card layer: `meshPhysicalMaterial` iridescence + clearcoat, `MeshTransmissionMaterial`
- [ ] Postprocessing: Bloom, ChromaticAberration, Noise, Vignette
- [ ] Rapier physics for drag / toss / collision
- [ ] Keep the CSS card as the low-tier and no-WebGL fallback

### v2 stretch (doc §11)
- [ ] Live data — Strava last run, GitHub streak, latest Substack post
- [ ] Per-theme ambient sound (`?sound=true`)
- [ ] AR mode (WebXR)
- [ ] NFC physical card
- [ ] Seasonal auto-themes, lanyard mode, visitor card generator

---

## Content inventory

Every view in `src/content/` supplies the same shape. Adding a sixth view is mechanical:

| Field | Type | Notes |
|---|---|---|
| `label` | string | shown on the view chip |
| `sigil` | string | glyph in the card's top-left |
| `corner` | string | micro-label, top-right |
| `role` | string | line under the name |
| `tagline` | string | typewriter line |
| `stackLines` | string[] | optional — Developer only |
| `stats` | `{num, label}[]` | 3–4 blocks, count up on intro |
| `note` | string | optional — the `◆` line |
| `back.cols` | `{sections: {label, items: {key, text}[]}[]}[]` | two columns |
| `back.buttons` | string[] | CTA row; resolved to actions in `src/content/links.js` |
| `back.quote` | string | closing line |

Constant across all views: the name `SANKET TAMBARE` and `PUNE, INDIA · 18°34′N`.

Link hrefs live in `src/content/links.js`, keyed by the same `key` tokens the back-face
rows use (`MAIL`, `WEB`, `IN`, `GH`, `SUB`, `X`, `DEV`, `STRV`, `RUN`, `PIC`).

---

## Known gaps / open questions

| Item | Status |
|---|---|
| `strava.com/athlete/sanket` | **Unverified** — placeholder in the design doc. Renders as plain text, not a link, until the real handle is confirmed. |
| `dev.to/daredavil` | Unverified — linked optimistically. |
| `runfolio.sankettambare.in` | Unverified — linked optimistically. |
| Resume PDF | Not supplied. The `Resume` button points at `sankettambare.in/resume`. |
| OG images | Not generated. `index.html` references `/og-wanderer.png` etc.; the files do not exist yet. |
| Custom domain | `card.sankettambare.in` not yet configured. |
| Font payload | 8 families across the 5 themes, loaded from Google Fonts. Not counted in the bundle figure below; worth measuring before launch. |

---

## Budget check (design doc §8)

| Metric | Target | Actual |
|---|---|---|
| Total bundle (gzipped) | < 450 KB | **70 KB** (67.7 JS + 1.5 CSS + 0.9 HTML) — 16% of budget |
| Frame rate | 60 FPS desktop | rAF loop writes transforms directly, no React re-render per frame |
| Particle count | 200 / 120 / 60 by tier | 150 Wanderer, 100 Holographic, 80 Sahyadri, 40 Blueprint, 0 Terminal — scaled ×0.45 on mobile, 0 on low tier |

---

## Decision log

**2026-08-28 — CSS 3D over React Three Fiber.**
The design prototype was already a complete, working card built on CSS 3D + canvas.
Rebuilding it in R3F would have cost weeks and re-derived polish that already existed,
for a visual gain that mostly shows up in the Holographic theme. Ported the prototype
instead; R3F is Phase 5 and optional. The doc's "no-WebGL flat fallback" requirement
disappears as a consequence — the primary implementation *is* the fallback.

**2026-08-28 — Detected state, not toggled state.**
The prototype exposed `embed` / `no-webgl` / `reduced-motion` as manual chips for
demoing. In the app these are derived: `prefers-reduced-motion` from `matchMedia`,
device tier from `navigator.hardwareConcurrency` + GPU string, embed from the URL.
`?lowfx=true` forces the low path for testing.

**2026-08-28 — One card layout, scaled — not two size sets.**
The prototype carried a second, smaller set of type and spacing values for phones.
Porting it exposed why that cannot work: Developer's stack block plus three stat
tiles does not fit 197 px of card height at any font size, so the face clipped on
four of the twenty combinations. The card is now laid out once at 620 x 391 and
the whole thing is scaled to fit (`useCardScale`). Composition is identical
everywhere, overflow is impossible by construction, and there is one set of
numbers to maintain instead of two. Pointer deltas are divided by the scale so
dragging still tracks the cursor exactly.

**2026-09-10 — A second geometry for the upright phone, not a second type scale.**
The one-layout rule above held the card at 620 x 391 everywhere, which on a 375px
phone scaled it to 0.56 — a 347 x 219 sliver in an 812px screen, with body type
landing near 6px. A phone held upright now gets the same ISO 7810 ID-1 card stood
on its end, 372 x 590, at scale 0.94. What changes is the box and the direction the
faces flow: the back's two columns become one run of sections, the front's footer
stacks, and Blueprint and Sahyadri get portrait coordinates for their signatures
(preserveAspectRatio is `none`, so one coordinate set would have flattened the
callout circle into an ellipse). Every font size is inherited from the landscape
set, so the 2026-08-28 objection to two size sets still stands — there is still one
set of type numbers, and each face is still scaled to fit, so overflow remains
impossible by construction. Selected by `(max-width: 820px) and (orientation:
portrait)`: a phone turned sideways keeps the landscape card, which suits that
viewport shape better.

**2026-08-28 — `App` stays a class component.**
The animation loop writes `style.transform` directly on refs every frame and never
through React state. That is the reason it holds 60 FPS. Ported as-is rather than
converted to hooks; the store, URL sync, and media queries are hooks around it.
