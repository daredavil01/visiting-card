import { useEffect } from 'react';
import { useCardStore } from './useCardStore.js';
import { DEFAULT_THEME } from '../themes/index.js';
import { DEFAULT_VIEW } from '../content/index.js';

// Keeps the address bar showing the current combination, so whatever the visitor
// is looking at is what they share. `replaceState` rather than `pushState`:
// clicking through five themes should not fill the back button with history.
//
// Params only appear when they differ from the default, which keeps the plain
// "general + wanderer" URL clean.
export function useUrlSync() {
  const theme = useCardStore((s) => s.theme);
  const view = useCardStore((s) => s.view);
  const side = useCardStore((s) => s.side);
  const embed = useCardStore((s) => s.embed);
  const autoflip = useCardStore((s) => s.autoflip);
  const lowfx = useCardStore((s) => s.lowfx);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);

    const set = (key, value, omitWhen) => {
      if (value === omitWhen) q.delete(key);
      else q.set(key, value);
    };

    set('theme', theme, DEFAULT_THEME);
    set('view', view, DEFAULT_VIEW);
    set('side', side, 'front');
    if (embed) q.set('embed', 'true');
    else q.delete('embed');
    if (autoflip) q.set('autoflip', 'true');
    else q.delete('autoflip');
    if (lowfx) q.set('lowfx', 'true');
    else q.delete('lowfx');

    const search = q.toString();
    const next = window.location.pathname + (search ? '?' + search : '') + window.location.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, '', next);
    }
  }, [theme, view, side, embed, autoflip, lowfx]);
}
