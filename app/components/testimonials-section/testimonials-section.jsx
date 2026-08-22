import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fadeUp, revealViewport } from '~/utils/motion';
import styles from './testimonials-section.module.css';

const PAGE_SIZE = 3;
const AUTO_ADVANCE_MS = 6000;
const MAX_RATING = 5;

function chunk(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function initials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const TestimonialsSection = ({ items, id }) => {
  const pages = chunk(items, PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const hasMultiplePages = pages.length > 1;

  useEffect(() => {
    if (!hasMultiplePages || paused || reduceMotion) return;

    const timer = setInterval(() => {
      setPage(current => (current + 1) % pages.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [hasMultiplePages, pages.length, paused, reduceMotion]);

  if (!items.length) return null;

  return (
    <Section as="section" id={id} className={styles.section}>
      <SectionHeading eyebrow="Testimonials" ghost="Clients" align="center">
        What clients say
      </SectionHeading>
      <motion.div
        className={styles.stage}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={fadeUp}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {pages[page].map(item => (
            <motion.article
              className={styles.card}
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {hasMultiplePages && (
        <div className={styles.dots}>
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              className={styles.dot}
              data-active={i === page}
              aria-label={`Show testimonials page ${i + 1} of ${pages.length}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      )}
    </Section>
  );
};
