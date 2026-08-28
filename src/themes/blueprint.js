// "Blueprint" — engineering drawing on blue drafting paper. Dashed cut line, grid,
// dimension callouts. Design doc section 5, theme 4.
export default {
  key: 'blueprint',
  label: 'Blueprint',
  swatch: '#7FB2E5',

  surface: '#1B3A5C',
  surfaceSolid: '#1B3A5C',
  pattern:
    'repeating-linear-gradient(to right, rgba(255,255,255,.14) 0 1px, transparent 1px 20px), repeating-linear-gradient(to bottom, rgba(255,255,255,.14) 0 1px, transparent 1px 20px)',
  patternSize: '100% 100%',

  accent: '#FFFFFF',
  accent2: '#E74C3C',
  text: '#FFFFFF',

  env: 'linear-gradient(180deg,#0F2440 0%,#0a1a30 100%)',
  // The infinite grid plane, at a coarser pitch than the card's own grid.
  envOverlay:
    'repeating-linear-gradient(to right, rgba(255,255,255,.03) 0 1px, transparent 1px 60px), repeating-linear-gradient(to bottom, rgba(255,255,255,.03) 0 1px, transparent 1px 60px)',

  // Which of light/dark this theme is at rest.
  base: 'dark',
  // The other place a drawing lives: pinned to a lit drafting table rather than
  // floating in a dark plan room.
  altEnv: 'linear-gradient(180deg,#EDEBE4 0%,#DCD9CF 100%)',
  altEnvOverlay:
    'repeating-linear-gradient(to right, rgba(27,58,92,.05) 0 1px, transparent 1px 60px), repeating-linear-gradient(to bottom, rgba(27,58,92,.05) 0 1px, transparent 1px 60px)',

  edge: '1px dashed rgba(255,255,255,.6)',
  shadow: '0 30px 60px -28px rgba(0,0,0,.7)',
  // Drafting paper has no specular.
  sheen: 'none',

  foil: 'none',
  foilOpacity: 0,
  scan: 'none',
  scanOpacity: 0,
  scanAnim: 'none',

  display: "'Caveat',cursive",
  body: "'IBM Plex Mono',monospace",
  quoteStyle: 'normal',

  line: 'rgba(255,255,255,.3)',
  line2: 'rgba(255,255,255,.35)',
  statBg: 'rgba(255,255,255,.06)',
  glow: 'rgba(255,255,255,.3)',
  dim: 'rgba(255,255,255,.5)',
  dim2: 'rgba(231,76,60,.9)',

  // Relief on the name, for the themes whose surface justifies it.
  emboss: 'none',

  radius: '2px',
  radiusS: '0px',

  particle: '#7FB2E5',
  pCount: 40,
  pSpeed: 0.12,
  pSize: 1.2,
  pGlow: false,
};
