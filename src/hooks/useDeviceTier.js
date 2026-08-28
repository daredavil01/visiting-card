import { useEffect } from 'react';
import { useCardStore } from './useCardStore.js';

// Design doc section 8. Cheap, synchronous, and only run once — the point is to
// avoid shipping 200 particles and a foil layer to a phone that will drop frames.
function detectTier() {
  try {
    const cores = navigator.hardwareConcurrency || 2;

    let gpu = '';
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
      // Free the context immediately; we only wanted the renderer string.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    if (cores >= 8 && !gpu.includes('Intel')) return 'high';
    if (cores >= 4) return 'medium';
    return 'low';
  } catch {
    return 'medium';
  }
}

const REDUCED = '(prefers-reduced-motion: reduce)';

// Replaces the prototype's manual state chips: reduced motion and device tier are
// detected, not toggled. `?lowfx=true` forces the low path for testing.
export function useDeviceTier() {
  const lowfx = useCardStore((s) => s.lowfx);
  const setCapability = useCardStore((s) => s.setCapability);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);

    const apply = () =>
      setCapability({
        deviceTier: lowfx ? 'low' : detectTier(),
        reducedMotion: mq.matches,
      });

    apply();
    // Respect the setting changing mid-session.
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [lowfx, setCapability]);
}
