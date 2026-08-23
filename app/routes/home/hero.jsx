import heroPortrait from '~/assets/hero-portrait.png';
import heroPortraitPlaceholder from '~/assets/hero-portrait-placeholder.png';
import reactLogo from '~/assets/logos-tech/react.svg';
import pythonLogo from '~/assets/logos-tech/python.svg';
import typescriptLogo from '~/assets/logos-tech/typescript.svg';
import anthropicLogo from '~/assets/logos-tech/anthropic.svg';
import { Icon } from '~/components/icon';
import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { MagneticWrap } from '~/components/magnetic-wrap';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { getWhatsAppLink } from '~/utils/contact';
import { heroFadeUp, heroStagger } from '~/utils/motion';
import { projects, testimonials } from '~/data/projects';
import styles from './hero.module.css';

const proofTestimonial = testimonials[0];

// Real project screenshots, floating as proof — not stock photos. Same 3
// projects as the "Featured work" section below, so the cloud reads as a
// preview of the real cards that appear once you scroll to them.
const PHOTO_PROOF_IDS = ['ladderbrief', 'admissiondesk', 'crazy-mountaineers'];
const photoProofs = PHOTO_PROOF_IDS.map((id, index) => ({
  project: projects.find(project => project.id === id),
  className: ['floatProof1', 'floatProof2', 'floatProof3'][index],
  delay: [0, 0.9, 1.8][index],
}));

// Real stack, pulled straight from the resume — not decorative icon soup.
const TECH_LOGOS = [
  { src: reactLogo, alt: 'React', className: 'floatLogoReact', delay: 0.4 },
  { src: pythonLogo, alt: 'Python', className: 'floatLogoPython', delay: 1.6 },
  { src: typescriptLogo, alt: 'TypeScript', className: 'floatLogoTypescript', delay: 0.7 },
  { src: anthropicLogo, alt: 'Anthropic', className: 'floatLogoAnthropic', delay: 1.9 },
];

function FloatCard({ className, delay = 0, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={className} variants={heroFadeUp}>
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
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const cloudOpacity = useTransform(scrollYProgress, [0.2, 0.6], [1, 0]);
  const cloudY = useTransform(scrollYProgress, [0.2, 0.6], [0, -50]);

  return (
    <Section as="header" id={id} ref={sectionRef} className={styles.hero}>
      <motion.div
        className={styles.layout}
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <div className={styles.portraitCol}>
          <motion.div className={styles.cloud} style={{ opacity: cloudOpacity, y: cloudY }}>
            {photoProofs.map(({ project, className, delay }) => (
              <FloatCard className={styles[className]} delay={delay} key={project.id}>
                <div className={styles.floatProofImageWrap}>
                  <Image
                    cover
                    className={styles.floatProofImage}
                    src={project.images[0].src}
                    placeholder={project.images[0].placeholder}
                    alt=""
                    sizes="140px"
                  />
                </div>
                <span className={styles.floatCheck}>
                  <Icon icon="check" size={11} />
                </span>
              </FloatCard>
            ))}

            {!!proofTestimonial && (
              <FloatCard className={styles.floatReview} delay={0.3}>
                <Text as="p" size="s" className={styles.floatReviewQuote}>
                  “{proofTestimonial.quote}”
                </Text>
                <Text as="p" size="s" weight="medium" className={styles.floatReviewName}>
                  {proofTestimonial.name}
                </Text>
              </FloatCard>
            )}

            {TECH_LOGOS.map(logo => (
              <FloatCard className={styles[logo.className]} delay={logo.delay} key={logo.alt}>
                <img className={styles.floatLogoImage} src={logo.src} alt={logo.alt} width={20} height={20} />
              </FloatCard>
            ))}
          </motion.div>

          <motion.div className={styles.portrait} variants={heroFadeUp}>
            <Image
              src={heroPortrait}
              placeholder={heroPortraitPlaceholder}
              alt="Portrait of Firdosh Ahmad"
              sizes="(min-width: 1040px) 420px, 60vw"
            />
          </motion.div>
        </div>

        <div className={styles.textCol}>
          <motion.div variants={heroFadeUp}>
            <Text as="p" className={styles.eyebrowPill}>
              <span className={styles.eyebrowDot} />
              Full-Stack &amp; AI Developer
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
              Full-stack development for businesses and agencies — from a simple
              site to a custom AI-powered tool.
            </Text>
          </motion.div>
          <motion.div className={styles.actions} variants={heroFadeUp}>
            <MagneticWrap>
              <Button className={styles.heroButton} icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
                Chat on WhatsApp
              </Button>
            </MagneticWrap>
            <Button
              className={styles.heroButton}
              secondary
              iconEnd="arrow-right"
              iconHoverShift
              href="/work"
            >
              See the work
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
