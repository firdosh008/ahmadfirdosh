import { Image } from '~/components/image';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { Button } from '~/components/button';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { projects } from '~/data/projects';
import { RING, SPIN_START, fillWindow } from './ring';
import styles from './carousel.module.css';

// Some projects carry a screenshot array, the rest a single srcSet.
const source = project =>
  project.images?.[0]
    ? { src: project.images[0].src, placeholder: project.images[0].placeholder }
    : { srcSet: project.image.srcSet, placeholder: project.image.placeholder };

// One hook set per card — useTransform can't be called in a loop in the parent.
function RingCard({ item, index, progress, reduceMotion, isFront, onSelect }) {
  const project = projects.find(entry => entry.id === item.id);
  const { start, end } = fillWindow(index);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  // Slots that receive a flying card don't scale in — the card arriving from
  // the achievements grid is already the right size, so this is a pure
  // cross-fade at the handover.
  const scale = useTransform(progress, [start, end], [item.from ? 1 : 0.9, 1]);
  const select = () => !isFront && onSelect(item.angle);

  return (
    <div
      className={item.shape === 'app' ? styles.app : styles.web}
      style={{ '--angle': `${item.angle}deg` }}
      data-ring-slot={item.from}
      data-ring-handoff={item.handoff}
      // Drives the hover lift and the cursor: the card already facing you has
      // nowhere to go, so it gets neither.
      data-front={isFront || undefined}
      role="button"
      tabIndex={0}
      aria-label={`Bring ${project.title} to the front`}
      onClick={select}
      onKeyDown={event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        select();
      }}
    >
      <motion.div
        className={styles.fill}
        style={reduceMotion ? undefined : { opacity, scale }}
      >
        <Image
          cover
          className={styles.shot}
          alt={project.title}
          sizes="(max-width: 696px) 70vw, 380px"
          {...source(project)}
        />
      </motion.div>
    </div>
  );
}

/**
 * A carousel on a cylinder: each card is pushed out along Z at its own angle,
 * and the whole ring is turned by scroll position. One transform on the parent
 * moves everything, so it stays smooth however many cards are on it.
 */
export const ProjectCarousel = ({ id }) => {
  const stageRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // A full turn once the slots have filled, so every project comes round to the
  // front — slow enough to read each card as it swings past.
  const rotate = useTransform(scrollYProgress, [SPIN_START, 1], [0, -360]);
  // The backdrop pans with the wheel at a fraction of the rate, so the shapes
  // drifting behind read as the far side of the same ring.
  const drift = useTransform(rotate, value => `${value * 2.4}px`);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.92, 1]);

  // Whichever card is nearest the front owns the caption below the ring. State
  // only changes when the answer does, so this isn't a render per frame.
  const [active, setActive] = useState(0);

  useMotionValueEvent(rotate, 'change', value => {
    const front = RING.reduce(
      (best, item, index) => {
        const offset = (((item.angle + value) % 360) + 360) % 360;
        const distance = Math.min(offset, 360 - offset);

        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Infinity }
    );

    setActive(current => (current === front.index ? current : front.index));
  });

  // Where the page has to sit for `angle` to be facing front. The ring's
  // rotation is a pure function of scroll position — solving that function is
  // what keeps a click, a swipe and the wheel all saying the same thing. A
  // second, hand-held rotation would drift out of step the moment you scrolled.
  const bringToFront = angle => {
    const stage = stageRef.current;
    if (!stage) return;

    const share = SPIN_START + (1 - SPIN_START) * (angle / 360);
    const top = stage.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: top + share * (stage.offsetHeight - window.innerHeight),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  // Sideways input — trackpad, wheel tilt, thumb — turns the wheel by moving
  // the page, for the same reason the click does.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = event => {
      // Anything with more vertical than horizontal in it is a page scroll
      // that happens to be a little crooked. Leave it alone.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.scrollBy(0, event.deltaX);
    };

    let from = null;

    const onTouchStart = event => {
      from = { x: event.touches[0].clientX, top: window.scrollY };
    };

    // Doubled: a thumb has only the screen's width to give, and at 1:1 a full
    // swipe barely moves the wheel round.
    const onTouchMove = event => {
      if (from)
        window.scrollTo({ top: from.top + (from.x - event.touches[0].clientX) * 2 });
    };

    const onTouchEnd = () => {
      from = null;
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove', onTouchMove, { passive: true });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove', onTouchMove);
      stage.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const project = projects.find(entry => entry.id === RING[active].id);
  const isApp = RING[active].shape === 'app';

  return (
    <section className={styles.stage} id={id} ref={stageRef} data-ring-stage>
      <div className={styles.pin}>
        <SectionHeading eyebrow="All work" className={styles.heading} align="center">
          Everything I&apos;ve built for clients
        </SectionHeading>

        <motion.div
          className={styles.viewport}
          style={reduceMotion ? undefined : { scale }}
          data-ring-source
        >
          {/* The far side of the wheel: the projects currently facing away,
              blurred back into the page so the ring reads as a solid object
              rather than a handful of floating cards. */}
          <motion.div
            className={styles.backdrop}
            style={reduceMotion ? undefined : { x: drift }}
            aria-hidden="true"
          >
            {RING.map(item => (
              <span className={styles.backdropShot} key={item.id}>
                <Image
                  cover
                  className={styles.backdropImage}
                  alt=""
                  sizes="240px"
                  {...source(projects.find(entry => entry.id === item.id))}
                />
              </span>
            ))}
          </motion.div>
          <motion.div
            className={styles.ring}
            style={reduceMotion ? undefined : { rotateY: rotate }}
          >
            {RING.map((item, index) => (
              <RingCard
                item={item}
                index={index}
                progress={scrollYProgress}
                reduceMotion={reduceMotion}
                isFront={index === active}
                onSelect={bringToFront}
                key={item.id}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className={styles.detail} key={project.id}>
          <Text as="p" size="s" className={styles.summary}>
            {project.summary}
          </Text>
          {!!project.buttonLink && (
            <Button
              secondary
              iconEnd="arrow-right"
              iconHoverShift
              href={project.buttonLink}
              className={styles.detailCta}
            >
              {isApp ? `View ${project.title} app` : `View ${project.title}`}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
