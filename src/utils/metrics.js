// The card is laid out once per orientation, and scaled to fit the viewport.
//
// The earlier approach — a second, smaller set of type and spacing values for
// phones — could not hold: Developer's stack block plus three stat tiles simply
// does not fit 197px of height, whatever the font size, so the face clipped.
// Scaling the whole card instead keeps the composition identical everywhere and
// makes overflow impossible by construction. See useCardScale.
//
// A phone held upright gets the second geometry below rather than a shrunken
// landscape card: the same ISO 7810 ID-1 ratio stood on its end, with the faces
// flowing down the tall axis. It is a different box, not a different type scale —
// every font size is inherited, so the composition still reads the same and the
// argument above still stands.

export const CARD_W = 620;
export const CARD_H = 391; // 620 : 391 is 85.6 : 53.98 mm, ISO 7810 ID-1

export const CARD_W_P = 372;
export const CARD_H_P = 590; // 372 : 590 is 53.98 : 85.6 mm — the same card, upright

export const METRICS = {
  cardW: `${CARD_W}px`,
  cardH: `${CARD_H}px`,
  pad: '30px',
  gap: '16px',
  gapS: '11px',
  sigilSize: '600 34px/1 ',
  nameFont: '700 33px/1',
  nameTrack: '.03em',
  roleGap: '7px',
  roleSize: '14px',
  taglineSize: '15px',
  taglineMin: '44px',
  bodySize: '11.5px',
  microSize: '9px',
  statSize: '22px',
  statPad: '9px 6px',
  btnPad: '9px 6px',
  keyW: '30px',
  hintBottom: '-46px',
  taglineMax: '82%',
};

// Only the box and the room inside it change. 372 minus 2 x 26 leaves 320px of
// content width, which carries the name at 33px and three stat tiles at ~106px
// each — so the type values come across untouched.
export const METRICS_PORTRAIT = {
  ...METRICS,
  cardW: `${CARD_W_P}px`,
  cardH: `${CARD_H_P}px`,
  pad: '26px',
  gap: '18px',
  gapS: '12px',
  hintBottom: '-40px',
  taglineMax: '100%',
};

export function metricsFor(portrait) {
  return portrait ? METRICS_PORTRAIT : METRICS;
}

export function cardSize(portrait) {
  return portrait ? { w: CARD_W_P, h: CARD_H_P } : { w: CARD_W, h: CARD_H };
}
