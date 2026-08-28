// The per-theme "Signature" rows from design doc section 5 — the one element that
// makes each theme unmistakably itself, beyond palette and typeface.
//
// Wanderer, Terminal and Holographic get theirs from the surface layers in Card
// (topographic lines that shift on tilt, scrolling scanlines, the pointer-driven
// foil). The two that need real drawing live here.

// Sahyadri Dawn: "hand-drawn SVG mountain silhouette across bottom edge".
// Deliberately uneven — the ridge is drawn with quadratic curves and no two
// summits share a height, so it reads as sketched rather than generated.
function SahyadriRidge({ t }) {
  return (
    <svg
      className="sig-ridge"
      viewBox="0 0 620 74"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '19%',
        pointerEvents: 'none',
      }}
    >
      {/* Far ridge, hazier. */}
      <path
        d="M0,58 Q46,40 78,46 T150,34 Q196,16 236,32 T322,22 Q378,6 424,26 T520,18 Q572,30 620,22 L620,74 L0,74 Z"
        fill={t.accent2}
        opacity="0.13"
      />
      {/* Near ridge, with the treeline sitting on it. */}
      <path
        d="M0,66 Q54,54 96,60 T178,48 Q228,34 268,50 T352,42 Q404,26 452,44 T548,38 Q588,48 620,42 L620,74 L0,74 Z"
        fill={t.accent2}
        opacity="0.26"
      />
      <path
        d="M0,66 Q54,54 96,60 T178,48 Q228,34 268,50 T352,42 Q404,26 452,44 T548,38 Q588,48 620,42"
        fill="none"
        stroke={t.accent2}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// Blueprint: "annotations fade in sequentially with red circles and arrows".
// Three callouts on the things a drawing would actually annotate — the sigil, the
// name block, and the stat row — staggered so they read as being added by hand.
function BlueprintAnnotations({ t }) {
  const red = t.accent2;
  return (
    <svg
      viewBox="0 0 620 391"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <g className="sig-anno" style={{ animationDelay: '260ms' }}>
        <circle
          cx="46"
          cy="52"
          r="26"
          fill="none"
          stroke={red}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.75"
        />
        <path d="M72,44 L112,30" stroke={red} strokeWidth="1" opacity="0.7" />
        <path d="M112,30 l-8,1 l5,4 z" fill={red} opacity="0.7" />
      </g>

      <g className="sig-anno" style={{ animationDelay: '520ms' }}>
        <path d="M556,150 L520,150" stroke={red} strokeWidth="1" opacity="0.7" />
        <path d="M520,150 l7,-4 l0,8 z" fill={red} opacity="0.7" />
        <text
          x="560"
          y="153"
          fill={red}
          opacity="0.85"
          style={{ font: "9px 'IBM Plex Mono', monospace", letterSpacing: '.08em' }}
        >
          TYP.
        </text>
      </g>

      {/* Dimension extension lines under the stat row, the way a drawing measures
          a repeated feature. */}
      <g className="sig-anno" style={{ animationDelay: '760ms' }}>
        <path d="M30,352 L30,362 M590,352 L590,362" stroke={red} strokeWidth="0.8" opacity="0.55" />
        <path d="M30,357 L590,357" stroke={red} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
      </g>
    </svg>
  );
}

export default function ThemeSignature({ t }) {
  if (t.key === 'sahyadri') return <SahyadriRidge t={t} />;
  if (t.key === 'blueprint') return <BlueprintAnnotations t={t} />;
  return null;
}
