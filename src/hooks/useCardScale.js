import { useEffect, useState } from 'react';
import { cardSize } from '../utils/metrics.js';

// Space the on-screen chrome needs so the card never sits underneath it.
const RESERVED = {
  desktop: { w: 96, h: 200 },
  mobile: { w: 28, h: 230 },
  // The upright card wants the height back: the chrome is a top row and a bottom
  // row of overlay, so what it actually costs is the two bars, not 230px.
  portrait: { w: 26, h: 168 },
  embed: { w: 24, h: 40 },
};

// How much to shrink the card so it fits the viewport. Never scales above 1 —
// a business card that fills a 27-inch monitor stops reading as a card.
export function useCardScale(mobile, embed, portrait) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      const r = embed
        ? RESERVED.embed
        : portrait
          ? RESERVED.portrait
          : mobile
            ? RESERVED.mobile
            : RESERVED.desktop;
      const { w, h } = cardSize(portrait);
      const availW = window.innerWidth - r.w;
      const availH = window.innerHeight - r.h;
      setScale(Math.max(0.3, Math.min(1, availW / w, availH / h)));
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [mobile, embed, portrait]);

  return scale;
}
