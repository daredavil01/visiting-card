import { VIEWS, VIEW_KEYS } from '../content/index.js';
import { SAFE_BOTTOM, SAFE_LEFT, SAFE_RIGHT } from '../utils/safeArea.js';

// Bottom-left segmented control. Changes what the card says; never how it looks.
export default function ViewFilter({ t, active, onPick, urlHint, compact }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: compact ? SAFE_BOTTOM : 30,
        left: compact ? SAFE_LEFT : 28,
        right: compact ? SAFE_RIGHT : 'auto',
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
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
            paddingLeft: 4,
          }}
        >
          View
        </div>
      )}
      <div
        role="radiogroup"
        aria-label="Card view"
        style={{
          display: 'flex',
          gap: 2,
          padding: 3,
          border: '1px solid rgba(255,255,255,.16)',
          borderRadius: 10,
          background: 'rgba(10,10,20,.42)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {VIEW_KEYS.map((k) => {
          const on = active === k;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(k)}
              className="chip"
              style={{
                flex: compact ? 1 : 'none',
                border: 0,
                cursor: 'pointer',
                font: "500 11px/1 'DM Sans',sans-serif",
                letterSpacing: '.04em',
                padding: compact ? '10px 8px' : '10px 16px',
                borderRadius: 8,
                color: on ? '#0a0a14' : 'rgba(255,255,255,.62)',
                background: on ? t.swatch : 'transparent',
                transition: 'all 220ms ease',
              }}
            >
              {VIEWS[k].label}
            </button>
          );
        })}
      </div>
      {!compact && (
        <div
          style={{
            font: "400 10px/1.6 'JetBrains Mono',monospace",
            color: t.dim,
            paddingLeft: 4,
          }}
        >
          {urlHint}
        </div>
      )}
    </div>
  );
}
