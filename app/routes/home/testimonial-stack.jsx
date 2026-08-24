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
    let armed = true;

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

      // Leaving the section rewinds the row before the page carries on, so it
      // is never left part-scrolled and always comes back to its first card —
      // which is also where the flight expects to land.
      const rect = section.getBoundingClientRect();
      const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const home = Math.floor(LOOPS / 2) * CARDS.length * step;

      // Re-armed here rather than in the wheel handler: the section can be
      // re-entered by a scrollbar drag, a keypress or an anchor jump, none of
      // which are wheel events, and a stale latch means no hold next time.
      if (shown > rect.height * 0.9) armed = true;

      if (shown < rect.height * 0.4 && !tween && Math.abs(rail.scrollLeft - home) > 1) {
        slide(home);
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

    const home = () => Math.floor(LOOPS / 2) * CARDS.length * cards[0].offsetWidth;

    // Leaving the section holds the page still until the row has rewound, so
    // the reset finishes before the screen moves rather than racing it. Bounded
    // by the tween and a hard timeout — a scroll that can't be released is a
    // far worse bug than one that resets late.
    let holding = false;
    let release = null;

    const hold = event => {
      if (holding) {
        event.preventDefault();
        return;
      }

      const rect = section.getBoundingClientRect();
      const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

      // One departure gets one hold, however many times the wheel turns; the
      // scroll loop re-arms it once the section is properly back.
      if (!armed || shown < rect.height * 0.4) return;
      if (Math.abs(rail.scrollLeft - home()) <= 1) return;

      // Going up, the cards start flying back to the carousel on the first
      // pixel of scroll — their clock runs off the section's top, which is
      // spent on the way in and unwinds the moment you turn round. So the
      // rewind has to happen before that pixel, not once the section is
      // half gone. Going down the clock stays pinned at its far end and the
      // cards sit still, so there it can wait until the row is on its way out.
      if (!(event.deltaY < 0) && shown > rect.height * 0.9) return;

      event.preventDefault();
      holding = true;
      armed = false;
      slide(home(), () => {
        holding = false;
        clearTimeout(release);
      });
      release = setTimeout(() => {
        holding = false;
      }, 700);
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
      // The rewind owns the wheel while it runs; leave it alone.
      if (holding) return;
      // A real sideways swipe still belongs to the row.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const scale =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;

      event.preventDefault();
      window.scrollBy(0, event.deltaY * scale);
    };

    // The rail covers the cards, so a click on them lands here: anything to
    // the right of the front card is the stack, and means "next".
    const advance = event => {
      const front = cards[0];
      const edge =
        stage.getBoundingClientRect().left + front.offsetLeft + front.offsetWidth;
      if (event.clientX <= edge) return;
      slide(
        Math.min(rail.scrollLeft + front.offsetWidth, rail.scrollWidth - rail.clientWidth)
      );
    };

    update();
    rail.addEventListener('click', advance);
    // Before the window-level hold, which still sees the event either way:
    // preventDefault doesn't stop it propagating.
    rail.addEventListener('wheel', steer, { passive: false });
    window.addEventListener('wheel', hold, { passive: false });
    window.addEventListener('touchmove', hold, { passive: false });
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
      rail.removeEventListener('wheel', steer);
      clearTimeout(release);
      window.removeEventListener('wheel', hold);
      window.removeEventListener('touchmove', hold);
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
