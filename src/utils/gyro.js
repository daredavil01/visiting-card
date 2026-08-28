// Device-orientation tilt for phones and tablets, the mobile counterpart to
// cursor tilt. Design doc section 7.1.
//
// Plain module rather than a hook: the animation loop that consumes it lives in a
// class component and writes transforms outside React entirely.
//
// iOS 13+ requires DeviceOrientationEvent.requestPermission() from inside a user
// gesture. Everything degrades silently to touch-drag when the sensor is absent
// or the request is denied — the card is fully usable either way.

const DOE = typeof window !== 'undefined' ? window.DeviceOrientationEvent : undefined;

export function gyroAvailable() {
  return typeof DOE !== 'undefined';
}

export function gyroNeedsPermission() {
  return gyroAvailable() && typeof DOE.requestPermission === 'function';
}

// Creates a listener that reports normalised tilt in the range -1..1 on each axis.
// `gamma` is left/right, `beta` is front/back. Beta is offset by 45 degrees so a
// phone held at a natural reading angle reads as flat, not tipped away.
export function createGyro(onTilt) {
  let attached = false;

  const handler = (e) => {
    if (e.gamma == null || e.beta == null) return;
    const y = Math.max(-1, Math.min(1, e.gamma / 35));
    const x = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
    onTilt(x, y);
  };

  const attach = () => {
    if (attached || !gyroAvailable()) return;
    window.addEventListener('deviceorientation', handler);
    attached = true;
  };

  return {
    // Resolves true when tilt is live. Safe to call unconditionally.
    async start() {
      if (!gyroAvailable()) return false;
      if (gyroNeedsPermission()) {
        try {
          const res = await DOE.requestPermission();
          if (res !== 'granted') return false;
        } catch {
          return false;
        }
      }
      attach();
      return attached;
    },
    stop() {
      if (!attached) return;
      window.removeEventListener('deviceorientation', handler);
      attached = false;
    },
  };
}
