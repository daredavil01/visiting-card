# 3D Interactive Visiting Card — Design Document

**Author:** Sanket Tambare  
**Version:** 2.0 · August 2026  
**Status:** Design Phase — Updated with research & persona views

---

## 1. Vision

A single-URL, physics-aware 3D visiting card that people remember — and that reshapes itself depending on who's looking.

Not a flat page with a shadow. A real object in space: holographic foil that catches light as you tilt it, a flip to reveal a second face, five material worlds you can toggle between, and four persona lenses that rewrite what's on the card. Show a recruiter your stack. Show a trail runner your race log. Show a trek group your summit count. Show anyone the full picture.

**The one-liner:** *"A card you want to play with before you read."*

---

## 2. Two Axes of Customization

The card has two independent controls, both always visible:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [THEME toggle — pill in top-right corner]        │
│  Wanderer · Terminal · Sahyadri · Blueprint · Data│
│                                                  │
│               ┌──────────────┐                   │
│               │              │                   │
│               │   3D CARD    │                   │
│               │              │                   │
│               └──────────────┘                   │
│                                                  │
│  [VIEW filter — segmented control, bottom-left]   │
│  General · Developer · Runner · Trekker           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**THEME** changes how the card looks — material, lighting, particles, fonts, environment.  
**VIEW** changes what the card says — title, tagline, stats, links, back-face content.

They compose independently: "Terminal" theme × "Runner" view is a green-phosphor card showing race stats. "Sahyadri Dawn" theme × "Developer" view is a warm handmade-paper card showing your tech stack. Any combination works.

---

## 3. View System — Four Persona Lenses

Each view rewrites the card's title line, tagline, stat blocks, back-face content, and which links are prioritized. The name "SANKET TAMBARE" and location "Pune, India · 18°34'N" stay constant across all views.

---

### 3.1 — General View (Default)

The full picture. Shows you as a multi-dimensional person, not a job title.

**Front Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  ◆  [Animated logo / sigil]                 │
│                                             │
│  SANKET TAMBARE                             │
│  Software Developer · Runner · Writer       │
│                                             │
│  "A developer who runs at dawn              │
│   and reads past midnight."                 │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 20+ │ │ 43+ │ │ 15+ │ │ 1.6K│          │
│  │races│ │books│ │treks│ │posts│          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
│                                             │
│  Pune, India · 18°34′N                      │
│                                             │
└─────────────────────────────────────────────┘
```

**Back Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  CONNECT                                    │
│                                             │
│  ✉  sanket.tambare01@gmail.com              │
│  🔗  sankettambare.in                       │
│  💼  linkedin.com/in/sankettambare          │
│  🐙  github.com/daredavil01                 │
│  ✍️  sankettambare.substack.com             │
│  🐦  @i_daredavil                           │
│                                             │
│  ──────────────────────────                 │
│                                             │
│  NOW                                        │
│  → Bridgenext · DORA metrics & ETL          │
│  → NAST Fellow · AI governance research     │
│  → Training for Khadakwasla Ultra 55K       │
│                                             │
│  [⬇ vCard]  [📋 Copy]  [📎 Resume]        │
│                                             │
│  "Critically engaging with the world,       │
│   one commit at a time."                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 3.2 — Developer View

For recruiters, collaborators, and open-source people. Speaks the language of stacks and systems.

**Front Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  </>  [Code bracket sigil, pulsing cursor]  │
│                                             │
│  SANKET TAMBARE                             │
│  Full-Stack Developer · Data Engineer       │
│                                             │
│  "Pipelines by day,                         │
│   open-source by night."                    │
│                                             │
│  STACK                                      │
│  React · Next.js · Python · FastAPI         │
│  AWS · Snowflake · Databricks · Terraform   │
│  GraphQL · Spring Boot · Kafka              │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ RHCSA│ │ 9yrs │ │ NAST │               │
│  │ cert │ │build │ │fellow│               │
│  └──────┘ └──────┘ └──────┘               │
│                                             │
│  Pune, India · 18°34′N                      │
│                                             │
└─────────────────────────────────────────────┘
```

