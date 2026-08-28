import CardFront from './CardFront.jsx';
import CardBack from './CardBack.jsx';
import ThemeSignature from './ThemeSignature.jsx';

// The card object itself: a perspective wrapper around two absolutely-stacked
// faces with `backface-visibility: hidden`, so rotating the parent past 90 degrees
// swaps which one you see. The transform is written by the animation loop in App,
// never by React.
//
// Surface layers on each face, back to front:
//   base        theme surface colour or gradient
//   pattern     topo contours / grid / paper fibre — shifts on tilt (Wanderer's
//               "elevation lines animate on tilt", doc section 5)
//   foil        rainbow or gold band, repositioned from the pointer (color-dodge)
//   sheen       specular highlight, tracks opposite the foil
//   scanlines   CRT rows, Terminal only, scrolling upward
//   rim         Fresnel edge-light, brightens as the card turns away (doc 7.1)
//   signature   per-theme drawing: Sahyadri's ridge, Blueprint's annotations
//   content     the face itself, parallaxed forward on Z
function Face({ t, children, back, refs = {} }) {
  const gradient = t.surface.includes('gradient');

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
        backgroundImage: gradient ? t.surface : 'none',
        border: t.edge,
        boxShadow: t.shadow,
      }}
    >
      <div
        ref={refs.pattern}
        className={t.key === 'blueprint' ? 'grid-pulse' : undefined}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-6%',
          pointerEvents: 'none',
          backgroundImage: t.pattern,
          backgroundSize: t.patternSize,
        }}
      />

      <div
        ref={refs.foil}
        aria-hidden="true"
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

      {refs.sheen && (
        <div
          ref={refs.sheen}
          aria-hidden="true"
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
        aria-hidden="true"
        // The class carries both the upward scroll and the tube flicker. An
        // inline `animation` here would override it, so there isn't one.
        className={!back && t.scanOpacity > 0 ? 'scanlines' : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: t.scan,
          backgroundSize: '100% 4px',
          opacity: t.scanOpacity,
        }}
      />

      {/* Fresnel rim: an inset edge-light whose strength the loop drives from the
          tilt angle, so the edge flares as the card turns away from the viewer. */}
      <div
        ref={refs.rim}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: t.radius,
          boxShadow: `inset 0 0 22px ${t.glow}, inset 0 0 2px ${t.accent}`,
          opacity: 0,
        }}
      />

      {!back && <ThemeSignature t={t} />}

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
  shadowRef,
  frontRefs,
  backRefs,
  frontLayerRef,
  onFlip,
  onKeyDown,
  tagline,
  caret,
  statNums,
  comboTag,
  cursor,
  onCopied,
  onLink,
  side,
  swapping,
}) {
  return (
    <div style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}>
      {/* Ground shadow, cast opposite the cursor. A sibling of the card rather
          than a box-shadow on it, so it can move independently of the tilt. */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '8% 4%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,.55)',
          filter: 'blur(34px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

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
        <Face t={t} refs={frontRefs}>
          <CardFront
            t={t}
            v={v}
            m={m}
            layerRef={frontLayerRef}
            tagline={tagline}
            caret={caret}
            statNums={statNums}
            comboTag={comboTag}
            swapping={swapping}
          />
        </Face>

        <Face t={t} back refs={backRefs}>
          {/* Keyed on view and side so the staggered reveal replays each time the
              card is turned over or the persona changes. */}
          <CardBack
            key={`${v.key}-${side}`}
            t={t}
            v={v}
            m={m}
            onCopied={onCopied}
            onLink={onLink}
          />
        </Face>
      </div>
    </div>
  );
}
