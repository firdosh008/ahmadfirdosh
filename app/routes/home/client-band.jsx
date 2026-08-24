import { LogoMarquee } from '~/components/logo-marquee';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import { Credibility } from './credibility';
import styles from './client-band.module.css';

export const ClientBand = () => (
  <motion.section
    className={styles.band}
    initial="hidden"
    whileInView="visible"
    viewport={revealViewport}
    variants={staggerChildren}
  >
    <motion.div className={styles.row} variants={fadeUp}>
      <LogoMarquee />
    </motion.div>
    <Credibility />
  </motion.section>
);
