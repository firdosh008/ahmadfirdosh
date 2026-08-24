import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { MagneticWrap } from '~/components/magnetic-wrap';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getWhatsAppLink } from '~/utils/contact';
import { heroFadeUp, heroStagger } from '~/utils/motion';
import styles from './hero.module.css';

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

export function Hero({ id, sectionRef }) {
  // Without a ref of its own this tracked window scroll, not the hero, so the
  // cloud faded against whole-page progress and never on cue.
  const localRef = useRef(null);
  const ref = sectionRef ?? localRef;

  // The portrait fades out as the scattered cards fly into the billboard's
  // slots below (see scatter-flight). Scroll-linked, so scrolling up reverses.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const portraitOpacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);
  const portraitScale = useTransform(scrollYProgress, [0.45, 0.95], [1, 0.92]);

  return (
    <Section as="header" id={id} ref={ref} className={styles.hero}>
      <motion.div
        className={styles.portraitCol}
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <div className={styles.cloud}>
          <div className={styles.floatPhoto1} data-flight-anchor="a" />
          <div className={styles.floatPhoto2} data-flight-anchor="b" />
          <div className={styles.floatPhoto3} data-flight-anchor="c" />
          <div className={styles.floatNotePhoto} data-flight-anchor="d" />
          <div className={styles.floatNote} data-flight-anchor="e" />
        </div>

        <motion.div
          className={styles.portraitExit}
          style={{ opacity: portraitOpacity, scale: portraitScale }}
        >
          <div className={styles.portrait} data-flight-anchor="p" />
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
              aria-label="Full-stack developer and AI engineer"
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
              Websites and apps that bring in{' '}
              <em className={styles.titleAccent}>customers</em>, not just compliments.
            </Heading>
          </motion.div>
          <motion.div variants={heroFadeUp}>
            <Text className={styles.subtitle} size="l" as="p">
              Full-stack and AI development in Dehradun, for businesses and agencies —
              from a first website to a custom tool.
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
            <Button className={styles.heroButton} secondary href="/#more-work">
              See my work
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