**Back Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  CONNECT                                    │
│                                             │
│  🐙  github.com/daredavil01                 │
│  💼  linkedin.com/in/sankettambare          │
│  📝  dev.to/daredavil                       │
│  ✉   sanket.tambare01@gmail.com             │
│                                             │
│  ──────────────────────────                 │
│                                             │
│  CURRENT WORK                               │
│  → Bridgenext · DORA-metric pipelines,      │
│    GitLab API → Lambda → Databricks →       │
│    Tableau                                  │
│  → NAST Fellow · Citizen agency in AI       │
│    governance for public deployments        │
│                                             │
│  SELECTED PROJECTS                          │
│  → RunSmart — marathon plan generator       │
│  → E20 ka Chakravyuha — data journalism    │
│  → Adivasi Survey Dashboard — 281 HH,      │
│    28 charts, bilingual                     │
│                                             │
│  [⬇ vCard]  [📎 Resume]  [🐙 GitHub]      │
│                                             │
│  "Critically engaging with the world,       │
│   one commit at a time."                    │
│                                             │
└─────────────────────────────────────────────┘
```

**View-specific details:**
- GitHub contribution heatmap sparkline on front (if live data enabled)
- Links prioritize GitHub → LinkedIn → Dev.to → Email
- Stats emphasize certifications, years of experience, fellowship

---

### 3.3 — Runner View

For running clubs, race organizers, pacers, and the Strava crowd.

**Front Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  🏃  [Running figure silhouette, animated   │
│       stride cycle]                         │
│                                             │
│  SANKET TAMBARE                             │
│  Ultra Runner · 5×/week                     │
│                                             │
│  "From a first nervous 5K                   │
│   to a 50K ultra."                          │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 50K  │ │ 20+  │ │  FM  │ │  HM  │      │
│  │ultra │ │races │ │42.2K │ │21.1K │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│  ◆ Next: Khadakwasla Ultra 55K             │
│    22 Nov 2026                              │
│                                             │
│  Pune, India · 18°34′N                      │
│                                             │
└─────────────────────────────────────────────┘
```

**Back Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  RACE LOG (selected)                        │
│                                             │
│  ─ Tata Ultra Marathon    50 KM  Lonavala   │
│  ─ Full Marathon          42.2K             │
│  ─ Half Marathons (×many) 21.1K             │
│  ─ 10K & 5K series        short             │
│                                             │
│  ──────────────────────────                 │
│                                             │
│  TRAINING                                   │
│  → 5 runs/week, dawn sessions              │
│  → 10-week block for KU 55K                │
│  → River route, Pune                        │
│                                             │
│  CONNECT                                    │
│  🏃  strava.com/athlete/sanket (if exists)  │
│  🔗  sankettambare.in/sports                │
│  📱  runfolio.sankettambare.in              │
│  ✉   sanket.tambare01@gmail.com             │
│                                             │
│  [⬇ vCard]  [🏃 RunFolio]  [📊 Race Log]  │
│                                             │
│  "Running five days a week isn't training   │
│   for a number — it's how the day           │
│   gets its shape."                          │
│                                             │
└─────────────────────────────────────────────┘
```

**View-specific details:**
- Live Strava data: last run distance, pace, weekly mileage (via Strava MCP)
- Animated heartbeat pulse on the stat blocks
- Links prioritize Strava → RunFolio → Sports page → Email
- "Next race" countdown badge if within 90 days

---

### 3.4 — Trekker View

For trekking groups, Sahyadri explorers, and fort enthusiasts.

**Front Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  ⛰️  [Mountain peak silhouette,             │
│       parallax depth layers]                │
│                                             │
│  SANKET TAMBARE                             │
│  Sahyadri Trekker · Fort Collector          │
│                                             │
│  "15+ summits, and one                      │
│   22-hour night march."                     │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ 15+  │ │ 22hr │ │  ∞   │               │
│  │treks │ │night │ │still │               │
│  │done  │ │march │ │to go │               │
│  └──────┘ └──────┘ └──────┘               │
│                                             │
│  ◆ Signature: Panhala → Pawankhind         │
│    The 22hr historic night trek             │
│                                             │
│  Pune, India · 18°34′N                      │
│                                             │
└─────────────────────────────────────────────┘
```

