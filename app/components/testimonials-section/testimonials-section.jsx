import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { fadeUp, revealViewport } from '~/utils/motion';
import styles from './testimonials-section.module.css';

const AUTO_ADVANCE_MS = 5000;
const MAX_RATING = 5;

function initials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const TestimonialsSection = ({ items, id }) => {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const interactedRef = useRef(false);

  // Scrolls only the horizontal card track — never the page. Card.scrollIntoView()
  // also considers the vertical axis and will nudge the whole page down to
  // fully frame the section, which is not what a horizontal carousel should do.
  const scrollToCard = (index, behavior) => {
    const stage = stageRef.current;
    const card = cardRefs.current[index];
    if (!stage || !card) return;

    const left = card.offsetLeft - (stage.clientWidth - card.clientWidth) / 2;
    stage.scrollTo({ left, behavior });
  };

  // Track which card is centered in the scroller, so the dots stay in sync
  // whether the user swipes, drags, or scrolls with a trackpad.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !items.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: stage, threshold: [0.6] }
    );

    cardRefs.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2 || reduceMotion) return;

    const timer = setInterval(() => {
      if (interactedRef.current) return;
      scrollToCard((activeIndex + 1) % items.length, 'smooth');
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [activeIndex, items.length, reduceMotion]);

  if (!items.length) return null;

  const goTo = index => {
    interactedRef.current = true;
    const clamped = Math.min(Math.max(index, 0), items.length - 1);
    scrollToCard(clamped, reduceMotion ? 'auto' : 'smooth');
  };

  return (
    <Section as="section" id={id} className={styles.section}>
      <SectionHeading eyebrow="Testimonials" align="center">
        What clients say
      </SectionHeading>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={fadeUp}
      >
        <div
          className={styles.stage}
          ref={stageRef}
          onPointerDown={() => {
            interactedRef.current = true;
          }}
        >
          {items.map((item, index) => (
            <article
              className={styles.card}
              key={item.name}
              ref={el => (cardRefs.current[index] = el)}
            >
              <div className={styles.avatar} aria-hidden>
                {initials(item.name)}
              </div>
              {!!item.rating && (
                <div
                  className={styles.rating}
                  aria-label={`Rated ${item.rating} out of ${MAX_RATING}`}
                >
                  {Array.from({ length: MAX_RATING }, (_, i) => (
                    <span aria-hidden key={i} data-filled={i < item.rating}>
                      ★
                    </span>
                  ))}
                </div>
              )}
              <Text as="p" size="m" className={styles.quote}>
                “{item.quote}”
              </Text>
              <Heading level={5} as="p" className={styles.name}>
                {item.name}
              </Heading>
              <Text as="p" size="s" className={styles.role}>
                {item.role}
              </Text>
            </article>
          ))}
        </div>
      </motion.div>
      {items.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Previous testimonial"
            disabled={activeIndex === 0}
            onClick={() => goTo(activeIndex - 1)}
          >
            <Icon icon="arrow-left" size={16} />
          </button>
          <div className={styles.dots}>
            {items.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={styles.dot}
                data-active={index === activeIndex}
                aria-label={`Show testimonial from ${item.name}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Next testimonial"
            disabled={activeIndex === items.length - 1}
            onClick={() => goTo(activeIndex + 1)}
          >
            <Icon icon="arrow-right" size={16} />
          </button>
        </div>
      )}
    </Section>
  );
};
