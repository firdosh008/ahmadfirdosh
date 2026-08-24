import { Button } from '~/components/button';
import styles from './sound-toggle.module.css';

export const SoundToggle = ({ muted, onToggle, isMobile, ...rest }) => (
  <Button
    iconOnly
    className={styles.toggle}
    data-mobile={isMobile}
    aria-label={muted ? 'Turn interface sound on' : 'Turn interface sound off'}
    aria-pressed={!muted}
    onClick={onToggle}
    {...rest}
  >
    <svg aria-hidden className={styles.svg} width="24" height="24" viewBox="0 0 38 38">
      {/* The speaker body, which both states share. */}
      <path className={styles.icon} d="M9 15h4l6-5v18l-6-5H9z" />
      {muted ? (
        <path className={styles.icon} d="M24 15l7 8M31 15l-7 8" />
      ) : (
        <path className={styles.icon} d="M24 14.5a6 6 0 0 1 0 9M28 11a11 11 0 0 1 0 16" />
      )}
    </svg>
  </Button>
);
