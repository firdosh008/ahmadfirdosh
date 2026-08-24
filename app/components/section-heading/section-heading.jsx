import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import styles from './section-heading.module.css';

export const SectionHeading = ({
  eyebrow,
  children,
  level = 2,
  align = 'start',
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
    {!!eyebrow && (
      <motion.div variants={fadeUp}>
        <Text className={styles.eyebrow} size="s">
          {eyebrow}
        </Text>
      </motion.div>
    )}
    <motion.div variants={fadeUp}>
      <Heading level={level} className={styles.title}>
        {children}
      </Heading>
    </motion.div>
  </motion.div>
);
