import { Button } from '~/components/button';
import { MagneticWrap } from '~/components/magnetic-wrap';
import { ProjectCard } from '~/components/project-card';
import { Section } from '~/components/section';
import { SectionHeading } from '~/components/section-heading';
import { motion } from 'framer-motion';
import { featuredProjects } from '~/data/projects';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import styles from './featured-work.module.css';

export function FeaturedWork({ id, sectionRef }) {
  return (
    <Section as="section" id={id} ref={sectionRef} className={styles.work}>
      <SectionHeading eyebrow="Selected work">
        A few recent projects
      </SectionHeading>
      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerChildren}
      >
        {featuredProjects.map(project => (
          <motion.div variants={fadeUp} key={project.id}>
            <ProjectCard
              title={project.title}
              category={project.category}
              summary={project.summary}
              image={project.image}
              images={project.images}
              logo={project.logo}
              buttonText={project.buttonText}
              buttonLink={project.buttonLink}
            />
          </motion.div>
        ))}
      </motion.div>
      <div className={styles.more}>
        <MagneticWrap>
          <Button href="/work" iconEnd="arrow-right" iconHoverShift>
            See all work
          </Button>
        </MagneticWrap>
      </div>
    </Section>
  );
}
