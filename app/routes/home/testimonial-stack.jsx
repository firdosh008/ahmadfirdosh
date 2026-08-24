import { Image } from '~/components/image';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { projects } from '~/data/projects';
import { RING } from './ring';
import styles from './testimonial-stack.module.css';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, t) => from + (to - from) * t;
const ease = t => t * t * (3 - 2 * t);

// How a card sits relative to the one in front of it. One card reads at full
// size; the rest are tucked behind it, each a step smaller, with only a strip
// of their right edge clearing the card on top.
const PEEK = 0.2; // of the front card's width that the whole stack shows past it
const SHRINK = 0.9; // each step back
const BEHIND = 2; // cards visible behind the front one; the rest hide under them
const LOOPS = 20; // copies of the row in the rail, so the line never runs out
const LIFT = '0 -10px'; // hover nudge on a card sitting behind the front one

// The right-hand edge of the card sitting `place` deep, in stage pixels: where
// it starts, plus its shrunken width. Built from the same three constants the
// row is drawn with, so what a click thinks it hit and what you can actually
// see can't come apart.
const edgeOf = (place, width) =>
  (width * PEEK * (1 - SHRINK ** place)) / (1 - SHRINK) + width * SHRINK ** place;

const STAR_PATH = 'M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z';

// The page showing through the band's edge. Everything above the curve is
// filled, so the band reads as having been cut by a wave rather than ending
// square. Drawn once; the bottom edge is the same path turned 180deg.
//
// Every endpoint sits on the midline (50) and the control points swing past
// the box — a quadratic only travels half way to its control, so reaching
// y=20 and y=80 takes controls at -10 and 110. That's what gives the crests
// their depth; putting the endpoints themselves at the extremes would just
// flatten the curve between them. Three segments = one and a half cycles.
const CREST = 'Q1200,110 960,50 T480,50 T0,50';

// The two edges run the same crest but enclose opposite sides of it: the top
// fills up to y=0, the bottom down to y=100. That inversion is what puts them
// out of phase — where the page cuts into the band at the top it bulges away
// at the bottom, so the band flows instead of pinching in and out together.
// (Turning one edge 180deg would mirror it horizontally and land back in
// phase, which is what it was doing before.)
const WAVE_TOP = `M0,0 H1440 V50 ${CREST} Z`;
const WAVE_BOTTOM = `M0,100 H1440 V50 ${CREST} Z`;