**Back Face:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  SUMMIT LOG (selected)                      │
│                                             │
│  ⛰ Panhala → Pawankhind   22hr night march │
│  ⛰ Sahyadri fort series    15+ summits      │
│  ⛰ Ridge routes & historic trails           │
│                                             │
│  ──────────────────────────                 │
│                                             │
│  WHAT I SEEK                                │
│  → Forts with history and difficult         │
│    approaches                               │
│  → Night treks and endurance routes         │
│  → Weekend Sahyadri exploration             │
│                                             │
│  CONNECT                                    │
│  🔗  sankettambare.in/treks                 │
│  📸  Photos & route maps on the live page   │
│  ✉   sanket.tambare01@gmail.com             │
│  💼  linkedin.com/in/sankettambare          │
│                                             │
│  [⬇ vCard]  [⛰ Trek Log]  [📸 Photos]     │
│                                             │
│  "Weekends belong to the Sahyadris —        │
│   forts, ridgelines, and the long           │
│   historic routes."                         │
│                                             │
└─────────────────────────────────────────────┘
```

**View-specific details:**
- Mountain silhouette with parallax depth layers on front
- Elevation profile sparkline (if trek data available)
- Links prioritize Trek page → Photos → Email → LinkedIn

---

## 4. View Transition Animation

When the user switches views, the card content doesn't just swap — it transitions:

```
Behavior:
1. Card does a quick half-flip (90° on Y-axis) — content disappears edge-on
2. During the edge-on moment (content invisible), swap the content
3. Card completes the flip back to face-forward (90° → 0°)
4. New stat blocks count up from zero
5. New tagline types in (typewriter, 40ms per character)
6. Total duration: ~0.6s

Alternative (no-flip): Holographic shimmer wipe
1. A rainbow holographic band sweeps across the card left-to-right
2. Content behind the band changes as it passes (like a reveal wipe)
3. Band width: ~60px, duration: 0.5s
4. Particles burst outward from the band as it crosses
```

**URL parameter:** `?view=developer|runner|trekker|general`

---

## 5. Theme System — Five Switchable Worlds

Each theme changes the card's material, lighting, environment, particles, and typography — not just colors. Themes are independent of views; any theme × view combination is valid.

### Research-Backed Material Upgrades (from the deep dive)

Before the per-theme specs, these are the premium material techniques to apply across themes where appropriate:

**Holographic Foil Effect** (from pokemon-cards-css pattern):
```
- Map pointer/gyro coordinates to CSS custom properties (--pointer-x, --pointer-y)
- Drive gradient position and blend-mode layers from those properties
- Use background-blend-mode + mix-blend-mode for rainbow refraction
- Apply as a subtle overlay on the card surface, intensity varies per theme
```

**Iridescent Physical Material** (from Vercel badge pattern):
```jsx
<meshPhysicalMaterial
  clearcoat={1}
  clearcoatRoughness={0.15}
  iridescence={1}
  iridescenceIOR={1.3}
  iridescenceThicknessRange={[0, 2400]}
  metalness={0.5}
  roughness={0.3}
/>
```

**Glass/Refraction** (drei MeshTransmissionMaterial):
```jsx
<MeshTransmissionMaterial
  transmission={0.95}
  thickness={0.5}
  roughness={0.1}
  chromaticAberration={0.03}
  anisotropy={0.3}
  ior={1.5}
/>
```

**Postprocessing Stack** (applied globally, tiered by device):
```jsx
<EffectComposer disabled={isLowTier}>
  <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.4} intensity={0.6} />
  <ChromaticAberration offset={[0.001, 0.001]} />
  <Noise opacity={0.02} />
  <Vignette darkness={0.4} />
