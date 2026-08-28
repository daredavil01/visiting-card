import { useCardStore } from './useCardStore.js';

// Resolves which environment a theme should be wearing.
//
// Each theme declares the mode it is at rest (`base`) and, where the concept
// allows one, an alternate world (`altEnv`). Terminal and Holographic declare
// none — a phosphor CRT and a refraction-lit foil card only make sense in the
// dark, and a light "variant" of either would be a different theme, not the same
// one with the lights on.
//
// `bgMode` is 'auto' until the visitor touches the toggle, at which point their
// choice sticks for the session and travels in the URL.
export function useBackground(theme) {
  const bgMode = useCardStore((s) => s.bgMode);
  const systemLight = useCardStore((s) => s.systemLight);

  const wanted = bgMode === 'auto' ? (systemLight ? 'light' : 'dark') : bgMode;
  const canToggle = Boolean(theme.altEnv);
  const showingAlt = canToggle && wanted !== theme.base;

  return {
    canToggle,
    // What the visitor is actually looking at, whether or not they chose it.
    mode: showingAlt ? (theme.base === 'dark' ? 'light' : 'dark') : theme.base,
    env: showingAlt ? theme.altEnv : theme.env,
    envOverlay: showingAlt ? theme.altEnvOverlay : theme.envOverlay,
  };
}
