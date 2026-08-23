import heroPortrait from '~/assets/hero-portrait.png';
import heroPortraitPlaceholder from '~/assets/hero-portrait-placeholder.png';
import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { MagneticWrap } from '~/components/magnetic-wrap';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getWhatsAppLink } from '~/utils/contact';
import { heroFadeUp, heroStagger } from '~/utils/motion';
import { projects } from '~/data/projects';
import styles from './hero.module.css';

// Real project screenshots, floating as proof — not stock photos. Placed at
// the hero's edges the way a scrapbook lays photos out.
const PHOTO_CARDS = [
  { id: 'crazy-mountaineers', className: 'floatPhoto1', delay: 0, tilt: -6 },
  { id: 'ladderbrief', className: 'floatPhoto2', delay: 0.9, tilt: -12 },
  { id: 'yumy', className: 'floatPhoto3', delay: 1.8, tilt: 7 },
].map(card => ({ ...card, project: projects.find(p => p.id === card.id) }));

// Five-point star, drawn once for the note's rating row.
const STAR_PATH = 'M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z';

// The testimonial note sits over the shot of the project it's about.
const noteProject = projects.find(project => project.id === 'admissiondesk');

function PhotoCard({ project, className, delay, tilt }) {
  return (
    <FloatCard className={className} delay={delay} tilt={tilt}>
      <div className={styles.floatPhotoImageWrap}>
        <Image
          cover
          className={styles.floatPhotoImage}
          src={project.images[0].src}
          placeholder={project.images[0].placeholder}
          alt=""
          sizes="280px"
        />
      </div>
    </FloatCard>
  );
}

// Typed into the pill like a search box: firdosh/<skill>.
const ROLES = [
  'full-stack-developer',
  'ai-engineer',
  'react-&-nextjs',
  'python-&-fastapi',
  'aws-&-cloudflare',
  'automations',
];

function TypedRole() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const word = ROLES[index];
    const typed = !deleting && length === word.length;
    const cleared = deleting && length === 0;
    const timer = setTimeout(
      () => {
        if (typed) return setDeleting(true);

        if (cleared) {
          setDeleting(false);
          setIndex(current => (current + 1) % ROLES.length);
          return;
        }

        setLength(current => current + (deleting ? -1 : 1));
      },
      typed ? 1800 : cleared ? 260 : deleting ? 35 : 70
    );

    return () => clearTimeout(timer);
  }, [index, length, deleting, reduceMotion]);

  return (
    <span className={styles.eyebrowTyped}>
      {reduceMotion ? ROLES[0] : ROLES[index].slice(0, length)}
      {!reduceMotion && <i className={styles.eyebrowCaret} aria-hidden="true" />}
    </span>
  );
}

function FloatCard({ className, delay = 0, tilt = 0, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={className} variants={heroFadeUp} style={{ rotate: tilt }}>
      <motion.div
        className={styles.floatBob}
        animate={reduceMotion ? undefined : { y: [-5, 5, -5] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero({ id, sectionRef }) {
  // The doodle cloud dissipates as the hero scrolls out of view — the
  // "ideas" drift up and fade, handing off to the real project cards /
  // build cards that scroll-reveal further down the page.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const cloudOpacity = useTransform(scrollYProgress, [0.2, 0.6], [1, 0]);
  const cloudY = useTransform(scrollYProgress, [0.2, 0.6], [0, -50]);

  return (
    <Section as="header" id={id} ref={sectionRef} className={styles.hero}>
      <motion.div
        className={styles.portraitCol}
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <motion.div className={styles.cloud} style={{ opacity: cloudOpacity, y: cloudY }}>
          {PHOTO_CARDS.map(({ project, className, delay, tilt }) => (
            <PhotoCard
              project={project}
              className={styles[className]}
              delay={delay}
              tilt={tilt}
              key={project.id}
            />
          ))}

          <PhotoCard
            project={noteProject}
            className={styles.floatNotePhoto}
            delay={0.6}
            tilt={9}
          />

          {!!noteProject.testimonial && (
            <FloatCard className={styles.floatNote} delay={0.2} tilt={-3}>
              <div className={styles.floatNoteHead}>
                <span className={styles.floatNoteStars} aria-hidden="true">
                  {Array.from({ length: noteProject.testimonial.rating }, (_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 16 16"
                      width="11"
                      height="11"
                      fill="currentColor"
                    >
                      <path d={STAR_PATH} />
                    </svg>
                  ))}
                </span>
                <span className={styles.floatNoteMeta}>
                  {noteProject.testimonial.role}
                </span>
              </div>
              <p className={styles.floatNoteName}>{noteProject.testimonial.name}</p>
              <p className={styles.floatNoteQuote}>
                {noteProject.testimonial.highlight ?? noteProject.testimonial.quote}
              </p>
            </FloatCard>
          )}
        </motion.div>

        <motion.div className={styles.portrait} variants={heroFadeUp}>
          <Image
            className={styles.portraitImage}
            src={heroPortrait}
            placeholder={heroPortraitPlaceholder}
            alt="Portrait of Firdosh Ahmad"
            sizes="(min-width: 1041px) 1600px, 80vw"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.layout}
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <div className={styles.textCol}>
          <motion.div variants={heroFadeUp}>
            <Text
              as="p"
              className={styles.eyebrowPill}
              aria-label="Full-Stack and AI Developer"
            >
              <svg
                className={styles.eyebrowSearchIcon}
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M10.6 10.6 14 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles.eyebrowPrefix} aria-hidden="true">
                firdosh/
              </span>
              <TypedRole />
            </Text>
          </motion.div>
          <motion.div variants={heroFadeUp}>
            <Heading level={1} as="h1" className={styles.title}>
              Websites and apps that turn visitors into{' '}
              <em className={styles.titleAccent}>customers</em>.
            </Heading>
          </motion.div>
          <motion.div variants={heroFadeUp}>
            <Text className={styles.subtitle} size="l" as="p">
              Full-stack development for businesses and agencies — from a simple site to a
              custom AI-powered tool.
            </Text>
          </motion.div>
          <motion.div className={styles.actions} variants={heroFadeUp}>
            <MagneticWrap>
              <Button
                className={styles.heroButton}
                icon="whatsapp"
                iconHoverShift
                href={getWhatsAppLink()}
              >
                Let&apos;s chat
              </Button>
            </MagneticWrap>
            <Button className={styles.heroButton} secondary href="/work">
              See my work
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