</EffectComposer>
```

---

### Theme 1: "The Wanderer" (Default)

**Concept:** Night sky over the Sahyadris. The card is a slab of dark stone floating in space, edge-lit like a headlamp catching rock.

| Token | Value |
|---|---|
| Card surface | Matte charcoal `#1A1A2E` with subtle topographic contour lines |
| Accent | Warm amber `#E8A838` — headlamp beam |
| Text | Off-white `#F0EDE5` — aged paper |
| Environment | Deep navy void `#0A0A1A` with slow-drifting star particles |
| Card edge | Brushed copper rim with Fresnel edge-lighting |
| Material | `meshPhysicalMaterial` rough matte + normal-map stone grain |
| Holographic | Disabled — this theme is matte and tactile |
| Signature | Topographic elevation lines etched into surface, animate on tilt |
| Display font | **Space Grotesk** — geometric, adventurer's logbook |
| Body font | **Inter** — clean utility |
| Sound (v2) | Distant crickets, wind, crackling fire |

**Particles:** Slow-floating firefly dots in amber. Drift speed 0.2px/frame. Count: 150 desktop / 60 mobile.

---

### Theme 2: "Terminal"

**Concept:** Retro CRT monitor. Phosphor green on black, scanlines, flicker.

| Token | Value |
|---|---|
| Card surface | Near-black `#0D0D0D` with CRT scanline overlay |
| Accent | Phosphor green `#00FF41` |
| Text | Green `#00FF41` at 90% opacity, monospaced |
| Environment | Pure black — no particles, faint CRT flicker |
| Card edge | Thin green border-glow, monitor bezel |
| Material | Glossy `meshPhysicalMaterial` with `clearcoat={0.8}` — glass screen |
| Holographic | Disabled — anachronistic for CRT |
| Signature | Typewriter text reveal; blinking cursor at tagline end |
| Display font | **JetBrains Mono** |
| Body font | **JetBrains Mono** lighter weight |
| Sound (v2) | Keyboard clatter, faint electrical hum |

**Effects:** Scanlines scroll up at 0.5px/frame. Screen flicker every 8s. Text renders as if printed character-by-character on first view.

---

### Theme 3: "Sahyadri Dawn"

**Concept:** Sunrise over Western Ghats. Handmade paper with torn edges.

| Token | Value |
|---|---|
| Card surface | Warm cream `#FAF5E9` with visible paper fiber texture |
| Accent | Sunrise coral `#E06C4F` + forest green `#2D5A3D` |
| Text | Deep charcoal `#2C2C2C` |
| Environment | Gradient sky — peach `#FFD4B8` → soft blue `#B8D4E3` |
| Card edge | Torn/deckle edge — irregular, handmade, bump-mapped |
| Material | Rough matte `meshPhysicalMaterial` with paper bump map |
| Holographic | Subtle gold-foil stamp effect on name only |
| Signature | Hand-drawn SVG mountain silhouette across bottom edge |
| Display font | **Playfair Display** — editorial, literary |
| Body font | **Source Serif 4** — readable warmth |
| Sound (v2) | Morning birds, light wind, distant temple bell |

**Particles:** Slow-falling leaves and morning mist. Organic shapes, never uniform. Count: 80 desktop / 40 mobile.

---

### Theme 4: "Blueprint"

**Concept:** Engineering drawing on blue drafting paper.

| Token | Value |
|---|---|
| Card surface | Blueprint blue `#1B3A5C` with white grid lines (2mm spacing) |
| Accent | White `#FFFFFF` + red annotation `#E74C3C` |
| Text | White `#FFFFFF` — hand-lettering style |
| Environment | Darker blue `#0F2440` with infinite grid plane |
| Card edge | Dashed border — cut line with crop marks |
| Material | Flat matte — drafting paper, no reflections |
| Holographic | Disabled — blueprints don't shimmer |
| Signature | Dimension lines measuring the card: "85.6 mm × 53.98 mm · SCALE 1:1 · REV 2026.08" |
| Display font | **Caveat** — hand-drawn technical lettering |
| Body font | **IBM Plex Mono** — engineering precision |
| Sound (v2) | Pencil scratching, paper shuffle |

**Effects:** Grid lines pulse outward from center on load. Annotations fade in sequentially with red circles and arrows.

---

### Theme 5: "Holographic"

**Concept:** Premium holographic foil card — the pokemon-cards-css pattern applied to a business card. The card itself IS the signature effect.

