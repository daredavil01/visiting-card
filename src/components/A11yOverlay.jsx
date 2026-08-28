import { IDENTITY, hrefFor, buttonFor } from '../content/links.js';
import { downloadVCard, copyVCard } from '../utils/vcard.js';

// A visually-hidden but fully readable version of the card.
//
// The card itself is a 3D-transformed object whose back face is rotated out of
// view; a screen reader following it would read a scrambled, half-hidden document.
// This overlay is the honest text alternative: name, role, every stat, and every
// contact destination as a real link, always present regardless of which face is
// showing. `aria-hidden` on the visual card keeps the two from being read twice.
export default function A11yOverlay({ v }) {
  const rows = v.back.cols.flatMap((c) => c.sections);

  return (
    <main className="sr-only">
      <h1>{IDENTITY.name}</h1>
      <p>{v.role}</p>
      <p>{v.tagline}</p>
      <p>{IDENTITY.location}</p>

      {v.stackLines && (
        <section>
          <h2>Stack</h2>
          <ul>
            {v.stackLines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>At a glance</h2>
        <ul>
          {v.stats.map((s) => (
            <li key={s.label}>
              {s.num} {s.label}
            </li>
          ))}
        </ul>
      </section>

      {v.note && <p>{v.note}</p>}

      {rows.map((sec) => (
        <section key={sec.label}>
          <h2>{sec.label}</h2>
          <ul>
            {sec.items.map((it) => {
              const href = hrefFor(it.key);
              return (
                <li key={it.text}>
                  {href ? (
                    <a href={href} rel="noopener noreferrer">
                      {it.text}
                    </a>
                  ) : (
                    it.text
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section>
        <h2>Actions</h2>
        <ul>
          {v.back.buttons.map((label) => {
            const spec = buttonFor(label);
            if (spec.href) {
              return (
                <li key={label}>
                  <a href={spec.href} rel="noopener noreferrer">
                    {spec.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => (spec.action === 'vcard' ? downloadVCard(v) : copyVCard(v))}
                >
                  {spec.action === 'vcard' ? 'Download contact card' : 'Copy contact details'}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <p>{v.back.quote}</p>
    </main>
  );
}
