// "Holographic" — premium foil card. The surface itself is the signature effect:
// the foil gradient is repositioned every frame from the pointer, and the sheen
// moves the opposite way so the highlight reads as a real specular.
// Design doc section 5, theme 5.
export default {
  key: 'holographic',
  label: 'Holographic',
  swatch: '#B39BFF',

  surface: 'linear-gradient(150deg,#26263f 0%,#14141f 100%)',
  surfaceSolid: '#1C1C2E',
  pattern:
    'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,0,128,.07) 0deg 8deg, rgba(0,255,255,.07) 8deg 16deg, rgba(255,255,0,.07) 16deg 24deg)',
  patternSize: '100% 100%',

  accent: '#FFFFFF',
  accent2: '#B39BFF',
  text: '#FFFFFF',

  env: 'radial-gradient(90% 80% at 50% 50%,#14142a 0%,#08080F 70%)',
  envOverlay: 'radial-gradient(50% 40% at 50% 50%, rgba(179,155,255,.12), transparent 70%)',

  // Which of light/dark this theme is at rest.
  base: 'dark',
  // No light variant: the card's own refracted light is the environment.
  altEnv: null,

  edge: '1px solid rgba(255,255,255,.35)',
  shadow: '0 40px 90px -30px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.35)',
  sheen: 'radial-gradient(closest-side at 30% 25%, rgba(255,255,255,.22), transparent 65%)',

  // Rainbow spectrum band, blended with color-dodge over the gunmetal base.
  foil: 'repeating-linear-gradient(112deg, #ff4d6d 0%, #ffd166 12%, #06d6a0 24%, #4cc9f0 36%, #b39bff 48%, #ff4d6d 60%)',
  foilOpacity: 0.55,
  scan: 'none',
  scanOpacity: 0,
  scanAnim: 'none',

  display: "'Sora',sans-serif",
  body: "'DM Sans',sans-serif",
  quoteStyle: 'normal',

  line: 'rgba(255,255,255,.18)',
  line2: 'rgba(255,255,255,.25)',
  statBg: 'rgba(255,255,255,.07)',
  glow: 'rgba(179,155,255,.7)',
  dim: 'rgba(255,255,255,.45)',
  dim2: 'rgba(179,155,255,.85)',

  // Relief on the name, for the themes whose surface justifies it.
  emboss: '0 1px 0 rgba(255,255,255,.55), 0 -1px 0 rgba(0,0,0,.55)',

  radius: '14px',
  radiusS: '7px',

  particle: '#ffffff',
  pCount: 100,
  pSpeed: 0.28,
  pSize: 1.3,
  pGlow: true,
};
