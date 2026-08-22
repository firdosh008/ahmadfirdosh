import { LogoMarquee } from '~/components/logo-marquee';
import { Text } from '~/components/text';
import styles from './client-band.module.css';

export const ClientBand = () => (
  <section className={styles.band}>
    <Text as="p" size="s" className={styles.eyebrow}>
      Worked with
    </Text>
    <LogoMarquee />
  </section>
);
