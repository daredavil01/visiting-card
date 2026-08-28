// "Terminal" — retro CRT. Phosphor green on black, scanlines, flicker.
// Design doc section 5, theme 2.
export default {
  key: 'terminal',
  label: 'Terminal',
  swatch: '#00FF41',

  surface: '#0D0D0D',
  surfaceSolid: '#0D0D0D',
  pattern: 'radial-gradient(120% 90% at 50% 0%, rgba(0,255,65,.08), transparent 60%)',
  patternSize: '100% 100%',

  accent: '#00FF41',
  accent2: '#00c633',
  text: '#00FF41',

  env: 'radial-gradient(100% 100% at 50% 50%,#04120a 0%,#000 70%)',
  envOverlay:
    'repeating-linear-gradient(to bottom, rgba(0,255,65,.035) 0 1px, transparent 1px 3px)',

  // Which of light/dark this theme is at rest.
  base: 'dark',
  // No light variant: a phosphor CRT only exists in the dark.
  altEnv: null,

  edge: '1px solid rgba(0,255,65,.5)',
  shadow:
    '0 0 60px rgba(0,255,65,.18), 0 30px 70px -30px #000, inset 0 0 40px rgba(0,255,65,.06)',
  sheen: 'radial-gradient(closest-side at 40% 20%, rgba(0,255,65,.1), transparent 70%)',

  // Holographic foil would be anachronistic on a CRT.
  foil: 'none',
  foilOpacity: 0,
  scan: 'repeating-linear-gradient(to bottom, rgba(0,0,0,.5) 0 1px, transparent 1px 4px)',
  scanOpacity: 0.55,
  scanAnim: 'flick 8s linear infinite',

  display: "'JetBrains Mono',monospace",
  body: "'JetBrains Mono',monospace",
  quoteStyle: 'normal',

  line: 'rgba(0,255,65,.22)',
  line2: 'rgba(0,255,65,.3)',
  statBg: 'rgba(0,255,65,.05)',
  glow: 'rgba(0,255,65,.6)',
  dim: 'rgba(0,255,65,.45)',
  dim2: 'rgba(0,255,65,.5)',

  // Relief on the name, for the themes whose surface justifies it.
  emboss: 'none',

  radius: '4px',
  radiusS: '2px',

  // Pure black environment — the CRT is the only light source.
  particle: '#00FF41',
  pCount: 0,
  pSpeed: 0,
  pSize: 1,
  pGlow: true,
};
