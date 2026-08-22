import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import styles from './section-heading.module.css';

export const SectionHeading = ({
  eyebrow,
  ghost,
  children,
  level = 2,
  align = 'start',
  invert,
  className,
  ...rest
}) => (
  <div className={classes(styles.wrap, className)} data-align={align} {...rest}>
    {!!ghost && (
      <span aria-hidden className={styles.ghost} data-invert={invert}>
        {ghost}
      </span>
    )}
    {!!eyebrow && (
      <Text className={styles.eyebrow} size="s" data-invert={invert}>
        {eyebrow}
      </Text>
    )}
    <Heading level={level} className={styles.title} data-invert={invert}>
      {children}
    </Heading>
  </div>
);
