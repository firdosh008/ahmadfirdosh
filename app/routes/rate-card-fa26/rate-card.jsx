import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { baseMeta } from '~/utils/meta';
import styles from './rate-card.module.css';

const BUSINESS_RATES = [
  { item: 'One-page / landing site', price: '₹15,000 – 25,000' },
  { item: 'Business site, 5–7 pages, CMS, SEO basics', price: '₹35,000 – 70,000' },
  { item: 'E-commerce', price: '₹75,000 – 1,50,000' },
  { item: 'Custom web app or dashboard', price: '₹1,50,000 – 4,00,000' },
  { item: 'AI chatbot on your own data', price: '₹60,000 – 2,00,000' },
  { item: 'Maintenance retainer', price: '₹5,000 – 15,000 / month' },
];

const AGENCY_RATES = [
  { item: 'Hourly — general dev work', price: '₹1,200 – 2,000 / hr' },
  { item: 'Hourly — AI / agent work', price: '₹2,500 – 4,000 / hr' },
  { item: 'Part-time retainer (60–80 hrs/mo)', price: '₹80,000 – 1,50,000 / month' },
  { item: 'Fixed two-week sprint', price: '₹60,000 – 1,00,000' },
];

export const meta = () => {
  return baseMeta({
    title: 'Rate card',
    description: 'Internal rate reference.',
    noIndex: true,
  });
};

export const RateCard = () => (
  <div className={styles.page}>
    <Section as="section" className={styles.section}>
      <Heading level={1} className={styles.title}>
        Rate card
      </Heading>
      <Text as="p" size="m" className={styles.note}>
        Unlisted reference page — not linked anywhere on the site. Ranges
        reflect scope, timeline, and whether design assets are provided.
        Final numbers are always confirmed in a written proposal before any
        work starts.
      </Text>

      <RateTable heading="Direct to business" rows={BUSINESS_RATES} />
      <RateTable heading="Agency / white-label" rows={AGENCY_RATES} />
    </Section>
    <Footer />
  </div>
);

const RateTable = ({ heading, rows }) => (
  <div className={styles.table}>
    <Heading level={3} as="h2" className={styles.tableHeading}>
      {heading}
    </Heading>
    <div className={styles.rows}>
      {rows.map(row => (
        <div className={styles.row} key={row.item}>
          <Text as="span" size="m" className={styles.rowItem}>
            {row.item}
          </Text>
          <Text as="span" size="m" weight="medium" className={styles.rowPrice}>
            {row.price}
          </Text>
        </div>
      ))}
    </div>
  </div>
);
