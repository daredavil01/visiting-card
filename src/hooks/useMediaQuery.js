import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    // Belt and braces: some embedded webviews resize the layout viewport without
    // firing the media-query change event, which would strand the card in the
    // wrong size set. Re-checking on resize costs nothing and closes that gap.
    window.addEventListener('resize', on);
    return () => {
      mq.removeEventListener('change', on);
      window.removeEventListener('resize', on);
    };
  }, [query]);

  return matches;
}

// The prototype faked mobile with a chip and a phone bezel. Here it is the real
// viewport that decides which of the two size sets the card uses.
export const MOBILE_QUERY = '(max-width: 640px)';
