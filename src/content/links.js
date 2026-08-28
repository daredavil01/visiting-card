// Real destinations for the back-face rows and CTA buttons.
//
// The prototype rendered every contact row as plain text. Here each row's `key`
// token resolves to an href so the row becomes a real anchor. A key with no entry
// (or an entry of `null`) stays plain text — that is how unverified destinations
// are handled rather than shipping a link that 404s.

export const LINKS = {
  MAIL: 'mailto:sanket.tambare01@gmail.com',
  WEB: 'https://sankettambare.in',
  IN: 'https://linkedin.com/in/sankettambare',
  GH: 'https://github.com/daredavil01',
  SUB: 'https://sankettambare.substack.com',
  X: 'https://x.com/i_daredavil',
  DEV: 'https://dev.to/daredavil',
  RUN: 'https://runfolio.sankettambare.in',

  // Unverified — the design doc itself marks the handle "(if exists)". Stays text
  // until confirmed. See status.md > Known gaps.
  STRV: null,

  // Prose row, not a destination.
  PIC: null,
};

export function hrefFor(key) {
  return LINKS[key] || null;
}

// CTA buttons. `action` is handled in CardBack; `href` opens in a new tab.
export const BUTTONS = {
  vCard: { action: 'vcard', label: 'vCard' },
  Copy: { action: 'copy', label: 'Copy' },
  Resume: { href: 'https://sankettambare.in/resume', label: 'Resume' },
  GitHub: { href: LINKS.GH, label: 'GitHub' },
  RunFolio: { href: LINKS.RUN, label: 'RunFolio' },
  'Race Log': { href: 'https://sankettambare.in/sports', label: 'Race Log' },
  'Trek Log': { href: 'https://sankettambare.in/treks', label: 'Trek Log' },
  Photos: { href: 'https://sankettambare.in/treks', label: 'Photos' },
};

export function buttonFor(label) {
  return BUTTONS[label] || { label };
}

// Constant across every view.
export const IDENTITY = {
  name: 'SANKET TAMBARE',
  location: 'PUNE, INDIA · 18°34′N',
  email: 'sanket.tambare01@gmail.com',
  city: 'Pune',
  region: 'Maharashtra',
  country: 'India',
};
