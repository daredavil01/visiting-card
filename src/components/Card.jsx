import CardFront from './CardFront.jsx';
import CardBack from './CardBack.jsx';

// The card object itself: a perspective wrapper around two absolutely-stacked
// faces with `backface-visibility: hidden`, so rotating the parent past 90 degrees
// swaps which one you see. The transform is written by the animation loop in App,
// never by React.
//
// Surface layers, back to front:
//   base        theme surface gradient + pattern
//   foil        rainbow / gold band, repositioned from the pointer (color-dodge)
//   sheen       specular highlight, moves opposite the foil
//   scanlines   CRT rows, Terminal only
//   content     the face itself, parallaxed forward on Z
function Face({ t, children, back, foilRef, sheenRef }) {
  // Themes describe their surface as either a flat colour or a gradient, with a
  // pattern layered over it. Composing that into explicit longhand properties
  // rather than the `background` shorthand keeps React from dropping the
  // pattern when only one of the two changes on a theme switch.
  const gradient = t.surface.includes('gradient');
  const layers = [t.pattern !== 'none' && t.pattern, gradient && t.surface].filter(Boolean);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : undefined,
        borderRadius: t.radius,
        overflow: 'hidden',
        backgroundColor: gradient ? t.surfaceSolid : t.surface,
        backgroundImage: layers.length ? layers.join(', ') : 'none',
        border: t.edge,
        boxShadow: t.shadow,
      }}
    >
      <div
        ref={foilRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: t.foilOpacity,
          backgroundImage: t.foil,
          backgroundSize: '240% 240%',
          mixBlendMode: 'color-dodge',
        }}
      />
      {sheenRef && (
        <div
          ref={sheenRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: t.sheen,
            backgroundSize: '200% 200%',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: t.scan,
          backgroundSize: '100% 4px',
          opacity: t.scanOpacity,
          animation: back ? 'none' : t.scanAnim,
        }}
      />
      {/* The faces are a visual rendering of content that A11yOverlay carries in
          readable form. Hiding them here stops a screen reader announcing the
          card twice, once of it rotated out of view. Interactive descendants are
          taken out of the tab order to match. */}
      <div aria-hidden="true" style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

export default function Card({
  t,
  v,
  m,
  cardRef,
  foilRef,
  sheenRef,
  backFoilRef,
  frontLayerRef,
  onFlip,
  onKeyDown,
  tagline,
  caret,
  statNums,
  comboTag,
  cursor,
  onCopied,
  side,
}) {
  return (
    <div style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}>
      <div
        ref={cardRef}
        className="card"
        onClick={onFlip}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={side === 'back'}
        aria-label={`Interactive visiting card, ${
          side === 'back' ? 'contact details' : 'front'
        }. Press Enter to flip. Arrow keys change theme and view.`}
        style={{
          position: 'relative',
          width: m.cardW,
          height: m.cardH,
          transformStyle: 'preserve-3d',
          cursor,
          willChange: 'transform',
        }}
      >
        <Face t={t} foilRef={foilRef} sheenRef={sheenRef}>
          <CardFront
            t={t}
            v={v}
            m={m}
            layerRef={frontLayerRef}
            tagline={tagline}
            caret={caret}
            statNums={statNums}
            comboTag={comboTag}
          />
        </Face>

        <Face t={t} back foilRef={backFoilRef}>
          <CardBack t={t} v={v} m={m} onCopied={onCopied} />
        </Face>
      </div>
    </div>
  );
}
