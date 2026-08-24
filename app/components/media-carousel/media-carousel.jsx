import { Icon } from '~/components/icon';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { classes } from '~/utils/style';
import styles from './media-carousel.module.css';

const AUTO_ADVANCE_MS = 3800;

export const MediaCarousel = ({ images, className }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple || paused || reduceMotion) return;

    const id = setInterval(() => {
      setIndex(current => (current + 1) % images.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(id);
  }, [hasMultiple, images.length, paused, reduceMotion]);

  if (!images.length) return null;

  const goTo = i => setIndex((i + images.length) % images.length);

  return (
    <div
      className={classes(styles.carousel, className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // WCAG 2.2.2: auto-rotating content pauses for keyboard users too, not
      // just on hover. Capture, so focus on the dot buttons counts.
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {images.map((image, i) => (
        <img
          key={image.src}
          className={styles.slide}
          data-active={i === index}
          src={image.src}
          alt={i === 0 ? image.alt : ''}
          aria-hidden={i === 0 ? undefined : true}
          loading="lazy"
        />
      ))}
      {hasMultiple && (
        <>
          <button
            type="button"
            className={styles.arrow}
            data-side="prev"
            aria-label="Previous screenshot"
            onClick={() => goTo(index - 1)}
          >
            <Icon icon="arrow-left" size={16} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            data-side="next"
            aria-label="Next screenshot"
            onClick={() => goTo(index + 1)}
          >
            <Icon icon="arrow-right" size={16} />
          </button>
          <div className={styles.counter}>
            {index + 1} / {images.length}
          </div>
          <div className={styles.dots}>
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                className={styles.dot}
                data-active={i === index}
                aria-label={`Show screenshot ${i + 1} of ${images.length}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
