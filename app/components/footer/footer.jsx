import { Icon } from '~/components/icon';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import { socialLinks } from '~/layouts/navbar/nav-data';
import config from '~/config.json';
import styles from './footer.module.css';

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)}>
    <Text size="s" align="center">
      <span className={styles.date}>
        {`© ${new Date().getFullYear()} ${config.name}.`}
      </span>
    </Text>
    {!!socialLinks.length && (
      <div className={styles.socialLinks}>
        {socialLinks.map(({ label, url, icon }) => (
          <a
            key={label}
            className={styles.socialLink}
            aria-label={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={icon} />
          </a>
        ))}
      </div>
    )}
  </footer>
);
