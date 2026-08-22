import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Marquee } from '~/components/marquee';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { TestimonialsSection } from '~/components/testimonials-section';
import { baseMeta } from '~/utils/meta';
import { getWhatsAppLink } from '~/utils/contact';
import { motion } from 'framer-motion';
import { fadeUp, revealViewport } from '~/utils/motion';
import config from '~/config.json';
import { testimonials } from '~/data/projects';
import { Hero } from './hero';
import { ClientBand } from './client-band';
import { WhatWeBuild, WhoWeWorkWith } from './capabilities';
import { FeaturedWork } from './featured-work';
import styles from './home.module.css';

const MARQUEE_ITEMS = [
  'Business Websites',
  'Web Apps',
  'AI Integration',
  'Dashboards',
  'Agencies & Studios',
];

export const meta = () => {
  return baseMeta({
    title: 'Full-Stack Developer & AI Engineer',
    description: `${config.name} builds websites, web apps, and AI-powered tools for businesses and agencies in ${config.location}.`,
  });
};

export const Home = () => (
  <div className={styles.home}>
    <Hero id="hero" />
    <ClientBand />
    <FeaturedWork id="work" />
    <TestimonialsSection items={testimonials} id="testimonials" />
    <Marquee items={MARQUEE_ITEMS} />
    <WhatWeBuild id="what-i-build" />
    <WhoWeWorkWith />
    <ClosingCta />
    <Footer />
  </div>
);

const ClosingCta = () => (
  <Section as="section" className={styles.cta}>
    <motion.div
      className={styles.ctaContent}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeUp}
    >
      <Heading level={2} className={styles.ctaTitle}>
        Have a project in mind?
      </Heading>
      <Text as="p" size="l" className={styles.ctaText}>
        Tell me a little about it on WhatsApp — I usually reply the same day.
      </Text>
      <div className={styles.ctaActions}>
        <Button className={styles.ctaButton} icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
          Chat on WhatsApp
        </Button>
        <Button className={styles.ctaButtonSecondary} secondary iconEnd="arrow-right" iconHoverShift href="/contact">
          Or use the contact form
        </Button>
      </div>
    </motion.div>
  </Section>
);
