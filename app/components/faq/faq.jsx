import { Icon } from '~/components/icon';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import styles from './faq.module.css';

export const Faq = ({ items, className }) => (
  <div className={classes(styles.faq, className)}>
    {items.map(({ question, answer }, index) => (
      <details className={styles.item} key={index}>
        <summary className={styles.question}>
          <Text as="span" size="l" weight="medium">
            {question}
          </Text>
          <Icon icon="chevron-right" className={styles.chevron} />
        </summary>
        <Text as="p" className={styles.answer} size="m">
          {answer}
        </Text>
      </details>
    ))}
  </div>
);
