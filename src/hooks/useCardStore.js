import { create } from 'zustand';
import { THEME_KEYS, DEFAULT_THEME, isTheme } from '../themes/index.js';
import { VIEW_KEYS, DEFAULT_VIEW, isView } from '../content/index.js';

// Initial state comes from the URL so a shared link lands directly in the right
// combination. Anything unrecognised falls back to the default rather than
// erroring — a mistyped ?theme= should still render a card.
// With no theme asked for, follow the visitor's system setting: Wanderer is the
// dark card, Sahyadri Dawn the light one (design doc section 8, Accessibility).
// An explicit ?theme= always wins — a shared link means what it says.
function systemPrefersLight() {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  } catch {
    return false;
  }
}

function preferredTheme() {
  return systemPrefersLight() ? 'sahyadri' : DEFAULT_THEME;
}

function readParams() {
  const q = new URLSearchParams(window.location.search);
  const theme = q.get('theme');
  const view = q.get('view');
  const flag = (name) => {
    const v = q.get(name);
    return v !== null && v !== 'false' && v !== '0';
  };
  return {
    theme: isTheme(theme) ? theme : preferredTheme(),
    view: isView(view) ? view : DEFAULT_VIEW,
    side: q.get('side') === 'back' ? 'back' : 'front',
    bgMode: ['light', 'dark'].includes(q.get('bg')) ? q.get('bg') : 'auto',
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

  // --- Background light/dark, for the themes that support both ---
  bgMode: initial.bgMode, // auto | light | dark
  systemLight: systemPrefersLight(),
  setBgMode: (m) => set({ bgMode: m }),
  toggleBg: () =>
    set((s) => {
      const current = s.bgMode === 'auto' ? (s.systemLight ? 'light' : 'dark') : s.bgMode;
      return { bgMode: current === 'light' ? 'dark' : 'light' };
    }),
  setSystemLight: (v) => set({ systemLight: v }),

  // --- Presentation flags, fixed for the session ---
  embed: initial.embed,
  autoflip: initial.autoflip,
  lowfx: initial.lowfx,

  // --- Capability, filled in by useDeviceTier ---
  deviceTier: 'high', // high | medium | low
  reducedMotion: false,
  setCapability: (c) => set(c),
}));
