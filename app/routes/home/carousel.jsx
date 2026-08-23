import { Image } from '~/components/image';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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
        <Text as="span" size="s" className={styles.caption}>
          {project.title}
        </Text>
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

  // A little over half a turn once the slots have filled — slow enough to read
  // each card as it swings past.
  const rotate = useTransform(scrollYProgress, [SPIN_START, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.92, 1]);

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
      </div>
    </section>
  );
};
