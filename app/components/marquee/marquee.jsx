import { classes } from '~/utils/style';
import styles from './marquee.module.css';

export const Marquee = ({ items, className, ...rest }) => (
  <div className={classes(styles.marquee, className)} aria-hidden {...rest}>
    <div className={styles.track}>
      <MarqueeGroup items={items} />
      <MarqueeGroup items={items} />
    </div>
  </div>
);

const MarqueeGroup = ({ items }) => (
  <div className={styles.group}>
    {items.map((item, index) => (
      <span className={styles.item} key={index}>
        {item}
        <span className={styles.divider}>&#10022;</span>
      </span>
    ))}
  </div>
);