| Token | Value |
|---|---|
| Card surface | Dark gunmetal `#1C1C2E` base with full holographic foil overlay |
| Accent | Rainbow iridescent — shifts with tilt angle |
| Text | Bright white `#FFFFFF` with subtle emboss/deboss effect |
| Environment | Near-black `#08080F` — the card's own light is the environment |
| Card edge | Iridescent rim — `iridescence={1}` + `clearcoat={1}` |
| Material | `meshPhysicalMaterial` with full iridescence + clearcoat stack |
| Holographic | **Maximum** — this IS the holographic theme |
| Signature | Rainbow light bands sweep across the card following tilt angle; text appears stamped/embossed into the foil |
| Display font | **Sora** — geometric, modern, clean against the busy surface |
| Body font | **DM Sans** — high readability against shimmer |
| Sound (v2) | Metallic chime on flip, ambient crystalline tones |

**Holographic implementation (research-backed):**
```
CSS layer stack (from pokemon-cards-css pattern adapted):
1. Base layer: gunmetal background
2. Gradient layer: radial gradient keyed to --pointer-x, --pointer-y
3. Foil pattern: repeating-conic-gradient (rainbow spectrum)
4. Blend: background-blend-mode: color-dodge + overlay
5. Specular: radial highlight following pointer position
6. All layers shift position based on tilt angle (mapped from
   mouse position or gyroscope)

In R3F: combine with meshPhysicalMaterial iridescence for
the 3D card mesh itself, while the content face uses the
CSS blend-mode stack via drei's <Html> or <RenderTexture>.
```

**Particles:** Tiny prismatic sparkle points that catch light as the card tilts. High opacity near the card, fade with distance. Count: 100 desktop / 50 mobile.

---

## 6. Theme × View Matrix — Quick Reference

Shows which signature element appears for each combination:

| | General | Developer | Runner | Trekker |
|---|---|---|---|---|
| **Wanderer** | Topo lines + fireflies | Topo lines + `git log` | Topo lines + trail | Topo lines + summit dots |
| **Terminal** | Green text + cursor | Green text + code block | Green text + pace data | Green text + elevation |
| **Sahyadri** | Paper + mountains | Paper + hand-drawn diagrams | Paper + route sketch | Paper + fort illustration |
| **Blueprint** | Grid + dimensions | Grid + architecture diagram | Grid + route elevation | Grid + fort floor plan |
| **Holographic** | Rainbow foil + stats | Rainbow foil + stack badges | Rainbow foil + race badges | Rainbow foil + summit badges |

---

## 7. Interaction Design

### 7.1 Mouse/Tilt Tracking (with Holographic Foil)

```
Behavior:
- Card tilts max ±15° on X and Y axes
- Tilt follows cursor position relative to card center
- Easing: spring physics (stiffness: 150, damping: 15)
- Light source moves OPPOSITE to tilt → realistic specular sheen
- Holographic foil gradient shifts WITH tilt → rainbow sweep
- Inner elements (text, stats) have parallax offset (2-4px depth)
- Dynamic shadow falls opposite the cursor direction
- Fresnel edge-rim brightens at steep angles
- On mobile: DeviceOrientationEvent (gamma=LR, beta=FB)
  with iOS requestPermission() gate
- Reset to flat on cursor-leave (spring ease-out, 0.6s)
```

### 7.2 Magnetic Cursor

```
Behavior (research-backed, GSAP pattern):
- When cursor enters card's bounding area (padding: 100px),
  card gently pulls toward cursor (strength: 0.3)
- Card center lerps toward cursor at 0.03 factor
- On cursor-leave: elastic snap-back (GSAP elastic.out)
- Contact links on back face have their own magnetic pull
  (strength: 0.4, radius: 40px per link)
- Cursor changes to a custom dot (12px, theme accent color)
  with a trailing circle (24px, 0.3 opacity, 60ms lag)
```

### 7.3 Flip (Front ↔ Back)

