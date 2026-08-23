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
import { useRef, useState } from 'react';
import { projects } from '~/data/projects';
import { RING, SPIN_START, fillWindow } from './ring';
import styles from './carousel.module.css';

// Some projects carry a screenshot array, the rest a single srcSet.
const source = project =>
  project.images?.[0]
    ? { src: project.images[0].src, placeholder: project.images[0].placeholder }
    : { srcSet: project.image.srcSet, placeholder: project.image.placeholder };

// One hook set per card — useTransform can't be called in a loop in the parent.
function RingCard({ item, index, progress, reduceMotion }) {
  const project = projects.find(entry => entry.id === item.id);
  const { start, end } = fillWindow(index);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  // Slots that receive a flying card don't scale in — the card arriving from
  // the achievements grid is already the right size, so this is a pure
  // cross-fade at the handover.
  const scale = useTransform(progress, [start, end], [item.from ? 1 : 0.9, 1]);

  return (
    <div
      className={item.shape === 'app' ? styles.app : styles.web}
      style={{ '--angle': `${item.angle}deg` }}
      data-ring-slot={item.from}
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

  const project = projects.find(entry => entry.id === RING[active].id);
  const isApp = RING[active].shape === 'app';

  return (
    <section className={styles.stage} id={id} ref={stageRef} data-ring-stage>
      <div className={styles.pin}>
        <SectionHeading eyebrow="More work" className={styles.heading} align="center">
          More things I&apos;ve shipped
        </SectionHeading>

        <motion.div
          className={styles.viewport}
          style={reduceMotion ? undefined : { scale }}
        >
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
