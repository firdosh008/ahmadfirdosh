import { Text } from '~/components/text';
import styles from './client-band.module.css';

const CLIENTS = [
  'AdmissionDesk',
  'Hotel Classic Inn',
  "Dr Sachin's Dental Clinic",
  'The Crazy Mountaineers',
  'Yumy',
  'SRA Hotels',
  'Anymart',
  'Preplix',
  'FlexiPaisa',
];

export const ClientBand = () => (
  <section className={styles.band}>
    <Text as="p" size="s" className={styles.eyebrow}>
      Worked with
    </Text>
    <ul className={styles.list}>
      {CLIENTS.map(client => (
        <li key={client} className={styles.item}>
          {client}
        </li>
      ))}
    </ul>
  </section>
);
