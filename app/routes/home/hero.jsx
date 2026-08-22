import heroPhoto from '~/assets/hero-photo.jpg';
import heroPhotoPlaceholder from '~/assets/hero-photo-placeholder.jpg';
import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '~/utils/contact';
import { heroFadeUp, heroStagger } from '~/utils/motion';
import styles from './hero.module.css';

const CREDIBILITY = [
  '3+ years shipping production software',
  'AI Engineer, Anthropic-certified',
  'Live client sites across hospitality, healthcare & travel',
  '12+ projects shipped for real clients',
];

export function Hero({ id, sectionRef }) {
  return (
    <Section as="header" id={id} ref={sectionRef} className={styles.hero}>
      <div className={styles.layout}>
        <motion.div
          className={styles.content}
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          <motion.div variants={heroFadeUp}>
            <Text className={styles.eyebrow} size="s">
              Full-Stack &amp; AI Developer
            </Text>
          </motion.div>
          <motion.div variants={heroFadeUp}>
            <Heading level={1} as="h1" className={styles.title}>
              Websites and apps that turn visitors into customers.
            </Heading>
          </motion.div>
          <motion.div variants={heroFadeUp}>
            <Text className={styles.subtitle} size="l" as="p">
              Full-stack development for businesses and agencies — from a simple
              site to a custom AI-powered tool.
            </Text>
          </motion.div>
          <motion.div className={styles.actions} variants={heroFadeUp}>
            <Button icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
              Chat on WhatsApp
            </Button>
            <Button secondary iconEnd="arrow-right" iconHoverShift href="/work">
              See the work
            </Button>
          </motion.div>
          <motion.ul className={styles.credibility} variants={heroFadeUp}>
            {CREDIBILITY.map(item => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
        </motion.div>
        <motion.div
          className={styles.photo}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            cover
            reveal
            className={styles.photoImage}
            src={heroPhoto}
            placeholder={heroPhotoPlaceholder}
            alt="Firdosh Ahmad"
            sizes="(max-width: 1040px) 60vw, 420px"
          />
        </motion.div>
      </div>
    </Section>
  );
}
