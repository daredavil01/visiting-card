import { create } from 'zustand';
import { THEME_KEYS, DEFAULT_THEME, isTheme } from '../themes/index.js';
import { VIEW_KEYS, DEFAULT_VIEW, isView } from '../content/index.js';

// Initial state comes from the URL so a shared link lands directly in the right
// combination. Anything unrecognised falls back to the default rather than
// erroring — a mistyped ?theme= should still render a card.
function readParams() {
  const q = new URLSearchParams(window.location.search);
  const theme = q.get('theme');
  const view = q.get('view');
  const flag = (name) => {
    const v = q.get(name);
    return v !== null && v !== 'false' && v !== '0';
  };
  return {
    theme: isTheme(theme) ? theme : DEFAULT_THEME,
    view: isView(view) ? view : DEFAULT_VIEW,
    side: q.get('side') === 'back' ? 'back' : 'front',
    embed: flag('embed'),
    autoflip: flag('autoflip'),
    lowfx: flag('lowfx'),
  };
}

const initial = readParams();

export const useCardStore = create((set, get) => ({
  // --- Theme axis (how the card looks) ---
  theme: initial.theme,
  setTheme: (t) => isTheme(t) && set({ theme: t }),
  cycleTheme: (dir) => {
    const i = THEME_KEYS.indexOf(get().theme);
    const n = (i + dir + THEME_KEYS.length) % THEME_KEYS.length;
    set({ theme: THEME_KEYS[n] });
  },

  // --- View axis (what the card says) ---
  view: initial.view,
  // Flipping back to the front on a view change keeps the intro animation
  // (typewriter + count-up) visible, which is the point of the transition.
  setView: (v) => isView(v) && v !== get().view && set({ view: v, side: 'front' }),
  cycleView: (dir) => {
    const i = VIEW_KEYS.indexOf(get().view);
    const n = (i + dir + VIEW_KEYS.length) % VIEW_KEYS.length;
    set({ view: VIEW_KEYS[n], side: 'front' });
  },

  // --- Card state ---
  side: initial.side,
  flip: () => set((s) => ({ side: s.side === 'front' ? 'back' : 'front' })),

  // --- Presentation flags, fixed for the session ---
  embed: initial.embed,
  autoflip: initial.autoflip,
  lowfx: initial.lowfx,

  // --- Capability, filled in by useDeviceTier ---
  deviceTier: 'high', // high | medium | low
  reducedMotion: false,
  setCapability: (c) => set(c),
}));