```
Behavior:
- Click/tap triggers 180° Y-axis rotation
- Duration: 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) — overshoot
- Card lifts toward viewer on Z-axis during flip (+20px)
- Holographic foil catches light dramatically mid-flip
- Edge glow intensifies at 90° (edge-on moment)
- Particle burst from card center on flip completion
- "Tap to flip" hint: ghost hand icon, fades after 3s on first visit
- Keyboard: Enter or Space to flip
```

### 7.4 Physics Drag

```
Behavior (Vercel badge / Rapier pattern):
- Click-and-hold (or touch-hold 150ms) grabs the card
- Card follows pointer with lerp lag (factor: 0.15)
- While dragged: card tilts based on drag velocity
- Release: spring-back to center with overshoot
  (rapier: restitution 0.5, damping 8)
- High-velocity release → full 360° spin before settling
- Shadow on ground plane follows card position
- Collision: card bounces off viewport edges
- Haptic: navigator.vibrate(10) on grab (mobile)
```

### 7.5 Particle Interaction

```
Behavior:
- Particles near cursor repel outward (radius: 80px, force: gentle)
- Card drag: particles trail behind with velocity-based spread
- Card flip: radial burst from card center
- Theme switch: cross-dissolve (old fade 0.6s, new fade-in 0.6s)
- View switch: particles briefly converge to card center, then re-scatter
- Count: 200 desktop / 80 mobile (auto-detect via navigator.hardwareConcurrency)
```

### 7.6 Hover Micro-interactions

```
Front face:
- Stat blocks: count-up from 0 on first view (duration: 1.2s, ease-out)
- Logo/sigil: slow continuous rotation (0.5rpm), scales 1.1× on hover
- View-specific sparkline: draws left-to-right on view enter

Back face:
- Contact links: magnetic pull + glow + scale(1.05) on hover
- Project items: slide-right reveal animation, staggered 80ms
- CTA buttons: fill animation (left-to-right color wipe) on hover
- vCard button: arrow icon bounces downward on hover
```

---

## 8. Technical Architecture

### Recommended Stack

```
React 18 + React Three Fiber (R3F)
├── @react-three/drei           — Text3D, Float, Environment, Html, RenderTexture
├── @react-three/rapier          — physics (drag/toss/spring/collision)
├── @react-three/postprocessing  — Bloom, ChromaticAberration, Noise, Vignette
├── framer-motion                — 2D UI (theme toggle, view filter, overlays)
├── zustand                      — global state (theme, view, cardSide)
├── leva                         — dev-mode physics tuning (strip in prod)
├── gsap                         — magnetic cursor, elastic snap
└── vite                         — build tool, tree-shaking
```

**Why this stack:** R3F is the same stack behind the Vercel Ship badge (the most influential 3D card on the web). drei gives you `MeshTransmissionMaterial`, `Float`, `Environment` and `Html` (for rendering DOM inside the 3D scene). Rapier gives physics. The pokemon-cards-css holographic technique layers on top via CSS blend-modes in drei's `<Html>` component. You get WebGL premium materials AND CSS foil effects in one card.

### Project Structure

```
card.sankettambare.in/
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Card.jsx              — 3D card mesh + materials
│   │   ├── CardFront.jsx         — front face (view-aware content)
│   │   ├── CardBack.jsx          — back face (view-aware content)
│   │   ├── Particles.jsx         — theme-aware particle system
│   │   ├── Environment.jsx       — lighting + HDR + background per theme
│   │   ├── HolographicOverlay.jsx — CSS blend-mode foil layer
│   │   ├── MagneticCursor.jsx    — custom cursor with GSAP
│   │   ├── ThemeToggle.jsx       — pill toggle (top-right)
│   │   └── ViewFilter.jsx        — segmented control (bottom-left)
│   ├── content/
│   │   ├── general.js            — text, stats, links for General view
│   │   ├── developer.js          — text, stats, links for Developer view
│   │   ├── runner.js             — text, stats, links for Runner view
│   │   └── trekker.js            — text, stats, links for Trekker view
│   ├── themes/
│   │   ├── wanderer.js           — tokens + material config
│   │   ├── terminal.js
│   │   ├── sahyadri.js
│   │   ├── blueprint.js
│   │   └── holographic.js
│   ├── hooks/
│   │   ├── useCardPhysics.js     — Rapier spring + drag logic
│   │   ├── useTilt.js            — mouse/gyro tilt + holographic mapping
│   │   ├── useTheme.js           — zustand theme store
│   │   ├── useView.js            — zustand view store
│   │   └── useDeviceTier.js      — detect GPU/CPU for perf tiering
│   ├── utils/
│   │   ├── vcard.js              — generate .vcf (view-aware fields)
│   │   ├── og-image.js           — static OG per theme
│   │   └── analytics.js          — track theme/view/flip/link events
│   └── assets/
│       ├── textures/             — normal maps, paper grain, foil patterns
│       ├── hdri/                 — environment maps (.hdr, compressed)
│       └── fonts/                — WOFF2 per theme
├── public/
│   ├── og-wanderer.png
│   ├── og-terminal.png
│   ├── og-sahyadri.png
│   ├── og-blueprint.png
│   ├── og-holographic.png
│   └── sanket-tambare.vcf
├── index.html
├── vite.config.js
└── package.json
```

