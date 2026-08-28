import { hrefFor, buttonFor } from '../content/links.js';
import { downloadVCard, copyVCard } from '../utils/vcard.js';

// Back face. Two columns of sections, a CTA row, and the closing quote.
//
// Rows whose `key` resolves to a real destination become anchors; the rest stay
// text. Anchors and buttons stop propagation so activating one never also flips
// the card out from under the visitor.
//
// This component is keyed on view+side in Card, so it remounts on every flip and
// the staggered reveal (doc 7.6, "slide-right reveal, staggered 80ms") replays.

const STAGGER_MS = 80;

export default function CardBack({ t, v, m, onCopied, onLink }) {
  const stop = (e) => e.stopPropagation();

  const handleButton = (e, spec) => {
    e.stopPropagation();
    if (spec.action === 'vcard') downloadVCard(v);
    else if (spec.action === 'copy') copyVCard(v).then(onCopied);
  };

  // Magnetic pull, 40px radius (doc 7.2). Runs only while the pointer is over the
  // row, and writes the transform directly — no state, no rerender.
  const magnetise = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const pull = 0.18;
    el.style.transform = `translate(${(dx * pull).toFixed(1)}px, ${(dy * pull).toFixed(1)}px)`;
  };
  const release = (e) => {
    e.currentTarget.style.transform = '';
  };

  // One running index across both columns so the stagger reads as a single sweep
  // down the face rather than two races.
  let order = 0;

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: m.pad,
        gap: m.gapS,
      }}
    >
      <div style={{ display: 'flex', gap: m.gap, flex: 1, minHeight: 0 }}>
        {v.back.cols.map((col, ci) => (
          <div
            key={ci}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: m.gapS,
              minWidth: 0,
            }}
          >
            {col.sections.map((sec) => (
              <div key={sec.label}>
                <div
                  className="reveal"
                  style={{
                    font: `500 ${m.microSize}/1 ${t.body}`,
                    letterSpacing: '.2em',
                    color: t.accent,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    animationDelay: `${order++ * STAGGER_MS}ms`,
                  }}
                >
                  {sec.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {sec.items.map((it) => {
                    const href = hrefFor(it.key);
                    const row = (
                      <>
                        <span
                          style={{
                            flex: 'none',
                            minWidth: m.keyW,
                            font: `400 ${m.microSize}/1.5 'JetBrains Mono',monospace`,
                            letterSpacing: '.06em',
                            color: t.accent2,
                          }}
                        >
                          {it.key}
                        </span>
                        <span
                          style={{
                            font: `400 ${m.bodySize}/1.45 ${t.body}`,
                            color: t.text,
                            opacity: 0.84,
                            wordBreak: 'break-word',
                          }}
                        >
                          {it.text}
                        </span>
                      </>
                    );

                    const style = {
                      display: 'flex',
                      gap: 7,
                      alignItems: 'baseline',
                      animationDelay: `${order++ * STAGGER_MS}ms`,
                      '--glow': t.glow,
                    };

                    return href ? (
                      <a
                        key={it.text}
                        className="row-link reveal"
                        href={href}
                        target={href.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          stop(e);
                          onLink?.(it.key);
                        }}
                        onPointerDown={stop}
                        onPointerMove={magnetise}
                        onPointerLeave={release}
                        tabIndex={-1}
                        style={style}
                      >
                        {row}
                      </a>
                    ) : (
                      <div key={it.text} className="reveal" style={style}>
                        {row}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: m.gapS,
          borderTop: `1px solid ${t.line}`,
          paddingTop: m.gapS,
        }}
      >
        {v.back.buttons.map((label, i) => {
          const spec = buttonFor(label);
          const style = {
            flex: 1,
            textAlign: 'center',
            padding: m.btnPad,
            border: `1px solid ${t.accent}`,
            borderRadius: t.radiusS,
            font: `500 ${m.microSize}/1 ${t.body}`,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: t.accent,
            cursor: 'pointer',
            animationDelay: `${(order + i) * STAGGER_MS}ms`,
            // Drives the left-to-right fill wipe in styles.css.
            '--fill': t.accent,
            '--fillText': t.surfaceSolid,
            '--rest': t.statBg,
          };

          const body =
            spec.action === 'vcard' ? (
              <>
                <span className="cta-arrow">⬇</span> {spec.label}
              </>
            ) : (
              spec.label
            );

          return spec.href ? (
            <a
              key={label}
              className="cta reveal"
              href={spec.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                stop(e);
                onLink?.(label);
              }}
              onPointerDown={stop}
              tabIndex={-1}
              style={style}
            >
              {body}
            </a>
          ) : (
            <button
              key={label}
              type="button"
              className="cta reveal"
              onClick={(e) => handleButton(e, spec)}
              onPointerDown={stop}
              tabIndex={-1}
              style={style}
            >
              {body}
            </button>
          );
        })}
      </div>

      <div
        className="reveal"
        style={{
          fontWeight: 400,
          fontSize: m.bodySize,
          lineHeight: 1.4,
          fontFamily: t.body,
          fontStyle: t.quoteStyle,
          color: t.text,
          opacity: 0.62,
          textWrap: 'pretty',
          animationDelay: `${(order + 4) * STAGGER_MS}ms`,
        }}
      >
        {v.back.quote}
      </div>
    </div>
  );
}
