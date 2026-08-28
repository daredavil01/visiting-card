import { useEffect, useState } from 'react';
import { CARD_W, CARD_H } from '../utils/metrics.js';

// Space the on-screen chrome needs so the card never sits underneath it.
const RESERVED = {
  desktop: { w: 96, h: 200 },
  mobile: { w: 28, h: 230 },
  embed: { w: 24, h: 40 },
};

// How much to shrink the card so it fits the viewport. Never scales above 1 —
// a business card that fills a 27-inch monitor stops reading as a card.
export function useCardScale(mobile, embed) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      const r = embed ? RESERVED.embed : mobile ? RESERVED.mobile : RESERVED.desktop;
      const availW = window.innerWidth - r.w;
      const availH = window.innerHeight - r.h;
      setScale(Math.max(0.3, Math.min(1, availW / CARD_W, availH / CARD_H)));
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [mobile, embed]);

  return scale;
}
