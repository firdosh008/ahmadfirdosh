import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { MediaCarousel } from '~/components/media-carousel';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import styles from './project-card.module.css';

export const ProjectCard = ({
  title,
  category,
  summary,
  image,
  images,
  buttonText,
  buttonLink,
  className,
  ...rest
}) => {
  const slides = images || [{ src: image.srcSet.split(' ')[0], alt: image.alt }];

  return (
    <article className={classes(styles.card, className)} {...rest}>
      <div className={styles.imageWrap}>
        <MediaCarousel images={slides} className={styles.image} />
      </div>
      <div className={styles.caption}>
        {!!category && (
          <Text className={styles.category} size="s">
            {category}
          </Text>
        )}
        <Heading level={4} className={styles.title}>
          {title}
        </Heading>
      </div>
      <div className={styles.footer}>
        {!!summary && (
          <Text className={styles.summary} size="s" as="p">
            {summary}
          </Text>
        )}
        {buttonLink && (
          <Button
            secondary
            iconHoverShift
            className={styles.link}
            href={buttonLink}
            iconEnd="arrow-right"
          >
            {buttonText || 'View project'}
          </Button>
        )}
      </div>
    </article>
  );
};
