// The card is laid out once, at one size, and scaled to fit the viewport.
//
// The earlier approach — a second, smaller set of type and spacing values for
// phones — could not hold: Developer's stack block plus three stat tiles simply
// does not fit 197px of height, whatever the font size, so the face clipped.
// Scaling the whole card instead keeps the composition identical everywhere and
// makes overflow impossible by construction. See useCardScale.

export const CARD_W = 620;
export const CARD_H = 391; // 620 : 391 is 85.6 : 53.98 mm, ISO 7810 ID-1

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
};