const Wave = ({ className, d }) => (
  <svg
    className={className}
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// The ring slots that hand a card down to this stack, in slot order — and only
// those whose project actually carries a testimonial. Pairing by project id
// rather than by position is what keeps the two lists free to be reordered
// independently: the carousel answers to the billboard, and this follows it.
export const HANDOFF = RING.filter(
  slot => slot.handoff != null && projects.some(p => p.id === slot.id && p.testimonial)
).sort((a, b) => a.handoff - b.handoff);

// Leading with those projects means each card is the shot the carousel was
// just showing. Sort is stable, so the rest keep their order.
const rank = project => {
  const place = HANDOFF.findIndex(slot => slot.id === project.id);
  return place < 0 ? HANDOFF.length : place;
};

const CARDS = projects
  .filter(project => project.testimonial)
  .sort((a, b) => rank(a) - rank(b));

// The row is circular: past the last card the first comes round again. Only the
// drawing wraps — the rail underneath is a long ordinary scroller.
const wrap = place => ((((place + 1) % CARDS.length) + CARDS.length) % CARDS.length) - 1;

export const source = project =>
  project.images?.[0]
    ? { src: project.images[0].src, placeholder: project.images[0].placeholder }
    : { srcSet: project.image.srcSet, placeholder: project.image.placeholder };

export const TestimonialStack = ({ id }) => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    if (!section || !stage || !rail) return;

    const cards = [...stage.querySelectorAll('[data-stack-card]')];
    const panels = [...section.querySelectorAll('[data-stack-panel]')];
    if (!cards.length) return;

    // Start in the middle of the loops so the row runs both ways.
    rail.scrollLeft = Math.floor(LOOPS / 2) * CARDS.length * cards[0].offsetWidth;

    let frame = null;
    // Which card the pointer is over, as a place rather than an index — the row
    // wraps, so which card sits in a given spot changes as it scrolls. -1 is none.
    let hovered = -1;

    const update = () => {
      frame = null;

      const width = cards[0].offsetWidth;
      const step = width;
      // The rail is an ordinary horizontal scroller sitting over the stage: it
      // gives us native wheel, trackpad, touch and keyboard input, and its
      // scroll position is the stack's position. The cards themselves are drawn
      // from it rather than laid out in it.
      const offset = rail.scrollLeft / step;

      cards.forEach((card, index) => {
        const place = wrap(index - offset);
        const height = card.offsetHeight;

        // Where the card belongs once it's home: at the front, or behind it,
        // nudged right just far enough for its edge to clear. Past the front
        // it slides off to the left instead.
        // Deeper than BEHIND, cards park on the last visible one rather than
        // fanning out further.
        const behind = clamp(place, 0, BEHIND);
        const toX =
          place <= 0
            ? place * width
            : (width * PEEK * (1 - SHRINK ** behind)) / (1 - SHRINK);
        const toScale = SHRINK ** behind;

        card.style.transform = `translate3d(${toX}px, ${
          -height / 2
        }px, 0) scale(${toScale})`;
        // `translate`, not folded into the transform above: that one is
        // rewritten every frame and a transition on it would smear the row's
        // own motion. The two compose, and only this half animates.
        card.style.translate = Math.round(place) === hovered ? LIFT : '0 0';
        // Cards that have gone past the front fade as they slide off left.
        // --fade, not opacity: the flight layer owns --flown on the cards it
        // still has in the air, and the two multiply.
        // Off to the left it fades as it goes; deeper than the last visible one
        // it is gone. Those park on top of each other at the same spot, and
        // their edges showing is what made the row look pre-loaded.
        card.style.setProperty(
          '--fade',
          `${clamp(1 + place * 1.2, 0, 1) * clamp(BEHIND + 1 - place)}`
        );
        // The quote sits beside the stack rather than on it, so its panel is
        // a sibling keyed to the same index: whichever card is at the front
        // fades its words in, and the rest crossfade out either way.
        const panel = panels[index];
        if (panel) {
          const read = clamp(1 - Math.abs(place) * 1.4);
          panel.style.opacity = `${read}`;
          panel.style.pointerEvents = read > 0.9 ? 'auto' : 'none';
        }
        // From its place, not its index: with the row wrapping, the card on its
        // way out has to stay above the one taking its spot.
        card.style.zIndex = `${Math.round(1000 - place * 10)}`;
      });

      // Once the section is mostly gone the row is put back where the flight
      // expects to find it. Instantly, and only while it's off screen: there
      // is nothing to watch, so there is nothing to animate — and nothing
      // worth holding the page still for.
      const rect = section.getBoundingClientRect();
      const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const home = Math.floor(LOOPS / 2) * CARDS.length * step;

      if (shown < rect.height * 0.4 && !tween && Math.abs(rail.scrollLeft - home) > 1) {
        rail.scrollLeft = home;
      }
    };

    const schedule = () => {
      frame ??= requestAnimationFrame(update);
    };

    // Chrome ignores smooth programmatic scrolling on a mandatory-snap
    // scroller, so the slide is tweened by hand. It lands exactly on a snap
    // point, so snapping has nothing to argue with.
    let tween = null;

    const slide = (to, done) => {
      const from = rail.scrollLeft;
      const start = performance.now();
      const step = now => {
        const t = ease(clamp((now - start) / 420));
        rail.scrollLeft = lerp(from, to, t);
        tween = t < 1 ? requestAnimationFrame(step) : null;
        // Snapping is off for the ride and back on at the end — otherwise every
        // frame lands between snap points and Chrome yanks it to the nearest
        // one, which is why a click used to jump where a swipe glided.
        if (!tween) {
          rail.style.scrollSnapType = '';
          done?.();
        }
      };
      if (tween) cancelAnimationFrame(tween);
      rail.style.scrollSnapType = 'none';
      tween = requestAnimationFrame(step);
    };

    // Chrome maps a vertical wheel onto the horizontal axis when an element
    // can only scroll that way. On a carousel you're aiming at that's a
    // convenience; on one that covers half the section it means the page
    // stops dead wherever the cursor happens to be and the row slides
    // sideways instead. A mostly-vertical gesture is the page's, so it's
    // taken off the rail and handed to the window by hand.
    //
    // deltaMode matters: a wheel that reports lines (1) or pages (2) rather
    // than pixels (0) would otherwise crawl.
    const steer = event => {
      // A real sideways swipe still belongs to the row.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const scale =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;

      event.preventDefault();
      window.scrollBy(0, event.deltaY * scale);
    };

    // The rail covers the cards, so every click and every hover meant for them
    // lands here instead, and which card was meant has to be worked back out
    // of x. Place 0 is the card at the front; 1 and 2 are the strips peeking
    // past its right edge.
    const placeAt = clientX => {
      const front = cards[0];
      const width = front.offsetWidth;
      const x = clientX - (stage.getBoundingClientRect().left + front.offsetLeft);

      for (let place = 0; place <= BEHIND; place += 1) {
        if (x < edgeOf(place, width)) return place;
      }

      return BEHIND;
    };

    // Clicking a card brings that card forward — two deep means two steps, not
    // one. The front card is already the one being read, so it does nothing.
    const advance = event => {
      const place = placeAt(event.clientX);
      if (place <= 0) return;
      slide(
        Math.min(
          rail.scrollLeft + place * cards[0].offsetWidth,
          rail.scrollWidth - rail.clientWidth
        )
      );
    };

    const hover = event => {
      const place = placeAt(event.clientX);
      const next = place > 0 ? place : -1;

      rail.style.cursor = next > 0 ? 'pointer' : '';
      if (next === hovered) return;

      hovered = next;
      schedule();
    };

    const unhover = () => {
      if (hovered === -1) return;

      hovered = -1;
      rail.style.cursor = '';
      schedule();
    };

    update();
    rail.addEventListener('click', advance);
    rail.addEventListener('mousemove', hover);
    rail.addEventListener('mouseleave', unhover);
    rail.addEventListener('wheel', steer, { passive: false });
    rail.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);

    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (tween) cancelAnimationFrame(tween);
      rail.removeEventListener('click', advance);
      rail.removeEventListener('mousemove', hover);
      rail.removeEventListener('mouseleave', unhover);
      rail.removeEventListener('wheel', steer);
      rail.removeEventListener('scroll', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <section className={styles.section} id={id} ref={sectionRef} data-stack-section>
      <Wave className={styles.waveTop} d={WAVE_TOP} />
      <Wave className={styles.waveBottom} d={WAVE_BOTTOM} />

      <SectionHeading eyebrow="Testimonials" className={styles.heading}>
        In their own words
      </SectionHeading>

      <div className={styles.layout}>
        <div className={styles.quotes}>
          {CARDS.map(project => (
            <figure
              className={styles.panel}
              data-stack-panel={project.id}
              key={project.id}
            >
              <span className={styles.stars} aria-hidden="true">
                {Array.from({ length: project.testimonial.rating }, (_, star) => (
                  <svg
                    key={star}
                    viewBox="0 0 16 16"
                    width="13"
                    height="13"
                    fill="currentColor"
                  >
                    <path d={STAR_PATH} />
                  </svg>
                ))}
              </span>
              <Text as="blockquote" className={styles.quote}>
                {project.testimonial.quote}
              </Text>
              <Text as="figcaption" size="s" className={styles.name}>
                {project.testimonial.name} · {project.testimonial.role}
              </Text>
            </figure>
          ))}
        </div>

        <div className={styles.viewport}>
          <div className={styles.stage} ref={stageRef}>
            {CARDS.map(project => (
              <article
                className={styles.card}
                data-stack-card={project.id}
                key={project.id}
              >
                <Image
                  cover
                  className={styles.media}
                  alt={project.title}
                  sizes="(max-width: 696px) 88vw, 560px"
                  {...source(project)}
                />
              </article>
            ))}
          </div>

          {/* Input surface only — the arc above is drawn from its scroll offset. */}
          <div
            className={styles.rail}
            ref={railRef}
            tabIndex={0}
            aria-label="Browse testimonials"
          >
            {Array.from({ length: CARDS.length * LOOPS }, (_, stop) => (
              <div className={styles.railStop} key={stop} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
