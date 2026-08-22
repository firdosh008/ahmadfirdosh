import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { motion } from 'framer-motion';
import { categorySlugs, ProjectCategory } from '~/data/projects';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import styles from './capabilities.module.css';

const BUILD_ITEMS = [
  {
    title: 'Business Websites',
    text: 'Fast, mobile-first websites that make a strong first impression and are easy for customers to find, trust, and book.',
  },
  {
    title: 'Web Apps & Dashboards',
    text: 'Custom tools — booking systems, admin panels, internal dashboards — built around how your business actually works.',
  },
  {
    title: 'AI Integration',
    text: 'Chatbots and automation trained on your own data, so routine questions and repetitive tasks stop eating your time.',
  },
];

const AUDIENCE = [
  {
    title: 'Businesses',
    text: 'Clinics, cafes, travel companies, and coaching centres who want a website or tool that actually brings in customers — explained without the jargon.',
    cta: 'See business websites',
    href: `/work#${categorySlugs[ProjectCategory.BusinessWebsites]}`,
  },
  {
    title: 'Agencies & Studios',
    text: 'Design and marketing studios who need a reliable full-stack and AI developer to build out client work — on time, on spec, white-label friendly.',
    cta: 'See technical work',
    href: `/work#${categorySlugs[ProjectCategory.AI]}`,
  },
];

export function WhatWeBuild({ id, sectionRef }) {
  return (
    <Section as="section" id={id} ref={sectionRef} className={styles.build}>
      <SectionHeading eyebrow="What I build" ghost="Build">
        Three ways I can help
      </SectionHeading>
      <motion.div
        className={styles.buildGrid}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerChildren}
      >
        {BUILD_ITEMS.map((item, index) => (
          <motion.div className={styles.buildCard} variants={fadeUp} key={item.title}>
            <span className={styles.index}>{`0${index + 1}`}</span>
            <Heading level={4} className={styles.buildTitle}>
              {item.title}
            </Heading>
            <Text as="p" size="m" className={styles.buildText}>
              {item.text}
            </Text>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

export function WhoWeWorkWith() {
  return (
    <Section as="section" className={styles.audience}>
      <SectionHeading eyebrow="Who I work with">Two kinds of clients, one process</SectionHeading>
      <motion.div
        className={styles.audienceGrid}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerChildren}
      >
        {AUDIENCE.map(item => (
          <motion.div className={styles.audienceCard} variants={fadeUp} key={item.title}>
            <Heading level={4} className={styles.audienceTitle}>
              {item.title}
            </Heading>
            <Text as="p" size="m" className={styles.audienceText}>
              {item.text}
            </Text>
            <Button secondary iconEnd="arrow-right" iconHoverShift href={item.href}>
              {item.cta}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
