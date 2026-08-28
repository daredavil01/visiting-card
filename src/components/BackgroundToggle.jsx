// Light/dark switch for the world the card sits in.
//
// Only rendered for themes that declare an alternate environment. Terminal and
// Holographic don't: a phosphor CRT and a refraction-lit foil card only exist in
// the dark, and offering a switch that does nothing is worse than not offering
// one. The card itself never changes — this is the room, not the object.
export default function BackgroundToggle({ t, mode, onToggle, compact }) {
  const isLight = mode === 'light';

  return (
    <button
      type="button"
      className="chip bg-toggle"
      role="switch"
      aria-checked={isLight}
      aria-label={`Background: ${isLight ? 'light' : 'dark'}. Switch to ${
        isLight ? 'dark' : 'light'
      }.`}
      title={`Switch to ${isLight ? 'dark' : 'light'} background`}
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,.16)',
        borderRadius: 999,
        padding: compact ? '8px 10px' : '9px 13px',
        background: 'rgba(10,10,20,.42)',
        color: 'rgba(255,255,255,.72)',
        backdropFilter: 'blur(10px)',
        font: "500 11px/1 'DM Sans',sans-serif",
        transition: 'all 220ms ease',
      }}
    >
      <span
        className="bg-glyph"
        style={{ display: 'inline-flex', color: isLight ? t.swatch : 'currentColor' }}
      >
        {isLight ? <SunGlyph /> : <MoonGlyph />}
      </span>
      {compact ? '' : isLight ? 'Light' : 'Dark'}
    </button>
  );
}

function SunGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
