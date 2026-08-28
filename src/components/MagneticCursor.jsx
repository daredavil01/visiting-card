// A dot that tracks the pointer exactly and a ring that lags behind it and swells
// near the card. Both are positioned by the animation loop in App, not by React.
// Design doc section 7.2.
export default function MagneticCursor({ t, dotRef, ringRef, hidden }) {
  const base = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 99,
    display: hidden ? 'none' : 'block',
  };

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 26,
          height: 26,
          margin: '-13px 0 0 -13px',
          border: `1px solid ${t.accent}`,
          borderRadius: '50%',
          opacity: 0.3,
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 8,
          height: 8,
          margin: '-4px 0 0 -4px',
          borderRadius: '50%',
          background: t.accent,
        }}
      />
    </>
  );
}
