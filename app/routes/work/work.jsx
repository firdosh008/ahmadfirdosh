import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { ProjectCard } from '~/components/project-card';
import { SectionHeading } from '~/components/section-heading';
import { TestimonialsSection } from '~/components/testimonials-section';
import { motion } from 'framer-motion';
import { categorySlugs, projectsByCategory, testimonials } from '~/data/projects';
import { baseMeta } from '~/utils/meta';
import { fadeUp, revealViewport, staggerChildren } from '~/utils/motion';
import config from '~/config.json';
import styles from './work.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Work',
    description: `Business websites, client products, and AI & automation projects built by ${config.name}.`,
  });
};

export const Work = () => (
  <div className={styles.work}>
    <header className={styles.header}>
      <SectionHeading eyebrow="Work" ghost="Work" align="center">
        A closer look at what I’ve built
      </SectionHeading>
    </header>
    {projectsByCategory.map(({ category, projects }) => (
      <section
        className={styles.category}
        id={categorySlugs[category]}
        key={category}
      >
        <Heading level={3} as="h2" className={styles.categoryTitle}>
          {category}
        </Heading>
        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={staggerChildren}
        >
          {projects.map(project => (
            <motion.div variants={fadeUp} key={project.id}>
              <ProjectCard
                title={project.title}
                summary={project.summary}
                image={project.image}
                images={project.images}
                buttonText={project.buttonText}
                buttonLink={project.buttonLink}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    ))}
    <TestimonialsSection items={testimonials} />
    <Footer />
  </div>
);
