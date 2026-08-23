import { Button } from '~/components/button';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import config from '~/config.json';
import { HIGHLIGHT_CARDS, MOBILE_CARDS } from './highlight-cards';
import styles from './billboard.module.css';

const SLOT_CLASS = {
  p: 'slotP',
  a: 'slotA',
  b: 'slotB',
  c: 'slotC',
  d: 'slotD',
  e: 'slotE',
};

// Desktop and mobile get their own grid. Only one is laid out at a time, so
// the small-screen version simply has no slot for the cards it leaves out
// rather than a slot standing empty or filled with a stand-in.
const Grid = ({ cards, className }) => (
  <div className={className}>
    {cards
      .filter(card => card.kind !== 'portrait')
      .map(card => (
        <div
          className={styles[SLOT_CLASS[card.key]]}
          data-flight-slot={card.key}
          key={card.key}
        />
      ))}
  </div>
);

/**
 * The grid is a set of empty slots. The cards scattered across the hero — and
 * the portrait itself — fly down and land in them (see scatter-flight); the
 * slots stay as the resting shape underneath, which is what makes the landing
 * read as "filling in" rather than as new content appearing.
 */
export const Billboard = ({ id }) => (
  <Section as="section" className={styles.billboard} id={id} data-flight-stage>
    <SectionHeading eyebrow="Achievements" className={styles.heading}>
      Work that shipped and stayed shipped
    </SectionHeading>

    <div className={styles.panel}>
      <div className={styles.identity}>
        <span className={styles.avatar} data-flight-slot="p" />
        <span className={styles.identityText}>
          <Text as="span" className={styles.identityName}>
            {config.name}
          </Text>
          <Text as="span" size="s" className={styles.identityRole}>
            {config.role}
          </Text>
        </span>
        <Button
          className={styles.identityCta}
          secondary
          iconEnd="arrow-right"
          iconHoverShift
          href="/#more-work"
        >
          View all projects
        </Button>
      </div>

      <Grid cards={HIGHLIGHT_CARDS} className={styles.gridDesktop} />
      <Grid cards={MOBILE_CARDS} className={styles.gridMobile} />
    </div>
  </Section>
);
