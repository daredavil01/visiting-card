import { IDENTITY } from '../content/links.js';
import ViewSignature from './ViewSignature.jsx';

// Front face. Every value that differs between themes comes from `t`, every value
// that differs between personas comes from `v` — the two axes never touch.
export default function CardFront({
  t,
  v,
  m,
  layerRef,
  tagline,
  caret,
  statNums,
  comboTag,
  swapping,
  portrait,
}) {
  return (
    <div
      ref={layerRef}
      // Content fades out at the edge-on moment of a view swap and back in with
      // the new persona already in place (doc section 4).
      className={swapping ? 'face-content swapping' : 'face-content'}
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: m.pad,
        gap: m.gap,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Slow continuous rotation, 0.5 rpm, scaling up on hover (doc 7.6). */}
        <div
          className="sigil"
          style={{
            font: m.sigilSize + t.display,
            color: t.accent,
            letterSpacing: '-.02em',
            textShadow: `0 0 18px ${t.glow}`,
          }}
        >
          {v.sigil}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div
            style={{
              textAlign: 'right',
              font: `400 ${m.microSize}/1.5 'JetBrains Mono',monospace`,
              letterSpacing: '.1em',
              color: t.dim2,
              textTransform: 'uppercase',
            }}
          >
            {v.corner}
          </div>
          {/* Replays its draw animation whenever the persona changes. */}
          <ViewSignature key={v.key} view={v} t={t} />
        </div>
      </div>

      <div>
        <div
          style={{
            font: m.nameFont,
            fontFamily: t.display,
            color: t.text,
            letterSpacing: m.nameTrack,
            lineHeight: 1.02,
            textShadow: t.emboss,
          }}
        >
          {IDENTITY.name}
        </div>
        <div
          style={{
            marginTop: m.roleGap,
            font: `500 ${m.roleSize}/1.3 ${t.body}`,
            color: t.accent,
            letterSpacing: '.04em',
          }}
        >
          {v.role}
        </div>
      </div>

      <div
        style={{
          // Longhand, not the `font` shorthand: fontStyle is set alongside it and
          // the two together make React drop one on rerender.
          fontWeight: 400,
          fontSize: m.taglineSize,
          lineHeight: 1.45,
          fontFamily: t.body,
          fontStyle: t.quoteStyle,
          color: t.text,
          opacity: 0.86,
          maxWidth: m.taglineMax,
          minHeight: m.taglineMin,
          textWrap: 'pretty',
        }}
      >
        {tagline}
        <span
          style={{
            display: 'inline-block',
            width: '.5em',
            color: t.accent,
            animation: 'blink 1s step-end infinite',
          }}
        >
          {caret}
        </span>
      </div>

      {v.stackLines && (
        <div>
          <div
            style={{
              font: `500 ${m.microSize}/1 ${t.body}`,
              letterSpacing: '.2em',
              color: t.dim2,
              textTransform: 'uppercase',
              marginBottom: m.gapS,
            }}
          >
            Stack
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {v.stackLines.map((line) => (
              <div
                key={line}
                style={{
                  font: `400 ${m.bodySize}/1.45 'JetBrains Mono',monospace`,
                  color: t.text,
                  opacity: 0.8,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: m.gapS, marginTop: 'auto' }}>
        {v.stats.map((s, i) => (
          <div
            key={s.label}
            className="stat"
            style={{
              flex: 1,
              padding: m.statPad,
              border: `1px solid ${t.line}`,
              borderRadius: t.radiusS,
              background: t.statBg,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                font: `600 ${m.statSize}/1 ${t.display}`,
                color: t.accent,
                letterSpacing: '-.01em',
              }}
            >
              {statNums[i]}
            </div>
            <div
              style={{
                marginTop: 3,
                font: `400 ${m.microSize}/1.25 'JetBrains Mono',monospace`,
                letterSpacing: '.05em',
                color: t.text,
                opacity: 0.62,
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {v.note && (
        <div
          style={{
            display: 'flex',
            gap: 7,
            alignItems: 'baseline',
            font: `400 ${m.bodySize}/1.4 ${t.body}`,
            color: t.text,
            opacity: 0.78,
          }}
        >
          <span style={{ color: t.accent2 }}>◆</span>
          <span>{v.note}</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          // Upright, the two footer lines do not fit side by side — Blueprint's
          // dimension string alone is wider than half the face — so they stack.
          flexDirection: portrait ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: portrait ? 'flex-start' : 'flex-end',
          gap: portrait ? 4 : 0,
          borderTop: `1px solid ${t.line}`,
          paddingTop: m.gapS,
        }}
      >
        <div
          style={{
            font: `400 ${m.microSize}/1 'JetBrains Mono',monospace`,
            letterSpacing: '.14em',
            color: t.text,
            opacity: 0.6,
          }}
        >
          {IDENTITY.location}
        </div>
        <div
          style={{
            font: `400 ${m.microSize}/1 'JetBrains Mono',monospace`,
            letterSpacing: '.14em',
            color: t.dim2,
          }}
        >
          {/* Blueprint's signature is the drawing annotating its own subject.
              The dimensions are the real ISO 7810 ID-1 card size, which is what
              the 620 x 391 layout is a 1:1 rendering of. It takes the footer slot
              rather than a row of its own — Developer's stack block leaves no
              vertical room for an extra line. */}
          {t.key === 'blueprint' ? '85.6 × 53.98 MM · SCALE 1:1 · REV 2026.08' : comboTag}
        </div>
      </div>
    </div>
  );
}
