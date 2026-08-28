import { IDENTITY, LINKS } from '../content/links.js';

// vCard 3.0 — the format Android, iOS and Outlook all import without complaint.
// The card is view-aware: TITLE and NOTE come from the active persona, and the
// URLs are the ones that view actually prioritises.

const FIELD_URLS = {
  general: [LINKS.WEB, LINKS.IN, LINKS.GH, LINKS.SUB],
  developer: [LINKS.GH, LINKS.IN, LINKS.DEV, LINKS.WEB],
  runner: [LINKS.RUN, 'https://sankettambare.in/sports', LINKS.WEB],
  trekker: ['https://sankettambare.in/treks', LINKS.WEB, LINKS.IN],
  writer: [LINKS.SUB, LINKS.DEV, LINKS.WEB, LINKS.X],
};

// Escape the characters vCard treats as structure.
function esc(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Strip the surrounding quotes the taglines carry for on-card typography.
function plain(text) {
  return String(text).replace(/^"|"$/g, '');
}

export function buildVCard(view) {
  const urls = FIELD_URLS[view.key] || FIELD_URLS.general;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Tambare;Sanket;;;',
    'FN:Sanket Tambare',
    `TITLE:${esc(view.role)}`,
    `EMAIL;TYPE=INTERNET,PREF:${IDENTITY.email}`,
    ...urls.filter(Boolean).map((u) => `URL:${u}`),
    `ADR;TYPE=HOME:;;;${esc(IDENTITY.city)};${esc(IDENTITY.region)};;${esc(IDENTITY.country)}`,
    `NOTE:${esc(plain(view.tagline))}`,
    `CATEGORIES:${esc(view.label)}`,
    `REV:${new Date().toISOString()}`,
    'END:VCARD',
  ];

  // vCard requires CRLF line endings.
  return lines.join('\r\n') + '\r\n';
}

export function downloadVCard(view) {
  const blob = new Blob([buildVCard(view)], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sanket-tambare-${view.key}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyVCard(view) {
  const text = buildVCard(view);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
