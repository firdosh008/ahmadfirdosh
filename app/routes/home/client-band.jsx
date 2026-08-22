import { LogoMarquee } from '~/components/logo-marquee';
import { Text } from '~/components/text';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport } from '~/utils/motion';
import styles from './client-band.module.css';

export const ClientBand = () => (
  <motion.section
    className={styles.band}
    initial="hidden"
    whileInView="visible"
    viewport={revealViewport}
    variants={fadeUp}
  >
    <Text as="p" size="s" className={styles.eyebrow}>
      Worked with
    </Text>
    <LogoMarquee />
  </motion.section>
);