### Zustand State Shape

```js
const useCardStore = create((set) => ({
  // Theme axis
  theme: 'wanderer',  // wanderer | terminal | sahyadri | blueprint | holographic
  setTheme: (t) => set({ theme: t }),

  // View axis
  view: 'general',    // general | developer | runner | trekker
  setView: (v) => set({ view: v }),

  // Card state
  side: 'front',      // front | back
  flip: () => set((s) => ({ side: s.side === 'front' ? 'back' : 'front' })),
  isDragging: false,
  setDragging: (d) => set({ isDragging: d }),

  // Performance
  deviceTier: 'high', // high | medium | low
  setDeviceTier: (t) => set({ deviceTier: t }),
}))
```

### Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Total bundle (gzipped) | < 450 KB |
| Texture assets | < 350 KB total (KTX2 compressed) |
| HDRI environment | < 100 KB (low-res, 256×128 for reflections) |
| Frame rate | 60 FPS desktop, 30+ FPS low-end mobile |
| Particle count | 200 high / 120 medium / 60 low tier |
| Font loading | 2 variable WOFF2 max per theme, font-display: swap |
| Postprocessing | Full on high, bloom-only on medium, off on low |

### Device Tiering

```js
function detectTier() {
  const cores = navigator.hardwareConcurrency || 2;
  const gl = document.createElement('canvas').getContext('webgl');
  const renderer = gl?.getExtension('WEBGL_debug_renderer_info');
  const gpu = renderer ? gl.getParameter(renderer.UNMASKED_RENDERER_WEBGL) : '';

  if (cores >= 8 && !gpu.includes('Intel')) return 'high';
  if (cores >= 4) return 'medium';
  return 'low';
}

// Tier effects:
// high:   full postprocessing, 200 particles, holographic foil, all textures
// medium: bloom only, 120 particles, simplified foil, compressed textures
// low:    no postprocessing, 60 particles, CSS-only foil, no normal maps
```

### Accessibility & Fallbacks

```
- prefers-reduced-motion: disable particles, tilt, physics, flip animation;
  show static front/back with CSS tab toggle; holographic shimmer stills
- prefers-color-scheme: auto-select Wanderer (dark) or Sahyadri (light)
- Keyboard: Enter/Space to flip, Tab through links, Arrow keys for theme/view
- Screen reader: full semantic HTML overlay with all contact info, ARIA labels
  on theme/view controls
- No-WebGL: detect support; fall back to flat HTML card with CSS 3D transforms
  and the holographic CSS-only foil effect (works without WebGL)
- iOS gyroscope: requestPermission() with graceful fallback to touch-drag
- Right-to-left: content is left-aligned English, no RTL needed
```

---

## 9. Distribution & URL Parameters

```
Primary:     card.sankettambare.in → Cloudflare Pages
Embed:       <iframe src="https://card.sankettambare.in?embed=true&theme=terminal&view=developer">
QR target:   https://card.sankettambare.in?utm_source=physical_card
Social:      OG images per theme, auto-selected by URL param
vCard:       static .vcf download, content adjusts to current view
```

