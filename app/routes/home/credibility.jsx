import { Text } from '~/components/text';
import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '~/utils/motion';
import styles from './credibility.module.css';

// The line that justifies the rate (design spec §3, §4.1.2). A business owner
// who can't evaluate "multi-agent orchestration" can still read these five and
// conclude this isn't the ₹20k web designer they were about to call. Facts
// about him only — nothing here claims a result on a client's behalf.
const CREDENTIALS = [
  { value: '3 years', label: 'shipping client work' },
  { value: '18 months', label: 'production AI engineering' },
  { value: 'Anthropic', label: 'certified' },
  { value: 'IEEE', label: 'published' },
  { value: 'Top 6%', label: 'on LeetCode' },
];

/**
 * Rendered inside the client band rather than as a section of its own. The gap
 * between the fold and the achievements grid is the corridor the hero's cards
 * fly down — anything parked in it spends the whole approach underneath a
 * moving card. The band is already in that corridor and already reads through
 * the flight, so the strip rides along with it.
 *
 * Inherits the band's reveal: no `whileInView` here, or the two would fight
 * over which one is in the viewport.
 */
export const Credibility = () => (
  <motion.ul className={styles.list} variants={staggerChildren}>
    {CREDENTIALS.map(item => (
      <motion.li className={styles.item} variants={fadeUp} key={item.value}>
        <Text as="span" className={styles.value}>
          {item.value}
        </Text>
        <Text as="span" size="s" className={styles.label}>
          {item.label}
        </Text>
      </motion.li>
    ))}
  </motion.ul>
);
