// Renders the QR code for the printed card into docs/print/.
//
//   npm run qr
//
// Same encoder the share panel uses (src/utils/qr.js), so what a printer prints
// and what the site shows can never drift apart. Two differences from the on-screen
// code, both because this one gets printed:
//
//   * quiet zone of 4 modules, the spec's minimum for reliable scanning off paper
//     (the panel uses 2, which is fine on a backlit screen);
//   * pure black on pure white, no theme colour and no rounded modules — contrast
//     is the only thing a scanner cares about.
//
// The SVG is the file to hand a printer: vector, so it is sharp at any card size.
// The PNG is for previews and for anything that will not take an SVG.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

import { qrModules } from '../src/utils/qr.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'print');

// Design doc section 9, "QR target". The utm parameter is what separates a scan
// of the printed card from every other visit in analytics.
const URL = 'https://card.sankettambare.in?utm_source=physical_card';

const QUIET = 4;
const PNG_PX = 2048;

const { matrix, size } = qrModules(URL);
const total = size + QUIET * 2;

// One <path> of module squares rather than thousands of <rect>s: smaller file,
// and print drivers handle a single filled path better than a rect swarm.
const d = matrix
  .flatMap((row, r) =>
    row.map((on, c) => (on ? `M${c + QUIET} ${r + QUIET}h1v1h-1z` : '')),
  )
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges">
  <title>${URL}</title>
  <rect width="${total}" height="${total}" fill="#ffffff"/>
  <path d="${d}" fill="#000000"/>
</svg>
`;

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'qr-card.svg'), svg);

// Snap to a whole number of pixels per module so no module lands half-shaded.
const px = Math.round(PNG_PX / total) * total;
const png = new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();
await writeFile(join(OUT, 'qr-card.png'), png);

console.log(`${URL}`);
console.log(`docs/print/qr-card.svg  ${size}x${size} modules + ${QUIET} quiet`);
console.log(`docs/print/qr-card.png  ${px}x${px} px`);
