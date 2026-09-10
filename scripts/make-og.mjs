// Renders the five Open Graph images — one per theme — into public/.
//
//   npm run og
//
// Why an SVG written here rather than a screenshot of the real card: a crawler's
// preview is a still 1200x630 frame, and the card's craft (tilt, foil, particles,
// physics) is all motion and pointer response. Reproducing the live card would
// have meant shipping a headless browser as a build dependency to photograph a
// thing that photographs badly anyway. This draws a still portrait of the card in
// each theme's own colours and faces, and resvg turns it into a PNG.
//
// Colours and fonts come from src/themes/, so a theme edit lands here on the next
// run. The two gradients per theme are the one thing restated: the theme files
// hold CSS gradient strings, which resvg cannot parse.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

import { THEMES } from '../src/themes/index.js';
import { OG_IMAGES, OG_SIZE } from '../src/utils/og-image.js';
import { IDENTITY } from '../src/content/links.js';
import general from '../src/content/general.js';
import { loadFonts } from './fonts.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');

const { width: W, height: H } = OG_SIZE;

// Card geometry: the landscape card from src/utils/metrics.js, centred and
// turned a few degrees so it reads as an object lying on a surface rather than a
// banner. At 3.5 degrees the rotated box is 643 x 428 — comfortably inside 1200 x 630.
const CARD = { w: 620, h: 391, tilt: -3.5 };
const CARD_X = (W - CARD.w) / 2;
const CARD_Y = (H - CARD.h) / 2;
const PAD = 44;

// Every family the five themes use, at the weights this image needs.
const FONT_SPEC = {
  'Space Grotesk': [700],
  'DM Sans': [400, 500],
  'JetBrains Mono': [400, 500, 700],
  'Playfair Display': [700],
  'Source Serif 4': [400],
  Caveat: [700],
  'IBM Plex Mono': [400, 500],
  Sora: [700],
};

// The gradients, restated for resvg. `bg` is the environment behind the card
// (theme.env), `card` is the slab itself (theme.surface). Kinds match the CSS.
const ART = {
  wanderer: {
    bg: { kind: 'radial', stops: ['#141433', '#0A0A1A', '#06060f'] },
    card: { kind: 'linear', angle: 155, stops: ['#22223c', '#16162a'] },
  },
  terminal: {
    bg: { kind: 'radial', stops: ['#04120a', '#000000', '#000000'] },
    card: { kind: 'linear', angle: 180, stops: ['#0D0D0D', '#0D0D0D'] },
  },
  sahyadri: {
    bg: { kind: 'linear', angle: 180, stops: ['#FFD4B8', '#F3D9CE', '#B8D4E3'] },
    card: { kind: 'linear', angle: 160, stops: ['#FFFBF2', '#F7F0E0'] },
  },
  blueprint: {
    bg: { kind: 'linear', angle: 180, stops: ['#0F2440', '#0a1a30'] },
    card: { kind: 'linear', angle: 180, stops: ['#1B3A5C', '#1B3A5C'] },
  },
  holographic: {
    bg: { kind: 'radial', stops: ['#14142a', '#08080F', '#08080F'] },
    card: { kind: 'linear', angle: 150, stops: ['#26263f', '#14141f'] },
  },
};

// CSS gradient angles run clockwise from "to top"; SVG wants a vector. Same
// convention the theme files were written in, so 155deg here means 155deg there.
function linearCoords(angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = Math.cos(rad) / 2;
  const y = Math.sin(rad) / 2;
  return { x1: 0.5 - x, y1: 0.5 - y, x2: 0.5 + x, y2: 0.5 + y };
}

function gradient(id, g) {
  const stops = g.stops
    .map((c, i) => {
      const offset = g.stops.length === 1 ? 0 : (i / (g.stops.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${c}"/>`;
    })
    .join('');

  if (g.kind === 'radial') {
    return `<radialGradient id="${id}" cx="50%" cy="42%" r="78%">${stops}</radialGradient>`;
  }
  const { x1, y1, x2, y2 } = linearCoords(g.angle);
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`;
}

// The first family in a theme's `display` / `body` stack, unquoted — the name
// resvg matches against the loaded buffers.
function family(stack) {
  return stack.split(',')[0].replace(/'/g, '').trim();
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svgFor(key) {
  const t = THEMES[key];
  const art = ART[key];
  const display = family(t.display);
  const body = family(t.body);
  const radius = parseInt(t.radius, 10) || 8;

  const left = CARD_X + PAD;
  const right = CARD_X + CARD.w - PAD;
  const top = CARD_Y + PAD;
  const bottom = CARD_Y + CARD.h - PAD;

  // Terminal writes its own name in the monospace face it uses everywhere; the
  // others get their display face. Both come from the theme, so this is just the
  // stack the card itself would have picked.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${gradient('bg', art.bg)}
    ${gradient('card', art.card)}
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${t.swatch}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${t.swatch}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g transform="rotate(${CARD.tilt} ${W / 2} ${H / 2})">
    <rect x="${CARD_X}" y="${CARD_Y + 16}" width="${CARD.w}" height="${CARD.h}"
          rx="${radius}" fill="#000" opacity="0.3"/>
    <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD.w}" height="${CARD.h}"
          rx="${radius}" fill="url(#card)" stroke="${t.line2}" stroke-width="1"/>

    <text x="${left}" y="${top + 16}" font-family="${display}" font-weight="700"
          font-size="24" fill="${t.accent}">${esc(general.sigil)}</text>
    <text x="${right}" y="${top + 14}" text-anchor="end" font-family="${body}"
          font-size="12" letter-spacing="2.4" fill="${t.dim}">${esc(
            general.corner.toUpperCase(),
          )}</text>

    <text x="${left}" y="${CARD_Y + 196}" font-family="${display}" font-weight="700"
          font-size="48" letter-spacing="1.5" fill="${t.text}">${esc(IDENTITY.name)}</text>
    <rect x="${left}" y="${CARD_Y + 220}" width="64" height="3" fill="${t.accent}"/>
    <text x="${left}" y="${CARD_Y + 262}" font-family="${body}" font-weight="500"
          font-size="17" fill="${t.dim}">${esc(general.role)}</text>
    <text x="${left}" y="${CARD_Y + 298}" font-family="${body}" font-size="15"
          fill="${t.accent}">${esc(general.tagline)}</text>

    <text x="${left}" y="${bottom}" font-family="${body}" font-size="11"
          letter-spacing="2" fill="${t.dim}">${esc(IDENTITY.location)}</text>
    <text x="${right}" y="${bottom}" text-anchor="end" font-family="${body}"
          font-size="11" letter-spacing="1.6" fill="${t.accent}">CARD.SANKETTAMBARE.IN</text>
  </g>
</svg>`;
}

const fontFiles = await loadFonts(FONT_SPEC);
await mkdir(OUT, { recursive: true });

for (const [key, file] of Object.entries(OG_IMAGES)) {
  if (!THEMES[key]) throw new Error(`OG_IMAGES has "${key}", which is not a theme.`);

  const png = new Resvg(svgFor(key), {
    // Fixed output size: the crawler's frame, not the SVG's natural size.
    fitTo: { mode: 'width', value: W },
    font: { fontFiles, loadSystemFonts: false },
  })
    .render()
    .asPng();

  await writeFile(join(OUT, file.replace(/^\//, '')), png);
  console.log(`${file}  ${(png.length / 1024).toFixed(0)} KB`);
}
