// Event tracking (design doc section 8, `utils/analytics.js`).
//
// Provider-agnostic on purpose: the card is a static page on Cloudflare Pages and
// which analytics tool ends up in front of it is not a decision this file should
// force. It looks for whichever privacy-friendly script is present and no-ops
// when none is — so the calls scattered through the app are always safe, and
// wiring a provider later is a one-line change in index.html, not a code change.
//
// Nothing here sends personal data: only which theme, which view, which link.

const QUEUE_LIMIT = 50;

// Kept so a provider that loads late (async script) still gets the session's
// early events — the theme a visitor arrived on is the most interesting one.
const pending = [];

function deliver(name, props) {
  // Plausible
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props });
    return true;
  }
  // Umami
  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track(name, props);
    return true;
  }
  // Fathom
  if (window.fathom && typeof window.fathom.trackEvent === 'function') {
    window.fathom.trackEvent(name);
    return true;
  }
  // Google Analytics / gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, props);
    return true;
  }
  return false;
}

function flush() {
  while (pending.length) {
    const [name, props] = pending[0];
    if (!deliver(name, props)) return;
    pending.shift();
  }
}

export function track(name, props = {}) {
  if (typeof window === 'undefined') return;
  if (!deliver(name, props)) {
    pending.push([name, props]);
    if (pending.length > QUEUE_LIMIT) pending.shift();
    return;
  }
  flush();
}

// Convenience wrappers for the four things worth knowing (doc section 11,
// "Analytics dashboard": theme/view popularity, flip rate, link CTR).
export const analytics = {
  load: (theme, view, { embed, tier }) =>
    track('card_load', { theme, view, embed: String(!!embed), tier }),
  theme: (theme, from) => track('theme_change', { theme, from }),
  view: (view, from) => track('view_change', { view, from }),
  flip: (side, theme, view) => track('card_flip', { side, theme, view }),
  link: (key, view) => track('link_click', { link: key, view }),
  vcard: (view) => track('vcard_download', { view }),
  copy: (view) => track('contact_copy', { view }),
};

// Give a late-loading provider a chance to pick up the backlog.
if (typeof window !== 'undefined') {
  window.addEventListener('load', flush);
  setTimeout(flush, 3000);
}
