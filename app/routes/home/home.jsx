import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { MagneticWrap } from '~/components/magnetic-wrap';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { baseMeta } from '~/utils/meta';
import { getWhatsAppLink } from '~/utils/contact';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport, heroStagger } from '~/utils/motion';
import config from '~/config.json';
import {
  siAnthropic,
  siCloudflare,
  siFastapi,
  siGooglegemini,
  siLangchain,
  siMlflow,
  siNeo4j,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
  siTypescript,
} from 'simple-icons';
import { Hero } from './hero';
import { Billboard } from './billboard';
import { ProjectCarousel } from './carousel';
import { TestimonialStack } from './testimonial-stack';
import { ScatterFlight } from './scatter-flight';
import { HandoffFlight } from './handoff-flight';
import { ClientBand } from './client-band';
import { WhatWeBuild, WhoWeWorkWith } from './capabilities';
import styles from './home.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Full-Stack Developer & AI Engineer, Dehradun',
    description: `Websites, web apps, and AI tools for businesses and agencies. ${config.name} builds them in Dehradun and usually replies on WhatsApp the same day.`,
  });
};

export const Home = () => (
  <div className={styles.home}>
    <div className={styles.fold}>
      <Hero id="hero" />
      <ClientBand />
    </div>
    <Billboard id="achievements" />
    <ProjectCarousel id="more-work" />
    <TestimonialStack id="testimonials" />
    <WhatWeBuild id="what-i-build" />
    <WhoWeWorkWith />
    <ClosingCta />
    <Footer />
    <ScatterFlight />
    <HandoffFlight />
  </div>
);

// The stack, off the resume, scattered around the ask. Positions are per cent
// of the section box and stay clear of the middle, where the words sit; the
// threads are drawn from the centre out to each mark.
//
// `mono` is for the brands whose own colour is near-black: left as-is they
// disappear against a dark page, so those take the page's text colour instead.
const STACK = [
  // Two columns clear of the middle: the panel in the centre is opaque, so
  // anything placed behind it is simply lost.
  { icon: siAnthropic, mono: true, x: 12, y: 9 },
  { icon: siGooglegemini, x: 21, y: 20 },
  { icon: siLangchain, x: 5, y: 26 },
  { icon: siPython, x: 17, y: 39 },
  { icon: siFastapi, x: 6, y: 54 },
  { icon: siMlflow, x: 17, y: 69 },
  { icon: siNeo4j, x: 7, y: 86 },
  { icon: siNextdotjs, mono: true, x: 88, y: 9 },
  { icon: siCloudflare, x: 79, y: 20 },
  { icon: siReact, x: 95, y: 26 },
  { icon: siTypescript, x: 83, y: 39 },
  { icon: siNodedotjs, x: 94, y: 54 },
  { icon: siPostgresql, x: 83, y: 69 },
  { icon: siSupabase, x: 93, y: 86 },
];

const ClosingCta = () => (
  <Section as="section" className={styles.cta}>
    <div className={styles.ctaField}>
      {/* Drawn with percentage coordinates rather than a viewBox, so the
          dashes keep their weight instead of stretching with the box. */}
      <svg className={styles.threads} aria-hidden="true">
        {STACK.map(node => (
          <line
            key={node.icon.title}
            x1="50%"
            y1="50%"
            x2={`${node.x}%`}
            y2={`${node.y}%`}
          />
        ))}
      </svg>

      <motion.ul
        className={styles.stack}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={heroStagger}
      >
        {STACK.map(node => (
          <motion.li
            className={styles.chip}
            key={node.icon.title}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            variants={fadeUp}
          >
            <svg
              className={styles.mark}
              viewBox="0 0 24 24"
              role="img"
              aria-label={node.icon.title}
            >
              <path d={node.icon.path} fill={node.mono ? 'currentColor' : `#${node.icon.hex}`} />
            </svg>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        className={styles.ctaContent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={fadeUp}
      >
        <Text as="p" size="s" className={styles.ctaEyebrow}>
          Built with the stack I work in every day
        </Text>
        <Heading level={2} className={styles.ctaTitle}>
          Have something you want built?
        </Heading>
        <Text as="p" size="l" className={styles.ctaText}>
          Tell me a little about it on WhatsApp — I usually reply the same day.
        </Text>
        <div className={styles.ctaActions}>
          <MagneticWrap>
            <Button icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
              Chat on WhatsApp
            </Button>
          </MagneticWrap>
          <Button secondary iconEnd="arrow-right" iconHoverShift href="/contact">
            Use the contact form
          </Button>
        </div>
      </motion.div>
    </div>
  </Section>
);
