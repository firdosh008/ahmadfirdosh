import { LogoMarquee } from '~/components/logo-marquee';
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
    <LogoMarquee />
  </motion.section>
);
