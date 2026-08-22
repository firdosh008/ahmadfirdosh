import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import styles from './section-heading.module.css';

const ghostReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
};

export const SectionHeading = ({
  eyebrow,
  ghost,
  children,
  level = 2,
  align = 'start',
  invert,
  className,
  ...rest
}) => (
  <motion.div
    className={classes(styles.wrap, className)}
    data-align={align}
    initial="hidden"
    whileInView="visible"
    viewport={revealViewport}
    variants={staggerChildren}
    {...rest}
  >
    {!!ghost && (
      <motion.span
        aria-hidden
        className={styles.ghost}
        data-invert={invert}
        variants={ghostReveal}
        style={align === 'center' ? { x: '-50%' } : undefined}
      >
        {ghost}
      </motion.span>
    )}
    {!!eyebrow && (
      <motion.div variants={fadeUp}>
        <Text className={styles.eyebrow} size="s" data-invert={invert}>
          {eyebrow}
        </Text>
      </motion.div>
    )}
    <motion.div variants={fadeUp}>
      <Heading level={level} className={styles.title} data-invert={invert}>
        {children}
      </Heading>
    </motion.div>
  </motion.div>
);
