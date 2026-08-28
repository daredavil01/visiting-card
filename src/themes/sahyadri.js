// "Sahyadri Dawn" — sunrise over the Western Ghats. Handmade paper, gold-foil stamp.
// Design doc section 5, theme 3. The only light theme.
export default {
  key: 'sahyadri',
  label: 'Sahyadri',
  swatch: '#E06C4F',

  surface: 'linear-gradient(160deg,#FFFBF2 0%,#F7F0E0 100%)',
  surfaceSolid: '#FAF5E9',
  // Paper fibre + a ridgeline shadow rising from the bottom edge.
  pattern:
    'repeating-linear-gradient(92deg, rgba(45,90,61,.05) 0 1px, transparent 1px 4px), radial-gradient(90% 60% at 50% 120%, rgba(45,90,61,.14), transparent 60%)',
  patternSize: '100% 100%',

  accent: '#E06C4F',
  accent2: '#2D5A3D',
  text: '#2C2C2C',

  env: 'linear-gradient(180deg,#FFD4B8 0%,#F3D9CE 45%,#B8D4E3 100%)',
  envOverlay: 'radial-gradient(70% 50% at 50% 110%, rgba(45,90,61,.16), transparent 70%)',

  // Which of light/dark this theme is at rest.
  base: 'light',
  // Dawn's counterpart: the same ridgeline at dusk, after the light has gone
  // off the rock.
  altEnv: 'linear-gradient(180deg,#2B2138 0%,#3E2C3A 45%,#1B2430 100%)',
  altEnvOverlay: 'radial-gradient(70% 50% at 50% 110%, rgba(224,108,79,.2), transparent 70%)',

  edge: '1px solid rgba(44,44,44,.14)',
  shadow: '0 34px 70px -26px rgba(90,60,40,.42), inset 0 1px 0 rgba(255,255,255,.7)',
  sheen: 'radial-gradient(closest-side at 25% 20%, rgba(255,255,255,.5), transparent 65%)',

  // Subtle gold-foil sweep rather than full rainbow holography.
  foil: 'linear-gradient(115deg, transparent 40%, rgba(224,160,60,.5) 50%, transparent 60%)',
  foilOpacity: 0.5,
  scan: 'none',
  scanOpacity: 0,
  scanAnim: 'none',

  display: "'Playfair Display',serif",
  body: "'Source Serif 4',serif",
  quoteStyle: 'italic',

  line: 'rgba(44,44,44,.14)',
  line2: 'rgba(44,44,44,.2)',
  statBg: 'rgba(224,108,79,.06)',
  glow: 'rgba(224,108,79,.35)',
  dim: 'rgba(44,44,44,.5)',
  dim2: 'rgba(45,90,61,.7)',

  // Relief on the name, for the themes whose surface justifies it.
  emboss: '0 1px 0 rgba(255,255,255,.85)',

  radius: '10px',
  radiusS: '5px',

  particle: '#2D5A3D',
  pCount: 80,
  pSpeed: 0.35,
  pSize: 2.4,
  pGlow: false,
};
