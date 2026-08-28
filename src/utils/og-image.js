// Static Open Graph image selection per theme (design doc sections 8 and 9).
//
// The card is a static page, so the crawler never runs the JavaScript that would
// know which theme a link points at. Two halves make this work:
//
//   1. this module — the single source of truth for which file belongs to which
//      theme, used by the build script that renders them and by the Pages
//      middleware that serves them;
//   2. functions/_middleware.js — a Cloudflare Pages Function that rewrites the
//      og:image tag on the way out, based on ?theme= in the requested URL.
//
// Updating the client-side meta tag would be pointless: by the time React runs,
// the crawler has already read and cached the HTML.

export const OG_IMAGES = {
  wanderer: '/og-wanderer.png',
  terminal: '/og-terminal.png',
  sahyadri: '/og-sahyadri.png',
  blueprint: '/og-blueprint.png',
  holographic: '/og-holographic.png',
};

export const OG_DEFAULT = OG_IMAGES.wanderer;

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImageFor(theme) {
  return OG_IMAGES[theme] || OG_DEFAULT;
}

// The share URLs from design doc section 9. Exported so the QR script and any
// future share UI use the same strings rather than re-deriving them.
export const SHARE_PRESETS = {
  linkedin: { view: 'developer', theme: 'terminal' },
  strava: { view: 'runner', theme: 'wanderer' },
  trek: { view: 'trekker', theme: 'sahyadri' },
  general: {},
};

export function shareUrl(origin, preset = 'general', extra = {}) {
  const params = new URLSearchParams({ ...SHARE_PRESETS[preset], ...extra });
  const q = params.toString();
  return origin + (q ? '?' + q : '');
}
