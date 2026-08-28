// Verifies src/utils/qr.js module-for-module against the reference `qrcode`
// package, across the URL shapes the card actually produces plus the edge of
// each version's capacity.
//
// The hand-written encoder ships to the browser; `qrcode` is a devDependency
// that never leaves this script. Run with: npm run check:qr

import QRCode from 'qrcode';
import { encodeQR } from '../src/utils/qr.js';
import { SHARE_PRESETS } from '../src/utils/og-image.js';

const ORIGIN = 'https://card.sankettambare.in';

const cases = [
  ORIGIN,
  ORIGIN + '/?utm_source=physical_card',
  ...Object.entries(SHARE_PRESETS).map(([, preset]) => {
    const q = new URLSearchParams(preset).toString();
    return ORIGIN + (q ? '/?' + q : '/');
  }),
  ORIGIN + '/?theme=holographic&view=trekker&side=back&bg=light',
  ORIGIN + '/?theme=blueprint&view=developer&bg=light&embed=true&autoflip=true',
  // Capacity edges: one character below and at each version boundary.
  'A'.repeat(14),
  'A'.repeat(15),
  'A'.repeat(62),
  'A'.repeat(63),
  'A'.repeat(122),
  'A'.repeat(123),
  'A'.repeat(213),
  // Multi-byte input, so the UTF-8 length path is exercised.
  'सांकेत ताम्बरे — पुणे, भारत ⛰ 18°34′N',
];

let failures = 0;

for (const text of cases) {
  const mine = encodeQR(text);

  // Byte mode is forced: the reference would otherwise switch to the more
  // compact alphanumeric mode on all-uppercase input, which this encoder does
  // not implement and does not need to.
  const ref = QRCode.create([{ data: text, mode: 'byte' }], { errorCorrectionLevel: 'M' });
  const refSize = ref.modules.size;
  const refData = ref.modules.data;

  const label = text.length > 46 ? text.slice(0, 43) + '...' : text;

  if (mine.length !== refSize) {
    console.error(`FAIL size  ${mine.length} vs ${refSize}  ${label}`);
    failures++;
    continue;
  }

  let diff = 0;
  for (let r = 0; r < refSize; r++) {
    for (let c = 0; c < refSize; c++) {
      const theirs = refData[r * refSize + c] === 1;
      if (mine[r][c] !== theirs) diff++;
    }
  }

  if (diff > 0) {
    console.error(`FAIL ${diff} modules differ (${refSize}x${refSize})  ${label}`);
    failures++;
  } else {
    console.log(`ok   ${refSize}x${refSize}  ${label}`);
  }
}

if (failures) {
  console.error(`\n${failures} of ${cases.length} cases failed`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} cases match the reference encoder exactly.`);
