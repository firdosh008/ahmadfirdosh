import heroPortrait from '~/assets/hero-portrait.png';
import heroPortraitPlaceholder from '~/assets/hero-portrait-placeholder.png';
import { Image } from '~/components/image';
import { projects } from '~/data/projects';
import styles from './highlight-cards.module.css';

// The cards that scatter across the hero and then fly into the achievements
// grid. One definition drives all three places — the hero anchors, the flying
// layer and the slots — so a card can't get out of sync with its landing spot.
// `onMobile: false` cards sit out the small-screen layout entirely: the mobile
// grid has no slot for them rather than a slot standing empty.
export const HIGHLIGHT_CARDS = [
  { key: 'p', kind: 'portrait' },
  { key: 'a', kind: 'photo', projectId: 'crazy-mountaineers', tilt: -6 },
  { key: 'b', kind: 'photo', projectId: 'ladderbrief', tilt: -12 },
  { key: 'c', kind: 'photo', projectId: 'dr-sachins-dental', tilt: 7, onMobile: false },
  { key: 'd', kind: 'link', projectId: 'admissiondesk', tilt: 9, onMobile: false },
  { key: 'e', kind: 'note', projectId: 'admissiondesk', tilt: -3 },
];

export const MOBILE_CARDS = HIGHLIGHT_CARDS.filter(card => card.onMobile !== false);

const cardProject = card => projects.find(item => item.id === card.projectId);

const domain = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

function CardImage({ project, sizes }) {
  return (
    <Image
      cover
      className={styles.image}
      src={project.images[0].src}
      placeholder={project.images[0].placeholder}
      alt=""
      sizes={sizes}
    />
  );
}

export function HighlightCard({ card }) {
  if (card.kind === 'portrait') {
    // Plain img, not <Image>: the flight layer drives this element's width and
    // offsets frame by frame to carry his head from the hero into the avatar.
    return (
      <img
        className={styles.portrait}
        data-flight-portrait
        src={heroPortrait}
        alt=""
        style={{ backgroundImage: `url(${heroPortraitPlaceholder})` }}
      />
    );
  }

  const project = cardProject(card);

  if (card.kind === 'link') {
    return (
      <span className={styles.link}>
        <span className={styles.linkImage}>
          <CardImage project={project} sizes="(max-width: 1040px) 40vw, 300px" />
        </span>
        <span className={styles.linkTitle}>{project.title}</span>
        <span className={styles.linkDomain}>{domain(project.buttonLink)}</span>
      </span>
    );
  }

  if (card.kind === 'note') {
    const { testimonial } = project;

    return (
      <span className={styles.note}>
        <span className={styles.noteMeta}>{testimonial.role}</span>
        <span className={styles.noteName}>{testimonial.name}</span>
        <span className={styles.noteQuote}>{testimonial.quote}</span>
      </span>
    );
  }

  return <CardImage project={project} sizes="(max-width: 1040px) 60vw, 420px" />;
}
