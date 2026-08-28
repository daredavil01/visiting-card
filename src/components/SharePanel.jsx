import { useEffect, useMemo, useRef, useState } from 'react';
import { qrModules } from '../utils/qr.js';
import { analytics } from '../utils/analytics.js';

// The share surface: one button, and a panel holding a QR code of exactly what
// the visitor is looking at — theme, view, and side all travel in the URL, so
// scanning it opens the same card, not a generic landing page.
//
// The code animates in module by module, sweeping diagonally out from the
// top-left finder. Each module is its own <rect> with a staggered delay, so the
// whole thing is CSS once painted; there are no timers and no per-frame work.

const QUIET = 2; // modules of quiet zone, required for reliable scanning
const STAGGER_MS = 5.5;

function QRCanvas({ url, dark, light, animate }) {
  const { matrix, size } = useMemo(() => qrModules(url), [url]);
  const total = size + QUIET * 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code linking to ${url}`}
    >
      <rect width={total} height={total} fill={light} />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              className={animate ? 'qr-module' : undefined}
              x={c + QUIET}
              y={r + QUIET}
              width="1"
              height="1"
              fill={dark}
              // The three finder patterns land first so the code reads as a QR
              // immediately; everything else fills in behind them.
              style={
                animate
                  ? { animationDelay: `${(isFinder(r, c, size) ? 0 : r + c) * STAGGER_MS}ms` }
                  : undefined
              }
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function isFinder(r, c, size) {
  return (
    (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)
  );
}

export default function SharePanel({ t, view, theme, compact }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const closeRef = useRef(null);

  // Read the address bar at open time: useUrlSync has already written the
  // current combination into it, so this is always the shareable link.
  useEffect(() => {
    if (!open) return;
    setUrl(window.location.href);
    analytics.link('share_panel', view);
  }, [open, view, theme]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      analytics.link('share_copy', view);
    } catch {
      // Clipboard blocked; the URL is on screen to copy by hand.
    }
  };

  // The Web Share sheet where the device has one — phones, mostly.
  const nativeShare = async () => {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: 'Sanket Tambare', url });
      analytics.link('share_native', view);
    } catch {
      // Cancelled.
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      style={{
        position: 'absolute',
        top: compact ? 16 : 26,
        left: compact ? 14 : 28,
        zIndex: 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
      }}
      onPointerDown={stop}
    >
      <button
        type="button"
        className="chip share-button"
        aria-expanded={open}
        aria-label={open ? 'Hide share code' : 'Share this card'}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,.16)',
          borderRadius: 999,
          padding: compact ? '9px 12px' : '10px 16px',
          background: open ? t.accent : 'rgba(10,10,20,.42)',
          color: open ? t.surfaceSolid : 'rgba(255,255,255,.72)',
          backdropFilter: 'blur(10px)',
          font: "500 11px/1 'DM Sans',sans-serif",
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          transition: 'all 220ms ease',
        }}
      >
        <ShareGlyph />
        {compact ? '' : 'Share'}
      </button>

      {open && (
        <div
          className="share-panel"
          style={{
            width: 232,
            padding: 16,
            borderRadius: 14,
            border: `1px solid ${t.line2}`,
            background: 'rgba(8,8,15,.86)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 24px 60px -24px rgba(0,0,0,.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#fff',
              alignSelf: 'center',
            }}
          >
            {/* Keyed on the URL so re-opening on a different combination replays
                the build-in rather than snapping to the new code. */}
            {url && <QRCanvas key={url} url={url} dark="#0b0b12" light="#ffffff" animate />}
          </div>

          <div
            style={{
              font: "400 10px/1.5 'JetBrains Mono',monospace",
              color: 'rgba(255,255,255,.55)',
              wordBreak: 'break-all',
            }}
          >
            {url.replace(/^https?:\/\//, '')}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={copy}
              className="share-action"
              style={shareActionStyle(t)}
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button
              type="button"
              ref={closeRef}
              onClick={nativeShare}
              className="share-action"
              style={shareActionStyle(t)}
            >
              Share…
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function shareActionStyle(t) {
  return {
    flex: 1,
    cursor: 'pointer',
    padding: '9px 8px',
    borderRadius: 8,
    border: `1px solid ${t.accent}`,
    background: 'transparent',
    color: t.accent,
    font: "500 10px/1 'DM Sans',sans-serif",
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    transition: 'background 200ms ease, color 200ms ease',
  };
}

function ShareGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
