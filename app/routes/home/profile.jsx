import profileImgLarge from '~/assets/profile-large.jpg';
import profileImgPlaceholder from '~/assets/profile-placeholder.jpg';
import profileImg from '~/assets/profile.jpg';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import { media } from '~/utils/style';
import katakana from './katakana.svg';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
      <DecoderText text="Hi there" start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
    I'm a full-stack software engineer with expertise in scalable web applications, AI-driven platforms, and blockchain solutions. I specialize in building intuitive, high-performance, and accessible digital experiences that drive innovation and deliver real-world impact.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" >
      <p><strong>Frontend:</strong> React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Material UI</p>
      <p><strong>Backend:</strong> Python, FastAPI, Node.js, Express.js, REST APIs, JWT, MySQL</p>
      <p><strong>AI / GenAI:</strong> LLM Orchestration, RAG Pipelines, MLflow, Multi-Agent Systems</p>
      <p><strong>Tools:</strong> Git, GitHub, Postman, CI/CD, VS Code, Cursor, Agile</p>
    </Text>
  
    <Text className={styles.description} data-visible={visible} size="l" >
    <div className={styles.timeline} data-visible={visible}>
      <div className={styles.timelineItem}>
        <div className={styles.timelineContent}>
          <strong>B.Tech in Computer Science</strong>
          <p>Graphic Era University, India (8.7 cgpa)</p>
        </div>
      </div>
      </div>
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I'm passionate about building scalable solutions that solve real-world problems. Always excited to learn new technologies and collaborate on innovative projects that make a difference.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImgPlaceholder}
                  srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                  width={960}
                  height={1280}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt="Firdosh Ahmad - Full Stack Developer"
                />
                <svg className={styles.svg} data-visible={visible} viewBox="0 0 136 766">
                  <use href={`${katakana}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
