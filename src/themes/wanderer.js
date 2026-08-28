// "The Wanderer" — night sky over the Sahyadris. Matte stone slab, edge-lit like a
// headlamp catching rock. Design doc section 5, theme 1.
export default {
  key: 'wanderer',
  label: 'Wanderer',
  swatch: '#E8A838',

  surface: 'linear-gradient(155deg,#22223c 0%,#16162a 100%)',
  surfaceSolid: '#1A1A2E',
  // Topographic contour rings, off-centre so they read as elevation not a target.
  pattern:
    'repeating-radial-gradient(circle at 78% 118%, rgba(232,168,56,.11) 0 1px, transparent 1px 22px)',
  patternSize: '100% 100%',

  accent: '#E8A838',
  accent2: '#C98A2E',
  text: '#F0EDE5',

  env: 'radial-gradient(120% 100% at 50% 0%,#141433 0%,#0A0A1A 60%,#06060f 100%)',
  envOverlay: 'radial-gradient(60% 50% at 50% 50%, rgba(232,168,56,.07), transparent 70%)',

  edge: '1px solid rgba(184,115,51,.55)',
  shadow: '0 40px 90px -30px rgba(0,0,0,.85), inset 0 1px 0 rgba(232,168,56,.22)',
  sheen: 'radial-gradient(closest-side at 30% 30%, rgba(255,225,170,.16), transparent 70%)',

  // Matte and tactile by design — no foil, no scanlines.
  foil: 'none',
  foilOpacity: 0,
  scan: 'none',
  scanOpacity: 0,
  scanAnim: 'none',

  display: "'Space Grotesk',sans-serif",
  body: "'DM Sans',sans-serif",
  quoteStyle: 'normal',

  line: 'rgba(240,237,229,.14)',
  line2: 'rgba(240,237,229,.2)',
  statBg: 'rgba(240,237,229,.045)',
  glow: 'rgba(232,168,56,.5)',
  dim: 'rgba(240,237,229,.42)',
  dim2: 'rgba(240,237,229,.4)',

  radius: '16px',
  radiusS: '7px',

  particle: '#E8A838',
  pCount: 150,
  pSpeed: 0.2,
  pSize: 1.6,
  pGlow: true,
};
