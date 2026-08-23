import { Image } from '~/components/image';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { projects } from '~/data/projects';
import { HANDOFF, source } from './testimonial-stack';
import styles from './handoff-flight.module.css';

const clamp = value => Math.min(1, Math.max(0, value));
const lerp = (from, to, t) => from + (to - from) * t;
const ease = t => t * t * (3 - 2 * t);

// A slot turned edge-on projects to almost nothing, and a card can't fly out of
// a zero-width box — those come off the front of the wheel instead.
const FLYABLE = 40;
// Share of the approach spent staggering, so however many cards there are the
// last one still lands by the time the row is in place.
const SPREAD = 0.3;

const FLIGHTS = HANDOFF.map(slot => ({
  slot,
  project: projects.find(project => project.id === slot.id),
})).filter(entry => entry.project);

/**
 * The third leg, and the same trick the achievements grid uses: the shot isn't
 * copied into the testimonial row, it travels there. One element per handoff
 * card lives in this fixed layer and interpolates from the carousel slot it
 * belongs to down onto the card's resting box. The slot empties to its grey
 * box behind it, and the row's own card only takes over once the flight has
 * landed on it exactly — so nothing is ever on screen twice, and scrolling
 * back up rewinds it.
 */
export const HandoffFlight = () => {
  const layerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const items = FLIGHTS.map(({ slot, project }) => ({
      el: layer.querySelector(`[data-handoff-card="${project.id}"]`),
      ring: document.querySelector(`[data-ring-handoff="${slot.handoff}"]`),
      card: document.querySelector(`[data-stack-card="${project.id}"]`),
    }));

    const section = document.querySelector('[data-stack-section]');
    if (!section) return;

    let frame = null;

    const update = () => {
      frame = null;

      const viewport = window.innerHeight;
      // Runs while the row is still rising into view — the cards have to be
      // travelling before you arrive, or they land in an empty section.
      const approach = clamp((viewport - section.getBoundingClientRect().top) / viewport);

      // Read every rect before writing anything — interleaving them forces a
      // layout per card, and these rects sit inside a pinned, 3D-transformed
      // carousel where that is ruinous.
      const gap = items.length > 1 ? SPREAD / (items.length - 1) : 0;

      const frames = items.map(({ el, ring, card }, index) => {
        // Staggered from the back of the stack forward, so the card still in
        // the air is always the one that belongs on top. Delaying the far ones
        // instead would fly them over cards that had already landed.
        const raw = clamp(
          (approach - (items.length - 1 - index) * gap) / (1 - SPREAD)
        );

        return {
          el,
          ring,
          card,
          travel: reduceMotion ? Math.round(raw) : ease(raw),
          from: ring?.getBoundingClientRect(),
          to: card?.getBoundingClientRect(),
        };
      });

      // The front of the wheel, for the cards whose own slot is edge-on.
      const lead = frames.find(entry => entry.from?.width > FLYABLE)?.from;

      frames.forEach(({ el, ring, card, travel, from, to }) => {
        const source = from?.width > FLYABLE ? from : lead;

        // Nothing to fly from or to, and the row keeps its own card rather than
        // a permanently invisible one waiting on a flight that can't happen.
        if (!el || !source || !to?.width) {
          card?.style.setProperty('--flown', '1');
          return;
        }

        el.style.width = `${lerp(source.width, to.width, travel)}px`;
        el.style.height = `${lerp(source.height, to.height, travel)}px`;
        el.style.transform = `translate3d(${lerp(source.left, to.left, travel)}px, ${lerp(
          source.top,
          to.top,
          travel
        )}px, 0)`;

        // At either end the element it stands in for is the one on screen: the
        // slot's own shot before the trip, the row's own card after it. In
        // between, both are hidden and this is the only copy.
        el.style.opacity = travel > 0 && travel < 1 ? '1' : '0';
        // Emptied quickly, so the slot reads as vacated the moment it lifts —
        // but only where the card really came out of that slot.
        if (source === from) {
          ring.style.setProperty('--handoff', `${1 - clamp(travel * 3)}`);
        }
        card.style.setProperty('--flown', travel < 1 ? '0' : '1');
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
    // out never runs and the cards come back stale.
    document.addEventListener('visibilitychange', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [reduceMotion]);

  return (
    <div className={styles.layer} ref={layerRef} aria-hidden="true">
      {FLIGHTS.map(({ project }, index) => (
        <div
          className={styles.card}
          data-handoff-card={project.id}
          key={project.id}
          // Same order the row keeps once they land: the leftmost card is the
          // one on top, each one behind it a layer lower. In DOM order these
          // would paint the other way round and the last card would cover the
          // first for the whole trip.
          style={{ zIndex: FLIGHTS.length - index }}
        >
          <Image
            cover
            className={styles.shot}
            alt={project.title}
            sizes="(max-width: 696px) 88vw, 760px"
            {...source(project)}
          />
        </div>
      ))}
    </div>
  );
};