### URL Parameters

```
?theme=wanderer|terminal|sahyadri|blueprint|holographic
?view=general|developer|runner|trekker
?side=front|back
?embed=true       — hides background, removes controls
?autoflip=true    — flips after 3s (for embeds)
?sound=true       — enables ambient audio (v2)
```

**Smart defaults for sharing:**
- LinkedIn share → `?view=developer&theme=terminal`
- Strava share → `?view=runner&theme=wanderer`
- Trek group share → `?view=trekker&theme=sahyadri`
- General share → no params (defaults to general + wanderer)

---

## 10. Design Inspiration References (Research-Backed)

| Reference | What to borrow | URL |
|---|---|---|
| **Vercel Ship 2024 badge** | Physics drag, R3F + Rapier, iridescent material | vercel.com/blog |
| **pokemon-cards-css** | Holographic foil CSS blend-mode stack, pointer-reactive | poke-holo.simey.me |
| **cards-css** | 14 procedural foils (aurora, prism, oilslick) + gyroscope | kongyo2.github.io/cards-css |
| **Igloo Inc** (Awwwards SOTY 2024) | Shader craft, chromatic aberration, frost dissolves | igloo.inc |
| **Lusion v3** (Awwwards SOTY) | Mobile geometry tiering, matcap rendering | lusion.co |
| **Bruno Simon portfolio** | Immersive 3D world, positional sound | bruno-simon.com |
| **Codrops 3D Glass Portal** | MeshTransmissionMaterial + glass card | tympanus.net/codrops |
| **Your own "The Self" orb** | Particle behavior tied to wellbeing meters | daredavil01.github.io |

---

## 11. Stretch Goals (v2)

| Feature | Description |
|---|---|
| **Live data feeds** | Strava last run, GitHub streak, current book, latest Substack post |
| **Sound design** | Per-theme ambient audio: crickets, keyboard, birds, pencil, chime |
| **AR mode** | WebXR — place the card on a real surface via phone camera |
| **NFC physical card** | Minimal printed card with NFC chip → opens 3D card URL |
| **Analytics dashboard** | Track theme/view popularity, flip rate, link CTR |
| **Visitor card generator** | Let visitors create their own card using your template |
| **Seasonal auto-themes** | Diwali (rangoli particles), Holi (color powder burst), monsoon (rain) |
| **Lanyard mode** | Vercel-style: card dangles from a lanyard, swings on physics |
| **View Transitions API** | Circle-wipe / diamond-reveal on theme switch |

---

## 12. Build Phases

### Phase 1 — Core Card + General View (Week 1)
- R3F scene: camera, lights, ground shadow
- Card mesh with front/back geometry
- General view content on both faces
- Mouse tilt tracking with spring physics
- Click-to-flip with 3D rotation
- "Wanderer" theme only
- Deploy to Cloudflare Pages

### Phase 2 — Physics, Particles & Views (Week 2)
- Drag-and-toss with Rapier spring return
- Particle system (theme-aware)
- Mobile gyroscope with iOS permission gate
- **All four views** with content switching
- View transition animation (half-flip swap)
- View segmented control UI

### Phase 3 — Full Theme System (Week 3)
- All 5 themes with materials, particles, fonts
- Holographic foil effect (CSS + iridescent material)
- Theme toggle with cross-dissolve transitions
- Postprocessing stack (Bloom + ChromaticAberration)
- Device tiering and performance gating
- Magnetic cursor with GSAP

### Phase 4 — Distribution & Polish (Week 4)
- vCard generation (view-aware)
- Embed mode (`?embed=true`)
- URL parameter support for all axes
- OG images per theme
- No-WebGL flat fallback
- Accessibility audit (keyboard, screen reader, reduced motion)
- QR code generation
- Analytics events

---

*This document is the source of truth for the 3D visiting card project. All implementation decisions trace back here. Version 2.0 incorporates deep research on award-winning 3D card patterns (Vercel badge, pokemon-cards-css holographic foil, Igloo Inc craft standards) and the persona-based view system.*
