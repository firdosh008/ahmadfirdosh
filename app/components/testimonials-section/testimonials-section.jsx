import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fadeUp, revealViewport } from '~/utils/motion';
import styles from './testimonials-section.module.css';

const AUTO_ADVANCE_MS = 6000;
const MAX_RATING = 5;
// Keep in sync with --mediaMobile in global.module.css.
const MOBILE_QUERY = '(max-width: 696px)';

function usePageSize() {
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setPageSize(mql.matches ? 1 : 3);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return pageSize;
}

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
  const pageSize = usePageSize();
  const pages = chunk(items, pageSize);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const hasMultiplePages = pages.length > 1;
  const currentPage = Math.min(page, pages.length - 1);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  useEffect(() => {
    if (!hasMultiplePages || paused || reduceMotion) return;

    const timer = setInterval(() => {
      setPage(current => (current + 1) % pages.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [hasMultiplePages, pages.length, paused, reduceMotion]);

  if (!items.length) return null;

  const goToPage = delta => {
    setPage(current => (current + delta + pages.length) % pages.length);
  };

  const handleDragEnd = (event, info) => {
    const SWIPE_DISTANCE = 40;
    const SWIPE_VELOCITY = 300;

    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
      goToPage(1);
    } else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) {
      goToPage(-1);
    }
  };

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
        drag={hasMultiplePages ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setPaused(true)}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {pages[currentPage].map(item => (
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
              data-active={i === currentPage}
              aria-label={`Show testimonials page ${i + 1} of ${pages.length}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      )}
    </Section>
  );
};
