import { THEMES, THEME_KEYS } from '../themes/index.js';
import { SAFE_TOP, SAFE_RIGHT } from '../utils/safeArea.js';

// Top-right pill. Changes how the card looks; never what it says.
export default function ThemeToggle({ t, active, onPick, compact }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: compact ? SAFE_TOP : 26,
        right: compact ? SAFE_RIGHT : 28,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 9,
      }}
    >
      {!compact && (
        <div
          style={{
            font: "500 9px/1 'DM Sans',sans-serif",
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: t.dim,
            paddingRight: 6,
          }}
        >
          Theme
        </div>
      )}
      <div
        role="radiogroup"
        aria-label="Card theme"
        style={{
          display: 'flex',
          gap: 3,
          padding: 4,
          border: '1px solid rgba(255,255,255,.16)',
          borderRadius: 999,
          background: 'rgba(10,10,20,.42)',
          backdropFilter: 'blur(10px)',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {THEME_KEYS.map((k) => {
          const on = active === k;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={on}
              // Compact chips are swatch-only, so the name has to come from here.
              aria-label={THEMES[k].label}
              title={THEMES[k].label}
              onClick={() => onPick(k)}
              className="chip"
              style={{
                border: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                font: "500 11px/1 'DM Sans',sans-serif",
                padding: compact ? '8px 10px' : '9px 14px',
                borderRadius: 999,
                color: on ? '#0a0a14' : 'rgba(255,255,255,.62)',
                background: on ? '#f2f0ea' : 'transparent',
                transition: 'all 220ms ease',
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: THEMES[k].swatch,
                  boxShadow: `0 0 8px ${THEMES[k].swatch}`,
                }}
              />
              {compact ? '' : THEMES[k].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
