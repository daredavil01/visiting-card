import { hrefFor, buttonFor } from '../content/links.js';
import { downloadVCard, copyVCard } from '../utils/vcard.js';

// Back face. Two columns of sections, a CTA row, and the closing quote.
//
// Rows whose `key` resolves to a real destination become anchors; the rest stay
// text. Anchors and buttons stop propagation so activating one never also flips
// the card out from under the visitor.
export default function CardBack({ t, v, m, onCopied }) {
  const stop = (e) => e.stopPropagation();

  const handleButton = (e, spec) => {
    e.stopPropagation();
    if (spec.action === 'vcard') downloadVCard(v);
    else if (spec.action === 'copy') copyVCard(v).then(onCopied);
  };

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
                  style={{
                    font: `500 ${m.microSize}/1 ${t.body}`,
                    letterSpacing: '.2em',
                    color: t.accent,
                    textTransform: 'uppercase',
                    marginBottom: 6,
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

                    const style = { display: 'flex', gap: 7, alignItems: 'baseline' };

                    return href ? (
                      <a
                        key={it.text}
                        className="row-link"
                        href={href}
                        target={href.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        onClick={stop}
                        onPointerDown={stop}
                        tabIndex={-1}
                        style={style}
                      >
                        {row}
                      </a>
                    ) : (
                      <div key={it.text} style={style}>
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
        {v.back.buttons.map((label) => {
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
            background: t.statBg,
            cursor: 'pointer',
            '--fill': t.accent,
            '--fillText': t.surfaceSolid,
          };

          return spec.href ? (
            <a
              key={label}
              className="cta"
              href={spec.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              onPointerDown={stop}
              tabIndex={-1}
              style={style}
            >
              {spec.label}
            </a>
          ) : (
            <button
              key={label}
              type="button"
              className="cta"
              onClick={(e) => handleButton(e, spec)}
              onPointerDown={stop}
              tabIndex={-1}
              style={style}
            >
              {spec.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontWeight: 400,
          fontSize: m.bodySize,
          lineHeight: 1.4,
          fontFamily: t.body,
          fontStyle: t.quoteStyle,
          color: t.text,
          opacity: 0.62,
          textWrap: 'pretty',
        }}
      >
        {v.back.quote}
      </div>
    </div>
  );
}
