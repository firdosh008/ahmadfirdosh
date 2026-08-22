import { Button } from '~/components/button';
import { Faq } from '~/components/faq';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { Text } from '~/components/text';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '~/utils/contact';
import { baseMeta } from '~/utils/meta';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import config from '~/config.json';
import styles from './services.module.css';

const PROCESS = [
  {
    title: 'Chat',
    text: 'Tell me what you need on WhatsApp or through the contact form. No sales call required unless you want one.',
  },
  {
    title: 'Proposal',
    text: "You'll get a clear scope and timeline in writing before any work starts — no surprises halfway through.",
  },
  {
    title: 'Build',
    text: "Regular updates as the work progresses, so you're never left wondering what's happening with your project.",
  },
  {
    title: 'Launch & Support',
    text: "I don't disappear after launch. Fixes and small changes are covered for the first 30 days, with maintenance available after that.",
  },
];

const FAQS = [
  {
    question: 'How long does a project take?',
    answer:
      'A simple business website usually takes 1–2 weeks. Web apps and AI integrations take longer depending on scope — you\'ll get a specific timeline in the proposal before any work starts.',
  },
  {
    question: 'What do you need from me to get started?',
    answer:
      "Just a clear idea of what you want, and any existing branding (logo, colours, content) if you have it. If you don't have branding yet, that's fine too — we can figure it out together.",
  },
  {
    question: 'Do you handle hosting and maintenance?',
    answer:
      'Yes. I can set up hosting and handle ongoing updates and fixes on a small monthly retainer, or hand everything off to you with clear documentation.',
  },
  {
    question: 'Do you work with agencies and studios?',
    answer:
      "Yes — white-label and subcontract work is welcome. I can work directly with your client under your brand, or stay entirely behind the scenes.",
  },
  {
    question: "What if I'm not sure what I need yet?",
    answer:
      "That's completely fine. Message me with roughly what you're trying to achieve and we'll figure out the right approach together before any commitment.",
  },
  {
    question: 'Do you sign NDAs?',
    answer: 'Yes, happy to for both agency and direct client work.',
  },
];

export const meta = () => {
  return baseMeta({
    title: 'Services',
    description: `How working with ${config.name} works — process, timelines, and answers to common questions.`,
  });
};

export const Services = () => (
  <div className={styles.services}>
    <header className={styles.header}>
      <SectionHeading eyebrow="Services" ghost="Services" align="center">
        What working together looks like
      </SectionHeading>
      <Text as="p" size="l" className={styles.intro}>
        Whether it’s a new website, a custom tool, or an AI feature added to
        what you already have, the process stays the same.
      </Text>
    </header>

    <Section as="section" className={styles.process}>
      <motion.div
        className={styles.processGrid}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerChildren}
      >
        {PROCESS.map((step, index) => (
          <motion.div className={styles.step} variants={fadeUp} key={step.title}>
            <span className={styles.stepIndex}>{`0${index + 1}`}</span>
            <Heading level={4} className={styles.stepTitle}>
              {step.title}
            </Heading>
            <Text as="p" size="m" className={styles.stepText}>
              {step.text}
            </Text>
          </motion.div>
        ))}
      </motion.div>
    </Section>

    <Section as="section" className={styles.faqSection}>
      <SectionHeading eyebrow="FAQ">Common questions</SectionHeading>
      <Faq items={FAQS} className={styles.faq} />
    </Section>

    <Section as="section" className={styles.cta}>
      <Heading level={3} className={styles.ctaTitle}>
        Not sure where to start?
      </Heading>
      <Text as="p" size="l" className={styles.ctaText}>
        Message me on WhatsApp with a rough idea — I’ll tell you honestly if
        it’s something I can help with.
      </Text>
      <Button icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
        Chat on WhatsApp
      </Button>
    </Section>

    <Footer />
  </div>
);
