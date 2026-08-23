import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HIGHLIGHT_CARDS, HighlightCard } from './highlight-cards';
import { ARRIVALS } from './ring';
import styles from './scatter-flight.module.css';

const clamp = value => Math.min(1, Math.max(0, value));
const lerp = (from, to, t) => from + (to - from) * t;
// Smoothstep: no velocity jump at either end of the flight.
const ease = t => t * t * (3 - 2 * t);

// Frames the avatar on his head, measured off the PNG's alpha: the head spans
// x 526-681, y 101-290 in the 1200x555 frame, so the circle shows a ~240px box
// centred on (603, 205). Expressed as multiples of the avatar's own size, which
// is what lets the card lerp into it. Lerping these alongside the card's box is
// what turns the portrait into a head-and-shoulders avatar instead of squashing
// the whole frame into a circle.
const AVATAR_IMAGE = { width: 5, left: -2.0125, top: -0.354 };

// Two grids exist (desktop and mobile); only one is laid out at a time, so the
// hidden one measures 0 and is skipped.
const visible = nodes => [...nodes].find(node => node.getBoundingClientRect().width > 0);

/**
 * The cards live here, in one fixed layer, and are the same elements the whole
 * way down: at rest they track invisible anchors in the hero, and as the
 * achievements grid scrolls up they interpolate into its slots — position,
 * size and tilt. Nothing is duplicated or cross-faded, so scrolling back up
 * rewinds it exactly.
 */
export const ScatterFlight = () => {
  const layerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const cards = HIGHLIGHT_CARDS.map(card => ({
      card,
      el: layer.querySelector(`[data-flight-card="${card.key}"]`),
      anchor: document.querySelector(`[data-flight-anchor="${card.key}"]`),
      slots: document.querySelectorAll(`[data-flight-slot="${card.key}"]`),
      ring: document.querySelector(`[data-ring-slot="${card.key}"]`),
      arrival: ARRIVALS[card.key],
    })).filter(entry => entry.el && entry.anchor && entry.slots.length);

    const stage = document.querySelector('[data-flight-stage]');
    const ringStage = document.querySelector('[data-ring-stage]');
    if (!stage || !cards.length) return;

    let frame = null;

    const update = () => {
      frame = null;

      const viewport = window.innerHeight;
      const stageTop = stage.getBoundingClientRect().top;
      // Starts when the grid is a viewport away, done as it settles into place.
      const raw = clamp((viewport - stageTop) / (viewport * 0.72));
      const progress = reduceMotion ? Math.round(raw) : ease(raw);

      // Second leg: out of the grid and down onto the carousel's ring.
      //
      // Two clocks, because they answer different questions. `approach` runs
      // while the carousel is still rising into view, which is when the cards
      // have to be travelling — keying the trip to the pinned stretch meant
      // nothing moved until you were already inside the section. `ringProgress`
      // is the pinned stretch itself, the clock the slots fill on.
      let approach = 0;
      let ringProgress = 0;

      if (ringStage) {
        const rect = ringStage.getBoundingClientRect();
        approach = clamp((viewport - rect.top) / viewport);
        ringProgress = clamp(-rect.top / Math.max(1, rect.height - viewport));
      }

      // Read every rect before writing anything — interleaving them would force
      // a layout per card.
      const frames = cards.map(({ el, card, anchor, slots, ring, arrival }) => {
        const slot = visible(slots);

        return {
          el,
          card,
          arrival,
          from: anchor.getBoundingClientRect(),
          to: slot?.getBoundingClientRect(),
          onward: ring?.getBoundingClientRect(),
        };
      });

      frames.forEach(({ el, card, arrival, from, to, onward }) => {
        if (!from.width || !to?.width) {
          el.style.opacity = '0';
          return;
        }

        let width = lerp(from.width, to.width, progress);
        let height = lerp(from.height, to.height, progress);
        let x = lerp(from.left, to.left, progress);
        let y = lerp(from.top, to.top, progress);
        let fade = 1;

        // Ride the second leg down to the ring, arriving exactly as that slot
        // starts to fill, then hand over to it across the fill window.
        if (arrival && onward?.width) {
          // Lands a touch before the section pins, staggered by departure order.
          const travel = ease(clamp((approach - arrival.order * 0.06) / 0.78));

          width = lerp(width, onward.width, travel);
          height = lerp(height, onward.height, travel);
          x = lerp(x, onward.left, travel);
          y = lerp(y, onward.top, travel);
          fade =
            1 - clamp((ringProgress - arrival.start) / (arrival.end - arrival.start));
        }

        el.style.opacity = fade === 1 ? '' : `${fade}`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${lerp(
          card.tilt ?? 0,
          0,
          progress
        )}deg)`;
        // Bobbing fades out as the card commits to its slot.
        el.style.setProperty('--bobAmount', `${(1 - progress) * 5}px`);

        if (card.kind !== 'portrait') return;

        // Round trip for the portrait: rectangle -> circle, whole frame -> head.
        el.style.borderRadius = `${lerp(0, 50, progress)}%`;

        const image = el.querySelector('[data-flight-portrait]');
        if (!image) return;

        image.style.width = `${lerp(1, AVATAR_IMAGE.width, progress) * width}px`;
        image.style.left = `${lerp(0, AVATAR_IMAGE.left, progress) * width}px`;
        image.style.top = `${lerp(0, AVATAR_IMAGE.top, progress) * height}px`;
      });
    };

    const schedule = () => {
      frame ??= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    // rAF is throttled while the tab is hidden, so a frame queued on the way
    // out never runs and the cards come back stale. Re-sync on return.
    document.addEventListener('visibilitychange', schedule);

    // Fonts and late images move the anchors after first paint.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    observer.observe(stage);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', schedule);
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <div className={styles.layer} ref={layerRef} aria-hidden="true">
      {HIGHLIGHT_CARDS.map((card, index) => (
        <div
          className={card.kind === 'portrait' ? styles.portraitCard : styles.card}
          data-flight-card={card.key}
          data-on-mobile={card.onMobile === false ? 'false' : 'true'}
          key={card.key}
        >
          <div className={styles.bob} style={{ animationDelay: `${index * 0.6}s` }}>
            <HighlightCard card={card} />
          </div>
        </div>
      ))}
    </div>
  );
};
