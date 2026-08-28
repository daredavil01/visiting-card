// The per-view sparkline from design doc sections 3.2-3.4 and the Theme x View
// matrix in section 6: a small graphic that says what this persona is about and
// draws itself left-to-right when the view is entered.
//
// Each one is real data-shaped rather than decorative noise:
//   developer  contribution heatmap — a commit rhythm with weekends dipping
//   runner     a training week's paces, with the long run as the outlier
//   trekker    an elevation profile whose tallest peak is the signature trek
//   general    the four counts on the front, as a single rising line
//   writer     ruled lines with a ragged right edge — a page of prose
//
// Themes only supply colour, so any of the twenty combinations works. The draw
// animation is CSS (dash offset for lines, scaleY for bars) keyed to the view, so
// switching views replays it without any JavaScript timers.

const W = 116;
// Kept short on purpose: Developer's stack block leaves only a few pixels of
// slack on the front face, and the signature has to fit inside them.
const H = 20;

// Commit-ish rhythm: five weeks, dipping at weekends.
const HEATMAP = [
  2, 3, 4, 2, 3, 1, 0, 3, 4, 4, 3, 2, 1, 0, 4, 3, 2, 4, 4, 1, 1, 2, 4, 3, 3, 2, 0, 1, 3, 4, 4, 2,
];

// A week of runs: easy days, a session, then the long one.
const PACES = [8, 11, 7, 14, 9, 6, 24];

// Ridge profile — the tall one is Panhala to Pawankhind.
const RIDGE = [4, 9, 6, 13, 8, 11, 22, 15, 9, 12, 6, 3];

// The four front-of-card counts, normalised into a rising line.
const GENERAL = [6, 11, 9, 17, 13, 20, 16, 23];

// Line lengths on a page of prose: mostly full, breaking short at paragraph ends.
const PROSE = [1, 0.94, 0.98, 0.62, 1, 0.9, 0.44];

function linePath(values, width = W, height = H) {
  const max = Math.max(...values);
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = (i * step).toFixed(1);
      const y = (height - (v / max) * (height - 2) - 1).toFixed(1);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

function Sparkline({ values, color, accent }) {
  const d = linePath(values);
  const max = Math.max(...values);
  const step = W / (values.length - 1);
  const peak = values.indexOf(max);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path
        className="sig-draw"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mark the outlier: the long run, the signature summit. */}
      <circle
        className="sig-dot"
        cx={(peak * step).toFixed(1)}
        cy={(H - (max / max) * (H - 2) - 1).toFixed(1)}
        r="2"
        fill={accent}
      />
    </svg>
  );
}

export default function ViewSignature({ view, t }) {
  const color = t.accent;
  const accent = t.accent2;

  if (view.key === 'developer') {
    const cols = Math.ceil(HEATMAP.length / 4);
    const cw = W / cols;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {HEATMAP.map((level, i) => {
          const col = Math.floor(i / 4);
          const row = i % 4;
          return (
            <rect
              key={i}
              className="sig-cell"
              x={(col * cw).toFixed(1)}
              y={(row * (H / 4)).toFixed(1)}
              width={(cw - 1.6).toFixed(1)}
              height={(H / 4 - 1.6).toFixed(1)}
              rx="0.8"
              fill={level === 0 ? accent : color}
              opacity={level === 0 ? 0.18 : 0.25 + level * 0.19}
              style={{ animationDelay: `${col * 26}ms` }}
            />
          );
        })}
      </svg>
    );
  }

  if (view.key === 'writer') {
    const rows = PROSE.length;
    const gap = H / rows;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {PROSE.map((len, i) => (
          <rect
            key={i}
            className="sig-rule"
            x="0"
            y={(i * gap + 1).toFixed(1)}
            width={(W * len).toFixed(1)}
            height="1.4"
            rx="0.7"
            fill={len < 0.7 ? accent : color}
            opacity={len < 0.7 ? 0.55 : 0.42}
            style={{ animationDelay: `${i * 55}ms` }}
          />
        ))}
      </svg>
    );
  }

  if (view.key === 'runner') return <Sparkline values={PACES} color={color} accent={accent} />;
  if (view.key === 'trekker') return <Sparkline values={RIDGE} color={color} accent={accent} />;
  return <Sparkline values={GENERAL} color={color} accent={accent} />;
}
